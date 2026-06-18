/** Año de una fecha como string; '' si la fecha es inválida. */
export const formatYear = (date: Date): string => {
  const year = date.getFullYear();
  return Number.isNaN(year) ? '' : String(year);
};

/** Entero con padding a 2 dígitos: 1 → "01". */
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Iniciales (máx. 2) en mayúsculas a partir de un nombre. */
export const initials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
