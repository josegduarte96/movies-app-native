/**
 * Aplana las páginas de un `useInfiniteQuery` en una lista plana de resultados.
 * Devuelve una referencia nueva en cada llamada (no memoizar: las FlatList
 * dependen de recibir el array calculado por render igual que antes).
 */
export const flattenPages = <T>(
  data: { pages: { results: T[] }[] } | undefined,
): T[] => data?.pages.flatMap((p) => p.results) ?? [];
