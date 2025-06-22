"use client";

import { Folder, useGetFoldersQuery, useUpdateFoldersOrderMutation } from "@/services/foldersApi";
import { FolderCard } from "./FolderCard";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useEffect, useState } from "react";

interface FolderListProps {
    className?: string;
}

export function FolderList({ className }: FolderListProps) {
    const { user } = useAuth();
    const { data: folders = [], isError } = useGetFoldersQuery(user?.uid);
    const [updateFoldersOrder] = useUpdateFoldersOrderMutation();

    const [localFolders, setLocalFolders] = useState<Folder[]>([]);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (
            folders.length !== localFolders.length ||
            folders.some(
                (f, i) => f.id !== localFolders[i]?.id || f.order !== localFolders[i]?.order
            )
        ) {
            setLocalFolders(folders);
        }
    }, [folders, localFolders]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = localFolders.findIndex((f) => f.id === active.id);
            const newIndex = localFolders.findIndex((f) => f.id === over?.id);

            const newOrderedFolders = arrayMove(localFolders, oldIndex, newIndex);
            setLocalFolders(newOrderedFolders);

            const foldersToUpdate = newOrderedFolders.map((folder, index) => ({
                ...folder,
                order: index,
            }));
            await updateFoldersOrder({ folders: foldersToUpdate });
        }
    };

    if (isError) return <p className="text-destructive">Ошибка загрузки папок.</p>;
    if (!localFolders.length && !folders.length) return null;

    return (
        <div className={cn("mb-8 flex gap-4", className)}>
            <h2 className="text-[18px] lg:text-xl dark:text-[#bedaca]">Мои папки</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToFirstScrollableAncestor, restrictToWindowEdges]}
            >
                <SortableContext
                    items={localFolders.map((f) => f.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="flex gap-2 lg:gap-4 flex-wrap">
                        {localFolders.map((folder) => (
                            <FolderCard key={folder.id} {...folder} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
