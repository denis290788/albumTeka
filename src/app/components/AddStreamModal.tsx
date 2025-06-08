"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Album } from "./albumCard";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const schema = z.object({
    // streamUrl: z.string().url("Введите корректный URL"),
    streamUrl: z.string().min(1, "Введите ссылку"),
    streamType: z.enum(["bandcamp", "spotify", "soundcloud"]),
});

type FormData = z.infer<typeof schema>;

export function AddStreamModal({
    album,
    open,
    onOpenChange,
    onAdded,
}: {
    album: Album;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdded: (stream: Album["streams"][number]) => void;
}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            streamType: "bandcamp",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const albumRef = doc(db, "albums", album.id);
            const albumSnap = await getDoc(albumRef);
            const existingStreams = albumSnap.data()?.streams || [];

            let processedUrl = data.streamUrl;

            if (data.streamType === "bandcamp") {
                const match = data.streamUrl.match(/album=(\d+)/);
                if (match) {
                    processedUrl = `https://bandcamp.com/EmbeddedPlayer/album=${match[1]}`;
                }
            }

            const newStream = {
                type: data.streamType,
                url: processedUrl,
            };

            await updateDoc(albumRef, {
                streams: [...existingStreams, newStream],
            });

            onAdded(newStream);
            reset();
            onOpenChange(false);
        } catch (err) {
            console.error("Ошибка при добавлении стрима:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить стриминг</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                setValue("streamType", val as FormData["streamType"])
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

                    <Button type="submit" disabled={isSubmitting}>
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
