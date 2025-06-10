"use client";

import { useGetFoldersQuery } from "@/services/foldersApi";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import { AlbumCard } from "@/app/components/albumCard";

interface FolderClientProps {
    folderId: string;
}

export function FolderClient({ folderId }: FolderClientProps) {
    const { data: folders, isLoading: loadingFolders, error: foldersError } = useGetFoldersQuery();
    const { data: albums, isLoading: loadingAlbums, error: albumsError } = useGetAlbumsQuery();

    //добавить запрос альбомов папки по её id
    const folder = folders?.find((f) => f.id === folderId);
    const folderAlbums = (albums ?? []).filter((a) => a.folderId === folderId);

    if (loadingFolders || loadingAlbums) {
        return <div className="p-6 text-muted-foreground">Загрузка...</div>;
    }

    if (foldersError || albumsError) {
        return <div className="p-6 text-red-500">Ошибка загрузки данных.</div>;
    }

    if (!folder) {
        return <div className="p-6 text-destructive">Папка не найдена.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">{folder.name}</h1>

            {folderAlbums.length === 0 ? (
                <p className="text-muted-foreground">В этой папке пока нет альбомов.</p>
            ) : (
                <div className="space-y-4">
                    {folderAlbums.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
            )}
        </div>
    );
}
