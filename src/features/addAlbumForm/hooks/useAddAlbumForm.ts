import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlbumFormData, createAlbumSchema } from "../model/albumFormSchema";
import { useAddAlbumMutation } from "@/entities/album/model/albumsApi";
import { useTranslation } from "react-i18next";
import { resolveStreamUrl } from "@/shared/utils/resolveStreamUrl";

export const useAddAlbumForm = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const form = useForm<AlbumFormData>({
        resolver: zodResolver(createAlbumSchema(t)),
        mode: "all",
        defaultValues: {
            streamType: "Bandcamp",
        },
    });

    const [addAlbum, { isLoading, error }] = useAddAlbumMutation();

    const onSubmit = async (data: AlbumFormData) => {
        const processedUrl = await resolveStreamUrl(
            data.streamType,
            data.streamUrl,
            form.clearErrors,
            form.setError,
            t
        );

        if (!processedUrl) return false;

        const albumToAdd = {
            title: data.title,
            artist: data.artist,
            year: data.year ? Number(data.year) : null,
            coverUrl: data.coverUrl || null,
            streams: [{ type: data.streamType, url: processedUrl }],
            defaultStream: data.streamType,
            folderId: null,
        };

        try {
            await addAlbum(albumToAdd).unwrap();
            form.reset();
            router.push("/");
            return true;
        } catch (err) {
            console.error("Ошибка при добавлении альбома:", err);
            return false;
        }
    };

    return {
        form,
        loading: isLoading,
        error: error,
        onSubmit,
    };
};
