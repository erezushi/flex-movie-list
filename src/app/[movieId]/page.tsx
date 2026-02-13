'use client';

import { ImageNotSupportedRounded, StarOutlineRounded, StarRounded } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavorite, removeFavorite, setSingleMovie } from '@/store/slices/movieSlice';

import genreIdList from './genreIds.json';

import './page.css';

const Page = ({ params }: { params: Promise<{ movieId: string }> }) => {
  const { movieId } = use(params);
  const numberId = Number(movieId);

  const dispatch = useAppDispatch();

  const movieList = useAppSelector((state) => state.movies.movieList);
  const favorites = useAppSelector((state) => state.movies.favorites);

  const isLoading = useAppSelector((state) => state.request.isLoading);
  const errorMessage = useAppSelector((state) => state.request.error);

  const movieObj = movieList.find((movieObj) => movieObj.movie.id === numberId);
  const isInFavorites = favorites.includes(numberId);

  const [selectedElement, setSelectedElement] = useState<'Back' | 'Favorite'>('Favorite');

  useEffect(() => {
    if (!movieObj) dispatch(setSingleMovie(numberId));
  }, [dispatch, movieObj, numberId]);

  const keyDownListener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape')
      (document.querySelector('a.back-button') as HTMLAnchorElement).click();
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') setSelectedElement('Back');
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') setSelectedElement('Favorite');
    if (event.key === 'Enter')
      (document.querySelector('.selected') as HTMLAnchorElement | HTMLButtonElement).click();
  }, []);

  useEffect(() => {
    document.body.addEventListener('keydown', keyDownListener);
    return () => {
      document.body.removeEventListener('keydown', keyDownListener);
    };
  }, [keyDownListener]);

  if (isLoading) return <CircularProgress />;
  if (errorMessage) return <>{errorMessage}</>;

  return (
    <main>
      <Link href="/" className={`back-button${selectedElement === 'Back' ? ' selected' : ''}`}>
        ↩ Back
      </Link>
      {movieObj && (
        <div className="details">
          {movieObj.poster ? (
            <Image
              className="details-poster"
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
          <div className="text-details">
            <span className="details-title">{movieObj.movie.title}</span>
            <br />
            <span className="release-year">({movieObj.movie.release_date.substring(0, 4)})</span>
            <br />
            <br />
            <span className="movie-genres">
              genres:{' '}
              {'genres' in movieObj.movie
                ? movieObj.movie.genres.map((genre) => genre.name).join(', ')
                : movieObj.movie.genre_ids
                    .map((id) => (genreIdList as Record<number, string>)[id])
                    .join(', ')}
            </span>
            <br />
            <br />
            <span className="movie-overview">{movieObj.movie.overview}</span>
            <br />
            {isInFavorites ? (
              <IconButton
                className={selectedElement === 'Favorite' ? 'selected' : ''}
                onClick={() => dispatch(removeFavorite(numberId))}
              >
                <StarRounded sx={{ color: '#FFFF00' }} />
              </IconButton>
            ) : (
              <IconButton
                className={selectedElement === 'Favorite' ? 'selected' : ''}
                onClick={() => dispatch(addFavorite(numberId))}
              >
                <StarOutlineRounded />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
