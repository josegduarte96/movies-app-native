import { AxiosAdapter } from '@/infrastructure/adapters/axios.adapter';
import { MovieDBRepository } from '@/infrastructure/repositories/movie-db.repository';

const MOVIE_DB_URL =
  process.env.EXPO_PUBLIC_MOVIE_DB_URL ?? 'https://api.themoviedb.org/3';
const MOVIE_DB_KEY = process.env.EXPO_PUBLIC_MOVIE_DB_KEY;

if (!MOVIE_DB_KEY) {
  console.warn('[movieApi] EXPO_PUBLIC_MOVIE_DB_KEY missing. Set it in .env');
}

const movieDBFetcher = new AxiosAdapter({
  baseURL: MOVIE_DB_URL,
  params: {
    api_key: MOVIE_DB_KEY ?? '',
    language: 'en-US',
  },
});

// Composition root: cablea el adapter concreto con el repositorio.
export const movieRepository = new MovieDBRepository(movieDBFetcher);
