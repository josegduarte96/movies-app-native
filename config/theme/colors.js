/**
 * Paleta editorial — fuente única de verdad de color.
 *
 * CommonJS a propósito: `tailwind.config.js` corre en Node plano (sin TS) y la
 * consume vía `require` para generar las clases NativeWind (bg-paper, text-ink,
 * text-ink-soft, text-accent…). El código RN la importa para props que NO
 * aceptan className: ActivityIndicator `color`, Stack `contentStyle`, etc.
 * Los tipos viven en `colors.d.ts` (mismo nombre) para no activar allowJs.
 *
 * lightColors = paleta clara (por defecto).
 * darkColors  = paleta oscura para el modo nocturno.
 *
 * Estructura anidada = shape del theme de Tailwind:
 *   ink.DEFAULT → `text-ink`,  ink.soft → `text-ink-soft`.
 * Neutros cálidos tintados hacia el rojo de marca. Sin negro/blanco puro.
 */
const lightColors = {
  paper: '#F6F4ED', // hueso cálido (fondo)
  ink: {
    DEFAULT: '#1C1815', // tinta casi-negra cálida (texto)
    soft: '#7A7164', // secundario / metadatos
  },
  line: '#E4DED1', // hairlines y bordes finos
  accent: {
    DEFAULT: '#B23A30', // rojo editorial (ladrillo)
    soft: '#D98A82',
  },
};

const darkColors = {
  paper: '#1A1A2E',
  ink: {
    DEFAULT: '#E8E4DD',
    soft: '#A09A8E',
  },
  line: '#2D2D38',
  accent: {
    DEFAULT: '#D98A82',
    soft: '#8B2D25',
  },
};

module.exports = { lightColors, darkColors, colors: lightColors };
