/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./public/**/*.html",
    ],
    theme: {
        extend: {
            fontFamily: {
                gruppo: ['"Gruppo"', "sans-serif"],
                sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
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
