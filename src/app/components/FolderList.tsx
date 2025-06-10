"use client";

import { useGetFoldersQuery } from "@/services/foldersApi";
import { FolderCard } from "./FolderCard";

export function FolderList() {
    const { data: folders = [], isLoading, isError } = useGetFoldersQuery();

    if (isLoading) return <p className="text-muted-foreground">Загрузка...</p>;
    if (isError) return <p className="text-red-500">Ошибка загрузки папок.</p>;
    if (!folders.length) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Мои папки</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {folders.map((folder) => (
                    <FolderCard key={folder.id} id={folder.id} name={folder.name} />
                ))}
            </div>
        </div>
    );
}
