import { FolderClient } from "@/components/FolderClient";

interface FolderPageProps {
    params: { id: string };
}

export default function FolderPage({ params }: FolderPageProps) {
    const { id } = params;

    return <FolderClient folderId={id} />;
}
