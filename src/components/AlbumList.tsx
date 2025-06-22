"use client";

import { useGetAlbumsByFolderQuery, useGetAlbumsQuery } from "@/services/albumsApi";
import { useAuth } from "@/features/auth";
import { AlbumCard } from "./AlbumCard";
import { useCallback, useEffect, useState } from "react";
import { useGetFolderByIdQuery } from "@/services/foldersApi";
import Masonry from "react-masonry-css";
import { Loader } from "./ui/loader";
import { useSearch } from "./SearchContext";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

interface AlbumListProps {
    folderId?: string;
}

const PAGE_SIZE = 9;

export function AlbumList({ folderId }: AlbumListProps) {
    const { user } = useAuth();
    const userId = user?.uid as string;

    const { searchMode, searchQuery } = useSearch();
    const [page, setPage] = useState(1);

    const {
        data: allUserAlbums = [],
        isLoading: isLoadingAllAlbums,
        isError: isErrorAllAlbums,
    } = useGetAlbumsQuery(user?.uid, { skip: !!folderId });

    const {
        data: folderAlbums = [],
        isLoading: isLoadingFolderAlbums,
        isError: isErrorFolderAlbums,
    } = useGetAlbumsByFolderQuery(
        { userId: userId, folderId: folderId as string },
        { skip: !folderId }
    );

    const {
        data: folder,
        isLoading: isLoadingFolder,
        isError: isErrorFolder,
    } = useGetFolderByIdQuery(
        { userId: userId, folderId: folderId as string },
        { skip: !folderId }
    );

    const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setActiveAlbumId(null);
        }
    }, [user]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, folderId]);

    // на главной отображаются альбомы без папок
    const albumsToDisplay = folderId
        ? folderAlbums
        : allUserAlbums.filter((album) => album.folderId === null);

    const filteredAlbums = albumsToDisplay.filter((album) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        if (searchMode === "album") {
            return album.title.toLowerCase().includes(query);
        } else {
            return album.artist?.toLowerCase().includes(query);
        }
    });

    const paginatedAlbums = filteredAlbums.slice(0, page * PAGE_SIZE);
    const hasMore = paginatedAlbums.length < filteredAlbums.length;

    const loadMore = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    const isLoading = folderId ? isLoadingFolderAlbums || isLoadingFolder : isLoadingAllAlbums;
    const isError = folderId ? isErrorFolderAlbums || isErrorFolder : isErrorAllAlbums;

    if (isLoading) return <Loader />;
    if (isError)
        return <p className="text-destructive text-2xl">Упс... ошибка загрузки альбомов:/</p>;
    if (albumsToDisplay.length === 0) {
        return <p className="text-muted-foreground text-2xl">Ты пока не добавил альбомы:/</p>;
    }
    if (filteredAlbums.length === 0) {
        return <p className="text-muted-foreground text-2xl">Ничего не найдено:/</p>;
    }

    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        640: 1,
    };

    return (
        <>
            {folderId && folder && <h1 className="text-2xl font-bold mb-6">{folder!.name}</h1>}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {paginatedAlbums.map((album) => (
                    <div key={album.id} className="mb-6">
                        <AlbumCard {...{ album, activeAlbumId, setActiveAlbumId }} />
                    </div>
                ))}
            </Masonry>

            {hasMore && (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={loadMore}
                        className="flex items-center gap-2"
                    >
                        Показать еще
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </>
    );
}
