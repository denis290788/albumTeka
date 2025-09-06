"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/shared/ui/select";
import { Check, Trash } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { STREAM_ICONS } from "@/shared/ui/stream-icons";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { Album, StreamType } from "@/entities/album/model/albumsApi";
import { useTranslation } from "react-i18next";
import { useAlbumStreams } from "../hooks/useAlbumStreams";
import { AddStreamModal } from "@/features/addStreamModal";

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
    const { t } = useTranslation();

    const { isOwner, setDefaultStream, removeStream } = useAlbumStreams(
        album,
        activeStream,
        setActiveStream
    );

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [streamToRemove, setStreamToRemove] = useState<StreamType | null>(null);

    return (
        <div className={cn(className)}>
            <Select
                onValueChange={(val) => {
                    if (val === "add") {
                        if (isOwner) setAddModalOpen(true);
                        return;
                    }
                    setActiveStream(val as StreamType);
                }}
                value={activeStream}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("stream_select_placeholder")} />
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
                            + {t("stream_add")}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>

            {isOwner && (
                <AddStreamModal open={addModalOpen} onOpenChange={setAddModalOpen} album={album} />
            )}

            <ConfirmModal
                open={confirmModalOpen}
                headText={t("stream_confirm_delete_title")}
                description={t("stream_confirm_delete_desc", { stream: streamToRemove })}
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
