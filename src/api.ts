import { MovieDiscoverResult, MovieQueryOptions, TMDB } from 'tmdb-ts';

const tmdb = new TMDB(process.env.NEXT_PUBLIC_TMDB_API_KEY!);

export const discoverMovies = async (options: MovieQueryOptions): Promise<MovieDiscoverResult> =>
  await tmdb.discover.movie(options);
