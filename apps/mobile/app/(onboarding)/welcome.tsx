import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NurseNest</Text>
      <Text style={styles.body}>A few quick steps to tailor study to your pathway and goals.</Text>
      <Pressable style={styles.button} onPress={() => router.push("/(onboarding)/pathway")}>
        <Text style={styles.buttonLabel}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700" },
  body: { fontSize: 16, opacity: 0.85 },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
