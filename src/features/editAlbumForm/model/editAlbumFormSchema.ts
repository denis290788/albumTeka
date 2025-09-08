import { z } from "zod";

export const editAlbumSchema = (t: (key: string) => string) =>
    z.object({
        title: z.string().min(1, t("albumForm_error_title")),
        artist: z.string().min(1, t("albumForm_error_artist")),
        year: z
            .string()
            .optional()
            .refine((val) => !val || /^\d{4}$/.test(val), {
                message: t("albumForm_error_year"),
            }),
        coverUrl: z.string().url(t("albumForm_error_coverUrl")).optional().or(z.literal("")),
    });

export type EditAlbumFormData = z.infer<ReturnType<typeof editAlbumSchema>>;
