import { z } from "zod";

export const streamSchema = z.object({
    streamUrl: z.string().min(1, "Введите ссылку"),
    streamType: z.enum(["bandcamp", "spotify", "soundcloud", "vk"]),
});

export type StreamFormData = z.infer<typeof streamSchema>;
