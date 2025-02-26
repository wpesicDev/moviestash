import { useState, useEffect } from 'react';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const useMovieData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, dataType, movieId = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (movieId) {
        setData((prevData) => ({
          ...prevData,
          movieDetails: {
            ...prevData.movieDetails,
            [movieId]: result,
          },
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          [dataType]: result,
        }));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDiscoverMovies = (page = 1) => {
    const url = `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
    fetchData(url, 'movies');
  };

  const getDiscoverShows = (page = 1) => {
    const url = `${BASE_URL}/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
    fetchData(url, 'shows');
  };

  const getMovieDetails = (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}?append_to_response=credits&language=en-US`;
    fetchData(url, null, movieId);
  };

  return {
    data,
    loading,
    error,
    getDiscoverMovies,
    getDiscoverShows,
    getMovieDetails,
  };
};

export default useMovieData;