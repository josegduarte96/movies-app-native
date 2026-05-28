import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getTopRatedUseCase } from '@/core/use-cases';

export const useTopRatedMovies = () =>
  useInfiniteQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: ({ pageParam }) => getTopRatedUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
