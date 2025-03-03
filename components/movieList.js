import {
  View,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "./customText";
import RatingContainer from "./ratingContainer";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as Haptics from "expo-haptics";

export default function MovieList({ data }) {
  const [favoriteIcons, setFavoriteIcons] = useState({});

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const favorites = await AsyncStorage.getItem("favourites");
      const favoritesOBJ = favorites ? JSON.parse(favorites) : [];

      const newFavoritesState = {};
      data.forEach((movie) => {
        newFavoritesState[movie.id] = favoritesOBJ.some(
          (fav) => fav.id === movie.id,
        )
          ? "heart"
          : "heart-outline";
      });

      setFavoriteIcons(newFavoritesState);
    };

    if (data.length > 0) {
      checkFavoriteStatus();
    }
  }, [data]);

  const toggleFavorite = async (movieDetails) => {
    try {
      const favorites = await AsyncStorage.getItem("favourites");
      let favoritesOBJ = favorites ? JSON.parse(favorites) : [];

      const index = favoritesOBJ.findIndex(
        (movie) => movie.id === movieDetails.id,
      );
      let newFavoriteIcons = { ...favoriteIcons };

      if (index === -1) {
        favoritesOBJ.push(movieDetails);
        newFavoriteIcons[movieDetails.id] = "heart";
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        favoritesOBJ.splice(index, 1);
        newFavoriteIcons[movieDetails.id] = "heart-outline";
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      setFavoriteIcons(newFavoriteIcons);
      await AsyncStorage.setItem("favourites", JSON.stringify(favoritesOBJ));
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          data={data.filter(item => item.poster_path)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <Link push href={`/${item.title ? "movie" : "show"}/${item.id}`}>
                <View style={styles.movieItem}>
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                    }}
                    style={styles.movieImage}
                  />
                  <View style={styles.movieItemTextContainer}>
                    <CustomText variant="title" numberOfLines={2}>
                      {item.title ?? item.name}
                    </CustomText>
                    <CustomText
                      color="grey"
                      numberOfLines={1}
                      style={styles.tagline}
                    >
                      {item.tagline
                        ? item.tagline
                        : item.overview
                          ? `${item.overview.substring(0, 35)}...`
                          : "No Description"}
                    </CustomText>
                    <RatingContainer
                      item={item}
                      style={styles.ratingContainer}
                    />
                    <View style={styles.genreContainer}>
                      {item.genres &&
                        item.genres.slice(0, 2).map((genre) => (
                          <CustomText
                            key={genre.id}
                            color="white"
                            style={styles.labels}
                          >
                            {genre.name}
                          </CustomText>
                        ))}
                    </View>
                  </View>
                </View>
              </Link>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Ionicons
                  name={favoriteIcons[item.id] || "heart-outline"}
                  size={24}
                  color={"#FF0000"}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    paddingRight: 10,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    padding: 8,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  movieItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  labels: {
    backgroundColor: "#8e8e93",
    padding: 4,
    width: "auto",
    borderRadius: 5,
  },
  ratingContainer: {
    paddingBottom: 10,
  },
  flatListContainer: {
    flexGrow: 1,
    padding: 5,
  },
});
