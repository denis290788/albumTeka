import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getFolder(id: string) {
    const ref = doc(db, "folders", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as { id: string; name: string };
}
