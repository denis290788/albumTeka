import { Album } from "@/app/components/albumCard";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getAlbumsByFolderId(folderId: string): Promise<Album[]> {
    const q = query(collection(db, "albums"), where("folderId", "==", folderId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Album, "id">),
    }));
}
