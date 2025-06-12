"use client";

import { useGetFoldersQuery } from "@/services/foldersApi";
import { FolderCard } from "./FolderCard";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

interface FolderListProps {
    className?: string;
}

export function FolderList({ className }: FolderListProps) {
    const { user } = useAuth();
    const { data: folders = [], isError } = useGetFoldersQuery(user?.uid);

    if (isError) return <p className="text-red-500">Ошибка загрузки папок.</p>;
    if (!folders.length) return null;

    return (
        <div className={cn("mb-8 flex gap-2 lg:gap-4 items-center flex-wrap", className)}>
            <h2 className="text-[18px] lg:text-xl">Мои папки</h2>
            {folders.map((folder) => (
                <FolderCard key={folder.id} id={folder.id} name={folder.name} />
            ))}
        </div>
    );
}
