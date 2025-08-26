import { AlbumList } from "@/components/AlbumList";

interface FolderPageProps {
    params: Promise<{ id: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
    const { id } = await params;

    return (
        <div className="max-w-[1440px] mx-auto pt-[90px] lg:pt-[115px] px-4 xl:px-16">
            <AlbumList folderId={id} />
        </div>
    );
}
