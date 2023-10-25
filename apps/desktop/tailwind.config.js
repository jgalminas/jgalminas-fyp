/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cornflower-blue': {
          '50': '#f0f5fe',
          '100': '#dde8fc',
          '200': '#c3d7fa',
          '300': '#9abff6',
          '400': '#72a2f0',
          '500': '#487ae9',
          '600': '#335ddd',
          '700': '#2a49cb',
          '800': '#283da5',
          '900': '#263882',
          '950': '#1b2350',
        }
      }
    },
  },
  plugins: [],
}

