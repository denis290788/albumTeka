"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/utils/cn";
import { FolderFormMode, useFolderForm } from "../hooks/useFolderForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface FolderFormProps {
    mode: FolderFormMode;
    folderId?: string;
    currentName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
    onSuccess?: () => void;
}

export function FolderForm({
    mode,
    folderId,
    currentName,
    open,
    onOpenChange,
    className,
    onSuccess,
}: FolderFormProps) {
    const { t } = useTranslation();
    const { form, onSubmit } = useFolderForm({
        mode,
        folderId,
        currentName,
        onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form;

    useEffect(() => {
        if (open) {
            reset({ name: currentName || "" });
        } else {
            reset();
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
                    <DialogTitle className="dark:text-[#bedaca]">
                        {mode === "create"
                            ? t("folderForm_title_create")
                            : t("folderForm_title_edit")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        placeholder={t("folderForm_placeholder")}
                        {...register("name")}
                        className="border-0"
                    />

                    <div className="flex flex-row gap-2 md:gap-4 items-center">
                        <Button type="submit" variant="outline" disabled={isSubmitting}>
                            {mode === "create"
                                ? t("folderForm_button_create")
                                : t("folderForm_button_save")}
                        </Button>
                        {errors.name && (
                            <p className="text-[10px] md:text-sm text-destructive">
                                {t("folderForm_error_name")}
                            </p>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
