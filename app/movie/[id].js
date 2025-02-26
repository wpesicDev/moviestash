import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useTMDB from '../../hooks/useTMDB';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const { data, getMovieDetails } = useTMDB();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!data?.movieDetails?.[id]) {
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
    } else {
      setLocalLoading(false);
    }
  }, [id, data, getMovieDetails]);

  const movieDetails = data?.movieDetails?.[id];

  useEffect(() => {
    if (movieDetails?.title) {
      navigation.setOptions({
        title: movieDetails.title,
        headerBlurEffect: 'regular',
        headerTransparent: true,
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
      <SafeAreaView style={{ marginBottom: 24}}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w780${movieDetails.backdrop_path}`,
          }}
          style={{
            width: "100%",
            height: 300,
            resizeMode: "cover",
          }}
          transition={300}
        />
        <View style={{ padding: 16, marginTop: -60, flexDirection: "row" }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
            }}
            style={{
              width: 100,
              height: 150,
              borderRadius: 8,
              marginRight: 16,
            }}
            transition={300}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: 'grey',
                marginBottom: 8,
              }}
            >
            </Text>
            <Text
              style={{ fontSize: 24, color: 'grey', fontWeight: 700 }}
              numberOfLines={2}
            >{movieDetails.title ?? movieDetails.name}</Text>
            <Text style={{ fontSize: 15, color: 'grey', opacity: 0.8 }}>
              {movieDetails.tagline}
            </Text>
          </View>
        </View>
      <Text>{movieDetails.overview}</Text>
      
      <Text>Movie ID: {id}</Text>
      <Text>Title: {movieDetails.title}</Text>
      </SafeAreaView>

  );
}