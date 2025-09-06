"use client";

import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ShareAlbumButtonProps {
    albumId: string;
    variant?: "card" | "details";
}

export function ShareAlbumButton({ albumId, variant = "card" }: ShareAlbumButtonProps) {
    const { t } = useTranslation();

    const handleShare = async () => {
        try {
            const url =
                variant === "card"
                    ? `${window.location.origin}/album/${albumId}`
                    : window.location.href;

            await navigator.clipboard.writeText(url);
            toast.success(t("albumMenu_copySuccess"));
        } catch (err) {
            console.error("Ошибка при копировании:", err);
            toast.error(t("albumMenu_copyError"));
        }
    };

    return (
        <DropdownMenuItem
            className="cursor-pointer text-foreground focus:bg-muted-foreground/30"
            onSelect={handleShare}
        >
            <Share2 className="w-4 h-4 mr-2" />
            {t("albumMenu_share")}
        </DropdownMenuItem>
    );
}
