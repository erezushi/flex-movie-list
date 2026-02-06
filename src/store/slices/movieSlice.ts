import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('favorites') ?? '[]') as number [];

export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      state.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state = state.filter((favoriteId) => favoriteId !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { addFavorite, removeFavorite } = movieSlice.actions;

export default movieSlice.reducer;
