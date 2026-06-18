import { useQuery } from '@tanstack/react-query';

import { movieRepository } from '@/config/api/movieApi';
import { getMovieCreditsUseCase } from '@/core/use-cases';
import { DEFAULT_STALE_TIME, movieKeys } from './movie-queries';

export const useGetMovieCredits = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.credits(movieId),
    queryFn: async () => {
      return getMovieCreditsUseCase(movieRepository, movieId);
    },
    staleTime: DEFAULT_STALE_TIME,
  });
