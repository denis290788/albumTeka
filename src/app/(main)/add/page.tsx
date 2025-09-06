import { AlbumForm } from "../../../features/addAlbumForm";

export default function AlbumFormPage() {
    return (
        <div className="min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-90px)] grid place-items-center px-4 pt-18 lg:pt-26">
            <div className="w-full">
                <AlbumForm />
            </div>
        </div>
    );
}
