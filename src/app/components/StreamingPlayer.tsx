// components/StreamingPlayer.tsx
"use client";

import { Album, StreamType } from "@/services/albumsApi";
import { VKPlayer } from "./VKPlayer";

interface StreamingPlayerProps {
    album: Album;
    activeStream: StreamType;
}

export function StreamingPlayer({ album, activeStream }: StreamingPlayerProps) {
    const stream = album.streams.find((s) => s.type === activeStream);

    if (!stream) {
        return <p className="text-muted-foreground">Стримы не найдены для выбранного типа.</p>;
    }

    switch (stream.type) {
        case "bandcamp":
            return (
                <iframe
                    style={{ border: 0, width: "100%", height: 120 }}
                    src={`${stream.url}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/`}
                    seamless
                    title={`Bandcamp player for ${album.title}`}
                />
            );

        case "spotify": {
            const cleanUrl = stream.url.split("?")[0];
            const albumId = cleanUrl.split("/").pop();
            if (!albumId) return <p className="text-red-500">Неверный URL Spotify.</p>;

            return (
                <iframe
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify player for ${album.title}`}
                ></iframe>
            );
        }
        case "soundcloud":
            return (
                <iframe
                    width="100%"
                    height="300"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                        stream.url
                    )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
                    title={`SoundCloud player for ${album.title}`}
                ></iframe>
            );

        case "vk": {
            const urlParts = stream.url.split("/");
            const playlistWithKey = urlParts[urlParts.length - 1];
            const parts = playlistWithKey.split("_");
            if (parts.length < 3) {
                console.error("Неверный формат URL VK:", stream.url);
                return <p className="text-red-500">Неверный URL VK.</p>;
            }
            const playlistId = `${parts[0]}_${parts[1]}`;
            const accessKey = parts[2];

            return (
                <div className="vk-player-container w-full">
                    <VKPlayer playlistId={playlistId} accessKey={accessKey} />
                </div>
            );
        }

        default:
            return null;
    }
}
