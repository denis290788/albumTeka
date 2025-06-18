import { streamSchema } from "@/features/addStreamModal/model/addStreamTypes";
import { z } from "zod";

export const albumSchema = z
    .object({
        title: z.string().min(1, "Введите название альбома"),
        artist: z.string().min(1, "Введите исполнителя"),
        year: z
            .string()
            .optional()
            .refine((val) => !val || /^\d{4}$/.test(val), {
                message: "Введите корректный год (4 цифры)",
            }),
        coverUrl: z.string().url("Неверная ссылка на обложку").optional().or(z.literal("")),
        streamType: z.enum(["bandcamp", "spotify", "soundcloud", "vk"]),
        // streamUrl: z.string().min(1, "Введите ссылку"),
    })
    .and(streamSchema);

export type AlbumFormData = z.infer<typeof albumSchema>;
