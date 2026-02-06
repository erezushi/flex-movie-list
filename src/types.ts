export type DisplayMode = 'popular' | 'playing' | 'favorites';

export interface MovieState {
  displayMode: DisplayMode;
  currentPage: number;
}
