import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useGetFoldersQuery } from "@/services/foldersApi";
import { Album, useUpdateAlbumMutation } from "@/services/albumsApi";

interface FolderSelectorProps {
    album: Album;
}

export function FolderSelector({ album }: FolderSelectorProps) {
    const { data: folders } = useGetFoldersQuery();
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

    const currentFolderName =
        album.folderId === null ? "Без папки" : folders!.find((f) => f.id === album.folderId)?.name;

    return (
        <Select onValueChange={handleChange} value={selectedValue}>
            <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder={currentFolderName || "Добавить в папку"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="null">Без папки</SelectItem>
                {folders!.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
