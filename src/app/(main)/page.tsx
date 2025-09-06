"use client";

import { useAuth } from "@/features/auth";
import { useRef } from "react";
import HeroSection from "@/widgets/heroSection/HeroSection";
import VideoCarousel from "@/widgets/videoCarousel/VideoCarousel";
import AuthSection from "@/widgets/authSection/AuthSection";
import { AlbumList } from "@/widgets/albumList";
import { FolderList } from "@/widgets/folderList";

export default function HomePage() {
    const { user } = useAuth();
    const authRef = useRef<HTMLDivElement | null>(null);

    if (!user) {
        return (
            <div className="max-w-full">
                <HeroSection
                    onStartClick={() => authRef.current?.scrollIntoView({ behavior: "smooth" })}
                />
                <VideoCarousel />
                <AuthSection ref={authRef} />
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto pt-[90px] lg:pt-[115px] pb-8 px-4 xl:px-16">
            <FolderList className="hidden lg:flex" />
            <AlbumList />
        </div>
    );
}
