"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddFolderForm } from "../features/addFolderForm";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { MobileMenuSheet } from "./MenuSheet";

export function Header() {
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth");
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 h-[75px] lg:h-[100px] flex items-center justify-between px-4 bg-[linear-gradient(180deg,#4ac77c,#dfe6e9)] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
            <Link href="/" className="text-4xl" style={{ fontFamily: "Gruppo, sans-serif" }}>
                album<span className="text-primary font-bold">TEKA</span>
            </Link>

            <div className="hidden lg:flex gap-2 items-center">
                {user && (
                    <>
                        <Button variant="outline" onClick={() => setIsAddFolderModalOpen(true)}>
                            Добавить папку
                        </Button>
                        <Link href="/add">
                            <Button>Добавить альбом</Button>
                        </Link>
                    </>
                )}
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
