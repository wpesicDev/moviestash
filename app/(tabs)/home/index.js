import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput } from 'react-native';
import useTMDB from '../../../hooks/useTMDB';
import { useEffect, useState } from 'react';
import MovieSlider from '../../../components/movieSlider';
import CustomText from '../../../components/customText';
import { useNavigation } from '@react-navigation/native';
import MovieList from '../../../components/movieList';

export default function Index() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data, loading, error, getDiscoverMovies, getDiscoverShows, getSearchResults} = useTMDB();
  const navigation = useNavigation();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      getSearchResults(search)
      console.log(data.search)
      console.log('tf')
    }
  }, [debouncedSearch]);

  useEffect(() => {
    getDiscoverMovies();
    getDiscoverShows();
    navigation.setOptions({
      headerTitle: '',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomText variant="display" align="left" style={styles.title}>Home</CustomText>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setSearch}
          value={search}
          placeholder='Search for Movies, Shows and Actors'
          returnKeyType={'done'}
        />

{(() => {
          if (search !== '' && search.length >= 3) {
            if (data.search?.results?.length > 0) {
              return (
                <>
                  <MovieList data={data.search?.results} />
                </>
              );
            } else {
              return (
                <>
                  <Text>No results found</Text>
                </>
              );
            }
          } else if (search !== '' && search.length < 3) {
            return (
              <>
                <Text>Search with at least 3 characters</Text>
              </>
            );
          } else {
            return (
              <>
                <CustomText variant="title" align="left">
                  Popular Movies
                </CustomText>
                <MovieSlider data={data?.movies} />
                <CustomText variant="title" align="left">
                  Popular Series
                </CustomText>
                <MovieSlider data={data?.shows} />
              </>
            );
          }
        })()}

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    borderRadius: 99,
    borderColor: '#ddd',
    marginBottom: 20,
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
  },
  safeAreaView: {
    backgroundColor: '#fff',
  },
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
    width: 10,
    height: 225,
    resizeMode: 'cover',
  },
  title: {
    paddingLeft: 10,
  },
});

