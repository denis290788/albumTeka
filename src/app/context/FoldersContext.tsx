"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Folder, getFolders } from "@/lib/queries/get-folders";

type FoldersContextType = {
    folders: Folder[];
    refreshFolders: () => Promise<void>;
};

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export function FoldersProvider({ children }: { children: React.ReactNode }) {
    const [folders, setFolders] = useState<Folder[]>([]);

    const refreshFolders = async () => {
        const result = await getFolders();
        setFolders(result);
    };

    useEffect(() => {
        refreshFolders();
    }, []);

    return (
        <FoldersContext.Provider value={{ folders, refreshFolders }}>
            {children}
        </FoldersContext.Provider>
    );
}

export function useFolders() {
    const context = useContext(FoldersContext);
    if (!context) {
        throw new Error("useFolders must be used within FoldersProvider");
    }
    return context;
}
