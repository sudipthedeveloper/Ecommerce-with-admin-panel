/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",
        "base-light": "#f1f5f2", // Whitish light green
        "base-dark": "#d4d9d6", // Soft grayish green
      },
      backgroundImage: {
        "gradient-base": "linear-gradient(to bottom, #f1f5f2, #d4d9d6)",
      },
    },
  },
  plugins: [],
};
