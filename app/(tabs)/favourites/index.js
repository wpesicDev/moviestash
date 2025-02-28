import { StyleSheet, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import favorites from '../../../components/customArray';
import CustomText from '../../../components/customText';
import { useNavigation } from 'expo-router';
import MovieList from '../../../components/movieList';

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
    <CustomText variant="display" align="left" style={styles.title}>Favorites</CustomText>
    <MovieList data={favorites.favorites} style={styles.favorites}/>
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
