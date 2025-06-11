"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddFolderForm } from "../features/addFolderForm";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";

export function Header() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth");
        } catch (error) {
            console.error("Ошибка выхода:", error);
            alert("Не удалось выйти. Попробуйте еще раз.");
        }
    };

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b">
            <Link href="/" className="text-2xl font-bold">
                album<span className="text-primary">Teka</span>
            </Link>

            {/* <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Добавить папку
                </Button>
                <Link href="/add">
                    <Button>Добавить альбом</Button>
                </Link>
            </div> */}

            <div className="flex gap-2">
                {user && (
                    <>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            Добавить папку
                        </Button>
                        <Link href="/add">
                            <Button>Добавить альбом</Button>
                        </Link>
                    </>
                )}
            </div>

            {user ? (
                <Button variant="destructive" onClick={handleLogout}>
                    Выйти
                </Button>
            ) : (
                <Link href="/auth">
                    <Button variant="default">Войти</Button>
                </Link>
            )}

            <AddFolderForm open={open} onOpenChange={setOpen} />
        </header>
    );
}
