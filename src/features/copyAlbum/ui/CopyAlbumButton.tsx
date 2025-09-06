"use client";

import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Disc3 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAddAlbumMutation, Album } from "@/entities/album/model/albumsApi";

interface CopyAlbumButtonProps {
    album: Album;
}

export function CopyAlbumButton({ album }: CopyAlbumButtonProps) {
    const { t } = useTranslation();
    const [addAlbum] = useAddAlbumMutation();

    const handleCopy = async () => {
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
        } catch (err) {
            console.error("Ошибка копирования альбома:", err);
            toast.error(t("albumDetails_addError"));
        }
    };

    return (
        <DropdownMenuItem
            className="cursor-pointer text-foreground focus:bg-muted-foreground/30"
            onSelect={handleCopy}
        >
            <Disc3 className="h-4 w-4 mr-2" />
            {t("albumDetails_add")}
        </DropdownMenuItem>
    );
}
