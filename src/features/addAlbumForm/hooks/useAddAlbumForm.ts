import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlbumFormData, albumSchema } from "../model/addAlbumTypes";
import { useAddAlbumMutation } from "@/services/albumsApi";

export const useAddAlbumForm = () => {
    const router = useRouter();

    const form = useForm<AlbumFormData>({
        resolver: zodResolver(albumSchema),
        mode: "onChange",
        defaultValues: {
            streamType: "Bandcamp",
        },
    });

    const [addAlbum, { isLoading, error }] = useAddAlbumMutation();

    const onSubmit = async (data: AlbumFormData) => {
        let processedUrl = data.streamUrl;

        if (data.streamType === "Bandcamp") {
            const albumMatch = data.streamUrl.match(/album=(\d+)/);
            const trackMatch = data.streamUrl.match(/track=(\d+)/);

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

        const albumToAdd = {
            title: data.title,
            artist: data.artist,
            year: data.year ? Number(data.year) : null,
            coverUrl: data.coverUrl || null,
            streams: [
                {
                    type: data.streamType,
                    url: processedUrl,
                },
            ],
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
