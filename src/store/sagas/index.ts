import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Image, MovieDiscoverResult } from 'tmdb-ts';
import { discoverMovies, getMoviePosters } from '@/api';
import {
  addFavorite,
  displayPlaying,
  displayPopular,
  nextPage,
  previousPage,
  removeFavorite,
  setMovieList,
} from '../slices/movieSlice';
import type { MovieState } from '@/types';

export function* saveFavorites() {
  const state = (yield select((state) => state.movies)) as MovieState;

  localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

export function* fetchMovieList() {
  const state = (yield select((state) => state.movies)) as MovieState;

  const discoverRes = (yield call(discoverMovies, {
    page: state.currentPage,
    sort_by: 'popularity.desc',
    // Both Popular and Now Playing calls are Discover calls sorted by popularity.
    // Release types 2 and 3 are theatrical (limited) and theatrical, empty string is the same as just Popular
    with_release_type: state.displayMode === 'playing' ? '2|3' : '',
  })) as MovieDiscoverResult;

  const posterLists = (yield all(
    discoverRes.results.map((movie) => getMoviePosters(movie.id))
  )) as Image[][];

  const movieList = discoverRes.results.map((movie, index) => ({
    movie,
    poster: posterLists[index].find((poster) => poster.file_path === movie.poster_path)!
  }))

  yield put(setMovieList(movieList));
}

export function* watchFavoritesChange() {
  yield takeEvery([addFavorite.type, removeFavorite.type], saveFavorites);
}

export function* watchDisplayChange() {
  yield takeEvery(
    [displayPopular.type, displayPlaying.type, nextPage.type, previousPage.type],
    fetchMovieList,
  );
}

export default function* rootSaga() {
  yield all([watchFavoritesChange(), watchDisplayChange()]);
}
