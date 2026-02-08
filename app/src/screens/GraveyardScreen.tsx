import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { EmptyState } from "../components/EmptyState";
import { PET_GLYPHS } from "../game/constants";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Graveyard">;
}

export function GraveyardScreen({ navigation }: Props) {
  const graveyard = useGameStore((s) => s.graveyard);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>MEMORIES</Text>
        <View style={{ width: 36 }} />
      </View>

      {graveyard.length === 0 ? (
        <EmptyState message="No memories yet." />
      ) : (
        <ScrollView style={styles.list}>
          {graveyard.map((pet, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.glyph}>
                {PET_GLYPHS[pet.glyphTheme]?.[pet.finalStage] ??
                  PET_GLYPHS.default[pet.finalStage]}
              </Text>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.detail}>
                Lived {pet.daysLived} days
              </Text>
              <Text style={styles.detail}>
                Reached: {pet.finalStage}
              </Text>
              <Text style={styles.detail}>
                Peak happiness: {pet.peakHappiness}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { fontSize: 14, color: "#FFFFFF", letterSpacing: 2, fontWeight: "500" },
  list: { flex: 1 },
  card: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
  },
  glyph: {
    fontSize: 36,
    color: "#333333",
    fontFamily: "monospace",
  },
  name: {
    fontSize: 18,
    color: "#888888",
    fontFamily: "monospace",
    marginTop: 8,
  },
  detail: {
    fontSize: 11,
    color: "#555555",
    fontFamily: "monospace",
    marginTop: 2,
  },
});
