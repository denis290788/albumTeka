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
import { ThemeToggle } from "./ThemeToggle";
import { SearchInput } from "./SearchInput";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./LanguageToggle";

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
    const { t } = useTranslation();

    return (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex flex-col 
                    bg-[linear-gradient(315deg,rgba(74,199,124,0.8),rgba(223,230,233,0.8))]
                    overflow-hidden
                    dark:bg-[linear-gradient(300deg,rgba(52,73,94,0.8),rgba(74,199,124,0.8))]
                    dark:text-background
                    p-2"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>{t("mobile_menu_title")}</SheetTitle>
                    <SheetDescription>{t("mobile_menu_description")}</SheetDescription>
                </SheetHeader>
                <div className="flex justify-items-start items-center gap-2">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>

                {user && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 md:gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 text-foreground"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push("/add");
                                }}
                            >
                                <Disc3 className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 flex gap-2 md:gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddFolderModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex-1 text-foreground"
                                >
                                    <Folder className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <SearchInput />
                        <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-150px)] px-[6px]">
                            <FolderList />
                        </div>
                    </div>
                )}
                <div className="mt-auto pb-2">
                    {user ? (
                        <Button variant="destructive" onClick={handleLogout} className="w-full">
                            {t("mobile_menu_logout")}
                        </Button>
                    ) : (
                        <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="default" className="w-full">
                                {t("mobile_menu_login")}
                            </Button>
                        </Link>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
