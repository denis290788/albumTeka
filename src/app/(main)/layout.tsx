import { SearchProvider } from "@/app/_providers/SearchContext";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

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
