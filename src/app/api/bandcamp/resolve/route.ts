import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.includes("bandcamp.com")) {
        return NextResponse.json({ error: "Неверная ссылка Bandcamp." }, { status: 400 });
    }

    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Ошибка при запросе к Bandcamp: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                { error: `Ошибка при запросе к Bandcamp: ${res.status} ${res.statusText}` },
                { status: res.status }
            );
        }

        const html = await res.text();

        const metaPlayerRegex =
            /<meta[^>]*property="(?:twitter:player|og:video)"[^>]*content="[^"]*(?:album|track)=(\d+)[^"]*"/;

        let id: string | null = null;
        let contentType: "album" | "track" | null = null;

        const match = html.match(metaPlayerRegex);
        if (match && match[1]) {
            id = match[1];
            if (match[0].includes("album=")) {
                contentType = "album";
            } else if (match[0].includes("track=")) {
                contentType = "track";
            }
        }

        if (id && contentType) {
            const embedUrl = `https://bandcamp.com/EmbeddedPlayer/${contentType}=${id}`;
            return NextResponse.json({ embedUrl });
        } else {
            return NextResponse.json(
                {
                    error: "Не удалось найти ID или определить тип (альбом/трек) Bandcamp. Убедитесь, что это ссылка на альбом или трек.",
                },
                { status: 404 }
            );
        }
    } catch (err) {
        console.error("Ошибка при получении Bandcamp-страницы:", err);
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера при обработке запроса Bandcamp." },
            { status: 500 }
        );
    }
}
