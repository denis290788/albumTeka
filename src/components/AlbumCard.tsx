"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { FolderSelector } from "./FolderSelector";
import { Album, StreamType } from "@/services/albumsApi";
import { StreamSelector } from "./StreamSelector";
import { AlbumCardMenu } from "./AlbumCardMenu";
import { StreamingPlayer } from "./StreamingPlayer";

import { Button } from "@/components/ui/button";
import { Disc3, PlayIcon, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface AlbumCardProps {
    album: Album;
    activeAlbumId: string | null;
    setActiveAlbumId: (id: string | null) => void;
}

export function AlbumCard({ album, activeAlbumId, setActiveAlbumId }: AlbumCardProps) {
    const router = useRouter();

    const [activeStream, setActiveStream] = useState<StreamType>(album.defaultStream);
    const isPlaying = activeAlbumId === album.id;

    const [coverLoadError, setCoverLoadError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setCoverLoadError(false);
    }, [album.coverUrl]);

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
                "p-2 md:p-4 relative gap-2 md:gap-6",
                "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]",
                "dark:bg-[linear-gradient(var(--angle),#4ac77c,#34495e)]"
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
            <div className="flex gap-2 md:gap-4 min-h-[96px]">
                <div className="w-24 h-24 shrink-0">
                    <div
                        onClick={() => router.push(`/album/${album.id}`)}
                        className="w-full h-full transition-opacity duration-200 hover:opacity-70  active:opacity-70 cursor-pointer"
                    >
                        {album.coverUrl && !coverLoadError ? (
                            // eslint-disable-next-line
                            <img
                                ref={imgRef}
                                src={album.coverUrl}
                                alt={album.title}
                                className="object-cover object-center rounded"
                                loading="lazy"
                                onError={() => setCoverLoadError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#4ac77c]/10 to-muted/20 flex flex-col items-center justify-center rounded">
                                <Disc3 className="w-16 h-16 text-muted-foreground rounded" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-foreground dark:text-[#bedaca]">
                    <h3 className="pr-8 font-semibold text-sm md:text-lg line-clamp-2 break-words">
                        {album.title}
                    </h3>
                    <p className="text-sm truncate">{album.artist}</p>
                    {album.year && <p className="text-sm">{album.year}</p>}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <StreamSelector
                    album={album}
                    activeStream={activeStream}
                    setActiveStream={setActiveStream}
                    className="w-full"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayClick}
                    className="shrink-0 bg-muted-foreground/30 text-foreground hover:text-accent-foreground dark:text-[#bedaca] dark:hover:text-background"
                >
                    {isPlaying ? (
                        <Square className="h-5 w-5 text-destructive" />
                    ) : (
                        <PlayIcon className="h-5 w-5" />
                    )}
                </Button>
                <FolderSelector album={album} />
            </div>
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
