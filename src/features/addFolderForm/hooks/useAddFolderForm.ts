import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderFormData, getFolderSchema } from "../model/addFolderTypes";
import { useAddFolderMutation } from "@/services/foldersApi";
import { useTranslation } from "react-i18next";

export const useAddFolderForm = (onSuccess?: () => void) => {
    const { t } = useTranslation();
    const [addFolder] = useAddFolderMutation();

    const form = useForm<FolderFormData>({
        resolver: zodResolver(getFolderSchema(t)),
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
