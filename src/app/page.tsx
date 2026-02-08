'use client';

import { Button } from '@mui/material';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { displayFavorites, displayPlaying, displayPopular } from '@/store/slices/movieSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const displayMode = useAppSelector((state) => state.movies.displayMode);
  const currentPage = useAppSelector((state) => state.movies.currentPage);
  const movieList = useAppSelector((state) => state.movies.movieList);

  return (
    <>
      <main>
        <Button
          variant="text"
          onClick={() => dispatch(displayPopular())}
          disabled={displayMode === 'popular'}
        >
          Popular
        </Button>
        |
        <Button
          variant="text"
          onClick={() => dispatch(displayPlaying())}
          disabled={displayMode === 'playing'}
        >
          Now Playing
        </Button>
        |
        <Button
          variant="text"
          onClick={() => dispatch(displayFavorites())}
          disabled={displayMode === 'favorites'}
        >
          Favorites
        </Button>
        <div className="movie-list">
          {movieList.map((movieObj) => (
            <div className="movie" key={movieObj.movie.id}>
              <Image
                className="movie-poster"
                alt={`${movieObj.movie.title} poster`}
                src={`https://image.tmdb.org/t/p/original${movieObj.movie.poster_path}`}
                width={movieObj.poster.width}
                height={movieObj.poster.height}
              />
              <span className="movie-title">
                {movieObj.movie.title}
              </span>
              <span className="release-year">
                {movieObj.movie.release_date.substring(0,4)}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
