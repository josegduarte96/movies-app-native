/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './presentation/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // Paleta editorial vía variables CSS: el ThemeProvider inyecta los
      // tripletes RGB con vars() según el modo (light/dark/system), por lo que
      // bg-paper / text-ink / border-line cambian solos. Valores en
      // config/theme/colors.js (fuente única de verdad para el runtime).
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
        },
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          soft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
        },
      },
      // Lora: serif calligráfica contemporánea, métricas limpias en pantalla.
      fontFamily: {
        display: ['Lora_700Bold'],
        editorial: ['Lora_400Regular'],
        'editorial-italic': ['Lora_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
