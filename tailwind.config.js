/** @type {import('tailwindcss').Config} */
export const content = [
    ".src/app/**/*.{js,ts,jsx,tsx}",
    ".src/app/**/*.{js,ts,jsx,tsx}", // Asegúrate de que Tailwind busque las clases en todos los archivos que contienen JSX
];
export const theme = {
    extend: {},
};
export const plugins = [];