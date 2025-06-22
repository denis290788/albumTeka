/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // Используем class-based темную тему
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./public/**/*.html",
    ],
    theme: {
        extend: {
            fontFamily: {
                syncopate: "var(--font-syncopate)",
                sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: {
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                destructive: "var(--destructive)",
            },
        },
        screens: {
            sm: "360px",
            md: "768px",
            lg: "1024px",
            xl: "1440px",
        },
    },
    plugins: [],
};
