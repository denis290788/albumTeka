import MainLayout from "./(main)/layout";
import Link from "next/link";

export default function NotFound() {
    return (
        <MainLayout>
            <p className="text-muted-foreground text-2xl mx-auto pt-[90px] lg:pt-[115px]">
                Кажется ты заблудился:/ Вернемся{" "}
                <span>
                    <Link href={"/"} className="text-foreground">
                        на главную?
                    </Link>
                </span>
            </p>
        </MainLayout>
    );
}
