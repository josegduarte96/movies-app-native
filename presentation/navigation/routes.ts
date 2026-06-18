/**
 * Contrato de navegación de la app. Centraliza los pathnames de Expo Router
 * para que las pantallas no repitan strings literales.
 *
 * `movieDetail` devuelve el objeto href tipado que espera `router.push`;
 * `pathname: '...' as const` preserva el typing de typed-routes de Expo.
 */
export const ROUTES = {
  home: '/home',
  search: '/search',
  movieDetail: (id: number | string) =>
    ({ pathname: '/movie/[id]' as const, params: { id: String(id) } }),
} as const;
