import {
    Album,
    Stream,
    StreamType,
    useUpdateAlbumMutation,
} from "@/entities/album/model/albumsApi";
import { useAuth } from "@/features/auth";

export function useAlbumStreams(
    album: Album,
    activeStream: StreamType,
    setActiveStream: (t: StreamType) => void
) {
    const { user } = useAuth();
    const isOwner = user?.uid === album.userId;

    const [updateAlbum] = useUpdateAlbumMutation();

    const setDefaultStream = async (type: StreamType) => {
        if (!isOwner) return;
        try {
            await updateAlbum({ ...album, defaultStream: type }).unwrap();
            setActiveStream(type);
        } catch (err) {
            console.error("Ошибка при установке стрима по умолчанию:", err);
        }
    };

    const removeStream = async (type: StreamType) => {
        if (!isOwner) return;
        try {
            const updatedStreams = album.streams.filter((s: Stream) => s.type !== type);

            if (activeStream === type) {
                setActiveStream(album.defaultStream);
            }

            await updateAlbum({
                ...album,
                streams: updatedStreams,
                defaultStream: album.defaultStream,
            }).unwrap();
        } catch (err) {
            console.error("Ошибка при удалении стрима:", err);
        }
    };

    return {
        isOwner,
        setDefaultStream,
        removeStream,
    };
}
