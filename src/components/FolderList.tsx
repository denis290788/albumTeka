"use client";

import { useGetFoldersQuery, useUpdateFolderOrderMutation } from "@/services/foldersApi";
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
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

interface FolderListProps {
    className?: string;
}

export function FolderList({ className }: FolderListProps) {
    const { user } = useAuth();
    const { data: folders = [], isError } = useGetFoldersQuery(user?.uid);
    const [updateOrder] = useUpdateFolderOrderMutation();

    const [localFolders, setLocalFolders] = useState(folders);
    const sensors = useSensors(useSensor(PointerSensor));

    // import isEqual from "lodash.isequal"; // npm install lodash.isequal
    // useEffect(() => {
    //   if (!isEqual(folders, localFolders)) {
    //     setLocalFolders(folders);
    //   }
    // }, [folders, localFolders]);

    useEffect(() => {
        if (JSON.stringify(folders) !== JSON.stringify(localFolders)) {
            setLocalFolders(folders);
        }
    }, [folders, localFolders]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = localFolders.findIndex((f) => f.id === active.id);
            const newIndex = localFolders.findIndex((f) => f.id === over?.id);

            const newOrder = arrayMove(localFolders, oldIndex, newIndex);
            setLocalFolders(newOrder);

            // Обновляем порядок на сервере
            for (let i = 0; i < newOrder.length; i++) {
                await updateOrder({ folderId: newOrder[i].id, order: i });
            }
        }
    };

    if (isError) return <p className="text-destructive">Ошибка загрузки папок.</p>;
    if (!folders.length) return null;

    return (
        <div className={cn("mb-8 flex flex-col gap-4", className)}>
            <h2 className="text-[18px] lg:text-xl">Мои папки</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={localFolders.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex gap-2 lg:gap-4 items-center flex-wrap">
                        {localFolders.map((folder) => (
                            <FolderCard key={folder.id} id={folder.id} name={folder.name} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
