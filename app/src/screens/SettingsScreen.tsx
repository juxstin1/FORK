import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Settings">;
}

export function SettingsScreen({ navigation }: Props) {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>SETTINGS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.list}>
        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <ToggleSwitch
          label="Hunger alerts"
          value={settings.hungerAlerts}
          onToggle={(v) => updateSettings({ hungerAlerts: v })}
        />
        <ToggleSwitch
          label="Loneliness nudges"
          value={settings.lonelinessNudges}
          onToggle={(v) => updateSettings({ lonelinessNudges: v })}
        />

        <Text style={styles.sectionHeader}>EXPERIENCE</Text>
        <ToggleSwitch
          label="Haptic feedback"
          value={settings.hapticFeedback}
          onToggle={(v) => updateSettings({ hapticFeedback: v })}
        />

        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Made with</Text>
          <Text style={styles.aboutValue}>FORK</Text>
        </View>
      </ScrollView>
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
    paddingBottom: 16,
  },
  title: { fontSize: 14, color: "#FFFFFF", letterSpacing: 2, fontWeight: "500" },
  list: { flex: 1 },
  sectionHeader: {
    fontSize: 11,
    color: "#555555",
    letterSpacing: 2,
    fontWeight: "500",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
  },
  aboutLabel: { fontSize: 14, color: "#FFFFFF" },
  aboutValue: { fontSize: 14, color: "#555555", fontFamily: "monospace" },
});
