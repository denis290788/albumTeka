import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderFormData, folderSchema } from "../model/addFolderTypes";
import { useAddFolderMutation } from "@/services/foldersApi";

export const useAddFolderForm = (onSuccess?: () => void) => {
    const [addFolder] = useAddFolderMutation();

    const form = useForm<FolderFormData>({
        resolver: zodResolver(folderSchema),
    });

    const onSubmit = async (data: FolderFormData) => {
        try {
            await addFolder({ name: data.name }).unwrap();
            form.reset();
            onSuccess?.();
        } catch (err) {
            console.error("Ошибка при добавлении папки", err);
        }
    };

    return {
        form,
        onSubmit,
    };
};
