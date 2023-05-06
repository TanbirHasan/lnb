/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark:{
          84818:'#84818A',
          47464:'#47464A',
          202020:'#202020',
          19263:'#19263F',
        },
        primary:'#D16F32',
        primaryHover:'#c76224',
        secondary:{
          10:'#A8C6DF',
          700:'#3294D1'
        },
        orange:'#3294D1',
      }
    },
  },
  plugins: [],
};
