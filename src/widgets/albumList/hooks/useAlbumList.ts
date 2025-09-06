import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetAlbumsByFolderQuery, useGetAlbumsQuery } from "@/entities/album/model/albumsApi";
import { useGetFolderByIdQuery } from "@/entities/folder/model/foldersApi";
import { useAuth } from "@/features/auth";
import { useSearch } from "@/app/_providers/SearchContext";

const PAGE_SIZE = 9;

export function useAlbumList(folderId?: string) {
    const { user } = useAuth();
    const userId = user?.uid as string;

    const { searchMode, searchQuery } = useSearch();
    const [page, setPage] = useState(1);
    const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

    const {
        data: allUserAlbums = [],
        isLoading: isLoadingAllAlbums,
        isError: isErrorAllAlbums,
    } = useGetAlbumsQuery(user?.uid, { skip: !!folderId });

    const {
        data: folderAlbums = [],
        isLoading: isLoadingFolderAlbums,
        isError: isErrorFolderAlbums,
    } = useGetAlbumsByFolderQuery({ userId, folderId: folderId as string }, { skip: !folderId });

    const {
        data: folder,
        isLoading: isLoadingFolder,
        isError: isErrorFolder,
    } = useGetFolderByIdQuery({ userId, folderId: folderId as string }, { skip: !folderId });

    useEffect(() => {
        if (!user) {
            setActiveAlbumId(null);
        }
    }, [user]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, folderId]);

    // на главной альбомы без папок
    const albumsToDisplay = useMemo(
        () => (folderId ? folderAlbums : allUserAlbums.filter((album) => album.folderId === null)),
        [folderId, folderAlbums, allUserAlbums]
    );

    const albumsToSearch = folderId ? folderAlbums : allUserAlbums;

    const filteredAlbums = useMemo(() => {
        if (!searchQuery) return albumsToDisplay;

        const query = searchQuery.toLowerCase();
        return albumsToSearch.filter((album) => {
            const match =
                searchMode === "album"
                    ? album.title.toLowerCase().includes(query)
                    : album.artist.toLowerCase().includes(query);
            return match && (folderId || album.folderId === null || searchQuery);
        });
    }, [albumsToSearch, albumsToDisplay, searchQuery, searchMode, folderId]);

    const paginatedAlbums = filteredAlbums.slice(0, page * PAGE_SIZE);
    const hasMore = paginatedAlbums.length < filteredAlbums.length;

    const loadMore = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    const isLoading = folderId ? isLoadingFolderAlbums || isLoadingFolder : isLoadingAllAlbums;
    const isError = folderId ? isErrorFolderAlbums || isErrorFolder : isErrorAllAlbums;

    return {
        folder,
        albumsToDisplay,
        filteredAlbums,
        paginatedAlbums,
        activeAlbumId,
        setActiveAlbumId,
        loadMore,
        hasMore,
        isLoading,
        isError,
    };
}
