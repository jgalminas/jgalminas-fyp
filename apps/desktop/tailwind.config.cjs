/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      screens: {
        '2lg': '1152px',
        '1.5xl': '1408px'
      },
      borderRadius: {
        'sm2': '0.188rem'
      },
      colors: {
        'woodsmoke': {
          '50': '#2B2F37',
          '100': '#282C33',
          '200': '#25292F',
          '300': '#22262B',
          '400': '#202328',
          '500': '#1D2024',
          '600': '#1A1C20',
          '700': '#17191C',
          '800': '#151619',
          '900': '#121315',
        },
        'science-blue': {
          '50': '#F0F7FF',
          '100': '#E0EEFE',
          '200': '#B9DCFE',
          '300': '#7CC0FD',
          '400': '#36A2FA',
          '500': '#0C86EB',
          '600': '#0068CA',
          '700': '#0152A3',
          '800': '#064686',
          '900': '#0B3B6F',
          '950': '#07254A'
        },
        'star-dust': {
          '50': '#F6F6F6',
          '100': '#E7E7E7',
          '200': '#D1D1D1',
          '300': '#B0B0B0',
          '400': '#999999',
          '500': '#6D6D6D',
          '600': '#5D5D5D',
          '700': '#4F4F4F',
          '800': '#454545',
          '900': '#3D3D3D',
          '950': '#262626'
        },
        'accent': {
          'red': '#FF3B3A',
          'blue': '#0068CA',
          'green': '#01A86C'
        },
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    }
  },
  plugins: [],
}