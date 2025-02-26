import { useState, useEffect } from 'react';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
console.log(API_KEY)
const BASE_URL = 'https://api.themoviedb.org/3';

const useMovieData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'accept': 'application/json'
        }
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDiscoverMovies = (page = 1) => {
    const url = `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
    console.log('fetching discover')
    fetchData(url);
  };



  const getMovieDetails = (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}?language=en-US`;
    fetchData(url);
  };

  const getMovieCast = (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}/credits?language=en-US`;
    fetchData(url);
  };

  return {
    data,
    loading,
    error,
    getDiscoverMovies,
    getMovieDetails,
    getMovieCast
  };
};

export default useMovieData;
