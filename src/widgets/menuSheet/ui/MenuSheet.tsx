"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/ui/sheet";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/features/themeToggle";
import { LanguageToggle } from "@/features/languageToggle";
import { FolderList } from "../../folderList";
import { LoginButton } from "@/features/auth";
import { UserActions } from "@/widgets/userActions";

interface MobileMenuSheetProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export function MobileMenuSheet({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuSheetProps) {
    const { t } = useTranslation();
    const pathname = usePathname();

    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

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

                <div className="flex flex-col gap-4">
                    <UserActions layout="mobile" />
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-150px)] px-[6px]">
                        <FolderList />
                    </div>
                </div>

                <div className="mt-auto pb-2">
                    <LoginButton fullWidth />
                </div>
            </SheetContent>
        </Sheet>
    );
}
