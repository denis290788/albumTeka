"use client";

import { NeatConfig, NeatGradient } from "@firecms/neat";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const neatConfig: NeatConfig = {
    colors: [
        { color: "#34495E", enabled: true },
        { color: "#4AC77C", enabled: true },
        { color: "#34495E", enabled: true },
        { color: "#4AC77C", enabled: true },
        { color: "#7F8C8D", enabled: true },
    ],
    speed: 4,
    horizontalPressure: 7,
    verticalPressure: 3,
    waveFrequencyX: 0,
    waveFrequencyY: 0,
    waveAmplitude: 0,
    shadows: 6,
    highlights: 0,
    colorBrightness: 1.65,
    colorSaturation: 0,
    wireframe: false,
    colorBlending: 5,
    backgroundColor: "#7F8C8D",
    backgroundAlpha: 1,
    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 0,
    resolution: 1,
    yOffset: 0,
};

export default function HeroSection({ onStartClick }: { onStartClick: () => void }) {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const neat = new NeatGradient({
                ref: canvasRef.current,
                ...neatConfig,
            });

            return () => neat.destroy();
        }
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />
            <div className="relative z-10 px-4">
                <h1
                    className="text-[clamp(2.5rem,8vw,9.375rem)] text-center text-foreground/50"
                    style={{ fontFamily: "Syncopate, sans-serif" }}
                >
                    album<span className="font-bold">TEKA</span>
                </h1>
                <p className="text-lg md:text-3xl mb-6 font-extralight text-muted-foreground/70">
                    {t("hero_section_description")}
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={onStartClick}
                        variant="hero"
                        className="hover:dark:bg-muted-foreground/30 font-extralight text-2xl p-4 md:text-4xl md:p-8"
                    >
                        {t("hero_section_start")}
                    </Button>
                </div>
            </div>
        </section>
    );
}
