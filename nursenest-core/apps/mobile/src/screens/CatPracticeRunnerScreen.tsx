import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  buildCatAdvancePatchBody,
  isHardEntitlementStop,
  MobileApiError,
  practiceQuestionTeachingExposure,
  reduceCatPracticePhase,
  type CatPracticePhase,
} from "@nursenest/mobile-shared";
import { useApi } from "../api-context";
import { useDebouncedFn } from "../use-debounce";

type SessionRow = {
  id: string;
  status: string;
  cursorIndex: number;
  config: Record<string, unknown>;
  questionIds: string[];
  results?: unknown;
};

type QuestionPayload = { index: number; total: number; question: { id: string; stem: string; options?: unknown } };

export function CatPracticeRunnerScreen(props: { practiceTestId: string; onBack: () => void }): React.ReactElement {
  const { practice } = useApi();
  const qc = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const [phase, setPhase] = useState<CatPracticePhase>({ kind: "idle" });
  const startMs = useRef(Date.now());

  const sessionQ = useQuery({
    queryKey: ["practice-test", props.practiceTestId],
    queryFn: () => practice.get(props.practiceTestId) as Promise<SessionRow>,
  });

  const cfg = sessionQ.data?.config as Record<string, string | undefined> | undefined;
  const cursor = sessionQ.data?.cursorIndex ?? 0;
  const qid = sessionQ.data?.questionIds?.[cursor];

  const exposure = useMemo(() => (cfg ? practiceQuestionTeachingExposure(cfg) : "full"), [cfg]);

  const questionQ = useQuery({
    queryKey: ["practice-test-q", props.practiceTestId, cursor],
    enabled: Boolean(sessionQ.data?.status === "IN_PROGRESS" && qid),
    queryFn: () => practice.getQuestion(props.practiceTestId, cursor) as Promise<QuestionPayload>,
  });

  React.useEffect(() => {
    if (!sessionQ.data) return;
    const cfgObj = sessionQ.data.config as { selectionMode?: string } | undefined;
    const sel = String(cfgObj?.selectionMode ?? "");
    setPhase((p) =>
      reduceCatPracticePhase(p, {
        type: "session_loaded",
        practiceTestId: props.practiceTestId,
        status: sessionQ.data!.status,
        selectionMode: sel,
      }),
    );
  }, [sessionQ.data, props.practiceTestId]);

  const advance = useMutation({
    mutationFn: async () => {
      if (!sessionQ.data || !qid) throw new Error("no item");
      const body = buildCatAdvancePatchBody({
        testId: props.practiceTestId,
        answers: answersRef.current,
        cursorIndex: cursor,
        examQuestionId: qid,
        elapsedMs: Math.max(0, Date.now() - startMs.current),
      });
      return practice.patch(props.practiceTestId, body) as Promise<Record<string, unknown>>;
    },
    onSuccess: async (data) => {
      setPhase((p) =>
        reduceCatPracticePhase(p, {
          type: "patch_cat_advance_response",
          practiceTestId: props.practiceTestId,
          body: data,
        }),
      );
      await qc.invalidateQueries({ queryKey: ["practice-test", props.practiceTestId] });
      await qc.invalidateQueries({ queryKey: ["practice-test-q", props.practiceTestId] });
    },
  });

  const debouncedAdvance = useDebouncedFn(() => advance.mutate(), 400);

  const pick = useCallback(
    (key: string) => {
      if (!qid) return;
      const next = { ...answersRef.current, [qid]: key };
      setAnswers(next);
      debouncedAdvance();
    },
    [qid, debouncedAdvance],
  );

  if (sessionQ.error) {
    const e = sessionQ.error;
    const hard = e instanceof MobileApiError && isHardEntitlementStop(e);
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{hard ? "Access denied." : String((e as Error).message)}</Text>
        <Pressable onPress={props.onBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (phase.kind === "completed") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Completed</Text>
        <Text style={styles.sub}>Results are on the server; open web review for full breakdown if needed.</Text>
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Done</Text>
        </Pressable>
      </View>
    );
  }

  const opts = (questionQ.data?.question?.options as { key?: string; label?: string }[] | undefined) ?? [];

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={props.onBack} style={styles.backPad}>
        <Text>← Back</Text>
      </Pressable>
      <Text style={styles.meta}>
        CAT · rationale: {exposure === "none" ? "hidden until complete (server)" : "visible"}
      </Text>
      {questionQ.isLoading ? <Text>Loading question…</Text> : null}
      {questionQ.error ? <Text style={styles.err}>Could not load question.</Text> : null}
      {questionQ.data ? (
        <>
          <Text style={styles.stem}>{questionQ.data.question.stem}</Text>
          {opts.map((o) => (
            <Pressable key={o.key ?? String(o.label)} style={styles.opt} onPress={() => pick(String(o.key ?? ""))}>
              <Text style={styles.optText}>{o.label ?? o.key}</Text>
            </Pressable>
          ))}
        </>
      ) : null}
      {advance.error ? <Text style={styles.err}>{String((advance.error as Error).message)}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  backPad: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { textAlign: "center", marginTop: 8, opacity: 0.75 },
  back: { marginTop: 16 },
  meta: { fontSize: 12, opacity: 0.7, marginBottom: 12 },
  stem: { fontSize: 17, lineHeight: 24, marginBottom: 16, fontWeight: "500" },
  opt: {
    borderWidth: 1,
    borderColor: "#bae6fd",
    backgroundColor: "#f0f9ff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  optText: { fontSize: 16 },
  err: { color: "#b91c1c", marginTop: 12 },
});
