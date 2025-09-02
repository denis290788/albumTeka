"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("✅ Service Worker registered", reg))
                .catch((err) => console.error("❌ SW registration failed", err));
        }
    }, []);

    return null;
}
