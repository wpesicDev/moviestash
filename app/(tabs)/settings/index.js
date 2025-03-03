import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../../../components/customText";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useColorScheme } from "react-native";

export default function Index() {
  const navigation = useNavigation();
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, []);

  const confirmClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all app data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: clearAllData,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "All data has been cleared successfully.");
    } catch (error) {
      console.error("Error clearing data:", error);

      const errorMessage = error.toString().toLowerCase();
      if (
        errorMessage.includes("no such file or directory") ||
        errorMessage.includes("couldn't be removed")
      ) {
        console.log(
          "Storage already cleared or not found - considering operation successful",
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "All data has been cleared successfully.");
      } else {
        Alert.alert("Error", "Failed to clear data. Please try again.");
      }
    }
  };

  const darkModeComingSoon = () => {
    Alert.alert(
      "Coming Soon",
      "Dark mode will be available in a future update.",
    );
  };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <CustomText
          variant="title"
          align="center"
          color={isDarkMode ? "#FFFFFF" : "#000000"}
        >
          MovieStash
        </CustomText>
        <CustomText
          variant="caption"
          align="center"
          color={isDarkMode ? "#CCCCCC" : "#666666"}
        >
          Version 1.2.14
        </CustomText>
      </View>

      <View style={styles.settingsSection}>
        <CustomText
          variant="headline"
          color={isDarkMode ? "#FFFFFF" : "#000000"}
        >
          Appearance
        </CustomText>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={darkModeComingSoon}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons
              name="moon-outline"
              size={24}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
            />
            <CustomText
              variant="body"
              color={isDarkMode ? "#FFFFFF" : "#000000"}
              style={styles.settingText}
            >
              Dark Mode (Coming Soon)
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <CustomText
          variant="headline"
          color={isDarkMode ? "#FFFFFF" : "#000000"}
        >
          Data
        </CustomText>

        <TouchableOpacity
          style={[styles.settingItem, styles.dangerButton]}
          onPress={confirmClearData}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <CustomText
              variant="body"
              color="#FF3B30"
              style={styles.settingText}
            >
              Clear All Data
            </CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 10,
    marginBottom: 0,
  },
  dangerButton: {
    borderBottomColor: "rgba(255, 59, 48, 0.2)",
  },
});
