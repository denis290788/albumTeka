import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
};

export const albumsApi = createApi({
    reducerPath: "albumsApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Album"],
    endpoints: (builder) => ({
        getAlbums: builder.query<Album[], void>({
            async queryFn() {
                try {
                    const snapshot = await getDocs(collection(db, "albums"));
                    const albums: Album[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Album[];
                    return { data: albums };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((a) => ({ type: "Album" as const, id: a.id })),
                          { type: "Album", id: "LIST" },
                      ]
                    : [{ type: "Album", id: "LIST" }],
        }),

        addAlbum: builder.mutation<Album, Omit<Album, "id">>({
            async queryFn(newAlbum) {
                try {
                    const docRef = await addDoc(collection(db, "albums"), newAlbum);
                    const albumWithId: Album = { id: docRef.id, ...newAlbum };
                    return { data: albumWithId };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: [{ type: "Album", id: "LIST" }],
        }),

        deleteAlbum: builder.mutation<true, string>({
            async queryFn(albumId) {
                try {
                    await deleteDoc(doc(db, "albums", albumId));
                    return { data: true };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: () => [{ type: "Album", id: "LIST" }],
        }),

        updateAlbum: builder.mutation<Album, Album>({
            async queryFn(album) {
                try {
                    const albumRef = doc(db, "albums", album.id);
                    await updateDoc(albumRef, album);
                    return { data: album };
                } catch (error) {
                    return { error };
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
