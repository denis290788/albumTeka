import { act, fireEvent, render, screen } from "@testing-library/react";
import { StreamSelector } from "../StreamSelector";
import { useAuth } from "@/features/auth";
import { useUpdateAlbumMutation } from "@/services/albumsApi";
import { mockAlbum, mockUpdateAlbum } from "../__mocks__/albumsApi";

let selectOnValueChange: (value: string) => void;
jest.mock("@/components/ui/select", () => ({
    Select: ({
        children,
        onValueChange,
    }: {
        children: React.ReactNode;
        onValueChange: (value: string) => void;
    }) => {
        selectOnValueChange = onValueChange;
        return <div>{children}</div>;
    },
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
        <button data-testid="select-trigger">{children}</button>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="select-content">{children}</div>
    ),
    SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
        <div data-testid={`select-item-${value}`}>{children}</div>
    ),
    SelectValue: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="select-value">{children}</div>
    ),
}));

jest.mock("../../features/addStreamModal", () => ({
    AddStreamModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="add-stream-modal">AddStreamModal</div> : null,
}));

jest.mock("lucide-react", () => ({
    Check: () => <div data-testid="check-icon" />,
    Trash: () => <div data-testid="trash-icon" />,
}));

jest.mock("@/features/auth");
jest.mock("@/services/albumsApi");

describe("StreamSelector", () => {
    const mockSetActiveStream = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: "user1" } });
        (useUpdateAlbumMutation as jest.Mock).mockReturnValue([mockUpdateAlbum]);

        render(
            <StreamSelector
                album={mockAlbum}
                activeStream="Bandcamp"
                setActiveStream={mockSetActiveStream}
            />
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("отображает текущий активный стрим", () => {
        expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
    });

    it("отображает все стримы и кнопку добавления", () => {
        fireEvent.click(screen.getByTestId("select-trigger"));

        expect(screen.getByTestId("select-item-Bandcamp")).toBeInTheDocument();
        expect(screen.getByTestId("select-item-Spotify")).toBeInTheDocument();
        expect(screen.getByTestId("select-item-add")).toBeInTheDocument();
    });

    it("вызывает setActiveStream при выборе стрима", () => {
        act(() => {
            selectOnValueChange("Spotify");
        });

        expect(mockSetActiveStream).toHaveBeenCalledWith("Spotify");
    });

    it("устанавливает стрим по умолчанию при клике на Check", () => {
        fireEvent.click(screen.getByTestId("select-trigger"));
        const spotifyCheck = screen.getAllByTestId("check-icon")[1]; // Spotify (не default)
        fireEvent.click(spotifyCheck);

        expect(mockUpdateAlbum).toHaveBeenCalledWith({
            ...mockAlbum,
            defaultStream: "Spotify",
        });
    });

    it("удаляет стрим при клике на Trash", () => {
        fireEvent.click(screen.getByTestId("select-trigger"));
        const spotifyTrash = screen.getAllByTestId("trash-icon")[0];
        fireEvent.click(spotifyTrash);

        expect(mockUpdateAlbum).toHaveBeenCalledWith({
            ...mockAlbum,
            streams: mockAlbum.streams.filter((s) => s.type !== "Spotify"),
        });
    });

    it("открывает модалку при выборе 'Добавить стриминг'", () => {
        act(() => {
            selectOnValueChange("add");
        });

        expect(screen.getByTestId("add-stream-modal")).toBeInTheDocument();
    });
});
