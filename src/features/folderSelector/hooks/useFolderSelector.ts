import { useAuth } from "@/features/auth";
import { Album, useUpdateAlbumMutation } from "@/entities/album/model/albumsApi";
import { useGetFoldersQuery } from "@/entities/folder/model/foldersApi";

export interface UseFolderSelectorOptions {
    album: Album;
}

export interface UseFolderSelectorReturn {
    folders?: Array<{ id: string; name: string }>;
    selectedValue: string | undefined;
    handleChange: (value: string) => Promise<void>;
    isLoading: boolean;
}

export const useFolderSelector = ({ album }: UseFolderSelectorOptions): UseFolderSelectorReturn => {
    const { user } = useAuth();

    const { data: folders, isLoading } = useGetFoldersQuery(user?.uid);
    const [updateAlbum] = useUpdateAlbumMutation();

    const selectedValue = album.folderId === null ? "null" : album.folderId;

    const handleChange = async (value: string) => {
        const newFolderId = value === "null" ? null : value;

        try {
            await updateAlbum({
                ...album,
                folderId: newFolderId,
            }).unwrap();
        } catch (error) {
            console.error("Ошибка при обновлении альбома:", error);
        }
    };

    return {
        folders,
        selectedValue,
        handleChange,
        isLoading,
    };
};
