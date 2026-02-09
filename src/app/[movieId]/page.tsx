'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSingleMovie } from "@/store/slices/movieSlice";
import { use, useEffect } from "react";

const Page = ({ params }: { params: Promise<{ movieId: string }> }) => {
  const { movieId } = use(params);
  const numberId = Number(movieId)

  const dispatch = useAppDispatch();
  const movieList = useAppSelector((state) => state.movies.movieList);
  const movieDetails = movieList.find((movieObj) => movieObj.movie.id === numberId)

  useEffect(() => {
    if (!movieDetails)
      dispatch(setSingleMovie(numberId))
  }, [dispatch, movieDetails, numberId]);

  return <>{movieDetails?.movie.id}: {movieDetails?.movie.title}</>;
};

export default Page;
