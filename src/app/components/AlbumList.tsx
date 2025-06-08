"use client";

import { useEffect, useState } from "react";
import { AlbumCard } from "./albumCard";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Album = {
    id: string;
    title: string;
    artist: string;
    year: number | null;
    coverUrl: string | null;
    defaultStream: "bandcamp" | "spotify" | "soundcloud";
    streams: {
        type: "bandcamp" | "spotify" | "soundcloud";
        url: string;
    }[];
    folderId?: string;
};

export function AlbumList() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "albums"), (snapshot) => {
            const updatedAlbums: Album[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Album[];

            setAlbums(updatedAlbums);
            setLoading(false);
        });

        return () => unsub(); // Отписка при размонтировании
    }, []);

    const handleDeleteAlbum = async (albumId: string) => {
        try {
            await deleteDoc(doc(db, "albums", albumId));
            // Обновление произойдёт автоматически через onSnapshot
        } catch (err) {
            console.error("Ошибка при удалении альбома:", err);
        }
    };

    if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

    const albumsWithoutFolder = albums.filter((album) => !album.folderId);

    if (albumsWithoutFolder.length === 0) {
        return <p className="text-muted-foreground">Нет добавленных альбомов.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {albumsWithoutFolder.map((album) => (
                <AlbumCard key={album.id} album={album} onDelete={handleDeleteAlbum} />
            ))}
        </div>
    );
}
