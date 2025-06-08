import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export type Folder = {
    id: string;
    name: string;
};

export async function getFolders(): Promise<Folder[]> {
    const snapshot = await getDocs(collection(db, "folders"));

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Folder, "id">),
    }));
}
