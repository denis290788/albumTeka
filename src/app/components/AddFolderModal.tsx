"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useFolders } from "../context/FoldersContext";

const formSchema = z.object({
    name: z.string().min(1, "Введите название папки"),
});

type FormData = z.infer<typeof formSchema>;

export function AddFolderModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const { refreshFolders } = useFolders();

    const onSubmit = async (data: FormData) => {
        try {
            await addDoc(collection(db, "folders"), {
                name: data.name,
            });

            await refreshFolders();
            reset();
            onOpenChange(false);
            router.refresh();
        } catch (err) {
            console.error("Ошибка при добавлении папки", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить папку</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Название папки" {...register("name")} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        Сохранить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
