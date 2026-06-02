import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { usePathway } from "../pathway-context";

export function HomeScreen(props: {
  onFlashcards: () => void;
  onPractice: () => void;
  onCat: () => void;
}): React.ReactElement {
  const { pathwayId, setPathwayId } = usePathway();
  const [draft, setDraft] = useState(pathwayId ?? "");

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Study</Text>
      <Text style={styles.label}>Pathway id (server-scoped)</Text>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        onEndEditing={() => void setPathwayId(draft.trim() || null)}
        autoCapitalize="none"
        placeholder="e.g. us-rn-nclex-rn"
      />
      <Pressable style={styles.btn} onPress={() => void setPathwayId(draft.trim() || null)}>
        <Text style={styles.btnText}>Save pathway</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={props.onFlashcards}>
        <Text style={styles.btnText}>Flashcards</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={props.onPractice}>
        <Text style={styles.btnText}>Practice exams</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={props.onCat}>
        <Text style={styles.btnText}>CAT (RN practice + NP)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 13, opacity: 0.8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#0f766e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
