import { View, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "./customText";
import RatingContainer from "./ratingContainer";
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function MovieList({ data }) {
    const [favoriteIcon, setFavouriteIcon] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async (movieDetails) => {
            const favorites = await AsyncStorage.getItem('favourites');
            const favoritesOBJ = favorites ? JSON.parse(favorites) : [];
            const isFavorite = favoritesOBJ.some(movie => movie.id === movieDetails.id);
            setFavouriteIcon(isFavorite ? "heart" : "heart-outline");
        };

        if (data.length > 0) {
            checkFavoriteStatus(data[0]); 
        }
    }, [data]);

    const toggleFavorite = async (movieDetails) => {
        try {
            const currentMovie = {
                id: movieDetails.id,
                title: movieDetails.title,
                name: movieDetails.name,
                poster_path: movieDetails.poster_path,
                genres: movieDetails.genres,
                tagline: movieDetails.tagline,
                overview: movieDetails.overview,
                vote_average: movieDetails.vote_average,
            };

            const favorites = await AsyncStorage.getItem('favourites');
            let favoritesOBJ = favorites ? JSON.parse(favorites) : [];

            const index = favoritesOBJ.findIndex(movie => movie.id === currentMovie.id);

            if (index === -1) {
                favoritesOBJ.push(currentMovie);
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                )
                setFavouriteIcon("heart");
            } else {
                favoritesOBJ.splice(index, 1);
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                 )
                setFavouriteIcon("heart-outline");
            }

            await AsyncStorage.setItem('favourites', JSON.stringify(favoritesOBJ));
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
                renderItem={({ item }) => (
                    <View style={styles.listItemContainer}>
                        <Link push href={`/${item.title ? 'movie' : 'show'}/${item.id}`}>
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
                                        {item.tagline ? item.tagline : (item.overview ? `${item.overview.substring(0, 35)}...` : 'No Description')}
                                    </CustomText>
                                    <RatingContainer item={item} style={styles.ratingContainer} />
                                    <View style={styles.genreContainer}>
                                        {item.genres && item.genres.splice(0, 2).map((genre, index) => (
                                            <CustomText key={genre.id} color="white" style={styles.labels}>
                                                {genre.name}
                                            </CustomText>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Link>
                        <TouchableOpacity onPress={() => toggleFavorite(item)}>
                            <Ionicons name={favoriteIcon} size={24} color={"#FF0000"} />
                        </TouchableOpacity>
                    </View>
                )}
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
        flexWrap: 'wrap',
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
