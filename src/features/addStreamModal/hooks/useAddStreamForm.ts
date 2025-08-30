import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStreamSchema, StreamFormData } from "../model/addStreamTypes";
import { Album, useUpdateAlbumMutation } from "@/services/albumsApi";
import { useTranslation } from "react-i18next";

export const useAddStreamForm = (album: Album) => {
    const { t } = useTranslation();
    const [updateAlbum, { isLoading, error }] = useUpdateAlbumMutation();

    const form = useForm<StreamFormData>({
        resolver: zodResolver(getStreamSchema(t)),
        defaultValues: {
            streamType: "Bandcamp",
        },
    });

    const onSubmit = async (data: StreamFormData) => {
        let processedUrl = data.streamUrl;

        if (data.streamType === "Bandcamp") {
            form.clearErrors("streamUrl");
            try {
                const res = await fetch("/api/bandcamp/resolve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: data.streamUrl }),
                });

                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.error || t("addStreamForm_error_streamUrl_pattern"));
                }

                processedUrl = json.embedUrl;
            } catch (err) {
                console.error("Ошибка при запросе к Bandcamp API:", err);
                form.setError("streamUrl", {
                    type: "manual",
                    message: t("addStreamForm_error_streamUrl_pattern"),
                });
                return false;
            }
        }

        const isDuplicateStreamType = album.streams.some((s) => s.type === data.streamType);

        if (isDuplicateStreamType) {
            form.setError("streamType", {
                type: "manual",
                message: t("addStreamForm_error_streamType_duplicate", { stream: data.streamType }),
            });
            return false;
        }

        const newStream = {
            type: data.streamType,
            url: processedUrl,
        };
        const updatedStreams = [...album.streams, newStream];

        try {
            await updateAlbum({
                ...album,
                streams: updatedStreams,
            }).unwrap();

            form.reset();
            return true;
        } catch (err) {
            console.error("Ошибка при добавлении стрима:", err);
            return false;
        }
    };

    return {
        form,
        onSubmit,
        isSubmitting: isLoading,
        submissionError: error,
    };
};
