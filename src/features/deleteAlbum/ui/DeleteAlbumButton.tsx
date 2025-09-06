"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { useDeleteAlbumMutation } from "@/entities/album/model/albumsApi";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface DeleteAlbumButtonProps {
    albumId: string;
    variant?: "card" | "details";
}

export function DeleteAlbumButton({ albumId, variant = "card" }: DeleteAlbumButtonProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [deleteAlbum] = useDeleteAlbumMutation();
    const [open, setOpen] = useState(false);

    const handleConfirmDelete = async () => {
        try {
            await deleteAlbum(albumId).unwrap();
            toast.success(t("albumMenu_deleteSuccess"));
            if (variant === "details") router.push("/");
        } catch (err) {
            console.error("Ошибка удаления:", err);
            toast.error(t("albumMenu_deleteError"));
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <DropdownMenuItem
                className="cursor-pointer text-destructive focus:bg-muted-foreground/30"
                onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                <Trash className="w-4 h-4 mr-2 text-destructive" />
                {t("albumMenu_delete")}
            </DropdownMenuItem>

            <ConfirmModal
                open={open}
                headText={t("albumMenu_confirmTitle")}
                description={t("albumMenu_confirmDescription")}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpen(false)}
            />
        </>
    );
}
