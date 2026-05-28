import { Movie } from '@/core/entities/movie.entity';
import { Paginated } from '@/core/entities/paginated.entity';
import { MovieRepository, Options } from '@/core/repositories/movie.repository';

export const searchMoviesUseCase = (
  repository: MovieRepository,
  query: string,
  options: Options = {},
): Promise<Paginated<Movie>> => repository.searchMovies(query, options);
