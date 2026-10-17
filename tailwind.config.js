/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AgroShare Brand Colors
        primary: {
          50:  '#f0faf0',
          100: '#dcf5dc',
          200: '#bbecbb',
          300: '#8ddc8d',
          400: '#5ac45a',
          500: '#37a837',
          600: '#2a8c2a',
          700: '#1e6b1e', // Deep forest green - main brand color
          800: '#195519',
          900: '#154515',
          950: '#0a240a',
        },
        secondary: {
          50:  '#f2fbf2',
          100: '#e0f7e0',
          200: '#c2efc2',
          300: '#94e094',
          400: '#5fcb5f', // Fresh leaf green
          500: '#39b539',
          600: '#2a962a',
          700: '#237523',
          800: '#1e5e1e',
          900: '#1a4e1a',
          950: '#0a2a0a',
        },
        accent: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Golden yellow accent
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        neutral: {
          50:  '#fafaf7', // Warm off-white background
          100: '#f4f4ee',
          200: '#e8e8de',
          300: '#d4d4c5',
          400: '#b5b5a0',
          500: '#94947c',
          600: '#787862',
          700: '#5e5e4c',
          800: '#4a4a3c',
          900: '#2d2d24', // Dark charcoal text
          950: '#1a1a12',
        },
        earth: {
          100: '#f7f0e6',
          200: '#ede0cc',
          300: '#d9c29a',
          400: '#c4a068',
          500: '#a87c3a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.10), 0 2px 6px 0 rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 60px -10px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(30,107,30,0.85) 0%, rgba(42,140,42,0.75) 100%)",
        'card-gradient': "linear-gradient(135deg, #f0faf0 0%, #fafaf7 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
