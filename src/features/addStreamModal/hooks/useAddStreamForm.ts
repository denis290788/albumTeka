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
            const albumMatch = data.streamUrl.match(/album=(\d+)/);
            const trackMatch = data.streamUrl.match(/track=(\d+)/);

            form.clearErrors("streamType");

            if (albumMatch) {
                processedUrl = `https://bandcamp.com/EmbeddedPlayer/album=${albumMatch[1]}`;
            } else if (trackMatch) {
                processedUrl = `https://bandcamp.com/EmbeddedPlayer/track=${trackMatch[1]}`;
            } else {
                form.setError("streamUrl", {
                    type: "manual",
                    message: "Для Bandcamp необходимо добавить Embed-ссылку",
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
