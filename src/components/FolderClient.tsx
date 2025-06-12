"use client";

import { useGetFoldersQuery } from "@/services/foldersApi";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import { AlbumCard } from "./AlbumCard";
import { useAuth } from "@/features/auth";
import { useEffect, useState } from "react";

interface FolderClientProps {
    folderId: string;
}

export function FolderClient({ folderId }: FolderClientProps) {
    const { user } = useAuth();

    const {
        data: folders,
        isLoading: loadingFolders,
        error: foldersError,
    } = useGetFoldersQuery(user?.uid);
    const {
        data: albums,
        isLoading: loadingAlbums,
        error: albumsError,
    } = useGetAlbumsQuery(user?.uid);

    //добавить запрос альбомов папки по её id
    const folder = folders?.find((f) => f.id === folderId);
    const folderAlbums = (albums ?? []).filter((a) => a.folderId === folderId);

    const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setActiveAlbumId(null);
        }
    }, [user]);

    if (loadingFolders || loadingAlbums) {
        return <div className="p-6 text-muted-foreground">Загрузка...</div>;
    }

    if (foldersError || albumsError) {
        return <div className="p-6 text-red-500">Ошибка загрузки данных.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 pt-[100px] lg:pt-[125px]">
            <h1 className="text-2xl font-bold mb-6">{folder!.name}</h1>

            {folderAlbums.length === 0 ? (
                <p className="text-muted-foreground">В этой папке пока нет альбомов.</p>
            ) : (
                <div className="albums-masonry">
                    {folderAlbums.map((album) => (
                        <div key={album.id} className="inline-block w-full pb-6">
                            <AlbumCard
                                key={album.id}
                                album={album}
                                activeAlbumId={activeAlbumId}
                                setActiveAlbumId={setActiveAlbumId}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
