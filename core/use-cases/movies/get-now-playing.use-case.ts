import { Movie } from '@/core/entities/movie.entity';
import { Paginated } from '@/core/entities/paginated.entity';
import { MovieRepository, Options } from '@/core/repositories/movie.repository';

export const nowPlayingUseCase = (
  repository: MovieRepository,
  options: Options = {},
): Promise<Paginated<Movie>> => repository.getNowPlaying(options);
