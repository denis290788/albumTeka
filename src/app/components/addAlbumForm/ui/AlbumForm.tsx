"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAddAlbumForm } from "../hooks/useAddAlbumForm";
import { AlbumFormData } from "../model/addAlbumTypes";

interface AlbumFormProps {
    className?: string;
}

export const AlbumForm = ({ className }: AlbumFormProps) => {
    const { form, loading, onSubmit } = useAddAlbumForm();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
            <div>
                <Label htmlFor="title">Название альбома</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
                <Label htmlFor="artist">Исполнитель</Label>
                <Input id="artist" {...register("artist")} />
                {errors.artist && <p className="text-sm text-red-500">{errors.artist.message}</p>}
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
                        <SelectItem value="vk">VK</SelectItem>
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
    );
};
