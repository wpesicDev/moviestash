import { Slot } from "expo-router";
import { Text } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
export default function HomeLayout() {
  const tabs = [
    {
      name: "home/index",
      title: "Home",
      icon: "compass-outline",
    },
    {
      name: "favourites/index",
      title: "Favourites",
      icon: "heart-outline",
    },
    {
      name: "settings/index",
      title: "Settings",
      icon: "settings-outline",
    },
  ];
  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <Ionicons
                size={28}
                style={{ marginBottom: -3 }}
                name={tab.icon}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
