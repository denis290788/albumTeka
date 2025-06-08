import { AlbumList } from "./components/AlbumList";
import { FolderList } from "./components/FolderList";
import { Header } from "./components/Header";

export default function HomePage() {
    return (
        <div className="max-w-4xl mx-auto py-10">
            <Header />
            <FolderList />
            <AlbumList />
        </div>
    );
}
