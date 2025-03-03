import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList } from "react-native";
import useTMDB from "../../../hooks/useTMDB";
import MovieSlider from "../../../components/movieSlider";
import CustomText from "../../../components/customText";
import { useNavigation } from "@react-navigation/native";
import MovieList from "../../../components/movieList";

export default function Index() {
  const [search, setSearch] = useState("");
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
    if (debouncedSearch && debouncedSearch.length >= 3) {
      getSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    getDiscoverMovies();
    getDiscoverShows();
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);

  if (error) return <Text>Error: {error.message}</Text>;

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.notfound}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (search !== "" && search.length >= 3) {
      if (data.search?.results?.length > 0) {
        return <MovieList data={data.search?.results} />;
      } else {
        return (
          <View style={styles.notfound}>
            <Text>No results found</Text>
          </View>
        );
      }
    } else if (search !== "" && search.length < 3) {
      return (
        <View style={styles.notfound}>
          <Text>Search with at least 3 characters</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.homeContainer}>
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
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomText variant="display" align="left" style={styles.title}>
        Home
      </CustomText>
      <View style={{paddingHorizontal: 10}}>
        <TextInput
          style={styles.input}
          onChangeText={setSearch}
          value={search}
          placeholder="Search for Movies, Shows and Actors"
          returnKeyType={"done"}
        />
      </View>

      <FlatList
        data={[null]}
        renderItem={() => <>{renderContent()}</>}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    display: 'flex',
    gap: 10
  },
  notfound: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    minWidth: "100%",
    width: "95%",
    borderRadius: 15,
    borderColor: "#ddd",
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  safeAreaView: {
    height: 'auto',
    backgroundColor: "#fff",
    flex: 1,
    maxHeight: 'auto'
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  title: {
    paddingLeft: 10,
  },
});
