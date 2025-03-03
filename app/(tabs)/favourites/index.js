import { StyleSheet, SafeAreaView, View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../../../components/customText";
import MovieList from "../../../components/movieList";
import { useNavigation } from "expo-router";

const getFavourites = async () => {
  try {
    const favorites = await AsyncStorage.getItem("favourites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error updating favorites: ", error);
  }
};

export default function Index() {
  const navigation = useNavigation();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    getFavourites().then(setFavourites);
  }, [favourites]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomText variant="display" align="left" style={styles.title}>
        Favourites
      </CustomText>
      {favourites.length === 0 ? (
        <View style={styles.centerMessage}>
          <CustomText style={styles.noFavoritesText}>
            No movies favourited
          </CustomText>
        </View>
      ) : (
        <MovieList data={favourites} style={styles.favorites} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  favorites: {
    flexGrow: 1,
  },
  title: {
    paddingLeft: 10,
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  noFavoritesText: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    color: "grey",
  },
});
