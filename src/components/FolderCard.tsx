import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";
import { useDeleteFolderMutation } from "@/services/foldersApi";
import { useGetAlbumsQuery } from "@/services/albumsApi";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { X, GripVertical } from "lucide-react";

interface FolderCardProps {
    id: string;
    name: string;
    className?: string;
}

export function FolderCard({ id, name, className }: FolderCardProps) {
    const { user } = useAuth();
    const [deleteFolder] = useDeleteFolderMutation();
    const { refetch: refetchAlbums } = useGetAlbumsQuery(user?.uid);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await deleteFolder({ id }).unwrap();
            refetchAlbums();
        } catch (err) {
            console.error("Ошибка при удалении папки:", err);
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(className, "group")}>
            <Card
                className={cn(
                    "p-1 bg-[#c8d3d6] transition min-w-25 max-w-50 lg:min-w-25 lg:max-w-50 shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "flex flex-row gap-0 items-center"
                )}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className={cn(
                        "cursor-grab text-muted-foreground hover:text-foreground transition",
                        "p-[2px] opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    )}
                >
                    <GripVertical className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <Link href={`/folder/${id}`}>
                        <h3 className="text-[16px] lg:text-lg text-foreground truncate">{name}</h3>
                    </Link>
                </div>

                <button
                    onClick={handleDelete}
                    className={cn(
                        "text-muted-foreground hover:text-destructive transition",
                        "p-[2px] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                    )}
                >
                    <X className="w-4 h-4" />
                </button>
            </Card>
        </div>
    );
}
