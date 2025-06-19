"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    playlistId: string; // пример: "-2000060338_24060338"
    accessKey?: string; // пример: "e8698053649fde8468"
};

export function VKPlayer({ playlistId, accessKey }: Props) {
    const uniqueId = useRef(`vk_playlist_${Math.random().toString(36).substring(2, 9)}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widgetInstance = useRef<any>(null);
    const [vkApiLoaded, setVkApiLoaded] = useState(false);

    useEffect(() => {
        const scriptId = "vk_openapi_js_script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://vk.com/js/api/openapi.js?173";
            script.async = true;
            script.onload = () => {
                setVkApiLoaded(true);
                console.log("VK API script loaded.");
            };
            script.onerror = () => {
                console.error("Failed to load VK API script.");
            };
            document.head.appendChild(script);
        } else {
            // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
            if (window.VK && window.VK.Widgets) {
                setVkApiLoaded(true);
            }
        }

        return () => {
            if (widgetInstance.current) {
                try {
                    if (
                        // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                        window.VK &&
                        // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                        window.VK.Widgets &&
                        // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                        typeof window.VK.Widgets.destroy === "function"
                    ) {
                        // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                        window.VK.Widgets.destroy(widgetInstance.current);
                        console.log("VK widget destroyed on unmount.");
                    } else {
                        console.warn("VK API not available to destroy widget on unmount.");
                    }
                } catch (e) {
                    console.error("Error destroying VK widget:", e);
                } finally {
                    widgetInstance.current = null;
                }
            }
        };
    }, []);

    useEffect(() => {
        const initializeWidget = () => {
            const containerElement = document.getElementById(uniqueId.current);

            if (vkApiLoaded && containerElement) {
                if (
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    window.VK &&
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    window.VK.Widgets &&
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    typeof window.VK.Widgets.Playlist === "function"
                ) {
                    if (widgetInstance.current) {
                        try {
                            // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                            window.VK.Widgets.destroy(widgetInstance.current);
                            console.log("Destroyed old VK widget.");
                        } catch (e) {
                            console.warn("Could not destroy old VK widget instance:", e);
                        } finally {
                            widgetInstance.current = null;
                        }
                    }

                    const [ownerId, playlistIdOnly] = playlistId.split("_");

                    const numOwnerId = Number(ownerId);
                    const numPlaylistId = Number(playlistIdOnly);

                    if (isNaN(numOwnerId) || isNaN(numPlaylistId)) {
                        console.error(
                            "Invalid playlistId format. Expected 'ownerId_playlistId'.",
                            playlistId
                        );
                        return;
                    }
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    widgetInstance.current = window.VK.Widgets.Playlist(
                        uniqueId.current,
                        numOwnerId,
                        numPlaylistId,
                        accessKey,
                        {
                            height: 300,
                        }
                    );
                    console.log("VK widget initialized for:", playlistId);
                } else {
                    console.warn("VK API Widgets or Playlist function not available yet.");
                }
            } else {
                console.log("Waiting for VK API to load or container to be available...", {
                    vkApiLoaded,
                    containerElementExists: !!containerElement,
                });
            }
        };

        if (vkApiLoaded) {
            initializeWidget();
        }
    }, [vkApiLoaded, playlistId, accessKey]);

    return <div id={uniqueId.current} />;
}
