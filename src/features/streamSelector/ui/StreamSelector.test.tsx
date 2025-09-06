import { act, fireEvent, render, screen } from "@testing-library/react";
import { mockAlbum } from "../../../shared/lib/test/__mocks__/albumsApi";
import { ConfirmModalProps } from "../../../shared/ui/ConfirmModal";
import { useAlbumStreams } from "../hooks/useAlbumStreams";
import { StreamSelector } from "./StreamSelector";

let selectOnValueChange: (value: string) => void;

jest.mock("@/shared/ui/select", () => ({
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

jest.mock("@/shared/ui/ConfirmModal", () => ({
    ConfirmModal: ({ open, onConfirm, onCancel }: ConfirmModalProps) => (
        <div data-testid="confirm-modal">
            {open && (
                <>
                    <button onClick={onConfirm} data-testid="confirm-delete-button">
                        Confirm Delete
                    </button>
                    <button onClick={onCancel} data-testid="confirm-cancel-button">
                        Cancel Delete
                    </button>
                </>
            )}
        </div>
    ),
}));

jest.mock("@/features/addStreamModal", () => ({
    AddStreamModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="add-stream-modal">AddStreamModal</div> : null,
}));

jest.mock("lucide-react", () => ({
    Check: () => <div data-testid="check-icon" />,
    Trash: () => <div data-testid="trash-icon" />,
}));

// мок для нового хука
jest.mock("../hooks/useAlbumStreams");

describe("StreamSelector", () => {
    const mockSetActiveStream = jest.fn();
    const mockSetDefaultStream = jest.fn();
    const mockRemoveStream = jest.fn();

    beforeEach(() => {
        (useAlbumStreams as jest.Mock).mockReturnValue({
            isOwner: true,
            setDefaultStream: mockSetDefaultStream,
            removeStream: mockRemoveStream,
        });

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

        expect(mockSetDefaultStream).toHaveBeenCalledWith("Spotify");
    });

    it("удаляет стрим при клике на Trash", () => {
        fireEvent.click(screen.getByTestId("select-trigger"));
        const spotifyTrash = screen.getAllByTestId("trash-icon")[0];
        fireEvent.click(spotifyTrash);

        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("confirm-delete-button"));

        expect(mockRemoveStream).toHaveBeenCalledWith("Spotify");
    });

    it("открывает модалку при выборе 'Добавить стриминг'", () => {
        act(() => {
            selectOnValueChange("add");
        });

        expect(screen.getByTestId("add-stream-modal")).toBeInTheDocument();
    });
});
