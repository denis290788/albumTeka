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
import { cn } from "@/lib/utils";
import { useAddStreamForm } from "../hooks/useAddStreamForm";
import { StreamFormData } from "../model/addStreamTypes";
import { Album } from "@/services/albumsApi";
import { useMemo } from "react";

interface AddStreamModalProps {
    album: Album;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function AddStreamModal({ album, open, onOpenChange, className }: AddStreamModalProps) {
    const { form, onSubmit, isSubmitting, submissionError } = useAddStreamForm(album);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    const handleFormSubmit = async (data: StreamFormData) => {
        const success = await onSubmit(data);

        if (success) {
            onOpenChange(false);
        }
        if (submissionError) {
            console.error("Ошибка при отправке формы:", submissionError);
        }
    };

    const gradientAngle = useMemo(() => Math.floor(Math.random() * 360), []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    className,
                    "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]"
                )}
                style={
                    {
                        "--angle": `${gradientAngle}deg`,
                    } as React.CSSProperties
                }
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>Добавить стриминг</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div>
                            <Label className="mb-2">Стримминг</Label>
                            <Select
                                onValueChange={(val) =>
                                    setValue("streamType", val as StreamFormData["streamType"])
                                }
                                defaultValue="bandcamp"
                            >
                                <SelectTrigger className="bg-background">
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
                                <p className="text-sm text-destructive">
                                    {errors.streamType.message}
                                </p>
                            )}
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="streamUrl" className="mb-2">
                                Ссылка
                            </Label>
                            <Input id="streamUrl" {...register("streamUrl")} />
                            {errors.streamUrl && (
                                <p className="text-sm text-destructive">
                                    {errors.streamUrl.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
