/** Tipos de la paleta editorial. Los valores viven en `colors.js`. */
type Palette = {
  paper: string;
  ink: { DEFAULT: string; soft: string };
  line: string;
  accent: { DEFAULT: string; soft: string };
};

export declare const lightColors: Palette;
export declare const darkColors: Palette;
export declare const colors: Palette;
