import { View, FlatList, Image, StyleSheet } from "react-native";
import CustomText from "./customText";
import RatingContainer from "./ratingContainer";
import { Ionicons } from "@expo/vector-icons";
export default function MovieList({data}) {
    return (
        <View style={styles.container}>
            <FlatList
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                data={data.favorites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.movieItem}>
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                            }}
                            style={{
                                width: 100,
                                height: 150,
                                borderRadius: 8,
                                marginRight: 16,
                            }}
                            transition={300}
                        />
                        <View style={styles.movieItemTextContainer}>
                            <CustomText
                                variant="title"
                                numberOfLines={2}
                            >{item.title ?? item.name}</CustomText>
                            <CustomText color='grey' >
                                {item.tagline}
                            </CustomText>
                            <RatingContainer item={item} style={styles.ratingContainer} />
                            <View style={styles.lowerContainer}>
                                <View style={styles.genreContainer}>
                                    {item.genres.slice(0, 3).map((genre) => (
                                        <CustomText key={genre} color='white' style={styles.labels}>
                                            {genre}
                                        </CustomText>
                                    ))}
                                </View>
                                <Ionicons name="heart" size={24} color={"#FF0000"} />
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 100,
      },
      movieItem: {
        flexDirection: "row",
        paddingTop: 16,
        paddingBottom: 16,
      },
      movieItemTextContainer: {
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "60%",
    
      },
      lowerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "top",
    
      },
      labels: {
        width: "auto",
        backgroundColor: "#8e8e93",
        padding: 4,
        borderRadius: 5,
      },
      genreContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
      },
      ratingContainer: {
        paddingBottom: 10,
      },
});