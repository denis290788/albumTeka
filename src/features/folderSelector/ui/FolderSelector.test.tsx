import { act, fireEvent, render, screen } from "@testing-library/react";
import { useAuth } from "@/features/auth";
import { useUpdateAlbumMutation } from "@/entities/album/model/albumsApi";
import { useGetFoldersQuery } from "@/entities/folder/model/foldersApi";
import { useFolderSelector } from "../hooks/useFolderSelector";
import { FolderSelector } from "./FolderSelector";
import { mockFolders } from "@/shared/lib/test/__mocks__/foldersApi";
import { mockAlbum, mockUpdateAlbum } from "@/shared/lib/test/__mocks__/albumsApi";

jest.mock("../hooks/useFolderSelector");

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                folder_selector_none: "Без папки",
            };
            return translations[key] || key;
        },
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}));

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
}));

jest.mock("@/features/auth");
jest.mock("@/entities/album/model/albumsApi");
jest.mock("@/entities/folder/model/foldersApi");

const mockUseFolderSelector = useFolderSelector as jest.MockedFunction<typeof useFolderSelector>;

describe("FolderSelector", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: "user1" } });
        (useGetFoldersQuery as jest.Mock).mockReturnValue({ data: mockFolders });
        (useUpdateAlbumMutation as jest.Mock).mockReturnValue([mockUpdateAlbum]);

        mockUseFolderSelector.mockReturnValue({
            folders: mockFolders,
            selectedValue: "null",
            handleChange: mockUpdateAlbum,
            isLoading: false,
        });

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

        expect(mockUpdateAlbum).toHaveBeenCalledWith("folder1");
    });
});
