import { z } from "zod";

export const streamSchema = z
    .object({
        streamType: z.enum(["Bandcamp", "Spotify", "Soundcloud", "VK"]),
        streamUrl: z.string().min(1, "Введите ссылку"),
    })
    .superRefine((data, ctx) => {
        const { streamType, streamUrl } = data;

        const patterns: Record<typeof data.streamType, RegExp> = {
            Bandcamp: /^(https:\/\/)?(.*\.)?bandcamp\.com\/.*(album|track|EmbeddedPlayer)/i,
            Spotify: /spotify\.com/i,
            Soundcloud: /soundcloud\.com/i,
            VK: /vk\.com\/music/i,
        };

        const pattern = patterns[streamType];

        if (!pattern.test(streamUrl)) {
            ctx.addIssue({
                path: ["streamUrl"],
                code: z.ZodIssueCode.custom,
                message: `Ссылка не соответствует выбранному типу стриминга (${streamType}).`,
            });
        }
    });

export type StreamFormData = z.infer<typeof streamSchema>;
