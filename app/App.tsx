import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useGameStore } from "./src/game/store";
import type { RootStackParamList } from "./src/navigation";

import { HomeScreen } from "./src/screens/HomeScreen";
import { MenuScreen } from "./src/screens/MenuScreen";
import { MiniGamesScreen } from "./src/screens/MiniGamesScreen";
import { GlyphMatchScreen } from "./src/screens/GlyphMatchScreen";
import { RhythmTapScreen } from "./src/screens/RhythmTapScreen";
import { MemoryGridScreen } from "./src/screens/MemoryGridScreen";
import { AchievementsScreen } from "./src/screens/AchievementsScreen";
import { GraveyardScreen } from "./src/screens/GraveyardScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const loadFromStorage = useGameStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: "#FFFFFF",
            background: "#000000",
            card: "#000000",
            text: "#FFFFFF",
            border: "#000000",
            notification: "#FFFFFF",
          },
          fonts: {
            regular: { fontFamily: "System", fontWeight: "400" },
            medium: { fontFamily: "System", fontWeight: "500" },
            bold: { fontFamily: "System", fontWeight: "700" },
            heavy: { fontFamily: "System", fontWeight: "900" },
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#000000" },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="MiniGames" component={MiniGamesScreen} />
          <Stack.Screen name="GlyphMatch" component={GlyphMatchScreen} />
          <Stack.Screen name="RhythmTap" component={RhythmTapScreen} />
          <Stack.Screen name="MemoryGrid" component={MemoryGridScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="Graveyard" component={GraveyardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
