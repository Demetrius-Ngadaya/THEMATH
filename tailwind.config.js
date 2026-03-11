/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,jsx}',
        './src/components/**/*.{js,jsx}',
        './src/app/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
            },
        },
    },
    plugins: [],
}