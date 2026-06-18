import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { nowPlayingUseCase } from '@/core/use-cases';
import {
  DEFAULT_STALE_TIME,
  getNextPageParam,
  movieKeys,
} from './movie-queries';

/**
 * Infinite pagination: cada `fetchNextPage()` pide la página siguiente.
 * `data.pages` es el arreglo de páginas; aplanar con flatMap para listar.
 */
export const useNowPlaying = () =>
  useInfiniteQuery({
    queryKey: movieKeys.nowPlaying(),
    queryFn: ({ pageParam }) =>
      nowPlayingUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: DEFAULT_STALE_TIME,
  });
