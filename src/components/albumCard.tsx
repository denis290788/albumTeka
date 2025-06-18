"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FolderSelector } from "./FolderSelector";
import { Album, StreamType } from "@/services/albumsApi";
import { StreamSelector } from "./StreamSelector";
import { AlbumCardMenu } from "./AlbumCardMenu";
import { StreamingPlayer } from "./StreamingPlayer";

import { Button } from "@/components/ui/button";
import { PlayIcon, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AlbumCardProps {
    album: Album;
    activeAlbumId: string | null;
    setActiveAlbumId: (id: string | null) => void;
}

export function AlbumCard({ album, activeAlbumId, setActiveAlbumId }: AlbumCardProps) {
    const [activeStream, setActiveStream] = useState<StreamType>(album.defaultStream);
    const isPlaying = activeAlbumId === album.id;

    const gradientAngle = useMemo(() => Math.floor(Math.random() * 360), []);

    const handlePlayClick = () => {
        if (isPlaying) {
            setActiveAlbumId(null);
        } else {
            setActiveAlbumId(album.id);
        }
    };

    return (
        <Card
            className={cn(
                "p-4 relative",
                "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                // "transition-all duration-200 ease-in-out",
                "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]"
                // "hover:bg-[linear-gradient(calc(var(--angle)+45deg),#4ac77c,#dfe6e9)]"
            )}
            style={
                {
                    "--angle": `${gradientAngle}deg`,
                } as React.CSSProperties
            }
        >
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
                            loading="lazy"
                        />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-lg text-foreground">{album.title}</h3>
                    <p className="text-sm text-muted-foreground">{album.artist}</p>
                    {album.year && <p className="text-sm text-muted-foreground">{album.year}</p>}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <StreamSelector
                    album={album}
                    activeStream={activeStream}
                    setActiveStream={setActiveStream}
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayClick}
                    className="shrink-0 bg-[#c8d3d6]"
                >
                    {isPlaying ? (
                        <Square className="h-5 w-5 text-destructive" />
                    ) : (
                        <PlayIcon className="h-5 w-5 text-accent-foreground" />
                    )}
                </Button>
                <FolderSelector album={album} />
            </div>
            {/* {isPlaying && <StreamingPlayer album={album} activeStream={activeStream} />} */}

            <AnimatePresence initial={false}>
                {isPlaying && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <StreamingPlayer album={album} activeStream={activeStream} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
