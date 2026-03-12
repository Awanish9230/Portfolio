/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#4f46e5", // Indigo 600
                secondary: "#64748b", // Slate 500
                background: {
                    light: '#F9FAFB',
                    dark: '#09090b'
                },
                surface: {
                    light: '#FAFAFA',
                    dark: '#171717'
                },
                text: {
                    light: '#111827',
                    dark: '#ffffff'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
