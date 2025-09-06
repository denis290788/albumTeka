"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type SearchMode = "album" | "artist";

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchMode: SearchMode;
    setSearchMode: (mode: SearchMode) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState<SearchMode>("album");

    const resetSearch = () => {
        setSearchQuery("");
        setSearchMode("album");
    };

    useEffect(() => {
        resetSearch();
    }, [pathname]);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchMode, setSearchMode }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
