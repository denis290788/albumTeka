"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAddStreamForm } from "../hooks/useAddStreamForm";
import { StreamFormData } from "../model/addStreamTypes";
import { Album } from "@/services/albumsApi";
import { STREAM_ICONS } from "@/lib/stream-icons";
import { useEffect } from "react";

interface AddStreamModalProps {
    album: Album;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function AddStreamModal({ album, open, onOpenChange, className }: AddStreamModalProps) {
    const { form, onSubmit, isSubmitting } = useAddStreamForm(album);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = form;

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleFormSubmit = async (data: StreamFormData) => {
        form.clearErrors();

        const success = await onSubmit(data);

        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    className,
                    "gap-6",
                    "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]",
                    "dark:bg-[linear-gradient(var(--angle),#34495e,#34495e)]"
                )}
                style={
                    {
                        "--angle": `${Math.floor(Math.random() * 360)}deg`,
                    } as React.CSSProperties
                }
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle className="dark:text-[#bedaca]">Добавить стриминг</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex flex-row gap-4 md:gap-4">
                        <div className="flex flex-col gap-2 mb-2">
                            <Label className="mb-0 dark:text-[#bedaca]">Стримминг</Label>
                            <Select
                                onValueChange={(val) =>
                                    setValue("streamType", val as StreamFormData["streamType"])
                                }
                                defaultValue="Bandcamp"
                            >
                                <SelectTrigger className="bg-muted-foreground/30 w-full">
                                    {STREAM_ICONS[form.watch("streamType") || "Bandcamp"]}
                                    <span className="hidden md:block">
                                        {form.watch("streamType")}
                                    </span>
                                </SelectTrigger>
                                <SelectContent className="">
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
                        <div className="flex-1 flex flex-col gap-2">
                            <Label htmlFor="streamUrl" className="mb-0 dark:text-[#bedaca]">
                                Ссылка
                            </Label>
                            <Input id="streamUrl" {...register("streamUrl")} className="border-0" />
                        </div>
                    </div>
                    <div className="min-h-[16px] mb-2">
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

                    <Button
                        type="submit"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
