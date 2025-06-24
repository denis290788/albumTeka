import { Album, useAddAlbumMutation, useDeleteAlbumMutation } from "@/services/albumsApi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { MoreHorizontal, Trash, Share2, Disc3 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "./ConfirmModal";
import { useState } from "react";

interface AlbumDetailsMenuProps {
    album: Album;
    isOwner: boolean;
}

export function AlbumDetailsMenu({ album, isOwner }: AlbumDetailsMenuProps) {
    const router = useRouter();

    const [addAlbum] = useAddAlbumMutation();
    const [deleteAlbum] = useDeleteAlbumMutation();

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleShareAlbum = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast.success("Ссылка скопирована в буфер обмена");
        } catch (err) {
            console.error("Ошибка при копировании ссылки:", err);
            toast.error("Не удалось скопировать ссылку");
        }
    };

    const handleAddAlbum = async (e: React.MouseEvent) => {
        e.preventDefault();

        const albumToAdd = {
            title: album.title,
            artist: album.artist,
            year: album.year,
            coverUrl: album.coverUrl,
            streams: album.streams,
            defaultStream: album.defaultStream,
            folderId: null,
        };

        try {
            await addAlbum(albumToAdd).unwrap();
            toast.success("Альбом добавлен в вашу библиотеку");
            return true;
        } catch (err) {
            console.error("Ошибка при добавлении альбома:", err);
            toast.error("Не удалось добавить альбом");
            return false;
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAlbum(album.id).unwrap();
            router.push("/");
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
                        className="text-foreground dark:text-[#bedaca]"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {isOwner ? (
                        <DropdownMenuItem
                            className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                            onClick={handleShareAlbum}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Поделиться
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                            onClick={handleAddAlbum}
                        >
                            <Disc3 className="h-4 w-4 mr-2" />
                            Добавить
                        </DropdownMenuItem>
                    )}
                    {isOwner && (
                        <DropdownMenuItem
                            className="text-destructive focus:bg-muted-foreground/30 cursor-pointer"
                            onClick={() => setConfirmModalOpen(true)}
                        >
                            <Trash className="w-4 h-4 mr-2 text-destructive" />
                            Удалить
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal
                open={confirmModalOpen}
                headText="Подтвердите удаление"
                description="Вы уверены, что хотите удалить этот альбом? Это действие нельзя отменить."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModalOpen(false)}
            />
        </>
    );
}
