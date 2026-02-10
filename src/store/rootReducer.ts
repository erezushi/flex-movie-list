import { combineReducers } from "@reduxjs/toolkit";
import movies from './slices/movieSlice';
import request from "./slices/requestSlice";
import search from "./slices/searchSlice";

const rootReducer = combineReducers({
  movies,
  search,
  request
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer