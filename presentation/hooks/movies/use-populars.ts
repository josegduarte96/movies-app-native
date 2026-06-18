import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getPopularsUseCase } from '@/core/use-cases';
import {
  DEFAULT_STALE_TIME,
  getNextPageParam,
  movieKeys,
} from './movie-queries';

export const usePopularsMovies = () =>
  useInfiniteQuery({
    queryKey: movieKeys.populars(),
    queryFn: ({ pageParam }) => getPopularsUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: DEFAULT_STALE_TIME,
  });
