import { Movie } from '@/core/entities/movie.entity';
import { Paginated } from '@/core/entities/paginated.entity';
import { MovieDBMovie, MovieDBMoviesResponse } from '@/infrastructure/interfaces/movie-db.responses';
import { IMAGE_BASE_URL } from '@/infrastructure/constants/images';

export class MovieMapper {
  static fromMovieDBToEntity(movie: MovieDBMovie): Movie {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: new Date(movie.release_date),
      posterPath: movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'no-poster',
      backdrop: movie.backdrop_path
        ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
        : 'no-backdrop',
    };
  }

  static fromResponseToPaginated(response: MovieDBMoviesResponse): Paginated<Movie> {
    return {
      results: response.results.map(MovieMapper.fromMovieDBToEntity),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }
}
