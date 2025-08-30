import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlbumFormData, createAlbumSchema } from "../model/addAlbumTypes";
import { useAddAlbumMutation } from "@/services/albumsApi";
import { useTranslation } from "react-i18next";

export const useAddAlbumForm = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const form = useForm<AlbumFormData>({
        resolver: zodResolver(createAlbumSchema(t)),
        mode: "onChange",
        defaultValues: {
            streamType: "Bandcamp",
        },
    });

    const [addAlbum, { isLoading, error }] = useAddAlbumMutation();

    const onSubmit = async (data: AlbumFormData) => {
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
                    message: t("albumForm_bandcamp_error"),
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
