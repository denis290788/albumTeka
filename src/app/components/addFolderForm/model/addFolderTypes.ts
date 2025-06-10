import { z } from "zod";

export const folderSchema = z.object({
    name: z.string().min(1, "Введите название папки"),
});

export type FolderFormData = z.infer<typeof folderSchema>;
