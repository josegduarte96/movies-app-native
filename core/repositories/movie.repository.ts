import { Movie } from '@/core/entities/movie.entity';
import { MovieDetail } from '@/core/entities/movie-detail.entity';
import { Paginated } from '@/core/entities/paginated.entity';

/**
 * Port del dominio. Define QUÉ se puede pedir en términos de entidades,
 * no CÓMO (HTTP, mapper, forma del JSON). La implementación vive en infrastructure.
 */

export interface Options {
  page?: number;
}

export abstract class MovieRepository {
  abstract getNowPlaying(options: Options): Promise<Paginated<Movie>>;
  abstract getPopular(options: Options): Promise<Paginated<Movie>>;
  abstract getTopRated(options: Options): Promise<Paginated<Movie>>;
  abstract searchMovies(query: string, options: Options): Promise<Paginated<Movie>>;
  abstract getMovieById(id: number): Promise<MovieDetail | undefined>;
}
