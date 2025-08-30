"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function LanguageToggle() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const toggleLanguage = () => {
        const newLang = i18n.language === "ru" ? "en" : "ru";
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            {i18n.language === "ru" ? "EN" : "RU"}
        </Button>
    );
}
