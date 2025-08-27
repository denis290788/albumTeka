import { render, screen, fireEvent } from "@testing-library/react";
import { AlbumCard } from "../AlbumCard";
import { mockAlbum } from "../__mocks__/albumsApi";

jest.mock("../AlbumCardMenu", () => ({
    AlbumCardMenu: () => <div data-testid="menu-mock" />,
}));

jest.mock("../FolderSelector", () => ({
    FolderSelector: () => <div data-testid="folder-selector-mock" />,
}));

jest.mock("../StreamSelector", () => ({
    StreamSelector: () => <div data-testid="stream-selector-mock" />,
}));

jest.mock("@/features/auth");
jest.mock("next/navigation");

describe("AlbumCard", () => {
    it("отображает название альбома, год, исполнителя", () => {
        render(<AlbumCard album={mockAlbum} activeAlbumId={null} setActiveAlbumId={jest.fn()} />);

        expect(screen.getByText("Test Album")).toBeInTheDocument();
        expect(screen.getByText("Test Artist")).toBeInTheDocument();
        expect(screen.getByText("2023")).toBeInTheDocument();
    });

    it("переключает состояние воспроизведения при клике на кнопку", () => {
        const setActiveAlbumId = jest.fn();
        render(
            <AlbumCard album={mockAlbum} activeAlbumId={null} setActiveAlbumId={setActiveAlbumId} />
        );

        const playButton = screen.getByRole("button", { name: /play/i });
        fireEvent.click(playButton);
        expect(setActiveAlbumId).toHaveBeenCalledWith("1");
    });

    it("отображает иконку остановки при активном воспроизведении", () => {
        render(<AlbumCard album={mockAlbum} activeAlbumId="1" setActiveAlbumId={jest.fn()} />);

        expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });
});
