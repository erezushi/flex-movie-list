import { TMDB } from 'tmdb-ts';

import type { DisplayMode, MovieDiscoverResults } from './types';

const tmdb = new TMDB(process.env.NEXT_PUBLIC_TMDB_API_KEY!);

export const discoverMovies = async (
  mode: DisplayMode,
  page: number,
): Promise<MovieDiscoverResults> => {
  if (mode === 'popular') {
    const response = await tmdb.movies.popular({ page });

    return {
      movies: response.results,
      pages: response.total_pages,
    };
  } else {
    const response = await tmdb.movies.nowPlaying({ page });

    return {
      movies: response.results,
      pages: response.total_pages,
    };
  }
};

export const getMoviePosters = async (movieId: number) => {
  const images = await tmdb.movies.images(movieId);

  return images.posters;
};

export const getSingleMovie = async (movieId: number) => {
  const details = await tmdb.movies.details(movieId, undefined);

  return details;
};

export const searchMovies = async (query: string) => {
  const searchRes = await tmdb.search.movies({ query });

  return searchRes.results;
};
