"use client";

import { useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const videoSources = [
    "https://github.com/user-attachments/assets/e86beced-45a4-43e1-8639-7491c36aaf3e",
    "https://github.com/user-attachments/assets/ec991222-a189-4c1f-b0b9-98df67f0ce51",
    "https://github.com/user-attachments/assets/a9ba4bdf-6b43-499d-9d1e-00f557c43092",
    "https://github.com/user-attachments/assets/7c393591-747c-4176-b2ae-93a1ce4b97e0",
    "https://github.com/user-attachments/assets/97cf44ba-ae28-4d31-ba1e-a42aa0a2e2eb",
    "https://github.com/user-attachments/assets/6d162819-25e9-4dd5-b1b7-0f2a42a1b876",
];

export default function VideoCarousel() {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);

    return (
        <section className="relative max-w-7xl px-4 mx-auto h-screen flex flex-col bg-background overflow-hidden py-12">
            <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Plyr
                    source={{
                        type: "video",
                        sources: [
                            {
                                src: videoSources[current],
                                type: "video/mp4",
                            },
                        ],
                    }}
                    options={{
                        controls: ["play-large", "fullscreen"],
                        autoplay: false,
                        muted: true,
                        loop: { active: true },
                        ratio: "16:9",
                    }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 md:p-0">
                <motion.p
                    key={current}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-md md:text-xl text-muted-foreground font-extralight text-center"
                >
                    {t(`video_caption_${current + 1}`)}
                </motion.p>
            </div>

            <div className="flex justify-center gap-8 pb-4 md:pb-8">
                {videoSources.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-4 h-4 rounded-full transition ${
                            idx === current ? "bg-foreground" : "bg-muted"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
