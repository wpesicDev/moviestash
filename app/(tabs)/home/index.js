import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import useTMDB from '../../../hooks/useTMDB';
import { useEffect, useState } from 'react';
import MovieSlider from '../../../components/movieSlider';
import CustomText from '../../../components/customText';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, loading, error, getDiscoverMovies, getDiscoverShows } = useTMDB();
  const navigation = useNavigation();


  useEffect(() => {
       getDiscoverMovies();
       getDiscoverShows();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomText variant="display" align="left">Search</CustomText>
        <CustomText variant="headline" align="left">Movies</CustomText>
        <MovieSlider data={data?.movies}/>
        <CustomText variant="headline" align="left">Shows</CustomText>
        <MovieSlider data={data?.shows}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  item: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 150,
    height: 225,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

