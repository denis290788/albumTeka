import { z } from "zod";
import { getStreamSchema } from "@/features/addStreamModal/model/addStreamTypes";

export const createAlbumSchema = (t: (key: string) => string) =>
    z
        .object({
            title: z.string().min(1, t("albumForm_error_title")),
            artist: z.string().min(1, t("albumForm_error_artist")),
            year: z
                .string()
                .optional()
                .refine((val) => !val || /^\d{4}$/.test(val), {
                    message: t("albumForm_error_year"),
                }),
            coverUrl: z.string().url(t("albumForm_error_coverUrl")).optional().or(z.literal("")),
            streamType: z.enum(["Bandcamp", "Spotify", "Soundcloud", "VK"]),
        })
        .and(getStreamSchema(t));

export type AlbumFormData = z.infer<ReturnType<typeof createAlbumSchema>>;
