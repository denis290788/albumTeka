import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamFormData, streamSchema } from "../model/addStreamTypes";
import { Album, useUpdateAlbumMutation } from "@/services/albumsApi";

export const useAddStreamForm = (album: Album) => {
    const [updateAlbum, { isLoading, error }] = useUpdateAlbumMutation();

    const form = useForm<StreamFormData>({
        resolver: zodResolver(streamSchema),
        defaultValues: {
            streamType: "bandcamp",
        },
    });

    const onSubmit = async (data: StreamFormData) => {
        let processedUrl = data.streamUrl;

        if (data.streamType === "bandcamp") {
            const match = data.streamUrl.match(/album=(\d+)/);
            if (match) {
                processedUrl = `https://bandcamp.com/EmbeddedPlayer/album=${match[1]}`;
            }
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
