"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(className)}
                // aria-describedby={undefined} если не нужен DialogDescription
            >
                <DialogHeader>
                    <DialogTitle>Добавить стриминг</DialogTitle>
                    <DialogDescription>Добавьте новый стримминговый плеер</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                                setValue("streamType", val as StreamFormData["streamType"])
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

                    <Button type="submit" disabled={isSubmitting}>
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
