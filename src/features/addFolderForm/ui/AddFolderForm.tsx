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
import { useMemo } from "react";

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
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        Сохранить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
