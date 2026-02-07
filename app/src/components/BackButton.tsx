import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
  onPress: () => void;
}

export function BackButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.text}>{"\u2190"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
});
