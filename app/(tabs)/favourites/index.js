import { StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import favorites from '../../../components/customArray';
import CustomText from '../../../components/customText';
import { useNavigation } from 'expo-router';
import MovieList from '../../../components/movieList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getFavourites = async () => {
  try {
    const favorites = await AsyncStorage.getItem('favourites');
    let favoritesOBJ = favorites ? JSON.parse(favorites) : [];
    console.log("favoriteobj: ", favoritesOBJ);
    return favoritesOBJ;

  } catch (error) {
    console.error("Error updating favorites: ", error);
  }
};
export default function Index() {
  const navigation = useNavigation();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    getFavourites().then(setFavourites);
    console.log(favourites);
  }, []); 


  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
    <CustomText variant="display" align="left" style={styles.title}>Favourites</CustomText>
    <MovieList data={favourites} style={styles.favorites}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  favorites: {
    flexGrow: 1,
  },
  title: {
    paddingLeft: 10,
  },
});
