import { AlbumForm } from "../../../features/addAlbumForm";

export default function AddAlbumPage() {
    return (
        <div className="max-w-xl mx-auto pt-[90px] lg:pt-[115px]">
            <h1 className="text-2xl font-semibold mb-6 dark:text-[#bedaca]">Добавить альбом</h1>
            <AlbumForm className="px-4 mb-10" />
        </div>
    );
}
