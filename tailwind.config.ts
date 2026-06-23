import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SWV Meubel huisstijl — primair oranje (#EC6806), secundair navy,
        // ondersteund door warme wood/bone neutrals voor cards en backgrounds.
        primary: {
          50: '#FFF4EB',
          100: '#FFE2C8',
          200: '#FFC691',
          300: '#FFA354',
          400: '#FA8527',
          500: '#EC6806',
          600: '#C75500',
          700: '#9F4502',
          800: '#7A3601',
          900: '#542500',
        },
        navy: {
          50: '#F1F4F8',
          100: '#D9E1ED',
          200: '#B3C2D6',
          300: '#7D93B3',
          400: '#4A6890',
          500: '#284870',
          600: '#1B3559',
          700: '#142844',
          800: '#0E1B2D',
          900: '#070D17',
        },
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
        ink: {
          900: '#1A1A1A',
          800: '#2D2D2D',
          700: '#4A4A4A',
          600: '#6B6B6B',
          500: '#8C8C8C',
          400: '#A8A8A8',
          300: '#C5C5C5',
        },
        accent: {
          green: '#198754',
          rose: '#B6605A',
          amber: '#C99146',
          stone: '#7A6F61',
        },
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-pt-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(60, 40, 20, 0.04), 0 8px 24px rgba(60, 40, 20, 0.06)',
        soft: '0 1px 2px rgba(60, 40, 20, 0.04)',
        ring: '0 0 0 4px rgba(236, 104, 6, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;

