import type {
  MovieDetail,
  ProductionCompany,
  SpokenLanguage,
} from '@/core/entities/movie-detail.entity';
import type {
  MovieDBMovieDetail,
  MovieDBProductionCompany,
  MovieDBSpokenLanguage,
} from '@/infrastructure/interfaces/movie-db-detail.responses';
import { IMAGE_BASE_URL } from '@/infrastructure/constants/images';

export class MovieDetailMapper {
  static fromMovieDBToEntity(movie: MovieDBMovieDetail): MovieDetail {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      overview: movie.overview,
      popularity: movie.popularity,
      posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'no-poster',
      backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : 'no-backdrop',
      homepage: movie.homepage,
      imdbId: movie.imdb_id,
      originCountry: movie.origin_country,
      productionCompanies: movie.production_companies.map(MovieDetailMapper.fromProductionCompany),
      releaseDate: new Date(movie.release_date),
      runtime: movie.runtime,
      spokenLanguages: movie.spoken_languages.map(MovieDetailMapper.fromSpokenLanguage),
      status: movie.status,
      tagline: movie.tagline,
    };
  }

  private static fromProductionCompany(company: MovieDBProductionCompany): ProductionCompany {
    return {
      id: company.id,
      logoPath: company.logo_path ? `${IMAGE_BASE_URL}${company.logo_path}` : 'no-logo',
      name: company.name,
      originCountry: company.origin_country,
    };
  }

  private static fromSpokenLanguage(lang: MovieDBSpokenLanguage): SpokenLanguage {
    return {
      englishName: lang.english_name,
      iso639_1: lang.iso_639_1,
      name: lang.name,
    };
  }
}
