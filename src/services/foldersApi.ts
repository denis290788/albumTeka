import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    writeBatch,
    getDoc,
    updateDoc,
    orderBy,
} from "firebase/firestore";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { db, auth } from "@/lib/firebase";

export type Folder = {
    id: string;
    name: string;
    userId: string;
    order?: number; 
};

export const foldersApi = createApi({
    reducerPath: "foldersApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Folder", "Album"],
    endpoints: (builder) => ({
        getFolders: builder.query<Folder[], string | undefined>({
            async queryFn(userId) {
                try {
                    if (!userId) {
                        console.warn("User ID is missing. Cannot fetch albums.");
                        return { data: [] };
                    }

                    const q = query(
                        collection(db, "folders"),
                        where("userId", "==", userId),
                        orderBy("order", "asc") // Сортируем по порядку
                    );

                    const snapshot = await getDocs(q);
                    const folders: Folder[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Folder, "id">),
                    }));
                    return { data: folders };
                } catch (error) {
                    console.error("Error fetching folders:", error);
                    return { error: { message: (error as Error).message } };
                }
            },
            providesTags: (result, userId) =>
                result
                    ? [
                          ...result.map((f) => ({ type: "Folder" as const, id: f.id })),
                          { type: "Folder", id: "LIST" },
                          { type: "Folder", id: `LIST-${userId}` },
                      ]
                    : [
                          { type: "Folder", id: "LIST" },
                          { type: "Folder", id: `LIST-${userId}` },
                      ],
        }),

        getFolderById: builder.query<Folder | null, { userId: string; folderId: string }>({
            async queryFn({ userId, folderId }) {
                try {
                    if (!userId || !folderId) {
                        console.warn(
                            "User ID or Folder ID is missing. Cannot fetch a specific folder."
                        );
                        return { data: null };
                    }

                    const folderDocRef = doc(db, "folders", folderId);
                    const folderDocSnap = await getDoc(folderDocRef);

                    if (folderDocSnap.exists() && folderDocSnap.data()?.userId === userId) {
                        return {
                            data: {
                                id: folderDocSnap.id,
                                ...(folderDocSnap.data() as Omit<Folder, "id">),
                            },
                        };
                    } else {
                        return { data: null }; // Папка не найдена или не принадлежит пользователю
                    }
                } catch (error) {
                    console.error("Error fetching folder by ID:", error);
                    return { error: error as Error };
                }
            },
            providesTags: (result, error, { folderId }) => [{ type: "Folder", id: folderId }],
        }),

        addFolder: builder.mutation<Folder, { name: string }>({
            async queryFn({ name }) {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        throw new Error("No user logged in. Cannot add folder.");
                    }

                    const docRef = await addDoc(collection(db, "folders"), {
                        name,
                        userId,
                        order: 0,
                    });
                    return { data: { id: docRef.id, name, userId } };
                } catch (error) {
                    console.error("Error adding folder:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: [{ type: "Folder", id: "LIST" }],
        }),

        deleteFolder: builder.mutation<true, { id: string }>({
            async queryFn({ id }) {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        throw new Error("No user logged in. Cannot delete folder.");
                    }

                    const folderDocRef = doc(db, "folders", id);
                    const folderDoc = await getDoc(folderDocRef);

                    if (!folderDoc.exists() || folderDoc.data()?.userId !== userId) {
                        throw new Error("Folder not found or not authorized to delete.");
                    }

                    const albumsRef = collection(db, "albums");
                    const q = query(
                        albumsRef,
                        where("folderId", "==", id),
                        where("userId", "==", userId)
                    );
                    const snapshot = await getDocs(q);

                    const batch = writeBatch(db);
                    snapshot.docs.forEach((docSnap) => {
                        batch.update(docSnap.ref, { folderId: null });
                    });
                    await batch.commit();
                    await deleteDoc(folderDocRef);

                    return { data: true };
                } catch (error) {
                    console.error("Error deleting folder:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Folder", id },
                { type: "Folder", id: "LIST" },
                { type: "Album", id: "LIST" },
            ],
        }),

        updateFolderOrder: builder.mutation<null, { folderId: string; order: number }>({
            async queryFn({ folderId, order }) {
                try {
                    const folderRef = doc(db, "folders", folderId);
                    await updateDoc(folderRef, { order });
                    return { data: null }; // ✅ <-- фикс
                } catch (error) {
                    console.error("Error updating folder order:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: (result, error, { folderId }) => [{ type: "Folder", id: folderId }],
        }),
    }),
});

export const {
    useGetFoldersQuery,
    useGetFolderByIdQuery,
    useAddFolderMutation,
    useDeleteFolderMutation,
    useUpdateFolderOrderMutation,
} = foldersApi;
