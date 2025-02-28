import { View, FlatList, Image, StyleSheet, SafeAreaView, } from "react-native";
import { useState, useEffect } from "react";
import CustomText from "./customText";
import RatingContainer from "./ratingContainer";
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';


export default function MovieList({ data }) {
    const [favoriteIcon, setFavouriteIcon] = useState(false);

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


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                contentContainerStyle={styles.flatListContainer}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                    item.poster_path ? (
                        <Link push href={`/${item.title ? 'movie' : 'show'}/${item.id}`}>
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
                                    <CustomText variant="title" numberOfLines={2}>
                                        {item.title ?? item.name}
                                    </CustomText>
                                    <CustomText
                                        color="grey"
                                        numberOfLines={1}
                                        style={styles.tagline}
                                    >
                                        {item.tagline ? item.tagline : (item.overview ? `${item.overview.substring(0, 35)}...` : 'No Description')}
                                    </CustomText>
                                    <RatingContainer item={item} style={styles.ratingContainer} />
                                    <View style={styles.lowerContainer}>
                                        {item.genres && item.genres.length > 0 && (
                                            <View style={styles.genreContainer}>
                                                {item.genres.slice(0, 2).map((genre, index) => (
                                                    <CustomText key={genre.id} color="white" style={styles.labels}>
                                                        {genre.name}
                                                    </CustomText>
                                                ))}
                                            </View>
                                        )}

                                        <Ionicons
                                            name="heart"
                                            size={24}
                                            color={"#FF0000"}
                                            onPress={toggleFavorite}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Link>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: "100%",
    },
    movieItem: {
        flexDirection: "row",
        width: "100%",
        padding: 10,
    },
    flatListContainer: {
        flexGrow: 1,
        padding: 5,
    },
    movieItemTextContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 10,
    },
    lowerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    labels: {
        backgroundColor: "#8e8e93",
        padding: 4,
        width: "auto",
        borderRadius: 5,
    },
    genreContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 5,
    },
    ratingContainer: {
        paddingBottom: 10,
    },
});



