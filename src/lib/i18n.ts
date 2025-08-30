import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../lib/locales/en.json";
import ru from "../lib/locales/ru.json";

const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") : null;

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ru: { translation: ru },
    },
    lng: savedLanguage || "ru",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18n;
