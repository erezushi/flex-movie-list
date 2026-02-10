import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Image } from 'tmdb-ts';
import { discoverMovies, getMoviePosters, getSingleMovie } from '@/api';
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
  setSingleMovie,
  displayFavorites,
} from '../slices/movieSlice';
import type { MovieState, MovieDiscoverResults } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';

export function* saveFavorites() {
  const state: MovieState = yield select((state) => state.movies);

  localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

export function* fetchMovieList() {
  const state: MovieState = yield select((state) => state.movies);

  const discoverRes: MovieDiscoverResults = yield call(
    discoverMovies,
    state.displayMode,
    state.currentPage,
  );

  const posterLists: Image[][] = yield all(
    discoverRes.movies.map((movie) => getMoviePosters(movie.id)),
  );

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

export function* fetchFavorites() {
  const state: MovieState = yield select((state) => state.movies);

  const movieDetails: Awaited<ReturnType<typeof getSingleMovie>>[] = yield all(
    state.favorites.map((favoriteId) => getSingleMovie(favoriteId))
  )

  const posterLists: Image[][] = yield all(
    state.favorites.map((favoriteId) => getMoviePosters(favoriteId)),
  )

  const movieList = movieDetails.map((movie, index) => ({
    movie,
    poster:
      posterLists[index].find((poster) => poster.file_path === movie.poster_path) ??
      posterLists[index][0],
  }));

  yield put(setMovieList(movieList));
}

export function* fetchSingleMovie(action: PayloadAction<number>) {
  const movieDetails: Awaited<ReturnType<typeof getSingleMovie>> = yield call(
    getSingleMovie,
    action.payload,
  );

  const posterList: Image[] = yield call(getMoviePosters, action.payload);

  yield put(
    setMovieList([
      {
        movie: movieDetails,
        poster:
          posterList.find((poster) => poster.file_path === movieDetails.poster_path) ??
          posterList[0],
      },
    ]),
  );
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

export function* watchDisplayFavorites() {
  yield takeEvery([displayFavorites.type], fetchFavorites)
}

export function* watchSingleMovie() {
  yield takeEvery([setSingleMovie.type], fetchSingleMovie);
}

export default function* rootSaga() {
  yield all([
    watchFavoritesChange(),
    watchDisplayChange(),
    watchSingleMovie(),
    watchDisplayFavorites(),
  ]);
}
