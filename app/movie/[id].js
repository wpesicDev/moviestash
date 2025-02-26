import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useTMDB from '../../hooks/useTMDB';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const { data, getMovieDetails } = useTMDB();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDetails = async () => {
      setLocalLoading(true);
      setLocalError(null);
      try {
        await getMovieDetails(id);
      } catch (err) {
        setLocalError(err.message);
      } finally {
        setLocalLoading(false);
      }
    };
    fetchDetails();
  }, [id, getMovieDetails]);

  const movieDetails = data?.movieDetails?.[id];

  //Update header title lol
  useEffect(() => {
    if (movieDetails?.title) {
      navigation.setOptions({
        title: movieDetails.title
      });
    }
  }, [movieDetails, navigation]);

  if (localLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (localError) {
    return (
      <View>
        <Text>Error: {localError}</Text>
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View>
        <Text>No data available for Movie ID: {id}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Movie ID: {id}</Text>
      <Text>Title: {movieDetails.title}</Text>
      <Text>Overview: {movieDetails.overview}</Text>
    </View>
  );
}