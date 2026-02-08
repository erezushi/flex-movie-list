import { Image, Movie } from 'tmdb-ts';

export type DisplayMode = 'popular' | 'playing' | 'favorites';

export interface MovieDiscoverResults {
  movies: Movie[];
  pages: number
}

export interface MovieDetails {
  movie: Movie;
  poster: Image;
}

export interface MovieState {
  displayMode: DisplayMode;
  currentPage: number;
  totalPages: number;
  movieList: MovieDetails[];
  favorites: number[];
}
