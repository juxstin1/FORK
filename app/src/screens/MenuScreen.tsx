import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Menu">;
}

const MENU_ITEMS = [
  { key: "MiniGames" as const, label: "GAMES", icon: "\u25B3" },
  { key: "Achievements" as const, label: "ACHIEVEMENTS", icon: "\u2605" },
  { key: "Graveyard" as const, label: "MEMORIES", icon: "\u25CB" },
  { key: "Settings" as const, label: "SETTINGS", icon: "\u2699" },
] as const;

export function MenuScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.menu}>
        {MENU_ITEMS.map(({ key, label, icon }) => (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => navigation.navigate(key)}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
    gap: 16,
  },
  pressed: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 18,
    color: "#555555",
    fontFamily: "monospace",
    width: 28,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 2,
    fontWeight: "500",
  },
});
