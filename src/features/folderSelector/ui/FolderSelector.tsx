"use client";

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/shared/ui/select";
import { Folder } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFolderSelector } from "../hooks/useFolderSelector";
import { Album } from "@/entities/album/model/albumsApi";

export interface FolderSelectorProps {
    album: Album;
}

export function FolderSelector({ album }: FolderSelectorProps) {
    const { t } = useTranslation();
    const { folders, selectedValue, handleChange, isLoading } = useFolderSelector({ album });

    if (isLoading) {
        return (
            <Select disabled>
                <SelectTrigger className="max-w-xs">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                </SelectTrigger>
            </Select>
        );
    }

    return (
        <Select onValueChange={handleChange} value={selectedValue}>
            <SelectTrigger className="max-w-xs group transition-all">
                <Folder className="h-4 w-4 text-foreground transition-colors group-hover:text-accent-foreground dark:text-[#bedaca] dark:group-hover:text-background" />
            </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectItem value="null">{t("folder_selector_none")}</SelectItem>
                {folders?.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
