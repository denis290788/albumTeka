"use client";

import { useGetAlbumsQuery } from "@/services/albumsApi";
import { AlbumCard } from "./albumCard";
import { useAuth } from "@/features/auth";

export function AlbumList() {
    const { user } = useAuth();
    const { data: albums = [], isLoading, isError } = useGetAlbumsQuery(user?.uid);

    if (isLoading) return <p className="text-muted-foreground">Загрузка...</p>;
    if (isError) return <p className="text-red-500">Ошибка загрузки альбомов</p>;

    const albumsWithoutFolder = albums.filter((album) => album.folderId === null);

    if (albumsWithoutFolder.length === 0) {
        return <p className="text-muted-foreground">Нет добавленных альбомов.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {albumsWithoutFolder.map((album) => (
                <AlbumCard key={album.id} album={album} />
            ))}
        </div>
    );
}
