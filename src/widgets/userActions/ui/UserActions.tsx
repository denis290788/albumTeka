"use client";

import { Button } from "@/shared/ui/button";
import { SearchInput } from "@/features/searchInput";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FolderForm } from "@/features/folderForm";
import { Disc3, Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

interface UserActionsProps {
    layout: "desktop" | "mobile";
    onAction?: () => void;
}

export function UserActions({ layout, onAction }: UserActionsProps) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();

    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

    if (!user) return;

    return (
        <>
            {layout === "desktop" ? (
                <div className="flex gap-2 items-center">
                    <SearchInput />
                    <Button variant="outline" onClick={() => router.push("/add")}>
                        {t("addAlbum")}
                    </Button>

                    <Button variant="outline" onClick={() => setIsAddFolderModalOpen(true)}>
                        {t("addFolder")}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 md:gap-4">
                        <Button
                            variant="outline"
                            className="flex-1 text-foreground"
                            onClick={() => {
                                router.push("/add");
                                onAction?.();
                            }}
                        >
                            <Disc3 className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 flex gap-2 md:gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddFolderModalOpen(true);
                                    onAction?.();
                                }}
                                className="flex-1 text-foreground"
                            >
                                <Folder className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <SearchInput />
                </div>
            )}
            <FolderForm
                open={isAddFolderModalOpen}
                onOpenChange={setIsAddFolderModalOpen}
                mode="create"
            />
        </>
    );
}
