import { AlbumForm } from "../../../features/addAlbumForm";

export default function AddAlbumPage() {
    return (
        <div className="max-w-xl mx-auto py-10 pt-[100px] lg:pt-[125px]">
            <h1 className="text-2xl font-semibold mb-6">Добавить альбом</h1>
            <AlbumForm className="px-4" />
        </div>
    );
}
