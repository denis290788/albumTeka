"use client";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/utils/cn";
import { useAddAlbumForm } from "../hooks/useAddAlbumForm";
import { useTranslation } from "react-i18next";
import { AddStreamForm } from "@/features/addStreamModal";

interface AlbumFormProps {
    className?: string;
}

export const AlbumForm = ({ className }: AlbumFormProps) => {
    const { t } = useTranslation();
    const { form, loading, onSubmit } = useAddAlbumForm();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = form;

    return (
        <div className="max-w-xl mx-auto p-4 mb-4 bg-transparent shadow-[0_4px_10px_rgba(0,0,0,0.15)] rounded-2xl">
            <h1 className="text-2xl font-semibold mb-4 dark:text-[#bedaca]">
                {t("albumForm_title")}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
                <div>
                    <Label htmlFor="title">
                        {t("albumForm_label_title")}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input id="title" {...register("title")} />
                    <div className="min-h-[18px]">
                        {errors.title && (
                            <p className="text-[10px] text-destructive">{errors.title.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="artist">
                        {t("albumForm_label_artist")}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input id="artist" {...register("artist")} />
                    <div className="min-h-[18px]">
                        {errors.artist && (
                            <p className="text-[10px] text-destructive">{errors.artist.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="year">{t("albumForm_label_year")}</Label>
                    <Input id="year" {...register("year")} />
                    <div className="min-h-[18px]">
                        {errors.year && (
                            <p className="text-[10px] text-destructive">{errors.year.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="coverUrl">{t("albumForm_label_coverUrl")}</Label>
                    <Input id="coverUrl" {...register("coverUrl")} />
                    <div className="min-h-[18px]">
                        {errors.coverUrl && (
                            <p className="text-[10px] text-destructive">
                                {errors.coverUrl.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 mb-2">
                    <AddStreamForm form={form} />
                </div>

                <Button type="submit" disabled={loading || !isValid} className="w-full">
                    {loading ? t("albumForm_saving") : t("albumForm_submit")}
                </Button>
            </form>
        </div>
    );
};
