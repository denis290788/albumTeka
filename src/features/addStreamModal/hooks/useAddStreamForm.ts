import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStreamSchema, StreamFormData } from "../model/addStreamSchema";
import { Album, useUpdateAlbumMutation } from "@/entities/album/model/albumsApi";
import { useTranslation } from "react-i18next";
import { resolveStreamUrl } from "@/shared/utils/resolveStreamUrl";

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
        const processedUrl = await resolveStreamUrl(
            data.streamType,
            data.streamUrl,
            form.clearErrors,
            form.setError,
            t
        );

        if (!processedUrl) return false;

        const isDuplicateStreamType = album.streams.some((s) => s.type === data.streamType);
        if (isDuplicateStreamType) {
            form.setError("streamType", {
                type: "manual",
                message: t("addStreamForm_error_streamType_duplicate", { stream: data.streamType }),
            });
            return false;
        }

        const updatedStreams = [...album.streams, { type: data.streamType, url: processedUrl }];

        try {
            await updateAlbum({ ...album, streams: updatedStreams }).unwrap();
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
