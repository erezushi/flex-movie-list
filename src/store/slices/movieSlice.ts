import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieWithPoster, MovieState } from '@/types';
import { discoverMovies, getMoviePosters } from '@/api';

const localFavorites = localStorage.getItem('favorites');

const discoverRes = await discoverMovies('popular', 1);
const posterLists = await Promise.all(discoverRes.movies.map((movieObj) => getMoviePosters(movieObj.id)));

const movieList = discoverRes.movies.map((movie, index) => ({
    movie,
    poster:
      posterLists[index].find((poster) => poster.file_path === movie.poster_path) ??
      posterLists[index][0],
  }));

const initialState: MovieState = {
  displayMode: 'popular',
  currentPage: 1,
  totalPages: Math.min(discoverRes.pages, 500),
  favorites: localFavorites ? JSON.parse(localFavorites) : [],
  movieList,
};

export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    displayPopular: (state) => {
      state.displayMode = 'popular';
      state.currentPage = 1;
    },
    displayPlaying: (state) => {
      state.displayMode = 'playing';
      state.currentPage = 1;
    },
    displayFavorites: (state) => {
      state.displayMode = 'favorites';
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    lastPage: (state) => {
      state.currentPage = state.totalPages;
    },
    previousPage: (state) => {
      state.currentPage -= 1;
    },
    firstPage: (state) => {
      state.currentPage = 1;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    addFavorite: (state, action: PayloadAction<number>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((movieId) => movieId !== action.payload);
    },
    setMovieList: (state, action: PayloadAction<MovieWithPoster[]>) => {
      state.movieList = action.payload;
    },
    // Used if movie detail page is loaded without the movie in movieList
    setSingleMovie: (state, action: PayloadAction<number>) => {
      state.singleMovie = action.payload;
    },
  },
});

export const {
  displayPopular,
  displayPlaying,
  displayFavorites,
  nextPage,
  lastPage,
  previousPage,
  firstPage,
  setTotalPages,
  addFavorite,
  removeFavorite,
  setMovieList,
  setSingleMovie
} = movieSlice.actions;

export default movieSlice.reducer;
