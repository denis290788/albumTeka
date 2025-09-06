"use client";

import { cn } from "@/shared/utils/cn";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Folder as FolderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFolderList } from "../hooks/useFolderList";
import { FolderCard } from "@/entities/folder";

interface FolderListProps {
    className?: string;
}

export function FolderList({ className }: FolderListProps) {
    const { t } = useTranslation();
    const { localFolders, isError, handleDragEnd } = useFolderList();

    const sensors = useSensors(useSensor(PointerSensor));

    if (isError) return <p className="text-destructive">{t("folder_list_error")}</p>;
    if (!localFolders.length) return null;

    return (
        <div className={cn("mb-8 flex flex-col lg:flex-row gap-4", className)}>
            <div className="flex gap-2 items-center">
                <FolderIcon className="h-6 w-6" />
                <h2 className="text-[18px] lg:text-xl">{t("folder_list_title")}</h2>
            </div>

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
