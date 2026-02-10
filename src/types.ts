import { Image, Movie, MovieDetails } from 'tmdb-ts';

export type DisplayMode = 'popular' | 'playing' | 'favorites';

export interface MovieDiscoverResults {
  movies: Movie[];
  pages: number
}

export interface MovieWithPoster {
  movie: Movie | MovieDetails;
  poster: Image;
}

export interface MovieState {
  displayMode: DisplayMode;
  currentPage: number;
  totalPages: number;
  movieList: MovieWithPoster[];
  favorites: number[];
  singleMovie?: number;
}

export interface SearchState {
  query: string;
  results: MovieWithPoster[];
}
