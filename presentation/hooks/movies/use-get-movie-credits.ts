import { useQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getMovieCreditsUseCase } from '@/core/use-cases';

export const useGetMovieCredits = (movieId: number) =>
  useQuery({
    queryKey: ['movie-credit', movieId],
    queryFn: async () => {
      return getMovieCreditsUseCase(movieRepository, movieId);
    },
    staleTime: 1000 * 60 * 5, // 5 min: datos "frescos", no refetch
  });
