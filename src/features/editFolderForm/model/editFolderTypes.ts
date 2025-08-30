import { z } from "zod";

export const getFolderSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, t("addFolderForm_error_name")),
    });

export type FolderFormData = z.infer<ReturnType<typeof getFolderSchema>>;
