import { FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import RatingContainer from "./ratingContainer";

export default function MovieSlider(props) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.data?.results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Link push href={`/${item.title ? "movie" : "show"}/${item.id}`}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
                }}
                style={{ borderRadius: 12, width: "100%", height: "100%" }}
                transition={200}
              />
            </Link>
            <Text>{item.title ?? item.name}</Text>
            <RatingContainer item={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: 250,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  item: {
    marginBottom: 20,
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 150,
    height: 225,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  seperator: {
    width: 10,
  },
  movieItem: {
    height: 200,
    width: 130,
  },
});
