"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAddAlbumForm } from "../hooks/useAddAlbumForm";
import { AlbumFormData } from "../model/addAlbumTypes";
import { STREAM_ICONS } from "@/lib/stream-icons";

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
        <div className="p-4 mb-6 bg-transparent shadow-[0_4px_10px_rgba(0,0,0,0.15)] rounded-2xl">
            <h1 className="text-2xl font-semibold mb-4 dark:text-[#bedaca]">Добавить альбом</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
                <div>
                    <Label htmlFor="title">
                        Название альбома<span className="text-destructive">*</span>
                    </Label>
                    <Input id="title" {...register("title")} />
                    <div className="min-h-[18px]">
                        {errors.title && (
                            <p className="text-[10px] text-destructive">{errors.title.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="artist">
                        Исполнитель<span className="text-destructive">*</span>
                    </Label>
                    <Input id="artist" {...register("artist")} />
                    <div className="min-h-[18px]">
                        {errors.artist && (
                            <p className="text-[10px] text-destructive">{errors.artist.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="year">Год выпуска</Label>
                    <Input id="year" {...register("year")} />
                    <div className="min-h-[18px]">
                        {errors.year && (
                            <p className="text-[10px] text-destructive">{errors.year.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="coverUrl">Ссылка на обложку</Label>
                    <Input id="coverUrl" {...register("coverUrl")} />
                    <div className="min-h-[18px]">
                        {errors.coverUrl && (
                            <p className="text-[10px] text-destructive">
                                {errors.coverUrl.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 mb-2">
                    <div>
                        <Label>
                            Cтриминг<span className="text-destructive">*</span>
                        </Label>
                        <Select
                            onValueChange={(val) =>
                                setValue("streamType", val as AlbumFormData["streamType"])
                            }
                            defaultValue="Bandcamp"
                        >
                            <SelectTrigger className="bg-muted-foreground/30">
                                {STREAM_ICONS[form.watch("streamType") || "Bandcamp"]}
                                <span className="hidden md:block">{form.watch("streamType")}</span>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Bandcamp">
                                    {STREAM_ICONS["Bandcamp"]}
                                    Bandcamp
                                </SelectItem>
                                <SelectItem value="Spotify">
                                    {STREAM_ICONS["Spotify"]}
                                    Spotify
                                </SelectItem>
                                <SelectItem value="Soundcloud">
                                    {STREAM_ICONS["Soundcloud"]}
                                    Soundcloud
                                </SelectItem>
                                <SelectItem value="VK">
                                    {STREAM_ICONS["VK"]}
                                    VK
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="streamUrl">
                            Ссылка<span className="text-destructive">*</span>
                        </Label>
                        <Input id="streamUrl" {...register("streamUrl")} />
                        <div className="min-h-[18px]">
                            {errors.streamType && (
                                <p className="text-[10px] text-destructive">
                                    {errors.streamType.message}
                                </p>
                            )}
                            {errors.streamUrl && (
                                <p className="text-[10px] text-destructive">
                                    {errors.streamUrl.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={loading || !isValid} className="w-full">
                    {loading ? "Сохраняем..." : "Добавить альбом"}
                </Button>
            </form>
        </div>
    );
};
