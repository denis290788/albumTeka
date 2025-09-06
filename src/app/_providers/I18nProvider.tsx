"use client";

import { ReactNode } from "react";
import "@/shared/lib/i18n/i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
