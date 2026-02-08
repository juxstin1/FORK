import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

interface Props {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export function ToggleSwitch({ label, value, onToggle }: Props) {
  return (
    <Pressable style={styles.row} onPress={() => onToggle(!value)}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.toggle}>{value ? "\u25CF" : "\u25CB"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  toggle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
});
