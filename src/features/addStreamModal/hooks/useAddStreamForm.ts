import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamFormData, streamSchema } from "../model/addStreamTypes";
import { Album, useUpdateAlbumMutation } from "@/services/albumsApi";

export const useAddStreamForm = (album: Album) => {
    const [updateAlbum, { isLoading, error }] = useUpdateAlbumMutation();

    const form = useForm<StreamFormData>({
        resolver: zodResolver(streamSchema),
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
                    throw new Error(json.error || "Не удалось обработать ссылку Bandcamp");
                }

                processedUrl = json.embedUrl;
            } catch (err) {
                console.error("Ошибка при запросе к Bandcamp API:", err);
                form.setError("streamUrl", {
                    type: "manual",
                    message: "Не удалось извлечь плеер из ссылки Bandcamp. Проверьте URL.",
                });
                return false;
            }
        }

        const isDuplicateStreamType = album.streams.some((s) => s.type === data.streamType);

        if (isDuplicateStreamType) {
            form.setError("streamType", {
                type: "manual",
                message: `Стриминг "${data.streamType}" уже добавлен.`,
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
