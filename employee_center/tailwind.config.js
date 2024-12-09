/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app.html",
    "./src/**.*{js,ts,jsx,tsx,html,svelte}",
    "./src/**/**.*{js,ts,jsx,tsx,html,svelte}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

