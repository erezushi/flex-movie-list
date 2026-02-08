import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieDetails, MovieState } from '@/types';

const initialState: MovieState = {
  displayMode: 'popular',
  currentPage: 1,
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
    previousPage: (state) => {
      state.currentPage -= 1;
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
  previousPage,
  addFavorite,
  removeFavorite,
  setMovieList,
} = movieSlice.actions;

export default movieSlice.reducer;
