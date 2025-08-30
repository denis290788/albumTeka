import { render, screen, fireEvent } from "@testing-library/react";
import { AlbumList } from "../AlbumList";
import { useAuth } from "@/features/auth";
import { useSearch } from "../SearchContext";
import { useGetAlbumsQuery, useGetAlbumsByFolderQuery } from "@/services/albumsApi";
import { useGetFolderByIdQuery } from "@/services/foldersApi";
import { AlbumCardProps } from "../AlbumCard";
import { mockAlbums } from "../__mocks__/albumsApi";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                albumList_error: "Упс... ошибка загрузки альбомов:/",
                albumList_empty: "Ты пока не добавил альбомы:/",
                albumList_notFound: "Альбомы не найдены",
                albumList_showMore: "Показать еще",
            };
            return translations[key] || key;
        },
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}));

jest.mock("../SearchContext", () => ({
    useSearch: jest.fn(),
}));

jest.mock("../AlbumCard", () => ({
    AlbumCard: ({ album }: AlbumCardProps) => <div data-testid="album-card">{album.title}</div>,
}));

jest.mock("@/features/auth");
jest.mock("@/services/albumsApi");
jest.mock("@/services/foldersApi");

describe("AlbumList", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { uid: "user1" },
        });

        (useSearch as jest.Mock).mockReturnValue({
            searchMode: "album",
            searchQuery: "",
        });

        (useGetAlbumsQuery as jest.Mock).mockReturnValue({
            data: mockAlbums,
            isLoading: false,
            isError: false,
        });

        (useGetAlbumsByFolderQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        (useGetFolderByIdQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            isError: false,
        });
    });

    it("отображает список альбомов", () => {
        render(<AlbumList />);

        expect(screen.getAllByTestId("album-card")).toHaveLength(9);
        expect(screen.getByText("Album 1")).toBeInTheDocument();
        expect(screen.getByText("Album 9")).toBeInTheDocument();
        expect(screen.queryByText("Album 10")).not.toBeInTheDocument();
    });

    it('отображает кнопку "Показать еще" если есть дополнительные альбомы', () => {
        render(<AlbumList />);

        expect(screen.getByText("Показать еще")).toBeInTheDocument();
    });

    it('загружает дополнительные альбомы при клике на "Показать еще"', () => {
        render(<AlbumList />);

        expect(screen.getAllByTestId("album-card")).toHaveLength(9);

        fireEvent.click(screen.getByText("Показать еще"));

        expect(screen.getAllByTestId("album-card")).toHaveLength(10);
        expect(screen.getByText("Album 10")).toBeInTheDocument();
    });

    it('не отображает кнопку "Показать еще" если все альбомы загружены', () => {
        (useGetAlbumsQuery as jest.Mock).mockReturnValue({
            data: mockAlbums.slice(0, 5),
            isLoading: false,
            isError: false,
        });

        render(<AlbumList />);

        expect(screen.queryByText("Показать еще")).not.toBeInTheDocument();
    });

    it("отображает сообщение об ошибке при ошибке загрузки", () => {
        (useGetAlbumsQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<AlbumList />);

        expect(screen.getByText("Упс... ошибка загрузки альбомов:/")).toBeInTheDocument();
    });

    it("отображает сообщение если альбомов нет", () => {
        (useGetAlbumsQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        render(<AlbumList />);

        expect(screen.getByText("Ты пока не добавил альбомы:/")).toBeInTheDocument();
    });
});
