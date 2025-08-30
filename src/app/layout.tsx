import "./globals.css";
import { ReactNode } from "react";
import { AppStore } from "./_providers/store/AppStore";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Syncopate, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ServiceWorkerRegister } from "@/lib/ServiceWorkerRegister";
import { I18nProvider } from "./_providers/I18nProvider";

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
    description: "Your music collection",
    icons: {
        icon: [
            { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: "/icons/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${syncopate.variable} ${openSans.variable} h-full`}
        >
            <body
                className="antialiased h-full font-open-sans bg-background text-foreground"
                style={{ fontFamily: "var(--font-open-sans), sans-serif" }}
            >
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                    <AppStore>
                        <AuthProvider>
                            <I18nProvider>
                                {children}
                                <Toaster
                                    position="bottom-right"
                                    duration={3000}
                                    toastOptions={{
                                        classNames: {
                                            toast: "!bg-background/30 !text-foreground !border-0 !mb-[40px] backdrop-blur-sm",
                                            title: "!font-bold !font-open-sans",
                                            description: "!opacity-90",
                                            error: "!bg-red-500/20 backdrop-blur-sm",
                                        },
                                    }}
                                />
                            </I18nProvider>
                        </AuthProvider>
                    </AppStore>
                </ThemeProvider>
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}
