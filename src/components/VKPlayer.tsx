"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    playlistId: string; // пример: "-2000060338_24060338"
    accessKey?: string; // пример: "e8698053649fde8468"
};

export function VKPlayer({ playlistId, accessKey }: Props) {
    // Используем уникальный ID для каждого экземпляра плеера
    // Это более надежно для внешних скриптов, которые ищут элементы по ID
    const uniqueId = useRef(`vk_playlist_${Math.random().toString(36).substring(2, 9)}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widgetInstance = useRef<any>(null);
    const [vkApiLoaded, setVkApiLoaded] = useState(false); // Состояние для отслеживания загрузки VK API

    useEffect(() => {
        // Загрузка скрипта VK API
        const scriptId = "vk_openapi_js_script"; // Уникальный ID для скрипта
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://vk.com/js/api/openapi.js?173";
            script.async = true; // Загружаем асинхронно
            script.onload = () => {
                setVkApiLoaded(true); // Устанавливаем флаг, что API загружен
                console.log("VK API script loaded.");
            };
            script.onerror = () => {
                console.error("Failed to load VK API script.");
            };
            document.head.appendChild(script); // Лучше добавлять в head
        } else {
            // Если скрипт уже есть, но API еще не готов (т.е. был добавлен другим экземпляром)
            // Дожидаемся VK API, если он уже в процессе загрузки

            // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
            if (window.VK && window.VK.Widgets) {
                setVkApiLoaded(true);
            } else {
                // Если скрипт есть, но window.VK еще не полностью инициализирован,
                // можно подождать его загрузки (например, с помощью MutationObserver или интервала)
                // Но в большинстве случаев onload должен сработать корректно при первом добавлении.
                // Для простоты, здесь просто предполагаем, что если скрипт есть, то VK будет доступен вскоре.
            }
        }

        return () => {
            // Очистка при размонтировании компонента
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
    }, []); // Зависимости пустые, так как скрипт должен загрузиться только один раз

    // Отдельный useEffect для инициализации виджета после загрузки API и изменения пропсов
    useEffect(() => {
        const initializeWidget = () => {
            const containerElement = document.getElementById(uniqueId.current);

            // Проверяем, что VK API загружен и контейнер доступен
            if (vkApiLoaded && containerElement) {
                if (
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    window.VK &&
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    window.VK.Widgets &&
                    // @ts-expect-error: Property 'VK' does not exist on type 'Window & typeof globalThis'.
                    typeof window.VK.Widgets.Playlist === "function"
                ) {
                    // Удаляем предыдущий виджет, если он существует, перед созданием нового
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

                    // Проверяем, что ownerId и playlistIdOnly являются числами
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
                        uniqueId.current, // Передаем ID элемента, а не сам ref
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

        // Если API уже загружен, или как только он загрузится, инициализируем виджет
        if (vkApiLoaded) {
            initializeWidget();
        }

        // Если playlistId или accessKey меняются, и API уже загружено, переинициализируем
    }, [vkApiLoaded, playlistId, accessKey]);

    return <div id={uniqueId.current} />; // Привязываем div к уникальному ID
}
