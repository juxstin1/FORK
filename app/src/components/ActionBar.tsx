import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  onFeed: () => void;
  onPlay: () => void;
  onClean: () => void;
  onRest: () => void;
  cooldowns: Record<string, number>;
}

const ACTIONS = [
  { key: "feed", label: "Feed", icon: "\u25CB" },   // ○
  { key: "play", label: "Play", icon: "\u25B3" },   // △
  { key: "clean", label: "Clean", icon: "\u25BD" },  // ▽
  { key: "rest", label: "Rest", icon: "\u25A1" },   // □
] as const;

export function ActionBar({ onFeed, onPlay, onClean, onRest, cooldowns }: Props) {
  const handlers: Record<string, () => void> = {
    feed: onFeed,
    play: onPlay,
    clean: onClean,
    rest: onRest,
  };

  const isOnCooldown = (key: string) => {
    const last = cooldowns[key];
    return last ? Date.now() - last < 2000 : false;
  };

  return (
    <View style={styles.container}>
      {ACTIONS.map(({ key, label, icon }) => {
        const disabled = isOnCooldown(key);
        return (
          <Pressable
            key={key}
            onPress={handlers[key]}
            disabled={disabled}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={[styles.icon, disabled && styles.disabledText]}>{icon}</Text>
            <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  button: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.3,
  },
  icon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
  label: {
    fontSize: 11,
    color: "#888888",
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  disabledText: {
    color: "#333333",
  },
});
