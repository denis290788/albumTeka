"use client";

import { createContext, useContext, useState } from "react";

type SearchMode = "album" | "artist";

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchMode: SearchMode;
    setSearchMode: (mode: SearchMode) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState<SearchMode>("album");

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
