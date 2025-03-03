import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import useTMDB from '../../hooks/useTMDB';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../components/customText';
import RatingContainer from '../../components/ratingContainer';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';

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

    console.log(movieDetails)
    try {
      const currentMovie = {
        id: movieDetails.id,
        title: movieDetails.title,
        name: movieDetails.name,
        poster_path: movieDetails.poster_path,
        genres: movieDetails.genres,
        tagline: movieDetails.tagline,
        genres: movieDetails.genres,
        overview: movieDetails.overview,
        vote_average: movieDetails.vote_average,
      };

      const favorites = await AsyncStorage.getItem('favourites');
      let favoritesOBJ = favorites ? JSON.parse(favorites) : [];

      const index = favoritesOBJ.findIndex(movie => movie.id === currentMovie.id);

      if (index === -1) {
        favoritesOBJ.push(currentMovie);
        setFavouriteIcon("heart");
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        )
        console.log("Added to favorites: ", currentMovie);
      } else {
        favoritesOBJ.splice(index, 1);
        setFavouriteIcon("heart-outline");
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        )
        console.log("Removed from favorites");
      }

      await AsyncStorage.setItem('favourites', JSON.stringify(favoritesOBJ));
      console.log("Updated favorites: ", favoritesOBJ);
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };


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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
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

            <RatingContainer item={movieDetails} />
            <Text
              style={{ fontSize: 24, color: 'grey', fontWeight: 700 }}
              numberOfLines={2}
            >
              {movieDetails.title ?? movieDetails.name}
            </Text>
            <Text style={{ fontSize: 15, color: 'grey', opacity: 0.8 }}>
              {`${movieDetails.tagline.substring(0, 27)}...`}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {movieDetails.original_language && (
            <Text style={styles.infoText}>Language: {movieDetails.original_language}</Text>
          )}

          <Text style={styles.overview}>{movieDetails.overview}</Text>

          {movieDetails.homepage && (
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(movieDetails.homepage)}>
              <Text style={styles.infoText}>Website: {movieDetails.homepage}</Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={styles.prodContainer}>
          <Text style={styles.sectionTitle}>Production Companies</Text>
          {movieDetails.production_companies?.length > 0 ? (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={movieDetails.production_companies}
              keyExtractor={(studio) => studio.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.prodItem}>
                  <Image
                    source={
                      item.logo_path
                        ? { uri: `https://image.tmdb.org/t/p/w300${item.logo_path}` }
                        : require('../../assets/production-placeholder.png')
                    }
                    style={styles.prodImage}
                    transition={200}
                  />
                  <Text style={styles.castName}>{item.name}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.castList}
            />
          ) : (
            <Text style={styles.noDataText}>No production companies found</Text>
          )}
        </View>

        <View style={styles.castContainer}>
          <Text style={styles.sectionTitle}>Cast</Text>
          {movieDetails.credits?.cast?.length > 0 ? (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={movieDetails.credits.cast}
              keyExtractor={(cast) => cast.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.castItem}>
                  <Image
                    source={
                      item.profile_path
                        ? { uri: `https://image.tmdb.org/t/p/w300${item.profile_path}` }
                        : require('../../assets/profile-placeholder.png')
                    }
                    style={styles.castImage}
                    transition={200}
                  />
                  <Text style={styles.castName}>{item.name}</Text>
                  <Text style={styles.castCharacter}>{item.character}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.castList}
            />
          ) : (
            <Text style={styles.noDataText}>No cast information available</Text>
          )}
        </View>

        <View style={styles.trailerContainer}>
          <Text style={styles.sectionTitle}>Trailers</Text>
          {movieDetails.videos?.results?.filter(video =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
          ).length > 0 ? (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={movieDetails.videos.results.filter(video =>
                video.type === "Trailer" &&
                video.site === "YouTube" &&
                video.official === true
              )}
              keyExtractor={(video) => video.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${item.key}`)}
                  style={{ width: 280, marginHorizontal: 4 }}
                >
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${item.key}/0.jpg` }}
                    style={{ width: "100%", height: 157, borderRadius: 8 }}
                    transition={300}
                  />
                  <Text
                    style={{ fontSize: 14, color: 'grey', marginTop: 4 }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.trailerList}
            />
          ) : (
            <Text style={styles.noDataText}>No trailers available</Text>
          )}
        </View>

        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteContainer}>
          <Ionicons
            name={favoriteIcon}
            size={24}
            color="#FF0000"
            style={styles.favoriteIcon}
          />
          <Text style={styles.favoriteText}>
            {favoriteIcon === "heart" ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  prodContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  prodItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 10,
  },
  prodImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  castContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  castList: {
    paddingVertical: 10,
  },
  castItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 10,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  castName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
    width: 100,
  },
  castCharacter: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
    width: 100,
  },
  separator: {
    width: 10,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    padding: 10,
  },
  favoriteIcon: {
    marginRight: 10,
  },
  favoriteText: {
    fontSize: 16,
    color: '#555',
  },
  trailerContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  trailerList: {
    paddingVertical: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
