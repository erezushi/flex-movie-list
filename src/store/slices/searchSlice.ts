import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { MovieWithPoster, SearchState } from '@/types';

const initialState: SearchState = {
  query: '',
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<MovieWithPoster[]>) => {
      state.results = action.payload;
    },
  },
});

export const { setQuery, setSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
