import { AlbumList } from "../../components/AlbumList";
import { FolderList } from "../../components/FolderList";

export default function HomePage() {
    return (
        <div className="max-w-7xl mx-auto py-10 pt-[100px] lg:pt-[125px]">
            <FolderList className="hidden lg:flex" />
            <AlbumList />
        </div>
    );
}
