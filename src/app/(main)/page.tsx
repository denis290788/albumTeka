import { AlbumList } from "../../components/AlbumList";
import { FolderList } from "../../components/FolderList";

export default function HomePage() {
    return (
        <div className="max-w-7xl mx-auto pt-[90px] lg:pt-[115px] pb-8">
            <FolderList className="hidden lg:flex" />
            <AlbumList />
        </div>
    );
}
