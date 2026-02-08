import { Image, Movie } from 'tmdb-ts';

export type DisplayMode = 'popular' | 'playing' | 'favorites';
export interface MovieDetails {
  movie: Movie;
  poster: Image;
}

export interface MovieState {
  displayMode: DisplayMode;
  currentPage: number;
  movieList: MovieDetails[];
  favorites: number[];
}
