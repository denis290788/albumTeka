import { z } from "zod";

export const getStreamSchema = (t: (key: string) => string) =>
    z
        .object({
            streamType: z.enum(["Bandcamp", "Spotify", "Soundcloud", "VK"], {
                errorMap: () => ({ message: t("addStreamForm_error_streamType") }),
            }),
            streamUrl: z.string().min(1, t("addStreamForm_error_streamUrl_required")),
        })
        .superRefine((data, ctx) => {
            const patterns: Record<typeof data.streamType, RegExp> = {
                Bandcamp: /^(https:\/\/)?(.*\.)?bandcamp\.com\/.*(album|track|EmbeddedPlayer)/i,
                Spotify: /spotify\.com/i,
                Soundcloud: /soundcloud\.com/i,
                VK: /vk\.com\/music/i,
            };

            if (!patterns[data.streamType].test(data.streamUrl)) {
                ctx.addIssue({
                    path: ["streamUrl"],
                    code: z.ZodIssueCode.custom,
                    message: t("addStreamForm_error_streamUrl_pattern"),
                });
            }
        });

export type StreamFormData = z.infer<ReturnType<typeof getStreamSchema>>;
