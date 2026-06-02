import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { isHardEntitlementStop, MobileApiError, reduceNpCatPhase, type NpCatPhase } from "@nursenest/mobile-shared";
import { useApi } from "../api-context";
import { usePathway } from "../pathway-context";

type StartBody = {
  practiceTestId: string;
  firstQuestion: { id: string } | null;
};

export function NpCatScreen(props: { onBack: () => void }): React.ReactElement {
  const { npCat } = useApi();
  const { pathwayId } = usePathway();
  const qc = useQueryClient();
  const [phase, setPhase] = useState<NpCatPhase>({ kind: "idle" });
  const [practiceTestId, setPracticeTestId] = useState<string | null>(null);
  const [activeQid, setActiveQid] = useState<string | null>(null);

  const start = useMutation({
    mutationFn: async () => {
      if (!pathwayId?.includes("np")) {
        throw new Error("NP CAT uses NP pathway ids (server entitlement).");
      }
      return npCat.startSession({ pathwayId, maxQuestions: 40 }) as Promise<StartBody>;
    },
    onSuccess: (data) => {
      setPracticeTestId(data.practiceTestId);
      setActiveQid(data.firstQuestion?.id ?? null);
      setPhase((p) => reduceNpCatPhase(p, { type: "session_created", practiceTestId: data.practiceTestId }));
    },
  });

  const qFull = useQuery({
    queryKey: ["np-cat-q", activeQid],
    enabled: Boolean(activeQid && phase.kind === "active"),
    queryFn: () => npCat.getQuestionFull(activeQid!, false) as Promise<{ stem: string; id: string }>,
  });

  const answer = useMutation({
    mutationFn: async (correct: boolean) => {
      if (!practiceTestId || !activeQid) throw new Error("session");
      return npCat.submitAnswer({
        practiceTestId,
        questionId: activeQid,
        answeredCorrectly: correct,
        responseTimeMs: undefined,
      }) as Promise<{
        sessionComplete?: boolean;
        nextQuestion?: { id: string } | null;
      }>;
    },
    onSuccess: async (data) => {
      if (!practiceTestId) return;
      setPhase((p) =>
        reduceNpCatPhase(p, {
          type: "answer_response",
          practiceTestId,
          body: data,
        }),
      );
      if (data.sessionComplete) {
        setActiveQid(null);
        await qc.invalidateQueries({ queryKey: ["np-cat-analysis", practiceTestId] });
      } else if (data.nextQuestion?.id) {
        setActiveQid(data.nextQuestion.id);
      }
    },
  });

  const analysis = useQuery({
    queryKey: ["np-cat-analysis", practiceTestId],
    enabled: phase.kind === "complete" && Boolean(practiceTestId),
    queryFn: () => npCat.getAnalysis(practiceTestId!) as Promise<unknown>,
  });

  if (!pathwayId) {
    return (
      <View style={styles.center}>
        <Text>Set pathway (NP) first.</Text>
        <Pressable onPress={props.onBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (start.error) {
    const e = start.error;
    const hard = e instanceof MobileApiError && isHardEntitlementStop(e);
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{hard ? "NP CAT requires subscriber session." : String((e as Error).message)}</Text>
        <Pressable onPress={props.onBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (phase.kind === "complete") {
    return (
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.title}>NP CAT complete</Text>
        <Text style={styles.sub}>Analysis (server):</Text>
        {analysis.isLoading ? <Text>Loading…</Text> : <Text style={styles.mono}>{JSON.stringify(analysis.data ?? {}, null, 2).slice(0, 2000)}</Text>}
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Done</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={props.onBack} style={styles.backPad}>
        <Text>← Back</Text>
      </Pressable>
      <Text style={styles.sub}>NP-only adaptive engine (`/api/cat/np/*`). Selection stays on the server.</Text>
      {phase.kind === "idle" ? (
        <Pressable style={styles.cta} onPress={() => start.mutate()} disabled={start.isPending}>
          <Text style={styles.ctaText}>Start NP CAT</Text>
        </Pressable>
      ) : null}
      {qFull.data ? (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.stem}>{qFull.data.stem}</Text>
          <Pressable style={styles.opt} onPress={() => answer.mutate(true)}>
            <Text>Mark correct</Text>
          </Pressable>
          <Pressable style={styles.opt} onPress={() => answer.mutate(false)}>
            <Text>Mark incorrect</Text>
          </Pressable>
        </View>
      ) : phase.kind === "active" ? (
        <Text style={{ marginTop: 12 }}>Loading item…</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  backPad: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { opacity: 0.75, marginBottom: 12 },
  cta: { backgroundColor: "#4c1d95", padding: 14, borderRadius: 12 },
  ctaText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  stem: { fontSize: 17, lineHeight: 24, marginBottom: 12 },
  opt: { padding: 14, backgroundColor: "#ede9fe", borderRadius: 10, marginBottom: 8 },
  back: { marginTop: 16 },
  err: { color: "#b91c1c", textAlign: "center", marginBottom: 12 },
  mono: { fontFamily: "monospace", fontSize: 11 },
});
