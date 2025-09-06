import { configureStore } from "@reduxjs/toolkit";
import { albumsApi } from "@/entities/album/model/albumsApi";
import { foldersApi } from "@/entities/folder/model/foldersApi";

export const storeConfig = () =>
    configureStore({
        reducer: {
            [albumsApi.reducerPath]: albumsApi.reducer,
            [foldersApi.reducerPath]: foldersApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(albumsApi.middleware).concat(foldersApi.middleware),
    });

export type AppStoreType = ReturnType<typeof storeConfig>;
