import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    open: boolean;
    headText: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
}

export function ConfirmModal({
    open,
    headText,
    description = "",
    onConfirm,
    onCancel,
    className,
}: ConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent
                className={cn(
                    className,
                    "shadow-[0_4px_10px_rgba(0,0,0,0.15)]",
                    "bg-[linear-gradient(var(--angle),#4ac77c,#dfe6e9)]",
                    "dark:bg-[linear-gradient(var(--angle),#34495e,#34495e)]"
                )}
                style={
                    {
                        "--angle": `${Math.floor(Math.random() * 360)}deg`,
                    } as React.CSSProperties
                }
            >
                <DialogHeader>
                    <DialogTitle className="dark:text-[#bedaca]">{headText}</DialogTitle>
                    {description && (
                        <DialogDescription className="mt-2">{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={onCancel} className="w-[100px]">
                        Отмена
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="w-[100px]">
                        Удалить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
