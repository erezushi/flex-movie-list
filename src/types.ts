import { Movie } from "tmdb-ts";

export type DisplayMode = 'popular' | 'playing' | 'favorites';

export interface MovieState {
  displayMode: DisplayMode;
  currentPage: number;
  movieList: Movie[];
  favorites: number[];
}
