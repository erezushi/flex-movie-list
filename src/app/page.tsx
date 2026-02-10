'use client';

import { Button, TextField } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';
import DiscoveryFeed from './components/DiscoveryFeed';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  displayFavorites,
  displayPlaying,
  displayPopular,
} from '@/store/slices/movieSlice';
import { setQuery } from '@/store/slices/searchSlice';

let hoverTimeout: NodeJS.Timeout | null = null;

const Home = () => {
  const dispatch = useAppDispatch();

  const displayMode = useAppSelector((state) => state.movies.displayMode);

  const searchQuery = useAppSelector((state) => state.search.query);

  const onPopularHover = useCallback(() => {
    hoverTimeout = setTimeout(() => dispatch(displayPopular()), 2000);
  }, [dispatch]);

  const onPlayingHover = useCallback(() => {
    hoverTimeout = setTimeout(() => dispatch(displayPlaying()), 2000);
  }, [dispatch]);

  const onFavoritesHover = useCallback(() => {
    hoverTimeout = setTimeout(() => dispatch(displayFavorites()), 2000);
  }, [dispatch]);

  const onHoverLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }, []);

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setQuery(event.target.value));
    },
    [dispatch],
  );

  return (
    <main>
      <Button
        variant="text"
        onClick={() => dispatch(displayPopular())}
        onMouseEnter={onPopularHover}
        onMouseLeave={onHoverLeave}
        disabled={displayMode === 'popular'}
        size="large"
      >
        Popular
      </Button>
      |
      <Button
        variant="text"
        onClick={() => dispatch(displayPlaying())}
        onMouseEnter={onPlayingHover}
        onMouseLeave={onHoverLeave}
        disabled={displayMode === 'playing'}
        size="large"
      >
        Now Playing
      </Button>
      |
      <Button
        variant="text"
        onClick={() => dispatch(displayFavorites())}
        onMouseEnter={onFavoritesHover}
        onMouseLeave={onHoverLeave}
        disabled={displayMode === 'favorites'}
        size="large"
      >
        Favorites
      </Button>
      <TextField
        className="search-input"
        variant="outlined"
        value={searchQuery}
        onChange={onInputChange}
        label="Search"
      />
      <DiscoveryFeed />
    </main>
  );
};

export default Home;
