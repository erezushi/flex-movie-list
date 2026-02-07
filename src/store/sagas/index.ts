import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { TMDB, MovieDiscoverResult } from 'tmdb-ts';
import {
  addFavorite,
  displayPlaying,
  displayPopular,
  nextPage,
  prviousPage,
  removeFavorite,
  setMovieList,
} from '../slices/movieSlice';
import type { MovieState } from '@/types';

const { TMDB_API_KEY } = process.env;
const tmdb = new TMDB(TMDB_API_KEY!);

export function* saveFavorites() {
  const state = (yield select((state) => state.movies)) as MovieState;

  localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

export function* fetchMovieList() {
  const state = (yield select((state) => state.movies)) as MovieState;

  const discoverRes = (yield call(tmdb.discover.movie, {
    page: state.currentPage,
    sort_by: 'popularity.desc',
    // Both Popular and Now Playing calls are Discover calls sorted by popularity.
    // Relase types 2 and 3 are theatrical (limited) and theatrical, empty string is the same as just Popular
    with_release_type: state.displayMode === 'playing' ? '2|3' : '',
  })) as MovieDiscoverResult;

  yield put(setMovieList(discoverRes.results));
}

export function* watchFavoritesChange() {
  yield takeEvery([addFavorite.type, removeFavorite.type], saveFavorites);
}

export function* watchDisplayChange() {
  yield takeEvery(
    [displayPopular.type, displayPlaying.type, nextPage.type, prviousPage.type],
    fetchMovieList,
  );
}

export default function* rootSaga() {
  yield all([watchFavoritesChange()]);
}

