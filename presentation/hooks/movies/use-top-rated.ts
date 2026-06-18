import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getTopRatedUseCase } from '@/core/use-cases';
import {
  DEFAULT_STALE_TIME,
  getNextPageParam,
  movieKeys,
} from './movie-queries';

export const useTopRatedMovies = () =>
  useInfiniteQuery({
    queryKey: movieKeys.topRated(),
    queryFn: ({ pageParam }) => getTopRatedUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: DEFAULT_STALE_TIME,
  });
