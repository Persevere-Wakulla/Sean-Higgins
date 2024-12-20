/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app.html",
    "./src/**.*{js,ts,jsx,tsx,html,svelte}",
    "./src/**/**.*{js,ts,jsx,tsx,html,svelte}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}

