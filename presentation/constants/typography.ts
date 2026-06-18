import type { TextStyle } from 'react-native';

/**
 * Tokens tipográficos para estilos que NativeWind no cubre con clases
 * (letterSpacing/lineHeight arbitrarios). Se pasan como objetos `style`.
 */

/** Etiqueta "eyebrow" tracked en mayúsculas (la firma del sistema). */
export const EYEBROW: TextStyle = { fontSize: 12, letterSpacing: 3 };

/** Variante mayor del eyebrow (cabeceras de carrusel / detalle). */
export const EYEBROW_LG: TextStyle = { fontSize: 13, letterSpacing: 3 };

/** Escala tipográfica de la pantalla de detalle. */
export const TYPE = {
  title: { fontSize: 36, lineHeight: 40 },
  tagline: { fontSize: 20, lineHeight: 27 },
  sectionHeading: { fontSize: 28, lineHeight: 32 },
  body: { fontSize: 16, lineHeight: 25 },
} as const satisfies Record<string, TextStyle>;
