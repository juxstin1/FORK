import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import { AchievementRow } from "../components/AchievementRow";
import { useGameStore } from "../game/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Achievements">;
}

export function AchievementsScreen({ navigation }: Props) {
  const achievements = useGameStore((s) => s.achievements);
  const unlocked = achievements.filter((a) => a.unlockedAt).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>ACHIEVEMENTS</Text>
        <Text style={styles.count}>
          {unlocked}/{achievements.length}
        </Text>
      </View>
      <ScrollView style={styles.list}>
        {achievements.map((a) => (
          <AchievementRow key={a.id} achievement={a} />
        ))}
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
  count: { fontSize: 14, color: "#555555", fontFamily: "monospace" },
  list: { flex: 1 },
});
