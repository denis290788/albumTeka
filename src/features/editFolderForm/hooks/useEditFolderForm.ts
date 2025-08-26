import { useUpdateFolderNameMutation } from "@/services/foldersApi";
import { useForm } from "react-hook-form";
import { FolderFormData, folderSchema } from "../model/editFolderTypes";
import { zodResolver } from "@hookform/resolvers/zod";

export const useEditFolderNameForm = (id: string, onSuccess?: () => void) => {
    const [editFolderName] = useUpdateFolderNameMutation();

    const form = useForm<FolderFormData>({
        resolver: zodResolver(folderSchema),
    });

    const onSubmit = async (data: FolderFormData) => {
        try {
            await editFolderName({ id: id, name: data.name }).unwrap();
            form.reset();
            onSuccess?.();
        } catch (err) {
            console.error("Ошибка при редактировании папки", err);
        }
    };

    return {
        form,
        onSubmit,
    };
};
