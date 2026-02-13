'use client';

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
import { Dispatch, MouseEvent, SetStateAction, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { firstPage, lastPage, nextPage, previousPage } from '@/store/slices/movieSlice';

interface DiscoveryFeedProps {
  selectedElement: string;
  setSelectedElement: Dispatch<SetStateAction<string>>;
}

const DiscoveryFeed = ({
  selectedElement,
  setSelectedElement,
}: DiscoveryFeedProps) => {
  const dispatch = useAppDispatch();

  const displayMode = useAppSelector((state) => state.movies.displayMode);
  const currentPage = useAppSelector((state) => state.movies.currentPage);
  const totalPages = useAppSelector((state) => state.movies.totalPages);
  const movieList = useAppSelector((state) => state.movies.movieList);

  const searchResults = useAppSelector((state) => state.search.results);

  const isLoading = useAppSelector((state) => state.request.isLoading);
  const errorMessage = useAppSelector((state) => state.request.error);

  const displayList = searchResults.length ? searchResults : movieList;

  const onPageChangeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      switch (event.currentTarget.name) {
        case 'first-page':
          dispatch(firstPage());
          break;
        case 'previous-page':
          dispatch(previousPage());
          break;
        case 'next-page':
          dispatch(nextPage());
          break;
        case 'last-page':
          dispatch(lastPage());
          break;
      }

      setSelectedElement('Movie0');
    },
    [dispatch, setSelectedElement],
  );

  if (isLoading) return <CircularProgress />;
  if (errorMessage) return <>{errorMessage}</>;

  return (
    <div className="discovery-feed">
      <div className="movie-list">
        {displayList.map((movieObj, index) => (
          <Link
            href={movieObj.movie.id.toString()}
            key={movieObj.movie.id}
            className={`movie-link${selectedElement === `Movie${index}` ? ' selected' : ''}`}
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
            className={selectedElement === 'First Page' ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="first-page"
            disabled={currentPage <= 2}
          >
            <FirstPageRounded />
          </IconButton>
          <IconButton
            className={selectedElement === 'Previous Page' ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="previous-page"
            disabled={currentPage <= 1}
          >
            <ChevronLeftRounded />
          </IconButton>
          {currentPage} / {totalPages}
          <IconButton
            className={selectedElement === 'Next Page' ? 'selected' : ''}
            onClick={onPageChangeClick}
            name="next-page"
            disabled={currentPage >= totalPages}
          >
            <ChevronRightRounded />
          </IconButton>
          <IconButton
            className={selectedElement === 'Last Page' ? 'selected' : ''}
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
