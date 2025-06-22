import { useSearch } from "./SearchContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Disc3, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function SearchInput() {
    const { searchQuery, setSearchQuery, searchMode, setSearchMode } = useSearch();
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleSearchMode = () => {
        setSearchMode(searchMode === "album" ? "artist" : "album");
        setSearchQuery("");
    };

    const handleClear = () => {
        setSearchQuery("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (isInputFocused) {
            inputRef.current?.focus();
        }
    }, [searchMode, isInputFocused]);

    return (
        <div className="flex items-center gap-2 relative">
            <Button onClick={toggleSearchMode} variant="ghost" size="icon" className="shrink-0">
                {searchMode === "album" ? (
                    <Disc3 className="h-5 w-5" />
                ) : (
                    <User className="h-5 w-5" />
                )}
            </Button>
            <div className="relative flex-1">
                <Input
                    ref={inputRef}
                    placeholder={`по ${searchMode === "album" ? "альбомам" : "исполнителям"}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="px-3 pr-6 py-1 bg-muted-foreground/30 border-0 dark:bg-muted-background dark:placeholder:text-background"
                />
                {searchQuery && (
                    <AnimatePresence>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClear}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
