import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useApi } from "../api-context";
import { CatPracticeRunnerScreen } from "./CatPracticeRunnerScreen";

export function PracticeRunnerGateScreen(props: { practiceTestId: string; onBack: () => void }): React.ReactElement {
  const { practice } = useApi();
  const q = useQuery({
    queryKey: ["practice-test", props.practiceTestId],
    queryFn: () => practice.get(props.practiceTestId) as Promise<{ config?: { selectionMode?: string } }>,
  });

  if (q.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const mode = q.data?.config?.selectionMode;
  if (mode === "cat") {
    return <CatPracticeRunnerScreen practiceTestId={props.practiceTestId} onBack={props.onBack} />;
  }

  return (
    <View style={styles.center}>
      <Text style={styles.t}>This session is not CAT ({mode ?? "unknown"}).</Text>
      <Text style={styles.s}>Mobile Prompt 4 wires CAT + NP engines; linear/tutor flows stay web-first until dedicated UI ships.</Text>
      <Pressable onPress={props.onBack} style={styles.back}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, padding: 24, justifyContent: "center" },
  t: { fontSize: 17, fontWeight: "600", marginBottom: 8 },
  s: { opacity: 0.8, lineHeight: 22 },
  back: { marginTop: 20 },
});
