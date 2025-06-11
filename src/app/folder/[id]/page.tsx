"use client";

import { useParams } from "next/navigation";
import { FolderClient } from "@/components/FolderClient";

export default function FolderPage() {
    const { id } = useParams<{ id: string }>();
    return <FolderClient folderId={id} />;
}
