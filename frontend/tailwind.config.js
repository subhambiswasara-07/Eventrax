/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        void: '#0B1020',
        sunbeam: '#DDF7EF',
        flare: '#6D5DFB',
        electric: '#12B8A6',
        paper: '#EEF2FF',
        chalk: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        halftone: 'radial-gradient(circle, rgba(31,27,36,0.14) 1.4px, transparent 1.4px)',
      },
      backgroundSize: {
        halftone: '10px 10px',
      },
      boxShadow: {
        stub: '0 18px 50px rgba(17,24,39,0.10)',
        'stub-sm': '0 8px 24px rgba(17,24,39,0.10)',
      },
      keyframes: {
        marquee: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '80px 0' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.92) translateY(6px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 4s linear infinite',
        popIn: 'popIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
