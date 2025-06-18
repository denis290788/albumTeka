import { z } from "zod";

export const streamSchema = z
    .object({
        streamType: z.enum(["bandcamp", "spotify", "soundcloud", "vk"]),
        streamUrl: z.string().min(1, "Введите ссылку"),
    })
    .superRefine((data, ctx) => {
        const { streamType, streamUrl } = data;

        const patterns: Record<typeof data.streamType, RegExp> = {
            bandcamp: /^(https:\/\/)?(.*\.)?bandcamp\.com\/.*(album|track|EmbeddedPlayer)/i,
            spotify: /spotify\.com/i,
            soundcloud: /soundcloud\.com/i,
            vk: /vk\.com\/music/i,
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
