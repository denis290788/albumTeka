"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash, Pencil, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { useDeleteFolderMutation } from "@/services/foldersApi";
import { useAuth } from "@/features/auth";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import { EditFolderForm } from "@/features/editFolderForm/ui/EditFolderForm";

interface FolderCardMenuProps {
    id: string;
    name: string;
}

export function FolderCardMenu({ id, name }: FolderCardMenuProps) {
    const { user } = useAuth();
    const [deleteFolder] = useDeleteFolderMutation();
    const { refetch: refetchAlbums } = useGetAlbumsQuery(user?.uid);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [folderNameModalOpen, setFolderNameModalOpen] = useState(false);

    const handleConfirmDelete = async () => {
        try {
            await deleteFolder({ id }).unwrap();
            refetchAlbums();
            toast.success("Папка успешно удалена");
        } catch (err) {
            console.error("Ошибка при удалении папки:", err);
            toast.error("Не удалось удалить папку");
        } finally {
            setConfirmModalOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                        onClick={() => setFolderNameModalOpen(true)}
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:bg-muted-foreground/30 cursor-pointer"
                        onClick={() => setConfirmModalOpen(true)}
                    >
                        <Trash className="w-4 h-4 mr-2 text-destructive" />
                        Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal
                open={confirmModalOpen}
                headText="Подтвердите удаление"
                description="Вы уверены, что хотите удалить папку? Это действие нельзя отменить."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModalOpen(false)}
            />

            <EditFolderForm
                id={id}
                currentName={name}
                open={folderNameModalOpen}
                onOpenChange={setFolderNameModalOpen}
            />
        </>
    );
}
