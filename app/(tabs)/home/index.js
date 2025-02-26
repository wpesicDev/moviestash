import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import useTMDB from '../../../hooks/useTMDB';
import { useEffect } from 'react';

export default function Index() {
  const { data, loading, error, getDiscoverMovies } = useTMDB();

  useEffect(() => {
    getDiscoverMovies();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={data?.results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>

            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`
              }}
              style={{ borderRadius: 12, width: "100%", height: "100%" }}
              transition={200}
            />

            <Text style={styles.movieTitle}>{item.poster_path}</Text>
          </View>
        )}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
