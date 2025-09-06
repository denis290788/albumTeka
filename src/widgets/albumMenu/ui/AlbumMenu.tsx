"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Album } from "@/entities/album/model/albumsApi";
import { ShareAlbumButton } from "@/features/shareAlbum";
import { CopyAlbumButton } from "@/features/copyAlbum";
import { DeleteAlbumButton } from "@/features/deleteAlbum";

type AlbumMenuVariant = "card" | "details";

interface AlbumMenuProps {
    album: Album;
    isOwner: boolean;
    variant?: AlbumMenuVariant;
}

export function AlbumMenu({ album, isOwner, variant = "card" }: AlbumMenuProps) {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {variant === "card" && (
                    <DropdownMenuItem
                        className="cursor-pointer text-foreground focus:bg-muted-foreground/30"
                        onSelect={() => router.push(`/album/${album.id}`)}
                    >
                        <Info className="w-4 h-4 mr-2" />
                        {t("albumMenu_details")}
                    </DropdownMenuItem>
                )}
                <ShareAlbumButton albumId={album.id} variant={variant} />
                {isOwner ? (
                    <DeleteAlbumButton albumId={album.id} variant={variant} />
                ) : (
                    <CopyAlbumButton album={album} />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
