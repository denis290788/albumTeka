import "./globals.css";
import { ReactNode } from "react";
import { AppStore } from "./_providers/store/AppStore";
import { AuthProvider } from "@/features/auth/hooks/useAuth";

export const metadata = {
    title: "AlbumTeka",
    description: "Your audioteka",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AppStore>
                    <AuthProvider>
                        <div className="bg-amber-300 min-h-screen">{children}</div>
                    </AuthProvider>
                </AppStore>
            </body>
        </html>
    );
}
