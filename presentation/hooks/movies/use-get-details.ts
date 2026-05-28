import { useQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getByIdUseCase } from '@/core/use-cases';

/**
 * Capa de presentación: React Query envuelve el use-case.
 * queryKey/staleTime = decisiones de UI (cache). queryFn = solo delega al use-case.
 */
export const useGetMovieDetails = (movieId: number) =>
  useQuery({
    queryKey: ['movies', movieId],
    queryFn: async () => {
      return getByIdUseCase(movieRepository, movieId);
    },
    staleTime: 1000 * 60 * 5, // 5 min: datos "frescos", no refetch
  });
