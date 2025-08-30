"use client";

import { useTranslation } from "react-i18next";
import MainLayout from "./(main)/layout";
import Link from "next/link";

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <div className="max-w-[1440px] mx-auto pt-[90px] lg:pt-[115px] pb-8 px-4 xl:px-16">
                <p className="text-muted-foreground text-2xl">
                    {t("notFound_message")}{" "}
                    <span>
                        <Link href={"/"} className="text-foreground">
                            {t("notFound_backHome")}
                        </Link>
                    </span>
                </p>
            </div>
        </MainLayout>
    );
}
