import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlbumFormData, albumSchema } from "../model/addAlbumTypes";
import { useAddAlbumMutation } from "@/services/albumsApi";

export const useAddAlbumForm = () => {
    const router = useRouter();

    const form = useForm<AlbumFormData>({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            streamType: "bandcamp",
        },
    });

    const [addAlbum, { isLoading, error }] = useAddAlbumMutation();

    const onSubmit = async (data: AlbumFormData) => {
        let processedUrl = data.streamUrl;

        if (data.streamType === "bandcamp") {
            const match = data.streamUrl.match(/album=(\d+)/);
            if (match) {
                processedUrl = `https://bandcamp.com/EmbeddedPlayer/album=${match[1]}`;
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
