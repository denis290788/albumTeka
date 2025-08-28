"use client";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Check, Trash } from "lucide-react";
import { Album, Stream, StreamType, useUpdateAlbumMutation } from "@/services/albumsApi";
import { useState } from "react";
import { AddStreamModal } from "../features/addStreamModal";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { STREAM_ICONS } from "@/lib/stream-icons";
import { ConfirmModal } from "./ConfirmModal";

interface StreamSelectorProps {
    album: Album;
    activeStream: StreamType;
    setActiveStream: (type: StreamType) => void;
    className?: string;
}

export function StreamSelector({
    album,
    activeStream,
    setActiveStream,
    className,
}: StreamSelectorProps) {
    const { user } = useAuth();
    const isOwner = user?.uid === album.userId;

    const [updateAlbum] = useUpdateAlbumMutation();
    const [addModalOpen, setAddModalOpen] = useState(false);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [streamToRemove, setStreamToRemove] = useState<StreamType | null>(null);

    const setDefaultStream = async (type: StreamType) => {
        if (!isOwner) return;
        try {
            await updateAlbum({ ...album, defaultStream: type }).unwrap();
            setActiveStream(type);
        } catch (err) {
            console.error("Ошибка при установке стрима по умолчанию:", err);
        }
    };

    const removeStream = async (type: StreamType) => {
        if (!isOwner) return;
        try {
            const updatedStreams = album.streams.filter((s: Stream) => s.type !== type);

            if (activeStream === type) {
                setActiveStream(album.defaultStream);
            }

            await updateAlbum({
                ...album,
                streams: updatedStreams,
                defaultStream: album.defaultStream,
            }).unwrap();
        } catch (err) {
            console.error("Ошибка при удалении стрима:", err);
        }
    };

    return (
        <div className={cn(className)}>
            <Select
                onValueChange={(val) => {
                    if (val === "add") {
                        if (isOwner) {
                            setAddModalOpen(true);
                        }
                        return;
                    }
                    setActiveStream(val as StreamType);
                }}
                value={activeStream}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите стриминг" />
                </SelectTrigger>

                <SelectContent className="bg-background">
                    {[...album.streams]
                        .sort((a) => (a.type === album.defaultStream ? -1 : 1))
                        .map((stream) => {
                            const isDefault = stream.type === album.defaultStream;

                            return (
                                <div
                                    key={stream.type}
                                    className="flex items-center justify-between px-2 py-1 rounded"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        {isDefault ? (
                                            <Check className="text-accent-foreground w-4 h-4" />
                                        ) : (
                                            isOwner && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDefaultStream(stream.type);
                                                    }}
                                                    className="focus:outline-none cursor-pointer"
                                                >
                                                    <Check className="text-gray-400 hover:text-accent-foreground w-4 h-4" />
                                                </button>
                                            )
                                        )}
                                        <SelectItem
                                            value={stream.type}
                                            className="flex-1 cursor-pointer"
                                            showIndicatorIcon={false}
                                        >
                                            {STREAM_ICONS[stream.type]}
                                            {stream.type}
                                        </SelectItem>
                                    </div>

                                    {!isDefault && isOwner && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStreamToRemove(stream.type);
                                                setConfirmModalOpen(true);
                                            }}
                                            className="focus:outline-none cursor-pointer pl-2"
                                        >
                                            <Trash className="text-red-400 hover:text-red-600 w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                    {isOwner && (
                        <SelectItem
                            value="add"
                            className="pl-9 text-muted-foreground cursor-pointer"
                        >
                            + Добавить стриминг
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>

            {isOwner && (
                <AddStreamModal open={addModalOpen} onOpenChange={setAddModalOpen} album={album} />
            )}

            <ConfirmModal
                open={confirmModalOpen}
                headText="Подтвердите удаление"
                description={`Вы уверены, что хотите удалить стримминг ${streamToRemove}? Это действие нельзя отменить.`}
                onConfirm={() => {
                    if (streamToRemove) {
                        removeStream(streamToRemove);
                        setConfirmModalOpen(false);
                        setStreamToRemove(null);
                    }
                }}
                onCancel={() => {
                    setConfirmModalOpen(false);
                    setStreamToRemove(null);
                }}
            />
        </div>
    );
}
