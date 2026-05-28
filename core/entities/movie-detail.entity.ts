export interface ProductionCompany {
  id: number;
  logoPath: string | null;
  name: string;
  originCountry: string;
}

export interface SpokenLanguage {
  englishName: string;
  iso639_1: string;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  overview: string;
  popularity: number;
  posterPath: string;
  backdropPath: string;
  homepage: string;
  imdbId: string | null;
  originCountry: string[];
  productionCompanies: ProductionCompany[];
  releaseDate: Date;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
}
