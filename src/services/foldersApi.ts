import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    writeBatch,
} from "firebase/firestore";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { db } from "@/lib/firebase";

export type Folder = {
    id: string;
    name: string;
};

export const foldersApi = createApi({
    reducerPath: "foldersApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Folder", "Album"],
    endpoints: (builder) => ({
        getFolders: builder.query<Folder[], void>({
            async queryFn() {
                try {
                    const snapshot = await getDocs(collection(db, "folders"));
                    const folders: Folder[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Folder, "id">),
                    }));
                    return { data: folders };
                } catch (error) {
                    return { error: error as Error };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((f) => ({ type: "Folder" as const, id: f.id })),
                          { type: "Folder", id: "LIST" }, // Важно: Тег LIST
                      ]
                    : [{ type: "Folder", id: "LIST" }],
        }),

        addFolder: builder.mutation<Folder, { name: string }>({
            async queryFn({ name }) {
                try {
                    const docRef = await addDoc(collection(db, "folders"), { name });
                    return { data: { id: docRef.id, name } };
                } catch (error) {
                    return { error: error as Error };
                }
            },
            invalidatesTags: [{ type: "Folder", id: "LIST" }],
        }),

        deleteFolder: builder.mutation<true, { id: string }>({
            async queryFn({ id }) {
                try {
                    const albumsRef = collection(db, "albums");
                    const q = query(albumsRef, where("folderId", "==", id));
                    const snapshot = await getDocs(q);

                    const batch = writeBatch(db);
                    snapshot.docs.forEach((docSnap) => {
                        batch.update(docSnap.ref, { folderId: null });
                    });
                    await batch.commit();
                    await deleteDoc(doc(db, "folders", id));

                    return { data: true };
                } catch (error) {
                    return { error: error as Error };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Folder", id },
                { type: "Folder", id: "LIST" },
                { type: "Album", id: "LIST" },
            ],
        }),
    }),
});

export const { useGetFoldersQuery, useAddFolderMutation, useDeleteFolderMutation } = foldersApi;
