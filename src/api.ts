import { TMDB } from 'tmdb-ts';
import { DisplayMode, MovieDiscoverResults } from './types';

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
