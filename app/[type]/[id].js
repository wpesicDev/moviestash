import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useTMDB from '../../hooks/useTMDB';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MovieDetail() {
  const { id, type } = useLocalSearchParams();
  const { data, getMovieDetails, getShowDetails } = useTMDB();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const navigation = useNavigation();

  // Set header options initially to prevent flickering
  useEffect(() => {
    const initialTitle = type === 'movie' ? 'Movie Details' : 'TV Show Details';
    navigation.setOptions({
      title: initialTitle,
      headerBlurEffect: 'regular',
      headerTransparent: true,
    });
  }, [type, navigation]);

  useEffect(() => {
    if (!data?.movieDetails?.[id]) {
      const fetchDetails = async () => {
        setLocalLoading(true);
        setLocalError(null);
        try {
          if (type === 'movie') {
            await getMovieDetails(id);
          } else if (type === 'show') {
            await getShowDetails(id);
          }
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
  }, [id, data, getMovieDetails, getShowDetails, type]);

  const movieDetails = data?.movieDetails?.[id];

  // Update header title when movieDetails is available
  useEffect(() => {
    if (movieDetails?.title || movieDetails?.name) {
      navigation.setOptions({
        title: movieDetails.title ?? movieDetails.name,
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
    <SafeAreaView style={{ marginBottom: 24 }}>
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
          >
            {movieDetails.title ?? movieDetails.name}
          </Text>
          <Text style={{ fontSize: 15, color: 'grey', opacity: 0.8 }}>
            {movieDetails.tagline}
          </Text>
        </View>
      </View>
      <Text>{movieDetails.overview}</Text>
      <Text>Movie ID: {id}</Text>
    </SafeAreaView>
  );
}