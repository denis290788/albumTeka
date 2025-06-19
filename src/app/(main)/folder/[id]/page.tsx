import { AlbumList } from "@/components/AlbumList";

interface FolderPageProps {
    params: Promise<{ id: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
    const { id } = await params;

    return (
        <div className="max-w-7xl mx-auto pt-[90px] lg:pt-[115px]">
            <AlbumList folderId={id} />
        </div>
    );
}
