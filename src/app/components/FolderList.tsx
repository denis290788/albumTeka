import { getFolders } from "@/lib/queries/get-folders";
import { FolderCard } from "./FolderCard";

export async function FolderList() {
    const folders = await getFolders();

    if (folders.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Мои папки</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {folders.map((folder) => (
                    <FolderCard key={folder.id} id={folder.id} name={folder.name} />
                ))}
            </div>
        </div>
    );
}
