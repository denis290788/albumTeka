import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlbumCardMenu } from "../AlbumCardMenu";
import { useRouter } from "next/navigation";
import { useDeleteAlbumMutation } from "@/services/albumsApi";
import { toast } from "sonner";
import { ConfirmModalProps } from "../ConfirmModal";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                albumMenu_copySuccess: "Ссылка скопирована в буфер обмена",
                albumMenu_copyError: "Ошибка при копировании",
                albumMenu_deleteSuccess: "Альбом удален",
                albumMenu_deleteError: "Ошибка при удалении",
                albumMenu_details: "Детали",
                albumMenu_share: "Поделиться",
                albumMenu_delete: "Удалить",
                albumMenu_confirmTitle: "Подтверждение удаления",
                albumMenu_confirmDescription: "Вы уверены, что хотите удалить этот альбом?",
            };
            return translations[key] || key;
        },
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("../ConfirmModal", () => ({
    ConfirmModal: ({ open, onConfirm, onCancel }: ConfirmModalProps) => (
        <div data-testid="confirm-modal">
            {open && (
                <>
                    <button onClick={onConfirm}>Confirm Delete</button>
                    <button onClick={onCancel}>Cancel Delete</button>
                </>
            )}
        </div>
    ),
}));

jest.mock("next/navigation");
jest.mock("@/services/albumsApi");

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe("AlbumCardMenu", () => {
    const mockRouterPush = jest.fn();
    const mockDeleteAlbum = jest.fn();
    const mockAlbumId = "album-123";

    beforeEach(async () => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        (useDeleteAlbumMutation as jest.Mock).mockReturnValue([mockDeleteAlbum]);

        jest.clearAllMocks();

        render(<AlbumCardMenu albumId={mockAlbumId} />);

        const menuButton = screen.getByRole("button");
        await userEvent.click(menuButton);
    });

    it('переходит на страницу альбома при клике на "Детали"', async () => {
        const detailsButton = screen.getByText("Детали");
        await userEvent.click(detailsButton);

        expect(mockRouterPush).toHaveBeenCalledWith(`/album/${mockAlbumId}`);
    });

    it('копирует ссылку при клике на "Поделиться"', async () => {
        const shareButton = screen.getByText("Поделиться");
        await userEvent.click(shareButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            `http://localhost/album/${mockAlbumId}`
        );
        expect(toast.success).toHaveBeenCalledWith("Ссылка скопирована в буфер обмена");
    });

    it('открывает модальное окно при клике на "Удалить"', async () => {
        const deleteButton = screen.getByText("Удалить");
        await userEvent.click(deleteButton);

        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    });
});
