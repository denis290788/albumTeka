"use client";

import { useState } from "react";
import { AlbumCard, Album } from "@/app/components/albumCard";
import { Folder } from "@/lib/queries/get-folders";

type Props = {
    folder: Folder;
    initialAlbums: Album[];
};

export function FolderClient({ folder, initialAlbums }: Props) {
    const [albums, setAlbums] = useState(initialAlbums);

    const handleFolderChange = (albumId: string, newFolderId: string | null) => {
        // если альбом переместили в другую папку — удаляем его
        if (newFolderId !== folder.id) {
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">{folder.name}</h1>

            {albums.length === 0 ? (
                <p className="text-muted-foreground">В этой папке пока нет альбомов.</p>
            ) : (
                <div className="space-y-4">
                    {albums.map((album) => (
                        <AlbumCard
                            key={album.id}
                            album={album}
                            onFolderChange={handleFolderChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
