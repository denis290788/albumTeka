"use client";

import { useAuth } from "@/features/auth";
import { AlbumList } from "../../components/AlbumList";
import { FolderList } from "../../components/FolderList";
import WelcomePage from "@/components/WelcomePage";

export default function HomePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="max-w-full">
                <WelcomePage />
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
