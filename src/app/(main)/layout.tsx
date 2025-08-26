import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchProvider } from "@/components/SearchContext";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SearchProvider>
            <div className="flex flex-col min-h-full">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </SearchProvider>
    );
}
