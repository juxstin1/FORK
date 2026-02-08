import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

interface Props {
  name: string;
  icon: string;
  highScore: number;
  onPress: () => void;
}

export function GameCard({ name, icon, highScore, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.score}>Best: {highScore}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A1A1A",
    padding: 16,
    marginHorizontal: 24,
    marginVertical: 6,
  },
  pressed: {
    borderColor: "#333333",
    opacity: 0.7,
  },
  icon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "monospace",
    width: 40,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 1.5,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  score: {
    fontSize: 11,
    color: "#555555",
    fontFamily: "monospace",
  },
});
