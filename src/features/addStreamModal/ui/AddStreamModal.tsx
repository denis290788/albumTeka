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
    } = form;

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
                    "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]"
                )}
                style={
                    {
                        "--angle": `${Math.floor(Math.random() * 360)}deg`,
                    } as React.CSSProperties
                }
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>Добавить стриминг</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 md:gap-4 md:mb-4">
                        <div className="flex flex-row md:flex-col gap-2">
                            <Label className="mb-0">Стримминг</Label>
                            <Select
                                onValueChange={(val) =>
                                    setValue("streamType", val as StreamFormData["streamType"])
                                }
                                defaultValue="Bandcamp"
                            >
                                <SelectTrigger className="bg-background w-full md:w-[130px]">
                                    <SelectValue placeholder="Выберите сервис" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bandcamp">Bandcamp</SelectItem>
                                    <SelectItem value="Spotify">Spotify</SelectItem>
                                    <SelectItem value="Soundcloud">Soundcloud</SelectItem>
                                    <SelectItem value="VK">VK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 flex flex-row md:flex-col gap-2">
                            <Label htmlFor="streamUrl" className="mb-0">
                                Ссылка
                            </Label>
                            <Input id="streamUrl" {...register("streamUrl")} className="border-0" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-self-start md:items-center">
                        <Button type="submit" disabled={isSubmitting} className="w-[130px]">
                            Добавить
                        </Button>
                        {errors.streamType && (
                            <p className="text-sm text-destructive">{errors.streamType.message}</p>
                        )}
                        {errors.streamUrl && (
                            <p className="text-sm text-destructive">{errors.streamUrl.message}</p>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
