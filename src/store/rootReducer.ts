import { combineReducers } from "@reduxjs/toolkit";
import movies from './slices/movieSlice';
import search from "./slices/searchSlice";
import request from "./slices/requestSlice";

const rootReducer = combineReducers({
  movies,
  search,
  request
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer