"use client";

import { useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { motion, useDragControls } from "framer-motion";
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
    const dragControls = useDragControls();

    const handleSwipe = (swipeDirection: string) => {
        if (swipeDirection === "left") {
            setCurrent((prev) => (prev === videoSources.length - 1 ? 0 : prev + 1));
        } else if (swipeDirection === "right") {
            setCurrent((prev) => (prev === 0 ? videoSources.length - 1 : prev - 1));
        }
    };

    return (
        <section className="relative max-w-7xl px-4 mx-auto min-h-[calc(100dvh-65px)] lg:min-h-[calc(100dvh-90px)] flex flex-col bg-background overflow-hidden pt-18">
            <div className="flex-1 flex flex-col justify-center items-center gap-16 md:gap-8">
                <div className="w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
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

                <motion.div
                    className="h-48 md:h-42 flex items-center justify-center p-0 w-full max-w-5xl mx-auto flex-shrink-0 touch-none"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragControls={dragControls}
                    onDragEnd={(event, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x > swipeThreshold) {
                            handleSwipe("right");
                        } else if (info.offset.x < -swipeThreshold) {
                            handleSwipe("left");
                        }
                    }}
                    style={{ touchAction: "pan-y" }}
                >
                    <motion.p
                        key={current}
                        initial={{ opacity: 0, x: 50, filter: "blur(8px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -50, filter: "blur(8px)" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-md md:text-xl text-muted-foreground font-extralight text-center"
                    >
                        {t(`video_caption_${current + 1}`)}
                    </motion.p>
                </motion.div>
            </div>

            <div className="flex justify-center gap-8 flex-shrink-0">
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
