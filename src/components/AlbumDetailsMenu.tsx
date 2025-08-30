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
import { useTranslation } from "react-i18next";

interface AlbumDetailsMenuProps {
    album: Album;
    isOwner: boolean;
}

export function AlbumDetailsMenu({ album, isOwner }: AlbumDetailsMenuProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const [addAlbum] = useAddAlbumMutation();
    const [deleteAlbum] = useDeleteAlbumMutation();

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleShareAlbum = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast.success(t("albumMenu_copySuccess"));
        } catch (err) {
            console.error("Ошибка при копировании ссылки:", err);
            toast.error(t("albumMenu_copyError"));
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
            toast.success(t("albumDetails_addSuccess"));
            return true;
        } catch (err) {
            console.error("Ошибка при добавлении альбома:", err);
            toast.error(t("albumDetails_addError"));
            return false;
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAlbum(album.id).unwrap();
            toast.success(t("albumMenu_deleteSuccess"));
            router.push("/");
        } catch (err) {
            console.error("Ошибка при удалении альбома:", err);
            toast.error(t("albumMenu_deleteError"));
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
                            {t("albumMenu_share")}
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            className="text-foreground focus:bg-muted-foreground/30 cursor-pointer"
                            onClick={handleAddAlbum}
                        >
                            <Disc3 className="h-4 w-4 mr-2" />
                            {t("albumDetails_add")}
                        </DropdownMenuItem>
                    )}
                    {isOwner && (
                        <DropdownMenuItem
                            className="text-destructive focus:bg-muted-foreground/30 cursor-pointer"
                            onClick={() => setConfirmModalOpen(true)}
                        >
                            <Trash className="w-4 h-4 mr-2 text-destructive" />
                            {t("albumMenu_delete")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal
                open={confirmModalOpen}
                headText={t("albumMenu_confirmTitle")}
                description={t("albumMenu_confirmDescription")}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModalOpen(false)}
            />
        </>
    );
}
