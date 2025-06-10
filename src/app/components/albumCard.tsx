"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FolderSelector } from "./FolderSelector";
import { Album, StreamType } from "@/services/albumsApi";
import { StreamSelector } from "./StreamSelector";
import { AlbumCardMenu } from "./AlbumCardMenu";
import { StreamingPlayer } from "./StreamingPlayer";

interface AlbumCardProps {
    album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
    const [activeStream, setActiveStream] = useState<StreamType>(album.defaultStream);

    return (
        <Card className="p-4 relative">
            <div className="absolute top-2 right-2">
                <AlbumCardMenu albumId={album.id} />
            </div>
            <div className="flex gap-4">
                {album.coverUrl && (
                    <div className="w-24 h-24 relative shrink-0">
                        {/* eslint-disable-next-line */}
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
                <StreamingPlayer album={album} activeStream={activeStream} />

                <div className="flex gap-2 items-center">
                    <StreamSelector
                        album={album}
                        activeStream={activeStream}
                        setActiveStream={setActiveStream}
                    />
                    <FolderSelector album={album} />
                </div>
            </div>
        </Card>
    );
}
