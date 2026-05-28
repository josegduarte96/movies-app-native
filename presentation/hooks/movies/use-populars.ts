import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getPopularsUseCase } from '@/core/use-cases';

export const usePopularsMovies = () =>
  useInfiniteQuery({
    queryKey: ['movies', 'populars'],
    queryFn: ({ pageParam }) => getPopularsUseCase(movieRepository, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
