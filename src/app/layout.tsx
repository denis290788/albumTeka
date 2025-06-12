import "./globals.css";
import { ReactNode } from "react";
import { AppStore } from "./_providers/store/AppStore";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Gruppo, Open_Sans } from "next/font/google";

const gruppo = Gruppo({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-gruppo",
    weight: "400",
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
        <html lang="en" className={`${gruppo.variable} ${openSans.variable} h-full`}>
            <body className="antialiased h-full font-sans bg-[#dfe6e9]">
                <AppStore>
                    <AuthProvider>{children}</AuthProvider>
                </AppStore>
            </body>
        </html>
    );
}
