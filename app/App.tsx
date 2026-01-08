import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={require("./assets/icon-fork.png")}
          style={styles.logoImage}
        />
      </View>
      <Text style={styles.title}>FORK</Text>
      <Text style={styles.subtitle}>Your app will appear here</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoBox: {
    width: 88,
    height: 88,
    backgroundColor: "#18181b",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  logoImage: {
    width: 72,
    height: 72,
    tintColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#18181b",
    fontFamily: "Inter",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#71717a",
    marginTop: 6,
    fontFamily: "Inter",
    fontWeight: "400",
  },
});
