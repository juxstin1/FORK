import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PetStats } from "../game/types";

interface Props {
  stats: PetStats;
}

const STAT_CONFIG = [
  { key: "hunger" as const, label: "HNG" },
  { key: "happiness" as const, label: "HPY" },
  { key: "energy" as const, label: "NRG" },
  { key: "hygiene" as const, label: "HYG" },
];

export function StatsRow({ stats }: Props) {
  return (
    <View style={styles.container}>
      {STAT_CONFIG.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.round(stats[key])}%` }]} />
          </View>
          <Text style={styles.value}>{Math.round(stats[key])}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#555555",
    letterSpacing: 1.5,
    width: 30,
    fontFamily: "monospace",
  },
  barBg: {
    flex: 1,
    height: 2,
    backgroundColor: "#1A1A1A",
  },
  barFill: {
    height: 2,
    backgroundColor: "#FFFFFF",
  },
  value: {
    fontSize: 11,
    color: "#888888",
    width: 24,
    textAlign: "right",
    fontFamily: "monospace",
  },
});
