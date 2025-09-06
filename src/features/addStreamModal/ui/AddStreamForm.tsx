"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/shared/ui/select";
import { STREAM_ICONS } from "@/shared/ui/stream-icons";
import { cn } from "@/shared/utils/cn";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StreamType } from "@/entities/album/model/albumsApi";

interface AddStreamFormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    className?: string;
}

export function AddStreamForm<T extends { streamType: StreamType; streamUrl: string }>({
    form,
    className,
}: AddStreamFormProps<T>) {
    const { t } = useTranslation();

    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;

    return (
        <div className="w-full flex flex-col">
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    <Label className="mb-0 dark:text-[#bedaca]">
                        {t("addStreamForm_label_streamType")}
                    </Label>
                    <Select
                        onValueChange={(val) =>
                            setValue("streamType" as Path<T>, val as PathValue<T, Path<T>>)
                        }
                        defaultValue="Bandcamp"
                    >
                        <SelectTrigger className="bg-muted-foreground/30 w-full">
                            {
                                STREAM_ICONS[
                                    (watch("streamType" as Path<T>) as StreamType) || "Bandcamp"
                                ]
                            }
                            <span className="hidden md:block">
                                {watch("streamType" as Path<T>) as StreamType}
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bandcamp">
                                {STREAM_ICONS["Bandcamp"]} Bandcamp
                            </SelectItem>
                            <SelectItem value="Spotify">
                                {STREAM_ICONS["Spotify"]} Spotify
                            </SelectItem>
                            <SelectItem value="Soundcloud">
                                {STREAM_ICONS["Soundcloud"]} Soundcloud
                            </SelectItem>
                            <SelectItem value="VK">{STREAM_ICONS["VK"]} VK</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor="streamUrl" className="mb-0 dark:text-[#bedaca]">
                        {t("addStreamForm_label_streamUrl")}{" "}
                        <span className="text-destructive">*</span>
                    </Label>

                    <Input
                        id="streamUrl"
                        {...register("streamUrl" as Path<T>)}
                        className={cn("w-full", className)}
                    />
                </div>
            </div>

            <div className="flex-1">
                <div className="min-h-[18px]">
                    {errors.streamUrl && (
                        <p className="text-[10px] text-destructive">
                            {String(errors.streamUrl.message)}
                        </p>
                    )}
                    {errors.streamType && (
                        <p className="text-[10px] text-destructive">
                            {String(errors.streamType.message)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
