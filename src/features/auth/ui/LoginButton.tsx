"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
    fullWidth?: boolean;
}

export function LoginButton({ fullWidth = false }: LoginButtonProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (user) {
        return (
            <Button
                variant="destructive"
                className={fullWidth ? "w-full" : ""}
                onClick={handleLogout}
            >
                {t("logout")}
            </Button>
        );
    }

    return (
        <Link href="/auth" className={fullWidth ? "w-full" : ""}>
            <Button className={fullWidth ? "w-full" : ""}>{t("login")}</Button>
        </Link>
    );
}
