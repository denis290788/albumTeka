import { FieldValues, Path, UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { StreamType } from "@/entities/album/model/albumsApi";

export async function resolveStreamUrl<T extends FieldValues>(
    streamType: StreamType,
    url: string,
    clearErrors: UseFormClearErrors<T>,
    setError: UseFormSetError<T>,
    t: (key: string) => string
): Promise<string | null> {
    let processedUrl = url;

    if (streamType === "Bandcamp") {
        clearErrors("streamUrl" as Path<T>);
        try {
            const res = await fetch("/api/bandcamp/resolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || t("addStreamForm_error_streamUrl_pattern"));
            }

            processedUrl = json.embedUrl;
        } catch (err) {
            console.error("Ошибка при запросе к Bandcamp API:", err);
            setError("streamUrl" as Path<T>, {
                type: "manual",
                message: t("addStreamForm_error_streamUrl_pattern"),
            });
            return null;
        }
    }

    return processedUrl;
}
