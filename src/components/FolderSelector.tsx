import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useGetFoldersQuery } from "@/services/foldersApi";
import { Album, useUpdateAlbumMutation } from "@/services/albumsApi";
import { useAuth } from "@/features/auth";
import { Folder } from "lucide-react";

interface FolderSelectorProps {
    album: Album;
}

export function FolderSelector({ album }: FolderSelectorProps) {
    const { user } = useAuth();

    const { data: folders } = useGetFoldersQuery(user?.uid);
    const [updateAlbum] = useUpdateAlbumMutation();

    const selectedValue = album.folderId === null ? "null" : album.folderId;

    const handleChange = async (value: string) => {
        const newFolderId = value === "null" ? null : value;

        try {
            await updateAlbum({ ...album, folderId: newFolderId }).unwrap();
        } catch (error) {
            console.error("Ошибка при обновлении альбома:", error);
        }
    };

    return (
        <Select onValueChange={handleChange} value={selectedValue}>
            <SelectTrigger className="max-w-xs bg-[#c8d3d6]">
                <SelectValue asChild>
                    <Folder className="h-4 w-4 text-muted-foreground" />
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectItem value="null">Без папки</SelectItem>
                {folders &&
                    folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
}
