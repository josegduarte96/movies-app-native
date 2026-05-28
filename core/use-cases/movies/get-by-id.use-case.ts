import { MovieRepository } from '@/core/repositories/movie.repository';
import { MovieDetail } from '@/core/entities/movie-detail.entity';

export const getByIdUseCase = (
  repository: MovieRepository,
  movieId: number,
): Promise<MovieDetail | undefined> => repository.getMovieById(movieId);
