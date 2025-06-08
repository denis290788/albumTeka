"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 🎯 Zod schema
const albumSchema = z.object({
    title: z.string().min(1, "Введите название альбома"),
    artist: z.string().min(1, "Введите исполнителя"),
    year: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4}$/.test(val), {
            message: "Введите корректный год (4 цифры)",
        }),
    coverUrl: z.string().url("Неверная ссылка на обложку").optional().or(z.literal("")),
    streamUrl: z.string().min(1, "Введите ссылку"),
    streamType: z.enum(["bandcamp", "spotify", "soundcloud"]),
});

type AlbumFormData = z.infer<typeof albumSchema>;

export default function AddAlbumPage() {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<AlbumFormData>({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            streamType: "bandcamp",
        },
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: AlbumFormData) => {
        setLoading(true);

        // 💡 Обработка Bandcamp
        let processedUrl = data.streamUrl;

        if (data.streamType === "bandcamp") {
            const match = data.streamUrl.match(/album=(\d+)/);
            if (match) {
                processedUrl = `https://bandcamp.com/EmbeddedPlayer/album=${match[1]}`;
            }
        }

        const album = {
            title: data.title,
            artist: data.artist,
            year: data.year ? Number(data.year) : null,
            coverUrl: data.coverUrl || null,
            streams: [
                {
                    type: data.streamType,
                    url: processedUrl,
                },
            ],
            defaultStream: data.streamType,
        };

        try {
            await addDoc(collection(db, "albums"), album);
            reset();
            router.push("/");
        } catch (err) {
            console.error("Ошибка при добавлении альбома:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">Добавить альбом</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="title">Название альбома</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div>
                    <Label htmlFor="artist">Исполнитель</Label>
                    <Input id="artist" {...register("artist")} />
                    {errors.artist && (
                        <p className="text-sm text-red-500">{errors.artist.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="year">Год выпуска (необязательно)</Label>
                    <Input id="year" type="number" {...register("year")} />
                    {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
                </div>

                <div>
                    <Label htmlFor="coverUrl">Ссылка на обложку (необязательно)</Label>
                    <Input id="coverUrl" {...register("coverUrl")} />
                    {errors.coverUrl && (
                        <p className="text-sm text-red-500">{errors.coverUrl.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="streamUrl">Ссылка на стриминг</Label>
                    <Input id="streamUrl" {...register("streamUrl")} />
                    {errors.streamUrl && (
                        <p className="text-sm text-red-500">{errors.streamUrl.message}</p>
                    )}
                </div>

                <div>
                    <Label>Тип стриминга</Label>
                    <Select
                        onValueChange={(val) =>
                            setValue("streamType", val as AlbumFormData["streamType"])
                        }
                        defaultValue="bandcamp"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите сервис" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bandcamp">Bandcamp</SelectItem>
                            <SelectItem value="spotify">Spotify</SelectItem>
                            <SelectItem value="soundcloud">SoundCloud</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.streamType && (
                        <p className="text-sm text-red-500">{errors.streamType.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Сохраняем..." : "Добавить альбом"}
                </Button>
            </form>
        </div>
    );
}
