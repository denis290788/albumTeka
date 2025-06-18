"use client";

import { useGetAlbumsByFolderQuery, useGetAlbumsQuery } from "@/services/albumsApi";
import { useAuth } from "@/features/auth";
import { AlbumCard } from "./AlbumCard";
import { useEffect, useState } from "react";
import { useGetFolderByIdQuery } from "@/services/foldersApi";
import Masonry from "react-masonry-css";
import { Loader } from "./ui/loader";

interface AlbumListProps {
    folderId?: string;
}

export function AlbumList({ folderId }: AlbumListProps) {
    const { user } = useAuth();
    const userId = user?.uid as string;

    const {
        data: allUserAlbums = [],
        isLoading: isLoadingAllAlbums,
        isError: isErrorAllAlbums,
    } = useGetAlbumsQuery(user?.uid, {
        skip: !!folderId,
    });

    const {
        data: folderAlbums = [],
        isLoading: isLoadingFolderAlbums,
        isError: isErrorFolderAlbums,
    } = useGetAlbumsByFolderQuery(
        { userId: userId, folderId: folderId as string },
        {
            skip: !folderId,
        }
    );

    const {
        data: folder,
        isLoading: isLoadingFolder,
        isError: isErrorFolder,
    } = useGetFolderByIdQuery(
        { userId: userId, folderId: folderId as string },
        {
            skip: !folderId,
        }
    );

    const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setActiveAlbumId(null);
        }
    }, [user]);

    const isLoading = folderId ? isLoadingFolderAlbums || isLoadingFolder : isLoadingAllAlbums;
    const isError = folderId ? isErrorFolderAlbums || isErrorFolder : isErrorAllAlbums;

    let albumsToDisplay = [];

    if (folderId) {
        albumsToDisplay = folderAlbums;
    } else {
        albumsToDisplay = allUserAlbums.filter((album) => album.folderId === null);
    }

    if (isLoading) return <Loader />;
    if (isError) return <p className="text-destructive text-2xl">Ошибка загрузки альбомов</p>;
    if (albumsToDisplay.length === 0) {
        return <p className="text-muted-foreground text-2xl">Нет добавленных альбомов</p>;
    }

    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        640: 1,
    };

    return (
        <>
            {folderId && folder && <h1 className="text-2xl font-bold mb-6">{folder!.name}</h1>}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {albumsToDisplay.map((album) => (
                    <div key={album.id} className="mb-6">
                        <AlbumCard {...{ album, activeAlbumId, setActiveAlbumId }} />
                    </div>
                ))}
            </Masonry>
        </>
    );
}
