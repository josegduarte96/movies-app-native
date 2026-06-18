import { useQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getByIdUseCase } from '@/core/use-cases';
import { DEFAULT_STALE_TIME, movieKeys } from './movie-queries';

/**
 * Capa de presentación: React Query envuelve el use-case.
 * queryKey/staleTime = decisiones de UI (cache). queryFn = solo delega al use-case.
 */
export const useGetMovieDetails = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: async () => {
      return getByIdUseCase(movieRepository, movieId);
    },
    staleTime: DEFAULT_STALE_TIME,
  });
