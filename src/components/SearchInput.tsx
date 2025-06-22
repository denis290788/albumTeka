import { useState, useRef } from "react";
import { useSearch } from "./SearchContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Disc3, SearchIcon, UserIcon } from "lucide-react";

export function SearchInput() {
    const { searchQuery, setSearchQuery, searchMode, setSearchMode } = useSearch();
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleSearchMode = () => {
        setSearchMode(searchMode === "album" ? "artist" : "album");
        setSearchQuery("");
    };

    const handleSearchClick = () => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleBlur = () => {
        if (!searchQuery) {
            setIsExpanded(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isExpanded ? (
                <>
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={`Поиск по ${
                            searchMode === "album" ? "альбомам" : "исполнителям"
                        }...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={handleBlur}
                        className="px-3 py-1 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <Button onClick={toggleSearchMode} variant="ghost">
                        {searchMode === "album" ? (
                            <Disc3 className="h-5 w-5" />
                        ) : (
                            <UserIcon className="h-5 w-5" />
                        )}
                    </Button>
                </>
            ) : (
                <Button variant="ghost" onClick={handleSearchClick}>
                    <SearchIcon className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
