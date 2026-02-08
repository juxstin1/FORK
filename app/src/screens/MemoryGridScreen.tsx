import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "MemoryGrid">;
}

type Phase = "watching" | "repeating" | "gameover";

export function MemoryGridScreen({ navigation }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("watching");
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const showIdx = useRef(0);
  const updateScore = useGameStore((s) => s.updateScore);
  const playWithPet = useGameStore((s) => s.playWithPet);

  // Start new round
  const startRound = useCallback((currentSequence: number[]) => {
    const next = Math.floor(Math.random() * 9);
    const newSeq = [...currentSequence, next];
    setSequence(newSeq);
    setPlayerIdx(0);
    setPhase("watching");
    showIdx.current = 0;

    // Play sequence
    let i = 0;
    const showNext = () => {
      if (i < newSeq.length) {
        setActiveCell(newSeq[i]);
        setTimeout(() => {
          setActiveCell(null);
          i++;
          setTimeout(showNext, 300);
        }, 500);
      } else {
        setPhase("repeating");
      }
    };
    setTimeout(showNext, 500);
  }, []);

  // Start game
  useEffect(() => {
    startRound([]);
    setRound(1);
  }, [startRound]);

  const handleCellPress = useCallback(
    (cell: number) => {
      if (phase !== "repeating") return;

      if (cell === sequence[playerIdx]) {
        // Correct
        setActiveCell(cell);
        setTimeout(() => setActiveCell(null), 150);

        const nextIdx = playerIdx + 1;
        if (nextIdx >= sequence.length) {
          // Round complete
          const newRound = round + 1;
          setRound(newRound);
          setTimeout(() => startRound(sequence), 500);
        } else {
          setPlayerIdx(nextIdx);
        }
      } else {
        // Wrong — game over
        setPhase("gameover");
        updateScore("memoryGrid", round);
        playWithPet();
      }
    },
    [phase, sequence, playerIdx, round, startRound, updateScore, playWithPet]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>MEMORY</Text>
        <Text style={styles.roundText}>Round: {round}</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <Pressable
              key={i}
              style={[
                styles.cell,
                activeCell === i && styles.cellActive,
              ]}
              onPress={() => handleCellPress(i)}
            >
              <View
                style={[
                  styles.cellInner,
                  activeCell === i && styles.cellInnerActive,
                ]}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.phaseLabel}>
        {phase === "watching" ? "WATCH..." : phase === "repeating" ? "REPEAT" : ""}
      </Text>

      {phase === "gameover" && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverLabel}>round</Text>
          <Text style={styles.gameOverScore}>{round}</Text>
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
  roundText: { fontSize: 14, color: "#888888", fontFamily: "monospace" },
  gridContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    width: 240,
    height: 240,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cell: {
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  cellActive: {
    borderColor: "#FFFFFF",
  },
  cellInner: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  cellInnerActive: {
    backgroundColor: "#FFFFFF",
  },
  phaseLabel: {
    textAlign: "center",
    fontSize: 11,
    color: "#555555",
    letterSpacing: 4,
    fontFamily: "monospace",
    paddingBottom: 32,
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
