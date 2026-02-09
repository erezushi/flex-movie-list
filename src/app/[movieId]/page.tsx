'use client';

import Image from 'next/image';
import { use, useEffect } from 'react';
import { ImageNotSupportedRounded, StarOutlineRounded, StarRounded } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavorite, removeFavorite, setSingleMovie } from '@/store/slices/movieSlice';
import genreIdList from './genreIds.json';

import './page.css';
import { IconButton } from '@mui/material';

const Page = ({ params }: { params: Promise<{ movieId: string }> }) => {
  const { movieId } = use(params);
  const numberId = Number(movieId);

  const dispatch = useAppDispatch();
  const movieList = useAppSelector((state) => state.movies.movieList);
  const movieObj = movieList.find((movieObj) => movieObj.movie.id === numberId);
  const favorites = useAppSelector((state) => state.movies.favorites);
  const isInFavorites = favorites.includes(numberId);

  useEffect(() => {
    if (!movieObj) dispatch(setSingleMovie(numberId));
  }, [dispatch, movieObj, numberId]);

  return (
    <>
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
              <IconButton onClick={() => dispatch(removeFavorite(numberId))}>
                <StarRounded sx={{color: '#FFFF00'}} />
              </IconButton>
            ) : (
              <IconButton onClick={() => dispatch(addFavorite(numberId))}>
                <StarOutlineRounded />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
