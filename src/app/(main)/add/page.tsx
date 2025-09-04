import { AlbumForm } from "../../../features/addAlbumForm";

export default function AddAlbumPage() {
    return (
        // <div className="max-w-xl mx-auto pt-[90px] lg:pt-[115px] px-4 xl:px-16">
        //     <AlbumForm />
        // </div>

        <div className="min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-90px)] grid place-items-center px-4 pt-18 lg:pt-26">
            <div className="w-full">
                <AlbumForm />
            </div>
        </div>
    );
}
