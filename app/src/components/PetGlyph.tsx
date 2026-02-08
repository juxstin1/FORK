import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import type { LifeStage, Mood, GlyphTheme } from "../game/types";
import { PET_GLYPHS } from "../game/constants";

interface Props {
  stage: LifeStage;
  mood: Mood;
  theme: GlyphTheme;
}

export function PetGlyph({ stage, mood, theme }: Props) {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mood === "sleeping") {
      // Slow, deep breathing for sleeping
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, { toValue: 1.03, duration: 3000, useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 0.98, duration: 3000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      // Normal idle breathing
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [mood, breathAnim]);

  const glyph = PET_GLYPHS[theme]?.[stage] ?? PET_GLYPHS.default[stage];
  const opacity = mood === "sleeping" ? 0.5 : mood === "sad" ? 0.7 : 1;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: breathAnim }, { translateY: bounceAnim }] }}>
        <Text style={[styles.glyph, { opacity }]}>{glyph}</Text>
      </Animated.View>
      {mood === "sleeping" && (
        <Text style={styles.sleepIndicator}>z z z</Text>
      )}
    </View>
  );
}

/** Trigger a bounce animation externally */
export function triggerBounce(bounceAnim: Animated.Value) {
  Animated.sequence([
    Animated.timing(bounceAnim, { toValue: -10, duration: 150, useNativeDriver: true }),
    Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
  ]).start();
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  glyph: {
    fontSize: 72,
    fontFamily: "monospace",
    color: "#FFFFFF",
    fontWeight: "100",
  },
  sleepIndicator: {
    fontSize: 14,
    color: "#555555",
    fontFamily: "monospace",
    letterSpacing: 4,
    marginTop: 8,
  },
});
