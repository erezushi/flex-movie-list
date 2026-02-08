import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Image } from 'tmdb-ts';
import { discoverMovies, getMoviePosters } from '@/api';
import {
  addFavorite,
  displayPlaying,
  displayPopular,
  nextPage,
  lastPage,
  previousPage,
  firstPage,
  removeFavorite,
  setMovieList,
  setTotalPages,
} from '../slices/movieSlice';
import type { MovieState, MovieDiscoverResults } from '@/types';

export function* saveFavorites() {
  const state = (yield select((state) => state.movies)) as MovieState;

  localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

export function* fetchMovieList() {
  const state = (yield select((state) => state.movies)) as MovieState;

  const discoverRes = (yield call(
    discoverMovies,
    state.displayMode,
    state.currentPage,
  )) as MovieDiscoverResults;

  const posterLists = (yield all(
    discoverRes.movies.map((movie) => getMoviePosters(movie.id)),
  )) as Image[][];

  const movieList = discoverRes.movies.map((movie, index) => ({
    movie,
    poster:
      posterLists[index].find((poster) => poster.file_path === movie.poster_path) ??
      posterLists[index][0],
  }));

  yield put(setMovieList(movieList));

  // TMDB API only accepts pages up to 500, even if it returns more than that
  yield put(setTotalPages(Math.min(discoverRes.pages, 500)));
}

export function* watchFavoritesChange() {
  yield takeEvery([addFavorite.type, removeFavorite.type], saveFavorites);
}

export function* watchDisplayChange() {
  yield takeEvery(
    [
      displayPopular.type,
      displayPlaying.type,
      nextPage.type,
      lastPage.type,
      previousPage.type,
      firstPage.type,
    ],
    fetchMovieList,
  );
}

export default function* rootSaga() {
  yield all([watchFavoritesChange(), watchDisplayChange()]);
}
