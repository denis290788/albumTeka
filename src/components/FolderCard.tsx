import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import { useDeleteFolderMutation } from "@/services/foldersApi";
import { X } from "lucide-react";
import Link from "next/link";

interface FolderCardProps {
    id: string;
    name: string;
    className?: string;
}

export function FolderCard({ name, id, className }: FolderCardProps) {
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
        <Link href={`/folder/${id}`} className={cn("relative group", className)}>
            <Card
                className={cn(
                    "p-2 bg-[#c8d3d6] hover:bg- transition min-w-20 max-w-35 lg:min-w-25 lg:max-w-50 shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    className
                )}
            >
                <h3 className="text-[16px] lg:text-lg text-center truncate">{name}</h3>
                <button
                    onClick={handleDelete}
                    className="cursor-pointer absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </Card>
        </Link>
    );
}
