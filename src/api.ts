import { MovieQueryOptions, TMDB } from 'tmdb-ts';

const tmdb = new TMDB(process.env.NEXT_PUBLIC_TMDB_API_KEY!);

export const discoverMovies = async (options: MovieQueryOptions) =>
  await tmdb.discover.movie(options);

export const getMoviePosters = async (movieId: number) => {
  const images = await tmdb.movies.images(movieId, { language: 'en-US' });

  return images.posters
}
