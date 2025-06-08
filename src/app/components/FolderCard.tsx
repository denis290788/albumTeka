"use client";

import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function FolderCard({ name, id }: { name: string; id: string }) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            // Найти все альбомы с этой папкой
            const albumsQuery = query(collection(db, "albums"), where("folderId", "==", id));
            const snapshot = await getDocs(albumsQuery);

            // Обновить их folderId на null
            const updates = snapshot.docs.map((docSnap) =>
                updateDoc(docSnap.ref, { folderId: null })
            );
            await Promise.all(updates);

            // Удалить саму папку
            await deleteDoc(doc(db, "folders", id));
            router.push("/");
            router.refresh(); // Обновить страницу
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
