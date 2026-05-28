import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { nowPlayingUseCase } from '@/core/use-cases';

/**
 * Infinite pagination: cada `fetchNextPage()` pide la página siguiente.
 * `data.pages` es el arreglo de páginas; aplanar con flatMap para listar.
 */
export const useNowPlaying = () =>
  useInfiniteQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: ({ pageParam }) =>
      nowPlayingUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
