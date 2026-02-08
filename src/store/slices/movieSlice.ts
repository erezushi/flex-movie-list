import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieDetails, MovieState } from '@/types';

const initialState: MovieState = {
  displayMode: 'popular',
  currentPage: 1,
  totalPages: 0,
  favorites: [],
  movieList: [],
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
    setMovieList: (state, action: PayloadAction<MovieDetails[]>) => {
      state.movieList = action.payload;
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
} = movieSlice.actions;

export default movieSlice.reducer;
