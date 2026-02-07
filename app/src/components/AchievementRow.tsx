import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Achievement } from "../game/types";

interface Props {
  achievement: Achievement;
}

export function AchievementRow({ achievement }: Props) {
  const unlocked = !!achievement.unlockedAt;
  const date = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString()
    : null;

  return (
    <View style={styles.row}>
      <Text style={[styles.icon, !unlocked && styles.muted]}>
        {unlocked ? achievement.icon : "?"}
      </Text>
      <View style={styles.info}>
        <Text style={[styles.title, !unlocked && styles.muted]}>
          {achievement.title}
        </Text>
        <Text style={[styles.desc, !unlocked && styles.muted]}>
          {achievement.description}
        </Text>
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
    gap: 12,
  },
  icon: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "monospace",
    width: 28,
    textAlign: "center",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 1,
    fontWeight: "500",
  },
  desc: {
    fontSize: 11,
    color: "#888888",
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: "#555555",
    marginTop: 2,
  },
  muted: {
    color: "#333333",
  },
});
