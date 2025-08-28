"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal, Info, Share2 } from "lucide-react";
import { useDeleteAlbumMutation } from "@/services/albumsApi";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { useRouter } from "next/navigation";

interface AlbumCardMenuProps {
    albumId: string;
}

export function AlbumCardMenu({ albumId }: AlbumCardMenuProps) {
    const router = useRouter();
    const [deleteAlbum] = useDeleteAlbumMutation();

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleShareAlbum = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const albumUrl = `${window.location.origin}/album/${albumId}`;
            await navigator.clipboard.writeText(albumUrl);
            toast.success("Ссылка скопирована в буфер обмена");
        } catch (err) {
            console.error("Ошибка при копировании ссылки:", err);
            toast.error("Не удалось скопировать ссылку");
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAlbum(albumId).unwrap();
            toast.success("Альбом успешно удален");
        } catch (err) {
            console.error("Ошибка при удалении альбома:", err);
            toast.error("Не удалось удалить альбом");
        } finally {
            setConfirmModalOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="text-foreground dark:text-[#bedaca] dark:hover:text-background"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                        onClick={() => router.push(`/album/${albumId}`)}
                    >
                        <Info className="w-4 h-4 mr-2" />
                        Детали
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                        onClick={handleShareAlbum}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Поделиться
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
                description="Вы уверены, что хотите удалить альбом? Это действие нельзя отменить."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModalOpen(false)}
            />
        </>
    );
}
