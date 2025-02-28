import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useTMDB from '../../hooks/useTMDB';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MovieDetail() {
  const { id, type } = useLocalSearchParams();
  const { data, getMovieDetails, getShowDetails } = useTMDB();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [favoriteIcon, setFavouriteIcon] = useState(false);
  const navigation = useNavigation();

  const checkFavoriteStatus = async () => {
    const favorites = await AsyncStorage.getItem('favourites');
    const favoritesOBJ = favorites ? JSON.parse(favorites) : [];
    const isFavorite = favoritesOBJ.some(movie => movie.id === movieDetails.id);
    setFavouriteIcon(isFavorite ? "heart" : "heart-outline");
  };

  const toggleFavorite = async () => {
    try {
      const currentMovie = {
        id: movieDetails.id, 
        title: movieDetails.title,
        name: movieDetails.name, 
        poster_path: movieDetails.poster_path, 
        genres: movieDetails.genres, 
        tagline: movieDetails.tagline
      };
  
      // Retrieve the current list of favorites from AsyncStorage
      const favorites = await AsyncStorage.getItem('favourites');
      let favoritesOBJ = favorites ? JSON.parse(favorites) : [];
  
      // Check if the movie is already in favorites
      const index = favoritesOBJ.findIndex(movie => movie.id === currentMovie.id);
  
      if (index === -1) { // Not in favorites, add it
        favoritesOBJ.push(currentMovie);
        setFavouriteIcon("heart");
        console.log("Added to favorites: ", currentMovie);
      } else { 
        favoritesOBJ.splice(index, 1);
        setFavouriteIcon("heart-outline");
        console.log("Removed from favorites");
      }
  
      await AsyncStorage.setItem('favourites', JSON.stringify(favoritesOBJ));
      console.log("Updated favorites: ", favoritesOBJ);
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };
  

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
    if (id && movieDetails) {
      checkFavoriteStatus();
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
      <Ionicons 
        name={favoriteIcon} 
        size={24} 
      color={"#FF0000"} 
      onPress={toggleFavorite}
    />
    </SafeAreaView>
  );
}