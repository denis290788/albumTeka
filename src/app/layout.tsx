import type { Metadata } from "next";
import "./globals.css";
import { FoldersProvider } from "./context/FoldersContext";

export const metadata: Metadata = {
    title: "AlbumTeka",
    description: "Your audioteka",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <FoldersProvider>
                    <div className="bg-amber-300 min-h-screen">{children}</div>
                </FoldersProvider>
            </body>
        </html>
    );
}
