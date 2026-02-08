import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { GameCard } from "../components/GameCard";
import { MINI_GAMES } from "../game/constants";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "MiniGames">;
}

export function MiniGamesScreen({ navigation }: Props) {
  const scores = useGameStore((s) => s.scores);

  const scoreMap: Record<string, number> = {
    "glyph-match": scores.glyphMatch,
    "rhythm-tap": scores.rhythmTap,
    "memory-grid": scores.memoryGrid,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>GAMES</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.list}>
        {MINI_GAMES.map((game) => (
          <GameCard
            key={game.id}
            name={game.name}
            icon={game.icon}
            highScore={scoreMap[game.id] ?? 0}
            onPress={() => navigation.navigate(game.screen)}
          />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 2,
    fontWeight: "500",
  },
  list: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
});
