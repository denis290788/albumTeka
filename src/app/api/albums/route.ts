import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export async function GET() {
    try {
        const q = query(collection(db, "albums"));
        const snapshot = await getDocs(q);

        const albums = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(albums);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load albums" }, { status: 500 });
    }
}
