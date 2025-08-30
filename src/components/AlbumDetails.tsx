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
import { Disc3 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AlbumDetailsProps {
    albumId: string;
    className?: string;
}

export function AlbumDetails({ albumId, className }: AlbumDetailsProps) {
    const { user } = useAuth();
    const { t } = useTranslation();

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
    if (isError) return <p className="text-destructive text-2xl">{t("album_error")}</p>;

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
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-foreground dark:text-[#bedaca] text-[18px]">
                    <h3 className="font-semibold">{album.title}</h3>
                    {album.year && <p>{album.year}</p>}
                    <p>{album.artist}</p>
                </div>
                <div className="flex  flex-col md:flex-row gap-4">
                    <div className="w-full md:w-[436px] relative shrink-0 aspect-square bg-black/10 rounded-2xl">
                        {album.coverUrl ? (
                            // eslint-disable-next-line
                            <img
                                src={album.coverUrl}
                                alt={album.title}
                                className="absolute inset-0 w-full h-full object-contain rounded-2xl"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-gradient-to-br from-[#4ac77c]/30 to-muted/25 flex flex-col items-center justify-center rounded-2xl">
                                <Disc3 className="w-64 h-64 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
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
