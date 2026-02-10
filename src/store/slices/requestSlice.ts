import { RequestState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: RequestState = {
  isLoading: false,
  error: '',
};

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { startLoading, stopLoading, setError } = requestSlice.actions;

export default requestSlice.reducer;
