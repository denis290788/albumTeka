import Link from "next/link";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            className="h-[65px] lg:h-[90px] flex items-center-safe justify-end px-4 bg-[linear-gradient(0deg,#4ac77c,#dfe6e9)] overflow-hidden text-[12px] lg:text-[20px]"
            style={{ fontFamily: "Syncopate, sans-serif" }}
        >
            © {year}
            {"\u00A0"}
            <span>
                album
                <span className="font-bold">TEKA</span>
            </span>
            {"\u00A0"}— by{"\u00A0"}
            <Link
                href={"https://github.com/denis290788"}
                className="underline decoration-[1.5px] underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
            >
                denis290788
            </Link>
        </footer>
    );
}
