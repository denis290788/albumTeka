import { Album } from "@/services/albumsApi";

export const mockAlbum: Album = {
    id: "1",
    title: "Test Album",
    artist: "Test Artist",
    year: 2023,
    coverUrl: "https://example.com/cover.jpg",
    defaultStream: "Bandcamp",
    streams: [
        { type: "Bandcamp", url: "bandcamp-link" },
        { type: "Spotify", url: "spotify-link" },
    ],
    folderId: null,
    userId: "user1",
    createdAt: "test-date",
};

export const mockAlbums = [
    { id: "1", title: "Album 1", artist: "Artist 1", folderId: null },
    { id: "2", title: "Album 2", artist: "Artist 2", folderId: null },
    { id: "3", title: "Album 3", artist: "Artist 3", folderId: null },
    { id: "4", title: "Album 4", artist: "Artist 4", folderId: null },
    { id: "5", title: "Album 5", artist: "Artist 5", folderId: null },
    { id: "6", title: "Album 6", artist: "Artist 6", folderId: null },
    { id: "7", title: "Album 7", artist: "Artist 7", folderId: null },
    { id: "8", title: "Album 8", artist: "Artist 8", folderId: null },
    { id: "9", title: "Album 9", artist: "Artist 9", folderId: null },
    { id: "10", title: "Album 10", artist: "Artist 10", folderId: null },
];

export const mockUpdateAlbum = jest.fn().mockReturnValue({
    unwrap: jest.fn().mockResolvedValue({}),
});

export const useUpdateAlbumMutation = jest.fn(() => [mockUpdateAlbum]);
export const useDeleteAlbumMutation = jest.fn(() => [jest.fn()]);
export const useGetAlbumsQuery = jest.fn(() => ({ data: mockAlbums }));
export const useGetAlbumsByFolderQuery = jest.fn(() => ({ data: null }));
