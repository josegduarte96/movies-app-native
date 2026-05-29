import { HttpAdapter } from '@/core/adapters/http.adapter';
import { Movie } from '@/core/entities/movie.entity';
import { Paginated } from '@/core/entities/paginated.entity';
import { MovieRepository, Options } from '@/core/repositories/movie.repository';
import { MovieDBMoviesResponse } from '@/infrastructure/interfaces/movie-db.responses';
import { MovieMapper } from '@/infrastructure/mappers/movie.mapper';
import { MovieDetail } from '@/core/entities/movie-detail.entity';
import { MovieDBMovieDetail } from '@/infrastructure/interfaces/movie-db-detail.responses';
import { MovieDetailMapper } from '@/infrastructure/mappers/movie-detail.mapper';
import { MovieCredits } from '@/core/entities/movie-credits.entity';
import { MovieCreditsMapper } from '@/infrastructure/mappers/movie-credits.mapper';
import { MovieDBCredits } from '@/infrastructure/interfaces/movie-db-credits.response';

/**
 * Implementación concreta del port para The Movie DB.
 * Aquí viven los detalles: endpoint, forma de la respuesta, mapeo a entidad.
 */
export class MovieDBRepository extends MovieRepository {
  constructor(private readonly fetcher: HttpAdapter) {
    super();
  }

  async getMovieCredits(id: number): Promise<MovieCredits[] | undefined> {
    try {
      const data = await this.fetcher.get<MovieDBCredits>(
        `/movie/${id}/credits`,
      );
      return data.cast.map(MovieCreditsMapper.fromCreditsDBToEntity);
    } catch (error) {
      console.error('getMovieCredits failed', error);
      throw new Error('Could not fetch movie credits');
    }
  }

  async getMovieById(id: number): Promise<MovieDetail | undefined> {
    try {
      const data = await this.fetcher.get<MovieDBMovieDetail>(`/movie/${id}`);
      return MovieDetailMapper.fromMovieDBToEntity(data);
    } catch (error) {
      console.error('getMovieById failed', error);
      throw new Error('Could not fetch movie details');
    }
  }

  async getNowPlaying({ page = 1 }: Options = {}): Promise<Paginated<Movie>> {
    try {
      const data = await this.fetcher.get<MovieDBMoviesResponse>(
        '/movie/now_playing',
        {
          params: { page },
        },
      );
      return MovieMapper.fromResponseToPaginated(data);
    } catch (error) {
      console.error('getNowPlaying failed', error);
      throw new Error('Could not fetch now playing movies');
    }
  }

  async getTopRated({ page = 1 }: Options = {}): Promise<Paginated<Movie>> {
    try {
      const data = await this.fetcher.get<MovieDBMoviesResponse>(
        '/movie/top_rated',
        {
          params: { page },
        },
      );
      return MovieMapper.fromResponseToPaginated(data);
    } catch (error) {
      console.error('getTopRated failed', error);
      throw new Error('Could not fetch top rated movies');
    }
  }

  async getPopular({ page = 1 }: Options = {}): Promise<Paginated<Movie>> {
    try {
      const data = await this.fetcher.get<MovieDBMoviesResponse>(
        '/movie/popular',
        {
          params: { page },
        },
      );
      return MovieMapper.fromResponseToPaginated(data);
    } catch (error) {
      console.error('getPopular failed', error);
      throw new Error('Could not fetch popular movies');
    }
  }

  async searchMovies(
    query: string,
    { page = 1 }: Options = {},
  ): Promise<Paginated<Movie>> {
    if (query.trim().length === 0) {
      return { results: [], page: 1, totalPages: 0, totalResults: 0 };
    }

    try {
      const data = await this.fetcher.get<MovieDBMoviesResponse>(
        '/search/movie',
        {
          params: { query, page },
        },
      );
      return MovieMapper.fromResponseToPaginated(data);
    } catch (error) {
      console.error('searchMovies failed', error);
      throw new Error('Could not search movies');
    }
  }
}
