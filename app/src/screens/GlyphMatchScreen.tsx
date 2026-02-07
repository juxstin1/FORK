import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { MATCH_GLYPHS } from "../game/constants";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "GlyphMatch">;
}

interface Card {
  id: number;
  glyph: string;
  isRevealed: boolean;
  isMatched: boolean;
}

function shuffleCards(): Card[] {
  const pairs = [...MATCH_GLYPHS, ...MATCH_GLYPHS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((glyph, i) => ({
    id: i,
    glyph,
    isRevealed: false,
    isMatched: false,
  }));
}

export function GlyphMatchScreen({ navigation }: Props) {
  const [cards, setCards] = useState<Card[]>(shuffleCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const updateScore = useGameStore((s) => s.updateScore);
  const playWithPet = useGameStore((s) => s.playWithPet);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleTap = useCallback(
    (id: number) => {
      if (gameOver) return;
      if (selected.length >= 2) return;
      if (cards[id].isRevealed || cards[id].isMatched) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, isRevealed: true } : c
      );
      const newSelected = [...selected, id];
      setCards(newCards);
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [a, b] = newSelected;
        if (newCards[a].glyph === newCards[b].glyph) {
          // Match!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, isMatched: true } : c
              )
            );
            const newMatches = matches + 1;
            setMatches(newMatches);
            setSelected([]);

            if (newMatches === MATCH_GLYPHS.length) {
              setGameOver(true);
              updateScore("glyphMatch", MATCH_GLYPHS.length);
              playWithPet();
            }
          }, 300);
        } else {
          // No match — hide after delay
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, isRevealed: false } : c
              )
            );
            setSelected([]);
          }, 600);
        }
      }
    },
    [cards, selected, matches, gameOver, updateScore, playWithPet]
  );

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>MATCH</Text>
        <Text style={styles.score}>
          {matches}/{MATCH_GLYPHS.length}
        </Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <Pressable
            key={card.id}
            style={[
              styles.card,
              card.isMatched && styles.cardMatched,
              card.isRevealed && styles.cardRevealed,
            ]}
            onPress={() => handleTap(card.id)}
          >
            <Text
              style={[
                styles.cardGlyph,
                !card.isRevealed && !card.isMatched && styles.hidden,
                card.isMatched && styles.matchedGlyph,
              ]}
            >
              {card.isRevealed || card.isMatched ? card.glyph : " "}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.timer}>{formatTime(timer)}</Text>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>complete</Text>
          <Text style={styles.gameOverTime}>{formatTime(timer)}</Text>
          <Pressable style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>done</Text>
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
  score: { fontSize: 14, color: "#888888", fontFamily: "monospace" },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  card: {
    width: "22%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  cardRevealed: { borderColor: "#333333" },
  cardMatched: { borderColor: "#0A0A0A" },
  cardGlyph: { fontSize: 24, color: "#FFFFFF", fontFamily: "monospace" },
  hidden: { opacity: 0 },
  matchedGlyph: { color: "#333333" },
  timer: {
    textAlign: "center",
    fontSize: 14,
    color: "#555555",
    fontFamily: "monospace",
    paddingBottom: 24,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverText: {
    fontSize: 14,
    color: "#888888",
    letterSpacing: 4,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  gameOverTime: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "monospace",
    marginTop: 8,
  },
  retryButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    fontSize: 12,
    color: "#888888",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});
