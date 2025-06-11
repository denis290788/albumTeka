import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import { useDeleteFolderMutation } from "@/services/foldersApi";
import { X } from "lucide-react";
import Link from "next/link";

interface FolderCardProps {
    id: string;
    name: string;
}

export function FolderCard({ name, id }: FolderCardProps) {
    const { user } = useAuth();

    const [deleteFolder] = useDeleteFolderMutation();
    const { refetch: refetchAlbums } = useGetAlbumsQuery(user?.uid);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await deleteFolder({ id }).unwrap();
            refetchAlbums();
        } catch (err) {
            console.error("Ошибка при удалении папки:", err);
        }
    };

    return (
        <Link href={`/folder/${id}`} className="relative group">
            <Card className="p-4 hover:bg-muted transition">
                <h3 className="font-semibold text-lg">{name}</h3>
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </Card>
        </Link>
    );
}
