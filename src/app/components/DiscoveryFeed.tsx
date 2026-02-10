'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { firstPage, lastPage, nextPage, previousPage } from '@/store/slices/movieSlice';
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  FirstPageRounded,
  ImageNotSupportedRounded,
  LastPageRounded,
} from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

const DiscoveryFeed = () => {
  const dispatch = useAppDispatch();

  const displayMode = useAppSelector((state) => state.movies.displayMode);
  const currentPage = useAppSelector((state) => state.movies.currentPage);
  const totalPages = useAppSelector((state) => state.movies.totalPages);
  const movieList = useAppSelector((state) => state.movies.movieList);

  const searchResults = useAppSelector((state) => state.search.results);

  const isLoading = useAppSelector((state) => state.request.isLoading);
  const errorMessage = useAppSelector((state) => state.request.error);

  const displayList = searchResults.length ? searchResults : movieList;

  const [selectedElement, setSelectedElement] = useState(0);

  const keyDownListener = useCallback(
    (event: KeyboardEvent) => {
      console.log(`here ${event.key}`);

      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          break;
        case 'ArrowUp':
          setSelectedElement((current) => {
            const newState = Math.max(current - 4, 0);

            if (current < displayList.length) window.scrollBy({ top: -300 });

            return newState;
          });
          break;
        case 'ArrowDown':
          setSelectedElement((current) => {
            const newState = Math.min(current + 4, displayList.length + 3);

            if (newState < displayList.length) window.scrollBy({ top: 300 });

            return newState;
          });
          break;
        case 'ArrowRight':
          setSelectedElement((current) => {
            const newState = Math.min(current + 1, displayList.length + 3);

            if (newState < displayList.length) {
              const currentRow = Math.floor(current / 4);
              const newRow = Math.floor(newState / 4);

              if (currentRow !== newRow) window.scrollBy({ top: 300 });
            }

            return newState;
          });
          break;
        case 'ArrowLeft':
          setSelectedElement((current) => {
            const newState = Math.max(current - 1, 0);

            if (current < displayList.length) {
              const currentRow = Math.floor(current / 4);
              const newRow = Math.floor(newState / 4);

              if (currentRow !== newRow) window.scrollBy({ top: -300 });
            }

            return newState;
          });
          break;
        case 'Enter':
          (document.querySelector('.selected') as HTMLAnchorElement | HTMLButtonElement).click();
          break;
      }
    },
    [displayList.length],
  );

  useEffect(() => {
    document.body.addEventListener('keydown', keyDownListener);
    return () => {
      document.body.removeEventListener('keydown', keyDownListener);
    };
  }, [keyDownListener]);

  const onPageChangeClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    switch (event.currentTarget.name) {
      case "first-page":
        dispatch(firstPage());
        break;
      case "previous-page":
        dispatch(previousPage());
        break;
      case "next-page":
        dispatch(nextPage());
        break;
      case "last-page":
        dispatch(lastPage());
        break;
    }

    setSelectedElement(0);
  }, [dispatch]);

  if (isLoading) return <CircularProgress />
  if (errorMessage) return <>{errorMessage}</>

  return (
    <div className="discovery-feed">
      <div className="movie-list">
        {displayList.map((movieObj, index) => (
          <Link
            href={movieObj.movie.id.toString()}
            key={movieObj.movie.id}
            className={`movie-link${selectedElement === index ? ' selected' : ''}`}
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
              <span className="release-year">{movieObj.movie.release_date.substring(0, 4)}</span>
            </div>
          </Link>
        ))}
      </div>
      {displayMode !== 'favorites' && (
        <div className="pagination">
          <IconButton
            className={selectedElement === displayList.length ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="first-page"
            disabled={currentPage <= 2}
          >
            <FirstPageRounded />
          </IconButton>
          <IconButton
            className={selectedElement === displayList.length + 1 ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="previous-page"
            disabled={currentPage <= 1}
          >
            <ChevronLeftRounded />
          </IconButton>
          {currentPage} / {totalPages}
          <IconButton
            className={selectedElement === displayList.length + 2 ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="next-page"
            disabled={currentPage >= totalPages}
          >
            <ChevronRightRounded />
          </IconButton>
          <IconButton
            className={selectedElement === displayList.length + 3 ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="last-page"
            disabled={currentPage >= totalPages - 1}
          >
            <LastPageRounded />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
