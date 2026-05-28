import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SWV Meubel brand palette: warme creme/wit met houttinten
        bone: {
          50: '#FBF8F3',
          100: '#F6F0E5',
          200: '#EDE3D0',
          300: '#E0D2B5',
          400: '#CDB991',
        },
        wood: {
          50: '#F7EFE3',
          100: '#EDD9BD',
          200: '#D9B98A',
          300: '#B8915C',
          400: '#956E3F',
          500: '#73522C',
          600: '#5A3F22',
          700: '#42301B',
          800: '#2D2113',
          900: '#1C140C',
        },
        accent: {
          green: '#5C7A4E',
          rose: '#B6605A',
          amber: '#C99146',
          stone: '#7A6F61',
        },
        ink: {
          900: '#231A12',
          800: '#33271B',
          700: '#4A3A28',
          600: '#5F4E3B',
          500: '#7B6A55',
          400: '#9A8A75',
          300: '#B9AC97',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Inter', 'sans-serif'],
        display: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(60, 40, 20, 0.04), 0 8px 24px rgba(60, 40, 20, 0.06)',
        soft: '0 1px 2px rgba(60, 40, 20, 0.04)',
        ring: '0 0 0 4px rgba(184, 145, 92, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
