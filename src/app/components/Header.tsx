"use client";

import Link from "next/link";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AddFolderModal } from "./AddFolderModal";

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b">
            <Link href="/" className="text-2xl font-bold">
                album<span className="text-primary">Teka</span>
            </Link>

            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Добавить папку
                </Button>
                <Link href="/add">
                    <Button>Добавить альбом</Button>
                </Link>
            </div>

            <AddFolderModal open={open} onOpenChange={setOpen} />
        </header>
    );
}
