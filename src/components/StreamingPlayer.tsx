"use client";

import { Album, StreamType } from "@/services/albumsApi";
import { VKPlayer } from "./VKPlayer";
import { useTheme } from "next-themes";

interface StreamingPlayerProps {
    album: Album;
    activeStream: StreamType;
}

export function StreamingPlayer({ album, activeStream }: StreamingPlayerProps) {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDarkMode = currentTheme === "dark";

    const stream = album.streams.find((s) => s.type === activeStream);
    if (!stream) {
        return <p className="text-muted-foreground">Стримы не найдены для выбранного типа.</p>;
    }

    switch (stream.type) {
        case "Bandcamp":
            return (
                <iframe
                    key={`bandcamp-${currentTheme}`}
                    style={{ border: 0, width: "100%", height: 392, borderRadius: "12px" }}
                    src={`${stream.url}/size=large/bgcol=${
                        isDarkMode ? "34495e" : "ffffff"
                    }/linkcol=${isDarkMode ? "dfe6e9" : "0687f5"}/theme=${
                        isDarkMode ? "dark" : "light"
                    }/tracklist=true/artwork=none/t=1`}
                    seamless
                    title={`Bandcamp player for ${album.title}`}
                />
            );

        case "Spotify": {
            const cleanUrl = stream.url.split("?")[0];
            const albumId = cleanUrl.split("/").pop();
            if (!albumId) return <p className="text-destructive">Неверный URL Spotify.</p>;

            return (
                <iframe
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`}
                    width="100%"
                    height="392"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify player for ${album.title}`}
                ></iframe>
            );
        }
        case "Soundcloud":
            return (
                <iframe
                    key={`soundcloud-${currentTheme}`}
                    style={{ borderRadius: "12px" }}
                    width="100%"
                    height="392"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                        stream.url
                    )}&color=%2334495e&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false&sharing=false&buying=false&liking=false&download=false`}
                    title={`SoundCloud player for ${album.title}`}
                ></iframe>
            );

        case "VK": {
            const urlParts = stream.url.split("/");
            const playlistWithKey = urlParts[urlParts.length - 1];
            const parts = playlistWithKey.split("_");
            if (parts.length < 3) {
                console.error("Неверный формат URL VK:", stream.url);
                return <p className="text-destructive">Неверный URL VK.</p>;
            }
            const playlistId = `${parts[0]}_${parts[1]}`;
            const accessKey = parts[2];

            return (
                <div className="vk-player-container w-full h-[392px]">
                    <VKPlayer playlistId={playlistId} accessKey={accessKey} />
                </div>
            );
        }

        default:
            return null;
    }
}
