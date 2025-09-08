import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
    useUpdateAlbumMutation,
    useGetAlbumByIdQuery,
    Album,
} from "@/entities/album/model/albumsApi";
import { useTranslation } from "react-i18next";
import { EditAlbumFormData, editAlbumSchema } from "../model/editAlbumFormSchema";

export const useEditAlbumForm = (albumId: string) => {
    const router = useRouter();
    const { t } = useTranslation();

    const {
        data: album,
        isLoading: isLoadingAlbum,
        isFetching: isFetchingAlbum,
    } = useGetAlbumByIdQuery({ albumId }, { skip: !albumId });

    const initialValues = useMemo(() => {
        if (album) {
            return {
                title: album.title,
                artist: album.artist,
                year: album.year ? String(album.year) : "",
                coverUrl: album.coverUrl ?? "",
            } as Partial<EditAlbumFormData>;
        }

        return {
            title: "",
            artist: "",
            year: "",
            coverUrl: "",
        } as Partial<EditAlbumFormData>;
    }, [album]);

    const form = useForm<EditAlbumFormData>({
        resolver: zodResolver(editAlbumSchema(t)),
        mode: "all",
        defaultValues: initialValues,
    });

    useEffect(() => {
        if (album) {
            form.reset(initialValues);
        }
    }, [album, initialValues, form]);

    const [updateAlbum, { isLoading: isUpdating }] = useUpdateAlbumMutation();

    const onSubmit = async (data: EditAlbumFormData) => {
        if (!album) return false;

        const albumToUpdate: Album = {
            ...album,
            title: data.title,
            artist: data.artist,
            year: data.year ? Number(data.year) : null,
            coverUrl: data.coverUrl || null,
        };

        try {
            await updateAlbum(albumToUpdate).unwrap();
            router.back();
            return true;
        } catch (err) {
            console.error("Ошибка при обновлении альбома:", err);
            return false;
        }
    };

    return {
        form,
        onSubmit,
        loading: isUpdating,
        isFetchingExisting: isLoadingAlbum || isFetchingAlbum,
        album,
    };
};
