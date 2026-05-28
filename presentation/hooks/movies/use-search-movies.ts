import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { searchMoviesUseCase } from '@/core/use-cases';

export const useSearchMovies = (query: string) =>
  useInfiniteQuery({
    queryKey: ['movies', 'search', query],
    queryFn: ({ pageParam }) =>
      searchMoviesUseCase(movieRepository, query, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    enabled: query.trim().length > 0,
  });
