'use client';

import { Button, TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import DiscoveryFeed from './components/DiscoveryFeed';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { displayFavorites, displayPlaying, displayPopular } from '@/store/slices/movieSlice';
import { setQuery } from '@/store/slices/searchSlice';

const selectableElements = [
  'Popular',
  'Playing',
  'Favorites',
  'Search',
  'Movies',
  'First Page',
  'Previous Page',
  'Next Page',
  'Last Page',
];

let hoverTimeout: NodeJS.Timeout | null = null;

const Home = () => {
  const dispatch = useAppDispatch();

  const displayMode = useAppSelector((state) => state.movies.displayMode);
  const movieList = useAppSelector((state) => state.movies.movieList);

  const searchQuery = useAppSelector((state) => state.search.query);
  const searchResults = useAppSelector((state) => state.search.results);

  const [selectedElement, setSelectedElement] = useState('Movie0');

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

  const keyDownListener = useCallback(
    (event: KeyboardEvent) => {
      const displayList = searchResults.length ? searchResults : movieList;

      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          break;

        case 'ArrowUp':
          setSelectedElement((currentSelection) => {
            if (currentSelection.startsWith('Movie')) {
              const selectedElementHeight = document.querySelector('.selected')!.clientHeight;
              window.scrollBy({ top: -selectedElementHeight });

              const selectedMovieIndex = Number(currentSelection.substring(5));

              if (selectedMovieIndex < 4) return selectableElements[selectedMovieIndex];

              return `Movie${selectedMovieIndex - 4}`;
            }

            const selectedElementIndex = selectableElements.indexOf(currentSelection);

            if (selectedElementIndex < 4) return 'Popular';

            return `Movie${displayList.length - (9 - selectedElementIndex)}`;
          });
          break;

        case 'ArrowDown':
          setSelectedElement((currentSelection) => {
            if (currentSelection.startsWith('Movie')) {
              const selectedElementHeight = document.querySelector('.selected')!.clientHeight;
              window.scrollBy({ top: selectedElementHeight });

              const selectedMovieIndex = Number(currentSelection.substring(5));

              if (selectedMovieIndex >= displayList.length - 4) {
                if (displayMode === 'favorites') return currentSelection;
                const indexInLastRow = selectedMovieIndex % 4;

                // selectableElements[5] === 'First Page'
                return selectableElements[5 + indexInLastRow];
              }

              return `Movie${selectedMovieIndex + 4}`;
            }

            const selectedElementIndex = selectableElements.indexOf(currentSelection);

            if (selectedElementIndex < 4) return `Movie${selectedElementIndex}`;

            return 'Last Page';
          });
          break;

        case 'ArrowLeft':
          setSelectedElement((currentSelection) => {
            if (currentSelection.startsWith('Movie')) {
              const selectedMovieIndex = Number(currentSelection.substring(5));

              if (selectedMovieIndex % 4 === 0) {
                const selectedElementHeight = document.querySelector('.selected')!.clientHeight;
                window.scrollBy({ top: -selectedElementHeight });
              }

              if (selectedMovieIndex === 0) return 'Search';

              return `Movie${selectedMovieIndex - 1}`;
            }

            const selectedElementIndex = selectableElements.indexOf(currentSelection);
            const previousElement = selectableElements[Math.max(selectedElementIndex - 1, 0)];

            if (previousElement === 'Movies') return `Movie${displayList.length - 1}`;

            return previousElement;
          });
          break;

        case 'ArrowRight':
          setSelectedElement((currentSelection) => {
            if (currentSelection.startsWith('Movie')) {
              const selectedMovieIndex = Number(currentSelection.substring(5));

              if (selectedMovieIndex % 4 === 3) {
                const selectedElementHeight = document.querySelector('.selected')!.clientHeight;
                window.scrollBy({ top: selectedElementHeight });
              }

              if (selectedMovieIndex === displayList.length - 1)
                return displayMode === 'favorites' ? currentSelection : 'First Page';

              return `Movie${selectedMovieIndex + 1}`;
            }

            const selectedElementIndex = selectableElements.indexOf(currentSelection);
            const nextElement =
              selectableElements[Math.min(selectedElementIndex + 1, selectableElements.length - 1)];

            if (nextElement === 'Movies') return 'Movie0';

            return nextElement;
          });
          break;

        case 'Enter':
          if (selectedElement === 'Search')
            (document.querySelector('.selected input') as HTMLInputElement).focus();
          else
            (document.querySelector('.selected') as HTMLAnchorElement | HTMLButtonElement).click();
          break;
      }
    },
    [displayMode, movieList, searchResults, selectedElement],
  );

  useEffect(() => {
    document.body.addEventListener('keydown', keyDownListener);
    return () => {
      document.body.removeEventListener('keydown', keyDownListener);
    };
  }, [keyDownListener]);

  useEffect(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    const selectedElementIndex = selectableElements.indexOf(selectedElement);

    if (selectedElementIndex >= 0 && selectedElementIndex < 3) {
      hoverTimeout = setTimeout(() => {
        (document.querySelector('Button.selected') as HTMLButtonElement)?.click();
      }, 2000);
    }
  }, [dispatch, selectedElement]);

  return (
    <main>
      <Button
        variant="text"
        className={selectedElement === 'Popular' ? 'selected' : ''}
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
        className={selectedElement === 'Playing' ? 'selected' : ''}
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
        className={selectedElement === 'Favorites' ? 'selected' : ''}
        onClick={() => dispatch(displayFavorites())}
        onMouseEnter={onFavoritesHover}
        onMouseLeave={onHoverLeave}
        disabled={displayMode === 'favorites'}
        size="large"
      >
        Favorites
      </Button>
      <TextField
        className={`search-input${selectedElement === 'Search' ? ' selected' : ''}`}
        variant="outlined"
        value={searchQuery}
        onChange={onInputChange}
        label="Search"
      />
      <DiscoveryFeed selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
    </main>
  );
};

export default Home;
