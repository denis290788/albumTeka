import { AlbumDetails } from "@/entities/album";

interface AlbumDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function AlbumDetailsPage({ params }: AlbumDetailsPageProps) {
    const { id } = await params;

    return (
        <div className="max-w-4xl mx-auto pt-[90px] lg:pt-[100px] px-4">
            <AlbumDetails albumId={id} className="mb-10 lg:mb-4" />
        </div>
    );
}
