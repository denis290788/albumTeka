import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export type StreamType = "bandcamp" | "spotify" | "soundcloud" | "vk";

export interface Stream {
    type: StreamType;
    url: string;
}

export type Album = {
    id: string;
    title: string;
    artist: string;
    year: number | null;
    coverUrl: string | null;
    defaultStream: StreamType;
    streams: Stream[];
    folderId?: string | null;
    userId: string;
};

export const albumsApi = createApi({
    reducerPath: "albumsApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Album"],
    endpoints: (builder) => ({
        getAlbums: builder.query<Album[], string | undefined>({
            async queryFn(userId) {
                try {
                    if (!userId) {
                        console.warn("User ID is missing. Cannot fetch albums.");
                        return { data: [] };
                    }

                    const q = query(collection(db, "albums"), where("userId", "==", userId));
                    const snapshot = await getDocs(q);
                    const albums: Album[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Album, "id">),
                    }));
                    return { data: albums };
                } catch (error) {
                    console.error("Ошибка при получении альбомов:", error);
                    return { error: error as Error };
                }
            },
            providesTags: (result, userId) =>
                result
                    ? [
                          ...result.map((a) => ({ type: "Album" as const, id: a.id })),
                          { type: "Album", id: "LIST" },
                          { type: "Album", id: `LIST-${userId}` },
                      ]
                    : [
                          { type: "Album", id: "LIST" },
                          { type: "Album", id: `LIST-${userId}` },
                      ],
        }),

        addAlbum: builder.mutation<Album, Omit<Album, "id" | "userId">>({
            async queryFn(newAlbumData) {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        throw new Error("Пользователь не авторизован. Невозможно добавить альбом.");
                    }
                    const albumToSave = { ...newAlbumData, userId };
                    const docRef = await addDoc(collection(db, "albums"), albumToSave);
                    const albumWithId: Album = { id: docRef.id, ...albumToSave };
                    return { data: albumWithId };
                } catch (error) {
                    console.error("Ошибка при добавлении альбома:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: [{ type: "Album", id: "LIST" }],
        }),

        deleteAlbum: builder.mutation<true, string>({
            async queryFn(albumId) {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        throw new Error("Пользователь не авторизован. Невозможно удалить альбом.");
                    }

                    const albumRef = doc(db, "albums", albumId);
                    const albumDoc = await getDoc(albumRef);

                    if (!albumDoc.exists() || albumDoc.data()?.userId !== userId) {
                        throw new Error("Альбом не найден или нет прав на удаление.");
                    }
                    await deleteDoc(albumRef);
                    return { data: true };
                } catch (error) {
                    console.error("Ошибка при удалении альбома:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: () => [{ type: "Album", id: "LIST" }],
        }),

        updateAlbum: builder.mutation<Album, Album>({
            async queryFn(album) {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        throw new Error("Пользователь не авторизован. Невозможно обновить альбом.");
                    }

                    const albumRef = doc(db, "albums", album.id);
                    const albumDoc = await getDoc(albumRef); // Получаем документ, чтобы проверить владение

                    if (!albumDoc.exists() || albumDoc.data()?.userId !== userId) {
                        throw new Error("Альбом не найден или нет прав на обновление.");
                    }

                    const { ...albumDataToUpdate } = album;

                    await updateDoc(albumRef, albumDataToUpdate);
                    return { data: album };
                } catch (error) {
                    console.error("Ошибка при обновлении альбома:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: (album) => [
                { type: "Album", id: album!.id },
                { type: "Album", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAlbumsQuery,
    useAddAlbumMutation,
    useDeleteAlbumMutation,
    useUpdateAlbumMutation,
} = albumsApi;
