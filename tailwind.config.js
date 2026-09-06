/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Karla', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
        hand:  ['Caveat', 'ui-serif', 'cursive'],
      },
      colors: {
        paper: '#f4efe3',
        sheet: '#fbf8f1',
        tab:   '#e9e1cf',
        rule:  '#ddd2ba',
        ink:   { DEFAULT: '#2e2a24', soft: '#6f675a', faint: '#8d8471' },
        pen:   '#8a5a3c',
      },
    },
  },
  plugins: [],
};
