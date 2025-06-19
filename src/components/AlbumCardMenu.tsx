"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal } from "lucide-react";
import { useDeleteAlbumMutation } from "@/services/albumsApi";

interface AlbumCardMenuProps {
    albumId: string;
}

export function AlbumCardMenu({ albumId }: AlbumCardMenuProps) {
    const [deleteAlbum] = useDeleteAlbumMutation();

    const handleDeleteAlbum = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            await deleteAlbum(albumId).unwrap();
        } catch (err) {
            console.error("Ошибка при удалении альбома:", err);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="text-foreground">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className="text-destructive focus:bg-muted-foreground/30 cursor-pointer"
                    onClick={handleDeleteAlbum}
                >
                    <Trash className="w-4 h-4 mr-2 text-destructive" />
                    Удалить
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
