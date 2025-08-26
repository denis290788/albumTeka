"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddFolderForm } from "../features/addFolderForm";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { MobileMenuSheet } from "./MenuSheet";
import { ThemeToggle } from "./ThemeToggle";
import { SearchInput } from "./SearchInput";

export function Header() {
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

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
                {user && (
                    <>
                        <SearchInput />
                        <Link href="/add">
                            <Button variant="outline">Добавить альбом</Button>
                        </Link>
                        <Button variant="outline" onClick={() => setIsAddFolderModalOpen(true)}>
                            Добавить папку
                        </Button>
                    </>
                )}
                <ThemeToggle />
                {user ? (
                    <Button variant="destructive" onClick={handleLogout}>
                        Выйти
                    </Button>
                ) : (
                    <Link href="/auth">
                        <Button variant="default">Войти</Button>
                    </Link>
                )}
            </div>

            <MobileMenuSheet
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                setIsAddFolderModalOpen={setIsAddFolderModalOpen}
                user={user}
                handleLogout={handleLogout}
                router={router}
            />

            <AddFolderForm open={isAddFolderModalOpen} onOpenChange={setIsAddFolderModalOpen} />
        </header>
    );
}
