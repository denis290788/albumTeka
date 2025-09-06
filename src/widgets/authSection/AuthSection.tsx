"use client";

import { AuthForm, useAuth } from "@/features/auth";
import { Github, Mail, UserCircle } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@/shared/ui/ActionButton";
import { AddToHomeScreenButton } from "@/features/addToHomeScreen";

const AuthSection = forwardRef<HTMLDivElement>((props, ref) => {
    const { login } = useAuth();
    const { t } = useTranslation();

    return (
        <section
            ref={ref}
            className="lg:h-[calc(100vh-90px)] px-4 flex flex-col lg:scroll-mt-0 lg:flex-row lg:gap-20 lg:justify-around"
        >
            <div className="py-16 lg:py-0 flex-1 min-h-screen lg:min-h-0 flex items-center justify-center lg:justify-end">
                <div className="w-full max-w-md">
                    <AuthForm />
                </div>
            </div>

            <div className="pb-8 lg:pb-0 flex-1 min-h-[calc(100vh-90px)] lg:pt-[18px] lg:min-h-0 flex flex-col items-center lg:items-start justify-center gap-6">
                <div className="w-full max-w-md flex justify-center">
                    <h2 className="text-3xl font-bold">{t("authSection_title")}</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <ActionButton
                        icon={
                            <Github
                                style={{ width: "2rem", height: "2rem" }}
                                className="lg:w-10 lg:h-10"
                            />
                        }
                        label="GitHub"
                        href="https://github.com/denis290788/albumTeka"
                    />
                    <ActionButton
                        icon={
                            <Mail
                                style={{ width: "2rem", height: "2rem" }}
                                className="lg:w-10 lg:h-10"
                            />
                        }
                        label="Email"
                        href="mailto:denis290788@gmail.com"
                    />
                    <ActionButton
                        icon={
                            <UserCircle
                                style={{ width: "2rem", height: "2rem" }}
                                className="lg:w-10 lg:h-10"
                            />
                        }
                        label={t("authSection_demo")}
                        onClick={() => login("demo@demo.ru", "123456")}
                    />
                    <AddToHomeScreenButton />
                </div>
            </div>
        </section>
    );
});

AuthSection.displayName = "AuthSection";

export default AuthSection;
