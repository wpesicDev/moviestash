import { Text, View, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RatingContainer({ item, style }) {
  return (
    <View style={[styles.ratingContainer, style]}>
      <Ionicons name="star" size={16} color={"#FFD700"} />
      <Text style={styles.ratingText}>{Math.round(item.vote_average * 10) / 10}/10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
  },
});
