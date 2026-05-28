import type { MovieDBMovie } from './movie-db.responses';

export interface MovieDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDBMovieDetail extends Omit<MovieDBMovie, 'genre_ids'> {
  backdrop_path: string | null;
  homepage: string;
  imdb_id: string | null;
  origin_country: string[];
  poster_path: string | null;
  production_companies: MovieDBProductionCompany[];
  release_date: string;
  runtime: number;
  spoken_languages: MovieDBSpokenLanguage[];
  status: string;
  tagline: string;
}
