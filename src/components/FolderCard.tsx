import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { FolderCardMenu } from "./FolderCardMenu";

interface FolderCardProps {
    id: string;
    name: string;
    className?: string;
}

export function FolderCard({ id, name, className }: FolderCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : "auto",
        transformOrigin: "0 0",
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(className, "group")}>
            <Card
                className={cn(
                    "p-1 bg-muted-foreground/30 transition min-w-25 max-w-40 lg:max-w-50 shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
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
                <div className="flex-1 min-w-0 flex justify-center">
                    <Link
                        href={`/folder/${id}`}
                        className="flex items-center justify-center h-full w-full"
                    >
                        <span className="text-[16px] lg:text-lg text-foreground dark:text-[#bedaca] truncate align-text-top text-center ">
                            {name}
                        </span>
                    </Link>
                </div>
                <div
                    className={cn(
                        "text-muted-foreground hover:text-foreground transition",
                        "p-[2px] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                    )}
                >
                    <FolderCardMenu id={id} name={name} />
                </div>
            </Card>
        </div>
    );
}
