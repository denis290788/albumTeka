import { AlbumForm } from "../components/addAlbumForm";

export default function AddAlbumPage() {
    return (
        <div className="max-w-xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">Добавить альбом</h1>
            <AlbumForm className="px-4" />
        </div>
    );
}
