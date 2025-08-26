import { useRef } from "react";
import AuthSection from "./AuthSection";
import HeroSection from "./HeroSection";
import VideoCarousel from "./VideoCarousel";

export default function WelcomePage() {
    const authRef = useRef<HTMLDivElement | null>(null);
    return (
        <>
            <HeroSection
                onStartClick={() => authRef.current?.scrollIntoView({ behavior: "smooth" })}
            />
            <VideoCarousel />
            <AuthSection ref={authRef} />
        </>
    );
}
