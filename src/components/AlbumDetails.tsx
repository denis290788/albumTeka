"use client";

import { useAuth } from "@/features/auth";
import { StreamType, useGetAlbumByIdQuery } from "@/services/albumsApi";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { StreamSelector } from "./StreamSelector";
import { FolderSelector } from "./FolderSelector";
import { StreamingPlayer } from "./StreamingPlayer";
import { Loader } from "./ui/loader";
import { AlbumDetailsMenu } from "./AlbumDetailsMenu";
import { motion } from "framer-motion";

interface AlbumDetailsProps {
    albumId: string;
    className?: string;
}

export function AlbumDetails({ albumId, className }: AlbumDetailsProps) {
    const { user } = useAuth();

    const {
        data: album,
        isLoading: isLoading,
        isError: isError,
    } = useGetAlbumByIdQuery({ albumId: albumId as string }, { skip: !albumId });

    const [activeStream, setActiveStream] = useState<StreamType | undefined>();

    useEffect(() => {
        if (album) {
            setActiveStream(album.defaultStream);
        }
    }, [album]);

    const gradientAngle = useMemo(() => Math.floor(Math.random() * 360), []);

    if (isLoading) return <Loader />;
    if (isError)
        return <p className="text-destructive text-2xl">Упс... ошибка загрузки альбома:/</p>;

    if (!album || !activeStream) return null;

    const isOwner = user?.uid === album.userId;

    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Card
                className={cn(
                    "p-4 gap-4",
                    "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "bg-transparent",
                    className
                )}
                style={{ "--angle": `${gradientAngle}deg` } as React.CSSProperties}
            >
                <div className="flex flex-col md:flex-row md:items-center gap-1 text-foreground dark:text-[#bedaca] text-[18px]">
                    <h3 className="font-semibold">{album.title}</h3>
                    {album.year && <p>{album.year}</p>}
                    <p>{album.artist}</p>
                </div>
                <div className="flex  flex-col md:flex-row gap-4">
                    {album.coverUrl && (
                        <div className="w-full md:w-[447px] relative shrink-0">
                            {/* eslint-disable-next-line */}
                            <img
                                src={album.coverUrl}
                                alt={album.title}
                                className="object-cover rounded"
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="flex flex-col flex-1 gap-2">
                        <div className="flex gap-2 items-center">
                            <StreamSelector
                                album={album}
                                activeStream={activeStream}
                                setActiveStream={setActiveStream}
                                className="flex-1"
                            />
                            {isOwner && <FolderSelector album={album} />}
                            <AlbumDetailsMenu album={album} isOwner={isOwner} />
                        </div>
                        <StreamingPlayer album={album} activeStream={activeStream} />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
