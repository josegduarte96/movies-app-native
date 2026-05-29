import { MovieRepository } from '@/core/repositories/movie.repository';

export const getMovieCreditsUseCase = (
  movieRepository: MovieRepository,
  movieId: number,
) => movieRepository.getMovieCredits(movieId);
