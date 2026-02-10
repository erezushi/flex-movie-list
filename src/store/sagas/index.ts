import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, debounce, put, select, takeEvery } from 'redux-saga/effects';
import { Image, Movie } from 'tmdb-ts';
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
import { setError, startLoading, stopLoading } from '../slices/requestSlice';
import { setQuery, setSearchResults } from '../slices/searchSlice';
import { discoverMovies, getMoviePosters, getSingleMovie, searchMovies } from '@/api';

import type { MovieState, MovieDiscoverResults } from '@/types';

// Movie Sagas

export function* saveFavorites() {
  const state: MovieState = yield select((state) => state.movies);

  yield call(localStorage?.setItem, 'favorites', JSON.stringify(state.favorites));
}

export function* fetchMovieList() {
  const state: MovieState = yield select((state) => state.movies);

  yield put(startLoading());
  yield put(setError(''));

  try {
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
  } catch (error) {
    yield put(setError((error as { message: string }).message));
  }

  yield put(stopLoading());
}

export function* fetchFavorites() {
  const state: MovieState = yield select((state) => state.movies);

  yield put(startLoading());
  yield put(setError(''));

  try {
    const movieDetails: Awaited<ReturnType<typeof getSingleMovie>>[] = yield all(
      state.favorites.map((favoriteId) => getSingleMovie(favoriteId)),
    );

    const posterLists: Image[][] = yield all(
      state.favorites.map((favoriteId) => getMoviePosters(favoriteId)),
    );

    const movieList = movieDetails.map((movie, index) => ({
      movie,
      poster:
        posterLists[index].find((poster) => poster.file_path === movie.poster_path) ??
        posterLists[index][0],
    }));

    yield put(setMovieList(movieList));
  } catch (error) {
    yield put(setError((error as { message: string }).message));
  }

  yield put(stopLoading());
}

export function* fetchSingleMovie(action: PayloadAction<number>) {
  yield put(startLoading());
  yield put(setError(''));

  try {
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
  } catch (error) {
    yield put(setError((error as { message: string }).message));
  }

  yield put(startLoading());
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
  yield takeEvery(displayFavorites, fetchFavorites);
}

export function* watchSingleMovie() {
  yield takeEvery(setSingleMovie, fetchSingleMovie);
}

// Search Sagas

let timesSearched = 0;
let searchRefresh: NodeJS.Timeout | null = null;

export function* movieSearchWorker(action: PayloadAction<string>) {
  const searchQuery = action.payload;

  if (searchQuery.length >= 2 && timesSearched < 5) {
    yield put(startLoading());
    yield put(setError(''));

    try {
      const searchResults: Movie[] = yield call(searchMovies, action.payload);

      const posterLists: Image[][] = yield all(
        searchResults.map((movie) => getMoviePosters(movie.id)),
      );

      const movieList = searchResults.map((movie, index) => ({
        movie,
        poster:
          posterLists[index].find((poster) => poster.file_path === movie.poster_path) ??
          posterLists[index][0],
      }));

      yield put(setSearchResults(movieList));

      timesSearched += 1;
      if (!searchRefresh)
        searchRefresh = yield call(
          setTimeout,
          () => {
            timesSearched = 0;
            searchRefresh = null;
          },
          10_000,
        );
    } catch (error) {
      yield put(setError((error as { message: string }).message));
    }

    yield put(stopLoading());
  } else if (searchQuery === '') {
    yield put(setSearchResults([]));
  }
}

export function* watchSearchQuery() {
  yield debounce(500, setQuery, movieSearchWorker);
}

export default function* rootSaga() {
  yield all([
    watchFavoritesChange(),
    watchDisplayChange(),
    watchSingleMovie(),
    watchDisplayFavorites(),
    watchSearchQuery(),
  ]);
}
