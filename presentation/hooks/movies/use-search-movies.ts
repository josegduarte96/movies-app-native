import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { searchMoviesUseCase } from '@/core/use-cases';
import { getNextPageParam, movieKeys } from './movie-queries';

export const useSearchMovies = (query: string) =>
  useInfiniteQuery({
    queryKey: movieKeys.search(query),
    queryFn: ({ pageParam }) =>
      searchMoviesUseCase(movieRepository, query, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: query.trim().length > 0,
  });
