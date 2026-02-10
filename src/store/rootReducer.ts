import { combineReducers } from "@reduxjs/toolkit";
import movies from './slices/movieSlice';
import search from "./slices/searchSlice";

const rootReducer = combineReducers({
  movies,
  search
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer