import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "RhythmTap">;
}

const GLYPHS = ["\u25B2", "\u25CF", "\u25C6", "\u25A0", "\u25CB"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const TAP_ZONE_X = 60;
const GLYPH_SPEED = 2500; // ms to cross screen
const SPAWN_INTERVAL = 800;
const HIT_TOLERANCE = 50;

interface FallingGlyph {
  id: number;
  glyph: string;
  y: number;
  spawnedAt: number;
  animX: Animated.Value;
  hit: boolean;
}

export function RhythmTapScreen({ navigation }: Props) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [misses, setMisses] = useState(0);
  const glyphsRef = useRef<FallingGlyph[]>([]);
  const [renderTick, setRenderTick] = useState(0);
  const idCounter = useRef(0);
  const updateScore = useGameStore((s) => s.updateScore);
  const playWithPet = useGameStore((s) => s.playWithPet);

  // Spawn glyphs
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const id = idCounter.current++;
      const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      const y = 100 + Math.random() * 300;
      const spawnedAt = Date.now();
      const animX = new Animated.Value(SCREEN_WIDTH);

      const newGlyph: FallingGlyph = { id, glyph, y, spawnedAt, animX, hit: false };
      glyphsRef.current = [...glyphsRef.current, newGlyph];

      Animated.timing(animX, {
        toValue: -40,
        duration: GLYPH_SPEED,
        useNativeDriver: true,
      }).start(() => {
        // Check if it was missed
        if (!newGlyph.hit) {
          setMisses((m) => {
            const next = m + 1;
            if (next >= 5) setGameOver(true);
            return next;
          });
          setCombo(0);
        }
        glyphsRef.current = glyphsRef.current.filter((g) => g.id !== id);
      });

      setRenderTick((t) => t + 1);
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [gameOver]);

  // End game — save score
  useEffect(() => {
    if (gameOver && score > 0) {
      updateScore("rhythmTap", score);
      playWithPet();
    }
  }, [gameOver, score, updateScore, playWithPet]);

  const handleTap = useCallback(() => {
    if (gameOver) return;

    // Find the closest glyph to the tap zone using deterministic position math.
    let closestIdx = -1;
    let closestDist = Infinity;
    const now = Date.now();

    glyphsRef.current.forEach((g, i) => {
      if (g.hit) return;

      const elapsed = now - g.spawnedAt;
      if (elapsed < 0 || elapsed > GLYPH_SPEED) return;

      const progress = elapsed / GLYPH_SPEED;
      const x = SCREEN_WIDTH - progress * (SCREEN_WIDTH + 40);
      const dist = Math.abs(x - TAP_ZONE_X);

      if (dist <= HIT_TOLERANCE && dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    if (closestIdx >= 0) {
      glyphsRef.current[closestIdx].hit = true;
      setScore((s) => s + 1);
      setCombo((c) => c + 1);
      setRenderTick((t) => t + 1);
    } else {
      setCombo(0);
    }
  }, [gameOver]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>RHYTHM</Text>
        <Text style={styles.scoreText}>{score}</Text>
      </View>

      <Pressable style={styles.playArea} onPress={handleTap}>
        {/* Tap zone line */}
        <View style={[styles.tapZone, { left: TAP_ZONE_X }]} />

        {/* Glyphs */}
        {glyphsRef.current.map((g) => (
          <Animated.Text
            key={g.id}
            style={[
              styles.glyph,
              {
                top: g.y,
                transform: [{ translateX: g.animX }],
                opacity: g.hit ? 0.2 : 1,
              },
            ]}
          >
            {g.glyph}
          </Animated.Text>
        ))}

        {/* Combo */}
        {combo > 1 && (
          <Text style={styles.combo}>x{combo}</Text>
        )}

        {/* Miss counter */}
        <Text style={styles.missCount}>{"\u25CB".repeat(5 - misses)}{"\u25CF".repeat(misses)}</Text>
      </Pressable>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverLabel}>score</Text>
          <Text style={styles.gameOverScore}>{score}</Text>
          <Pressable style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneText}>done</Text>
          </Pressable>
        </View>
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
  },
  title: { fontSize: 14, color: "#FFFFFF", letterSpacing: 2, fontWeight: "500" },
  scoreText: { fontSize: 14, color: "#888888", fontFamily: "monospace" },
  playArea: { flex: 1, position: "relative" },
  tapZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#1A1A1A",
  },
  glyph: {
    position: "absolute",
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
  combo: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    fontSize: 20,
    color: "#555555",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  missCount: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    fontSize: 12,
    color: "#333333",
    fontFamily: "monospace",
    letterSpacing: 4,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverLabel: {
    fontSize: 14,
    color: "#888888",
    letterSpacing: 4,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  gameOverScore: {
    fontSize: 48,
    color: "#FFFFFF",
    fontFamily: "monospace",
    marginTop: 8,
  },
  doneButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  doneText: {
    fontSize: 12,
    color: "#888888",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});
