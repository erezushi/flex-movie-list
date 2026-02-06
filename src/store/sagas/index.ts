import { all, takeEvery } from 'redux-saga/effects';
import { addFavorite, removeFavorite } from '../slices/movieSlice';
import { PayloadAction } from '@reduxjs/toolkit';

function* addFavoriteWorker(action: PayloadAction<number>) {
  const savedList = JSON.parse(localStorage.getItem('favorites') ?? '[]') as number[];
  savedList.push(action.payload);
  localStorage.setItem('favorites', JSON.stringify(savedList));
}

function* removeFavoriteWorker(action: PayloadAction<number>) {
  let savedList = JSON.parse(localStorage.getItem('favorites') ?? '[]') as number[];
  savedList = savedList.filter((favoriteId) => favoriteId !== action.payload);
  localStorage.setItem('favorites', JSON.stringify(savedList));
}

export function* additionWatcher() {
  yield takeEvery(addFavorite, addFavoriteWorker);
}

export function* removalWatcher() {
  yield takeEvery(removeFavorite, removeFavoriteWorker);
}

export default function* rootSaga() {
  yield all([additionWatcher(), removalWatcher()]);
}
