"use client";

import { useGetAlbumsQuery } from "@/services/albumsApi";
import { useAuth } from "@/features/auth";
import { AlbumCard } from "./AlbumCard";
import { useEffect, useState } from "react";

export function AlbumList() {
    const { user } = useAuth();
    const { data: albums = [], isLoading, isError } = useGetAlbumsQuery(user?.uid);

    const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setActiveAlbumId(null);
        }
    }, [user]);

    if (isLoading) return <p className="text-muted-foreground">Загрузка...</p>;
    if (isError) return <p className="text-red-500">Ошибка загрузки альбомов</p>;

    const albumsWithoutFolder = albums.filter((album) => album.folderId === null);

    if (albumsWithoutFolder.length === 0) {
        return <p className="text-muted-foreground">Нет добавленных альбомов.</p>;
    }

    return (
        <div className="albums-masonry">
            {albumsWithoutFolder.map((album) => (
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
    );
}
