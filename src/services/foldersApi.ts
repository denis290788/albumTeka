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
                        console.warn("Отсутствует User ID. Невозможно загрузить альбомы.");
                        return { data: [] };
                    }

                    const q = query(
                        collection(db, "folders"),
                        where("userId", "==", userId),
                        orderBy("order", "asc")
                    );

                    const snapshot = await getDocs(q);
                    const folders: Folder[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Folder, "id">),
                    }));
                    return { data: folders };
                } catch (error) {
                    console.error("Ошибка при получении папок:", error);
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
                            "Отсутствует User ID или Folder ID. Невозможно загрузить папку."
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
                        return { data: null };
                    }
                } catch (error) {
                    console.error("Ошибка при получении папки по ID:", error);
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
                        throw new Error("Отсутствует User ID. Невозможно добавить папку.");
                    }

                    const docRef = await addDoc(collection(db, "folders"), {
                        name,
                        userId,
                        order: 0,
                    });
                    return { data: { id: docRef.id, name, userId } };
                } catch (error) {
                    console.error("Ошибка придобавлении папки:", error);
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
                        throw new Error("Отсутствует User ID. Невозможно удалить папку.");
                    }

                    const folderDocRef = doc(db, "folders", id);
                    const folderDoc = await getDoc(folderDocRef);

                    if (!folderDoc.exists() || folderDoc.data()?.userId !== userId) {
                        throw new Error("Папка не найдена или нет прав на удаление.");
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
                    console.error("Ошибка удаления папки:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Folder", id },
                { type: "Folder", id: "LIST" },
                { type: "Album", id: "LIST" },
            ],
        }),

        updateFoldersOrder: builder.mutation<null, { folders: Folder[] }>({
            async queryFn({ folders }) {
                try {
                    const batch = writeBatch(db);
                    folders.forEach((folder, index) => {
                        const folderRef = doc(db, "folders", folder.id);
                        batch.update(folderRef, { order: index });
                    });
                    await batch.commit();
                    return { data: null };
                } catch (error) {
                    console.error("Ошибка обновления порядка папок:", error);
                    return { error: error as Error };
                }
            },
            invalidatesTags: (result, error, { folders }) => [
                { type: "Folder", id: "LIST" },
                ...folders.map((f) => ({ type: "Folder" as const, id: f.id })),
            ],
        }),
    }),
});

export const {
    useGetFoldersQuery,
    useGetFolderByIdQuery,
    useAddFolderMutation,
    useDeleteFolderMutation,
    useUpdateFoldersOrderMutation,
} = foldersApi;
