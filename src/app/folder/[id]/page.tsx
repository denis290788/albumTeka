import { FolderClient } from "@/app/components/FolderClient";
import { getAlbumsByFolderId } from "@/lib/queries/get-albums-by-folder-id";
import { getFolder } from "@/lib/queries/get-folder";
import { notFound } from "next/navigation";

type Props = {
    params: { id: string };
};

export default async function FolderPage({ params }: Props) {
    const folder = await getFolder(params.id);
    if (!folder) return notFound();

    const albums = await getAlbumsByFolderId(params.id);

    return <FolderClient folder={folder} initialAlbums={albums} />;
}
