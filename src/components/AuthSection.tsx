"use client";

import { Button } from "@/components/ui/button";
import { useAddToHomeScreen } from "@/features/addToHomeScreen/useAddToHomeScreen";
import { AuthForm, useAuth } from "@/features/auth";
import { Github, Mail, MonitorSmartphone, UserCircle } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

const AuthSection = forwardRef<HTMLDivElement>((props, ref) => {
    const { login } = useAuth();
    const { t } = useTranslation();
    const { isVisible, handleAddToHomeScreen } = useAddToHomeScreen();

    return (
        <section
            ref={ref}
            className="md:h-[calc(100vh-90px)] px-4 flex flex-col md:scroll-mt-0 md:flex-row md:gap-20 md:justify-around"
        >
            <div className="flex-1 min-h-screen md:min-h-0 flex items-center justify-center md:justify-end">
                <div className="w-full max-w-md">
                    <AuthForm />
                </div>
            </div>

            <div className="flex-1 min-h-[calc(100vh-90px)] md:pt-4 md:min-h-0 flex flex-col items-center md:items-start justify-center gap-6">
                <div className="w-full max-w-md flex justify-center">
                    <h2 className="text-3xl font-bold">{t("authSection_title")}</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Button
                        variant="heroAlt"
                        className="h-24 md:h-30 flex flex-col items-center justify-center gap-2 p-2"
                    >
                        <Link
                            href="https://github.com/denis290788/albumTeka"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-2 p-2"
                        >
                            <Github
                                style={{ width: "2rem", height: "2rem" }}
                                className="md:w-10 md:h-10"
                            />
                            <span className="text-xs md:text-sm text-center">GitHub</span>
                        </Link>
                    </Button>
                    <Button
                        variant="heroAlt"
                        className="h-24 md:h-30 flex flex-col items-center justify-center gap-2 p-2"
                    >
                        <Link
                            href="mailto:denis290788@gmail.com"
                            className="flex flex-col items-center justify-center gap-2 p-2"
                        >
                            <Mail
                                style={{ width: "2rem", height: "2rem" }}
                                className="md:w-10 md:h-10"
                            />
                            <span className="text-xs md:text-sm text-center">Email</span>
                        </Link>
                    </Button>
                    <Button
                        onClick={() => login("demo@demo.ru", "123456")}
                        variant="heroAlt"
                        className="h-24 md:h-30 flex flex-col items-center justify-center gap-2 p-2"
                    >
                        <UserCircle
                            style={{ width: "2rem", height: "2rem" }}
                            className="md:w-10 md:h-10"
                        />
                        <span className="text-xs md:text-sm text-center">
                            {t("authSection_demo")}
                        </span>
                    </Button>
                    <Button
                        onClick={handleAddToHomeScreen}
                        variant="heroAlt"
                        className="h-24 md:h-30 flex flex-col items-center justify-center gap-2 p-2"
                        disabled={!isVisible}
                    >
                        <MonitorSmartphone
                            style={{ width: "2rem", height: "2rem" }}
                            className="md:w-10 md:h-10"
                        />
                        <span className="text-xs md:text-sm text-center">
                            {t("authSection_install")}
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    );
});

AuthSection.displayName = "AuthSection";

export default AuthSection;
