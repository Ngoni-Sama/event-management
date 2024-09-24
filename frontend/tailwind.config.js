/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],  // Specify the files Tailwind should scan for class names
  theme: {
    extend: {},  // Extend the default theme if needed
  },
  plugins: [],  // Add any plugins if required
};