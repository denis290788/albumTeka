"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEditFolderNameForm } from "../hooks/useEditFolderForm";
import { useEffect } from "react";

interface EditFolderFormProps {
    id: string;
    currentName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function EditFolderForm({
    id,
    currentName,
    open,
    onOpenChange,
    className,
}: EditFolderFormProps) {
    const { form, onSubmit } = useEditFolderNameForm(id, () => onOpenChange(false));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form;

    useEffect(() => {
        if (open) {
            reset({ name: currentName });
        }
    }, [open, currentName, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    className,
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
                    <DialogTitle className="dark:text-[#bedaca]">Новое название папки</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        defaultValue={currentName}
                        placeholder="Название папки"
                        {...register("name")}
                        className="border-0"
                    />

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-self-start md:items-center">
                        <Button type="submit" variant="outline" disabled={isSubmitting}>
                            Изменить
                        </Button>
                        {errors.name && (
                            <p className="text-[10px] text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
