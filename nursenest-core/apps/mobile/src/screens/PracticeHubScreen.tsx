import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { isHardEntitlementStop, MobileApiError, practiceTestResumeKey } from "@nursenest/mobile-shared";
import * as SecureStore from "expo-secure-store";
import { useApi } from "../api-context";
import { usePathway } from "../pathway-context";

type Row = {
  id: string;
  title: string | null;
  status: string;
  selectionMode?: string | null;
  accuracyPct?: number | null;
  scoreCorrect?: number | null;
  scoreTotal?: number | null;
};

export function PracticeHubScreen(props: {
  onBack: () => void;
  onOpenTest: (id: string) => void;
}): React.ReactElement {
  const { practice } = useApi();
  const { pathwayId } = usePathway();
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ["practice-tests"],
    queryFn: () => practice.list() as Promise<{ tests: Row[] }>,
  });

  const createCat = useMutation({
    mutationFn: async () => {
      if (!pathwayId) throw new Error("pathway");
      return practice.create({
        title: "Mobile CAT",
        questionCount: 20,
        topicNames: [],
        selectionMode: "cat",
        catSelectionBasis: "random",
        catPresentationMode: "practice",
        catExamFeedbackMode: "test",
        catAdaptiveSessionType: "cat",
        pathwayId,
        timedMode: false,
      }) as Promise<{ id: string }>;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync(practiceTestResumeKey(data.id), JSON.stringify({ kind: "cat", at: Date.now() }));
      await qc.invalidateQueries({ queryKey: ["practice-tests"] });
      props.onOpenTest(data.id);
    },
  });

  if (listQ.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (listQ.error) {
    const e = listQ.error;
    const hard = e instanceof MobileApiError && isHardEntitlementStop(e);
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{hard ? "Sign in or upgrade for practice exams." : String((e as Error).message)}</Text>
        <Pressable onPress={props.onBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  const rows = listQ.data?.tests ?? [];

  return (
    <View style={styles.flex}>
      <Pressable onPress={props.onBack} style={styles.backPad}>
        <Text>← Back</Text>
      </Pressable>
      <Pressable
        style={[styles.cta, !pathwayId && styles.disabled]}
        disabled={!pathwayId || createCat.isPending}
        onPress={() => createCat.mutate()}
      >
        <Text style={styles.ctaText}>{pathwayId ? "Start new CAT (20)" : "Set pathway first"}</Text>
      </Pressable>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={<Text style={styles.h}>Recent</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => props.onOpenTest(item.id)}>
            <Text style={styles.t}>{item.title ?? "Practice test"}</Text>
            <Text style={styles.m}>
              {item.status}
              {item.selectionMode ? ` · ${item.selectionMode}` : ""}
            </Text>
            {item.status === "COMPLETED" && item.accuracyPct != null && (
              <Text style={styles.m}>Score: {item.accuracyPct}%</Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  backPad: { paddingVertical: 12 },
  cta: { backgroundColor: "#0369a1", padding: 14, borderRadius: 12, marginBottom: 12 },
  ctaText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  disabled: { opacity: 0.45 },
  h: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  row: { padding: 14, borderRadius: 12, backgroundColor: "#e0f2fe", marginBottom: 8 },
  t: { fontSize: 16, fontWeight: "600" },
  m: { fontSize: 12, opacity: 0.75, marginTop: 4 },
  err: { color: "#b91c1c", textAlign: "center", marginBottom: 12 },
});
