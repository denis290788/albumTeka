import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Album } from "./albumCard";
import { useFolders } from "../context/FoldersContext";

export function FolderSelector({
    album,
    onChange,
}: {
    album: Album;
    onChange?: (newFolderId: string | null) => void;
}) {
    const { folders } = useFolders();

    const handleChange = async (folderId: string) => {
        const value = folderId === "none" ? null : folderId;
        const albumRef = doc(db, "albums", album.id);
        await updateDoc(albumRef, { folderId: value });
        onChange?.(value);
    };

    const currentFolder = folders.find((f) => f.id === album.folderId);

    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder={currentFolder?.name || "Добавить в папку"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">Без папки</SelectItem>
                {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
