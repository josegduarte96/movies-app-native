const { colors } = require('./config/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './presentation/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta editorial: fuente única en config/theme/colors.js.
      colors,
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
