import { useUpdateFolderNameMutation } from "@/services/foldersApi";
import { useForm } from "react-hook-form";
import { FolderFormData, getFolderSchema } from "../model/editFolderTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const useEditFolderNameForm = (id: string, onSuccess?: () => void) => {
    const { t } = useTranslation();
    const [editFolderName] = useUpdateFolderNameMutation();

    const form = useForm<FolderFormData>({
        resolver: zodResolver(getFolderSchema(t)),
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
