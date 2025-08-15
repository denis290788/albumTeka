import { act, fireEvent, render, screen } from "@testing-library/react";
import { FolderSelector } from "../FolderSelector";
import { useAuth } from "@/features/auth";
import { useUpdateAlbumMutation } from "@/services/albumsApi";
import { useGetFoldersQuery } from "@/services/foldersApi";
import { mockFolders } from "../__mocks__/foldersApi";
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
}));

jest.mock("@/features/auth");
jest.mock("@/services/albumsApi");
jest.mock("@/services/foldersApi");

describe("FolderSelector", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: "user1" } });
        (useGetFoldersQuery as jest.Mock).mockReturnValue({ data: mockFolders });
        (useUpdateAlbumMutation as jest.Mock).mockReturnValue([mockUpdateAlbum]);

        render(<FolderSelector album={mockAlbum} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("отображает триггер и список папок", () => {
        expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
    });

    it('отображает все папки и опцию "Без папки"', () => {
        fireEvent.click(screen.getByTestId("select-trigger"));

        expect(screen.getByTestId("select-item-null")).toHaveTextContent("Без папки");
        expect(screen.getByTestId("select-item-folder1")).toHaveTextContent("Folder 1");
        expect(screen.getByTestId("select-item-folder2")).toHaveTextContent("Folder 2");
    });

    it("вызывает обновление при выборе папки", async () => {
        act(() => {
            selectOnValueChange("folder1");
        });

        expect(mockUpdateAlbum).toHaveBeenCalledWith({
            ...mockAlbum,
            folderId: "folder1",
        });
    });
});
