'use client';

import { Button, IconButton, TextField } from '@mui/material';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  displayFavorites,
  displayPlaying,
  displayPopular,
  firstPage,
  lastPage,
  nextPage,
  previousPage,
} from '@/store/slices/movieSlice';
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  FirstPageRounded,
  ImageNotSupportedRounded,
  LastPageRounded,
} from '@mui/icons-material';
import Link from 'next/link';
import { ChangeEvent, useCallback } from 'react';
import { setQuery } from '@/store/slices/searchSlice';

let hoverTimeout: NodeJS.Timeout | null = null;

const Home = () => {
  const dispatch = useAppDispatch();

  const displayMode = useAppSelector((state) => state.movies.displayMode);
  const currentPage = useAppSelector((state) => state.movies.currentPage);
  const totalPages = useAppSelector((state) => state.movies.totalPages);
  const movieList = useAppSelector((state) => state.movies.movieList);
  
  const searchQuery = useAppSelector((state) => state.search.query);
  const searchResults = useAppSelector((state) => state.search.results);

  const displayList = searchResults.length ? searchResults : movieList;

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
    <>
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
        <div className="discovery-feed">
          <div className="movie-list">
            {displayList.map((movieObj) => (
              <Link
                href={movieObj.movie.id.toString()}
                key={movieObj.movie.id}
                className="movie-link"
              >
                <div className="movie">
                  {movieObj.poster ? (
                    <Image
                      className="movie-poster"
                      alt={`${movieObj.movie.title} poster`}
                      src={`https://image.tmdb.org/t/p/original${movieObj.poster.file_path}`}
                      width={movieObj.poster.width}
                      height={movieObj.poster.height}
                    />
                  ) : (
                    <div className="missing-poster">
                      <ImageNotSupportedRounded fontSize="large" />
                      Poster Missing
                    </div>
                  )}
                  <span className="movie-title">{movieObj.movie.title}</span>
                  <span className="release-year">
                    {movieObj.movie.release_date.substring(0, 4)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {displayMode !== 'favorites' && (
            <div className="pagination">
              <IconButton onClick={() => dispatch(firstPage())} disabled={currentPage <= 2}>
                <FirstPageRounded />
              </IconButton>
              <IconButton onClick={() => dispatch(previousPage())} disabled={currentPage <= 1}>
                <ChevronLeftRounded />
              </IconButton>
              {currentPage} / {totalPages}
              <IconButton onClick={() => dispatch(nextPage())} disabled={currentPage >= totalPages}>
                <ChevronRightRounded />
              </IconButton>
              <IconButton
                onClick={() => dispatch(lastPage())}
                disabled={currentPage >= totalPages - 1}
              >
                <LastPageRounded />
              </IconButton>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
