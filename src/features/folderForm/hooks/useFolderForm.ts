import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { FolderFormData, getFolderSchema } from "../model/types";
import {
    useAddFolderMutation,
    useUpdateFolderNameMutation,
} from "@/entities/folder/model/foldersApi";

export type FolderFormMode = "create" | "edit";

interface UseFolderFormOptions {
    mode: FolderFormMode;
    folderId?: string;
    currentName?: string;
    onSuccess?: () => void;
}

export const useFolderForm = ({ mode, folderId, currentName, onSuccess }: UseFolderFormOptions) => {
    const { t } = useTranslation();
    const [addFolder] = useAddFolderMutation();
    const [editFolderName] = useUpdateFolderNameMutation();

    const form = useForm<FolderFormData>({
        resolver: zodResolver(getFolderSchema(t)),
        defaultValues: {
            name: currentName || "",
        },
    });

    const onSubmit = async (data: FolderFormData) => {
        try {
            if (mode === "create") {
                await addFolder({ name: data.name }).unwrap();
            } else if (mode === "edit" && folderId) {
                await editFolderName({ id: folderId, name: data.name }).unwrap();
            }

            form.reset();
            onSuccess?.();
        } catch (err) {
            console.error(
                `Ошибка при ${mode === "create" ? "добавлении" : "редактировании"} папки`,
                err
            );
        }
    };

    return {
        form,
        onSubmit,
        mode,
    };
};
