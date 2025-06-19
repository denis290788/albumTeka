"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Folder, MenuIcon, Disc3 } from "lucide-react";
import { FolderList } from "./FolderList";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface MobileMenuSheetProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
    setIsAddFolderModalOpen: Dispatch<SetStateAction<boolean>>;
    user: User | null;
    handleLogout: () => Promise<void>;
    router: ReturnType<typeof useRouter>;
}

export function MobileMenuSheet({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAddFolderModalOpen,
    user,
    handleLogout,
    router,
}: MobileMenuSheetProps) {
    return (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col bg-background p-2">
                <SheetHeader className="sr-only">
                    <SheetTitle>Навигация</SheetTitle>
                    <SheetDescription>Навигация по сайту / Раздел с папками</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 pt-8">
                    {user && (
                        <div>
                            <div className="flex gap-4 mb-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddFolderModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex-1 text-foreground"
                                >
                                    <Folder className="h-4 w-4 mr-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1  text-foreground"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push("/add");
                                    }}
                                >
                                    <Disc3 className="h-4 w-4 mr-2" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-150px)] px-[6px]">
                                <FolderList />
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-auto">
                    {user ? (
                        <Button variant="destructive" onClick={handleLogout} className="w-full">
                            Выйти
                        </Button>
                    ) : (
                        <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="default" className="w-full">
                                Войти
                            </Button>
                        </Link>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
