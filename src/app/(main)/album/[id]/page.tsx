import { AlbumDetails } from "@/components/AlbumDetails";

interface AlbumDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function FolderPage({ params }: AlbumDetailsPageProps) {
    const { id } = await params;

    return (
        <div className="max-w-4xl mx-auto pt-[90px] lg:pt-[115px]">
            <AlbumDetails albumId={id} className="mb-10" />
        </div>
    );
}
