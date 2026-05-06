import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { secureKeys } from "../../lib/secure-keys";

export default function GoalsScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState("");

  async function next() {
    await SecureStore.setItemAsync(secureKeys.localStudyGoal, goal.trim()).catch(() => undefined);
    router.push("/(onboarding)/subscription");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study goal</Text>
      <Text style={styles.sub}>Optional — stored locally for now; can sync to your profile in the next step.</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pass NCLEX in 90 days"
        value={goal}
        onChangeText={setGoal}
        multiline
      />
      <Pressable style={styles.button} onPress={() => void next()}>
        <Text style={styles.buttonLabel}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { opacity: 0.8 },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
