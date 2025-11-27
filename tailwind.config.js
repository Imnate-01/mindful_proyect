
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#eaf3ef", bg2: "#d7ebe4", surface: "#ffffff", surface2: "#f6faf8",
        text: "#2b3a36", muted: "#6b7f78", primary: "#2aa58c", primary700: "#1f7f6c",
        accent: "#ffdca8", danger: "#e65959"
      },
      boxShadow: { soft: "0 10px 24px rgba(20,40,40,.10), 0 2px 6px rgba(20,40,40,.08)" },
      borderRadius: { app: "16px" }
    },
  }, plugins: [],
}
