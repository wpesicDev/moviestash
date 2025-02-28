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

  const { data, loading, error, getDiscoverMovies, getDiscoverShows, getSearchResults } = useTMDB();
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
      if (search.length >= 3) {
        getSearchResults(search)
        console.log(data.search)
      }
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
        if (loading) {
          return (
            <View style={styles.notfound}>
              <Text>Loading...</Text>
            </View>
          );
        }
        if (search !== '' && search.length >= 3) {
          if (data.search?.results?.length > 0) {
            return (
              <View>
                <MovieList data={data.search?.results} />
              </View>
            );
          } else {
            return (
              <View style={styles.notfound}>
                <Text>No results found</Text>
              </View>
            );
          }
        } else if (search !== '' && search.length < 3) {
          return (
            <View style={styles.notfound}>
              <Text>Search with at least 3 characters</Text>
            </View>
          );
        } else {
          return (
            <View>
              <CustomText variant="title" align="left">
                Popular Movies
              </CustomText>
              <MovieSlider data={data?.movies} />
              <CustomText variant="title" align="left">
                Popular Series
              </CustomText>
              <MovieSlider data={data?.shows} />
            </View>
          );
        }
      })()}
    </ScrollView>
  </SafeAreaView>
  
  );
}
const styles = StyleSheet.create({
  notfound: {
    height: 300,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    minWidth: '100%',
    width: "95%",
    borderRadius: 15,
    borderColor: '#ddd',
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  safeAreaView: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    paddingBottom: 70,
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

