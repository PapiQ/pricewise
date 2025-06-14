/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E43030", // ✅ bg-primary
        primaryOrange: "#D48D3B", // ✅ bg-primaryOrange
        primaryGreen: "#3E9242", // ✅ bg-primaryGreen
        secondary: "#282828",
        gray200: "#EAECF0",
        gray300: "#D0D5DD",
        gray500: "#667085",
        gray600: "#475467",
        gray700: "#344054",
        gray900: "#101828",
        white100: "#F4F4F4",
        white200: "#EDF0F8",
        black100: "#3D4258",
        neutralBlack: "#23263B",
      },
    },
  },
  plugins: [],
};
