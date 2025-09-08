import { EditAlbumForm } from "@/features/editAlbumForm";

interface EditAlbumPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
    const { id } = await params;

    return (
        <div className="min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-90px)] pb-4 px-4 pt-20 lg:pt-26">
            <div className="w-full">
                <EditAlbumForm albumId={id} />
            </div>
        </div>
    );
}
