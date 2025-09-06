"use client";

import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import { ChevronDown, Folder as FolderIcon } from "lucide-react";
import { Loader } from "@/shared/ui/loader";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { useAlbumList } from "../hooks/useAlbumList";
import { AlbumCard } from "@/entities/album";

interface AlbumListProps {
    folderId?: string;
}

export function AlbumList({ folderId }: AlbumListProps) {
    const { t } = useTranslation();

    const {
        folder,
        albumsToDisplay,
        filteredAlbums,
        paginatedAlbums,
        activeAlbumId,
        setActiveAlbumId,
        loadMore,
        hasMore,
        isLoading,
        isError,
    } = useAlbumList(folderId);

    if (isLoading) return <Loader />;
    if (isError) return <p className="text-destructive text-2xl">{t("albumList_error")}</p>;
    if (albumsToDisplay.length === 0) {
        return <p className="text-muted-foreground text-2xl">{t("albumList_empty")}</p>;
    }
    if (filteredAlbums.length === 0) {
        return <p className="text-muted-foreground text-2xl">{t("albumList_notFound")}</p>;
    }

    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        640: 1,
    };

    return (
        <>
            {folderId && folder && (
                <div className="flex gap-2 items-center mb-6">
                    <FolderIcon className="h-6 w-6" />
                    <h2 className="text-[18px] lg:text-2xl">{folder.name}</h2>
                </div>
            )}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {paginatedAlbums.map((album) => (
                    <motion.div
                        key={album.id}
                        className="will-change-transform transform-gpu mb-6"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <AlbumCard
                            album={album}
                            activeAlbumId={activeAlbumId}
                            setActiveAlbumId={setActiveAlbumId}
                        />
                    </motion.div>
                ))}
            </Masonry>

            {hasMore && (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={loadMore}
                        className="flex items-center gap-2"
                    >
                        {t("albumList_showMore")}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </>
    );
}
