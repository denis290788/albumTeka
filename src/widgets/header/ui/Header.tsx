"use client";

import Link from "next/link";
import { useState } from "react";
import { LoginButton } from "@/features/auth";
import { ThemeToggle } from "@/features/themeToggle";
import { LanguageToggle } from "@/features/languageToggle";
import { MobileMenuSheet } from "../../menuSheet";
import { UserActions } from "../../userActions";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 h-[65px] lg:h-[90px] flex items-center justify-between px-4 bg-[linear-gradient(180deg,rgba(74,199,124,0.8),rgba(223,230,233,0.8))] backdrop-blur-sm overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.15)] dark:bg-[linear-gradient(180deg,rgba(74,199,124,0.8),rgba(52,73,94,0.8))] dark:text-background">
            <Link
                href="/"
                className="text-2xl lg:text-4xl"
                style={{ fontFamily: "Syncopate, sans-serif" }}
            >
                album<span className="font-bold">TEKA</span>
            </Link>

            <div className="hidden lg:flex gap-2 items-center">
                <UserActions layout="desktop" />
                <ThemeToggle />
                <LanguageToggle />
                <LoginButton />
            </div>

            <MobileMenuSheet
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
        </header>
    );
}
