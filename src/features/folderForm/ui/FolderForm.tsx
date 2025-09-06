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

    const translations = {
        title: mode === "create" ? t("folderForm_title_create") : t("folderForm_title_edit"),
        placeholder: t("folderForm_placeholder"),
        submit: mode === "create" ? t("folderForm_button_create") : t("folderForm_button_save"),
        error: t("folderForm_error_name"),
    };

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
                    <DialogTitle className="dark:text-[#bedaca]">{translations.title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        placeholder={translations.placeholder}
                        {...register("name")}
                        className="border-0"
                    />

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-self-start md:items-center">
                        <Button type="submit" variant="outline" disabled={isSubmitting}>
                            {translations.submit}
                        </Button>
                        {errors.name && (
                            <p className="text-[10px] text-destructive">{translations.error}</p>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
