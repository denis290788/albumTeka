"use client";

import {
    Folder,
    useGetFoldersQuery,
    useUpdateFoldersOrderMutation,
} from "@/entities/folder/model/foldersApi";
import { useAuth } from "@/features/auth";
import { useEffect, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function useFolderList() {
    const { user } = useAuth();
    const { data: folders = [], isError } = useGetFoldersQuery(user?.uid);
    const [updateFoldersOrder] = useUpdateFoldersOrderMutation();

    const [localFolders, setLocalFolders] = useState<Folder[]>([]);

    useEffect(() => {
        const changed =
            folders.length !== localFolders.length ||
            folders.some(
                (f, i) =>
                    f.id !== localFolders[i]?.id ||
                    f.name !== localFolders[i]?.name ||
                    f.order !== localFolders[i]?.order
            );

        if (changed) {
            setLocalFolders(folders);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folders]);

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

    return {
        localFolders,
        isError,
        handleDragEnd,
    };
}
