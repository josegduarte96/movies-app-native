import { Movie } from '@/core/entities/movie.entity';
import { Paginated } from '@/core/entities/paginated.entity';
import { MovieRepository, Options } from '@/core/repositories/movie.repository';

export const getPopularsUseCase = (
  repository: MovieRepository,
  options: Options = {},
): Promise<Paginated<Movie>> => repository.getPopular(options);
