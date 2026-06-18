import type { Paginated } from '@/core/entities/paginated.entity';

/**
 * Decisiones de caché de React Query (capa de presentación).
 *
 * `movieKeys` centraliza las queryKeys para evitar literales repetidos y
 * mantenerlas consistentes. Las claves conservan EXACTAMENTE su forma previa
 * para no invalidar caché entre versiones (nota: `credits` no lleva el prefijo
 * 'movies', igual que antes).
 */
export const movieKeys = {
  all: ['movies'] as const,
  nowPlaying: () => [...movieKeys.all, 'now-playing'] as const,
  populars: () => [...movieKeys.all, 'populars'] as const,
  topRated: () => [...movieKeys.all, 'topRated'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  detail: (movieId: number) => [...movieKeys.all, movieId] as const,
  credits: (movieId: number) => ['movie-credit', movieId] as const,
};

/** 5 minutos: datos "frescos", no refetch. */
export const DEFAULT_STALE_TIME = 1000 * 60 * 5;

/** Avanza a la página siguiente mientras no se alcance la última. */
export const getNextPageParam = (last: Paginated<unknown>): number | undefined =>
  last.page < last.totalPages ? last.page + 1 : undefined;
