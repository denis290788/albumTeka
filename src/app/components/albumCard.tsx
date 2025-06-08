"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FolderSelector } from "./FolderSelector";
import { AddStreamModal } from "./AddStreamModal";
import { Check, Trash, MoreHorizontal } from "lucide-react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type StreamType = "bandcamp" | "spotify" | "soundcloud";

interface Stream {
    type: StreamType;
    url: string;
}

export type Album = {
    id: string;
    title: string;
    artist: string;
    year: number | null;
    coverUrl: string | null;
    defaultStream: "bandcamp" | "spotify" | "soundcloud";
    streams: Stream[];
    folderId?: string;
};

export function AlbumCard({
    album,
    onFolderChange,
    onDelete,
}: {
    album: Album;
    onFolderChange?: (albumId: string, newFolderId: string | null) => void;
    onDelete?: (albumId: string) => void;
}) {
    const [activeStream, setActiveStream] = useState<StreamType>(album.defaultStream);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [streams, setStreams] = useState(album.streams);

    const setDefaultStream = async (type: StreamType) => {
        try {
            const ref = doc(db, "albums", album.id);
            const snapshot = await getDoc(ref);
            const data = snapshot.data();

            if (!data) return;

            await updateDoc(ref, {
                defaultStream: type,
            });

            setActiveStream(type);
            setStreams(data.streams || []);
        } catch (err) {
            console.error("Ошибка при установке стрима по умолчанию:", err);
        }
    };

    const removeStream = async (type: StreamType) => {
        try {
            const ref = doc(db, "albums", album.id);
            const snapshot = await getDoc(ref);
            const data = snapshot.data();

            const updated = (data?.streams || []).filter((s: Stream) => s.type !== type);

            await updateDoc(ref, {
                streams: updated,
                defaultStream:
                    type === data!.defaultStream && updated.length > 0
                        ? updated[0].type
                        : data!.defaultStream,
            });

            setStreams(updated);
            if (activeStream === type) {
                setActiveStream(updated[0]?.type || null);
            }
        } catch (err) {
            console.error("Ошибка при удалении стрима:", err);
        }
    };

    const renderPlayer = () => {
        const stream = album.streams.find((s) => s.type === activeStream);
        if (!stream) return null;

        switch (stream.type) {
            case "bandcamp":
                return (
                    <iframe
                        style={{ border: 0, width: "100%", height: 120 }}
                        src={`${stream.url}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/`}
                        seamless
                    />
                );

            case "spotify": {
                // Удаляем query-параметры, если есть
                const cleanUrl = stream.url.split("?")[0];

                return (
                    <iframe
                        style={{ borderRadius: "12px" }}
                        src={`https://open.spotify.com/embed/album/${cleanUrl.split("/").pop()}`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                );
            }
            case "soundcloud":
                return (
                    <iframe
                        width="100%"
                        height="300"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            stream.url
                        )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
                    ></iframe>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="p-4 relative">
            {/* Кнопка меню в правом верхнем углу */}
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-red-500 focus:bg-red-100"
                            onClick={() => onDelete?.(album.id)}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Удалить альбом
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex gap-4">
                {album.coverUrl && (
                    <div className="w-24 h-24 relative shrink-0">
                        <img
                            src={album.coverUrl}
                            alt={album.title}
                            className="object-cover rounded"
                        />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-lg">{album.title}</h3>
                    <p className="text-sm text-muted-foreground">{album.artist}</p>
                    {album.year && <p className="text-sm text-muted-foreground">{album.year}</p>}
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {renderPlayer()}

                <div className="flex gap-2 items-center">
                    <Select
                        onValueChange={(val) => {
                            if (val === "add") {
                                setAddModalOpen(true);
                                return;
                            }
                            setActiveStream(val as StreamType);
                        }}
                        value={activeStream}
                    >
                        <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Выберите стриминг" />
                        </SelectTrigger>

                        <SelectContent>
                            {[...streams]
                                .sort((a) => (a.type === album.defaultStream ? -1 : 1))
                                .map((stream) => {
                                    const isDefault = stream.type === album.defaultStream;

                                    return (
                                        <div
                                            key={stream.type}
                                            className="flex items-center justify-between px-2 py-1 hover:bg-accent rounded"
                                        >
                                            {/* Левая часть: галочка + название */}
                                            <div className="flex items-center gap-2 w-full">
                                                {isDefault ? (
                                                    <Check className="text-blue-500 w-4 h-4" />
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDefaultStream(stream.type);
                                                        }}
                                                    >
                                                        <Check className="text-gray-400 hover:text-blue-500 w-4 h-4" />
                                                    </button>
                                                )}
                                                <SelectItem value={stream.type} className="flex-1">
                                                    {stream.type}
                                                </SelectItem>
                                            </div>

                                            {/* Правая часть: удалить */}
                                            {!isDefault && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeStream(stream.type);
                                                    }}
                                                >
                                                    <Trash className="text-red-400 hover:text-red-600 w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                            {/* + Добавить стриминг */}
                            <SelectItem value="add" className="text-muted-foreground italic">
                                + Добавить стриминг
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <FolderSelector
                        album={album}
                        onChange={(newFolderId) => {
                            onFolderChange?.(album.id, newFolderId);
                        }}
                    />
                </div>
                <AddStreamModal
                    open={addModalOpen}
                    onOpenChange={setAddModalOpen}
                    album={album}
                    onAdded={(newStream) => setStreams((prev) => [...prev, newStream])}
                />
            </div>
        </Card>
    );
}
