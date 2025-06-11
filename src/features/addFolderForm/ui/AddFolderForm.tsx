"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddFolderForm } from "../hooks/useAddFolderForm";

interface AddFolderFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function AddFolderForm({ open, onOpenChange, className }: AddFolderFormProps) {
    const { form, onSubmit } = useAddFolderForm(() => onOpenChange(false));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(className)}
                // aria-describedby={undefined} если не нужен DialogDescription
            >
                <DialogHeader>
                    <DialogTitle>Добавить папку</DialogTitle>
                    <DialogDescription>
                        Введите название новой папки, чтобы упорядочить ваши альбомы.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Название папки" {...register("name")} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        Сохранить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
