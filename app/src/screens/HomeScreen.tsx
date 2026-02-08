import React, { useEffect, useCallback } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PetGlyph } from "../components/PetGlyph";
import { StatsRow } from "../components/StatsRow";
import { ActionBar } from "../components/ActionBar";
import { useGameStore } from "../game/store";
import { getTimeOfDay, getMood, getDaysAlive } from "../game/engine";
import { TIME_GLYPHS } from "../game/constants";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
}

export function HomeScreen({ navigation }: Props) {
  const pet = useGameStore((s) => s.pet);
  const isNewUser = useGameStore((s) => s.isNewUser);
  const settings = useGameStore((s) => s.settings);
  const cooldowns = useGameStore((s) => s.actionCooldowns);
  const showEvolution = useGameStore((s) => s.showEvolution);
  const showDeath = useGameStore((s) => s.showDeath);
  const updatePet = useGameStore((s) => s.updatePet);
  const feedPet = useGameStore((s) => s.feedPet);
  const playWithPet = useGameStore((s) => s.playWithPet);
  const cleanPet = useGameStore((s) => s.cleanPet);
  const restPet = useGameStore((s) => s.restPet);
  const dismissEvolution = useGameStore((s) => s.dismissEvolution);
  const dismissDeath = useGameStore((s) => s.dismissDeath);
  const buryPet = useGameStore((s) => s.buryPet);

  // Update pet stats every 10 seconds
  useEffect(() => {
    if (!pet || pet.isDead) return;
    updatePet();
    const interval = setInterval(updatePet, 10000);
    return () => clearInterval(interval);
  }, [pet?.isDead, updatePet]);

  const timeOfDay = getTimeOfDay();

  // New user onboarding
  if (isNewUser || !pet) {
    return <OnboardingView />;
  }

  // Death screen
  if (showDeath || pet.isDead) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.deathContainer}>
          <Text style={styles.deathGlyph}>{"\u25CB"}</Text>
          <Text style={styles.deathTitle}>rest in peace</Text>
          <Text style={styles.deathName}>{pet.name}</Text>
          <Text style={styles.deathDays}>
            {getDaysAlive(pet.bornAt)} days
          </Text>
          <Pressable
            style={styles.deathButton}
            onPress={() => {
              buryPet();
              dismissDeath();
            }}
          >
            <Text style={styles.deathButtonText}>remember & begin again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const mood = getMood(pet.stats, timeOfDay);
  const daysAlive = getDaysAlive(pet.bornAt);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Evolution overlay */}
      {showEvolution && (
        <Pressable style={styles.evolutionOverlay} onPress={dismissEvolution}>
          <Text style={styles.evolutionText}>evolved</Text>
          <Text style={styles.evolutionStage}>{pet.stage.toUpperCase()}</Text>
        </Pressable>
      )}

      {/* Status row */}
      <View style={styles.statusRow}>
        <Text style={styles.stageLabel}>
          {pet.stage.toUpperCase()} {"\u00B7"} DAY {daysAlive}
        </Text>
        <Pressable onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.menuDots}>{"\u22EF"}</Text>
        </Pressable>
        <Text style={styles.timeGlyph}>{TIME_GLYPHS[timeOfDay]}</Text>
      </View>

      {/* Pet */}
      <PetGlyph stage={pet.stage} mood={mood} theme={settings.glyphTheme} />

      {/* Stats */}
      <StatsRow stats={pet.stats} />

      {/* Spacer */}
      <View style={{ height: 24 }} />

      {/* Actions */}
      <ActionBar
        onFeed={feedPet}
        onPlay={playWithPet}
        onClean={cleanPet}
        onRest={restPet}
        cooldowns={cooldowns}
      />
    </SafeAreaView>
  );
}

function OnboardingView() {
  const [name, setName] = React.useState("");
  const [showInput, setShowInput] = React.useState(false);
  const initPet = useGameStore((s) => s.initPet);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.onboarding}>
        {!showInput ? (
          <Pressable onPress={() => setShowInput(true)} style={styles.onboardingTouch}>
            <Text style={styles.onboardingText}>your glyph awaits</Text>
          </Pressable>
        ) : (
          <View style={styles.nameInput}>
            <Text style={styles.onboardingLabel}>name your pet</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={16}
              placeholderTextColor="#333333"
              selectionColor="#FFFFFF"
            />
            {name.length > 0 && (
              <Pressable onPress={() => initPet(name.trim())} style={styles.confirmButton}>
                <Text style={styles.confirmText}>{"\u2713"}</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  stageLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#555555",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  menuDots: {
    fontSize: 20,
    color: "#555555",
    paddingHorizontal: 12,
  },
  timeGlyph: {
    fontSize: 16,
    color: "#555555",
    fontFamily: "monospace",
  },
  // Onboarding
  onboarding: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  onboardingTouch: {
    padding: 40,
  },
  onboardingText: {
    fontSize: 16,
    color: "#888888",
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  onboardingLabel: {
    fontSize: 14,
    color: "#555555",
    letterSpacing: 1,
    marginBottom: 16,
    fontFamily: "monospace",
  },
  nameInput: {
    alignItems: "center",
  },
  textInput: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "monospace",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 200,
    textAlign: "center",
    letterSpacing: 2,
  },
  confirmButton: {
    marginTop: 24,
    padding: 12,
  },
  confirmText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
  // Evolution overlay
  evolutionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  evolutionText: {
    fontSize: 14,
    color: "#888888",
    letterSpacing: 4,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  evolutionStage: {
    fontSize: 32,
    color: "#FFFFFF",
    letterSpacing: 4,
    fontFamily: "monospace",
    marginTop: 8,
  },
  // Death
  deathContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  deathGlyph: {
    fontSize: 48,
    color: "#333333",
    fontFamily: "monospace",
  },
  deathTitle: {
    fontSize: 14,
    color: "#555555",
    letterSpacing: 2,
    fontFamily: "monospace",
    marginTop: 24,
  },
  deathName: {
    fontSize: 24,
    color: "#888888",
    fontFamily: "monospace",
    marginTop: 8,
  },
  deathDays: {
    fontSize: 12,
    color: "#333333",
    fontFamily: "monospace",
    marginTop: 4,
  },
  deathButton: {
    marginTop: 48,
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  deathButtonText: {
    fontSize: 12,
    color: "#888888",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});
