import { DisplayMode, MovieState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MovieState = {
  displayMode: 'popular',
  currentPage: 1,
};

export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    changeDisplayMode: (state, action: PayloadAction<DisplayMode>) => {
      state.displayMode = action.payload;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { changeDisplayMode, changePage } = movieSlice.actions;

export default movieSlice.reducer;
