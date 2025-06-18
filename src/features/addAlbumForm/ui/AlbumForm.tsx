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
        formState: { errors, isValid },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
            <div>
                <Label htmlFor="title">
                    Название альбома<span className="text-destructive">*</span>
                </Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div>
                <Label htmlFor="artist">
                    Исполнитель<span className="text-destructive">*</span>
                </Label>
                <Input id="artist" {...register("artist")} />
                {errors.artist && (
                    <p className="text-sm text-destructive">{errors.artist.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="year">Год выпуска</Label>
                <Input id="year" {...register("year")} />
                {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
            </div>

            <div>
                <Label htmlFor="coverUrl">Ссылка на обложку</Label>
                <Input id="coverUrl" {...register("coverUrl")} />
                {errors.coverUrl && (
                    <p className="text-sm text-destructive">{errors.coverUrl.message}</p>
                )}
            </div>
            <div className="flex gap-2">
                <div>
                    <Label>Cтриминг</Label>
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
                        <p className="text-sm text-destructive">{errors.streamType.message}</p>
                    )}
                </div>
                <div className="flex-1">
                    <Label htmlFor="streamUrl">Ссылка</Label>
                    <Input id="streamUrl" {...register("streamUrl")} />
                    {errors.streamUrl && (
                        <p className="text-sm text-destructive">{errors.streamUrl.message}</p>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={loading || !isValid}>
                {loading ? "Сохраняем..." : "Добавить альбом"}
            </Button>
        </form>
    );
};
