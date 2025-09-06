"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { useAddStreamForm } from "../hooks/useAddStreamForm";
import { AddStreamForm } from "./AddStreamForm";
import { StreamFormData } from "../model/addStreamSchema";
import { Album } from "@/entities/album/model/albumsApi";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface AddStreamModalProps {
    album: Album;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function AddStreamModal({ album, open, onOpenChange, className }: AddStreamModalProps) {
    const { t } = useTranslation();
    const { form, onSubmit, isSubmitting } = useAddStreamForm(album);

    const { handleSubmit, reset } = form;

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
                    <DialogTitle className="dark:text-[#bedaca]">
                        {t("addStreamForm_title")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <AddStreamForm form={form} className="border-0" />

                    <Button
                        type="submit"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {t("addStreamForm_button_add")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
