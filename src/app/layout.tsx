import "./globals.css";
import { ReactNode } from "react";
import { AppStore } from "./_providers/store/AppStore";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Syncopate, Open_Sans } from "next/font/google";

const syncopate = Syncopate({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-syncopate",
});

const openSans = Open_Sans({
    subsets: ["cyrillic", "latin"],
    display: "swap",
    variable: "--font-open-sans",
});

export const metadata = {
    title: "AlbumTeka",
    description: "Your audioteka",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={`${syncopate.variable} ${openSans.variable} h-full`}>
            <body className="antialiased h-full font-sans bg-background text-foreground">
                <AppStore>
                    <AuthProvider>{children}</AuthProvider>
                </AppStore>
            </body>
        </html>
    );
}
