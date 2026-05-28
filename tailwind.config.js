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
      // Neuton: serif editorial de transición, lectura cálida tipo revista.
      fontFamily: {
        display: ['Neuton_700Bold'],
        editorial: ['Neuton_400Regular'],
        'editorial-italic': ['Neuton_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
