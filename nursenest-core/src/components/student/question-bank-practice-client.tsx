"use client";

import { LearnerNoteScope } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import type { RationaleQualityClient } from "@/components/student/premium-rationale-panel";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import { recordQuestionPerformanceEvent } from "@/lib/learner/question-performance-events";
import { PremiumRationalePanel } from "@/components/student/premium-rationale-panel";
import type { QuestionListEmptyDiagnostics } from "@/lib/questions/question-list-empty-diagnostics";
import {
  messageForDiscoveryFailure,
  messageForQuestionsApiFailure,
  questionBankEmptyCopy,
} from "@/lib/student/gated-state-messages";

type QFull = {
  id: string;
  stem: string;
  questionType: string;
  rationale?: string | null;
  options?: unknown;
  topic?: string | null;
  subtopic?: string | null;
  exam?: string | null;
};

/** Study preset: matches product “random quiz”, “topic drill”, “pathway mixed exam”. */
export type QuestionBankPreset = "random_bank" | "topic_drill" | "pathway_mixed";

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

function sessionKey(userId: string) {
  return `nn_qbank_session_${userId}`;
}

function rollupsKey(userId: string) {
  return `nn_qbank_rollups_${userId}`;
}

function appendRollup(
  userId: string,
  topic: string | null | undefined,
  correct: boolean,
  meta: {
    questionId: string;
    subtopic?: string | null;
    pathwayId?: string | null;
    exam?: string | null;
    timeSpentMs?: number;
  },
) {
  try {
    const k = rollupsKey(userId);
    let raw: string | null;
    try {
      raw = localStorage.getItem(k);
    } catch {
      raw = null;
    }
    let data: { events: Array<{ topic?: string | null; correct: boolean; at: string }> };
    try {
      data = raw
        ? (JSON.parse(raw) as { events: Array<{ topic?: string | null; correct: boolean; at: string }> })
        : { events: [] };
      if (!Array.isArray(data.events)) data.events = [];
    } catch {
      data = { events: [] };
    }
    data.events.push({ topic: topic ?? null, correct, at: new Date().toISOString() });
    data.events = data.events.slice(-120);
    localStorage.setItem(k, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
  recordQuestionPerformanceEvent(userId, {
    questionId: meta.questionId,
    topic: topic ?? null,
    subtopic: meta.subtopic ?? null,
    pathwayId: meta.pathwayId ?? null,
    exam: meta.exam ?? null,
    correct,
    ...(typeof meta.timeSpentMs === "number" && meta.timeSpentMs >= 0 ? { timeSpentMs: meta.timeSpentMs } : {}),
  });
}

function sameIdListOrderIndependent(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export function QuestionBankPracticeClient({
  userId,
  userLabel,
  protectionFlags,
  pathwayOptions = [],
  defaultPathwayId = null,
}: {
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  pathwayOptions?: { id: string; label: string }[];
  defaultPathwayId?: string | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [softNotice, setSoftNotice] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QFull[]>([]);
  const [topic, setTopic] = useState<string | null>(null);
  const [topicCodeFilter, setTopicCodeFilter] = useState<string | null>(null);
  const [pathwayIdFilter, setPathwayIdFilter] = useState<string | null>(null);
  const [preset, setPreset] = useState<QuestionBankPreset>("pathway_mixed");
  const seenIdsRef = useRef<string[]>([]);
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [topicMenuTruncationNotice, setTopicMenuTruncationNotice] = useState<string | null>(null);
  const [discoveryNotice, setDiscoveryNotice] = useState<string | null>(null);
  const [efficiencyMode, setEfficiencyMode] = useState<string | null>(null);
  /** Exam-style bank: suppress rich rationale until learner opts in (reduces “open-book” feel). */
  const [examShell, setExamShell] = useState(false);
  const [examShowExplanation, setExamShowExplanation] = useState(false);
  const [emptyCopy, setEmptyCopy] = useState<{ title: string; body: string } | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [graded, setGraded] = useState<
    Record<
      string,
      {
        correct: boolean;
        rationale: string | null;
        rationaleQuality?: RationaleQualityClient | null;
        rationaleSections?: Array<{ heading: string; body: string }> | null;
        referenceMedia?: RationaleReferenceMedia[] | null;
        teaching?: NormalizedTeachingPayload | null;
        teachingMedia?: TeachingMediaBundle | null;
        learningLoop?: {
          topicCode: string | null;
          confidence: "high" | "medium" | "low";
          lessonHref: string | null;
          flashcardsHref: string | null;
          topicDrillHref: string | null;
        } | null;
      }
    >
  >({});
  const [grading, setGrading] = useState(false);
  const questionOpenedAtMsRef = useRef<number | null>(null);

  const current = questions[idx];
  const total = questions.length;

  useEffect(() => {
    if (current?.id) questionOpenedAtMsRef.current = Date.now();
  }, [current?.id]);

  const topicForApi = preset === "topic_drill" ? topic : null;
  const sortForApi = preset === "topic_drill" ? "recent" : "random";

  /** Avoid one request without pathway when mixed mode will apply learner pathway on next tick. */
  const pathwayMixedReady =
    preset !== "pathway_mixed" || pathwayOptions.length === 0 || pathwayIdFilter != null;

  const loadBatch = useCallback(
    async (append: boolean) => {
      setPhase("loading");
      setError(null);
      try {
        if (preset === "topic_drill" && !topic) {
          setQuestions([]);
          setEmptyCopy({
            title: "Pick a topic",
            body: "Choose a topic from the menu below to start a topic-based quiz (recent items first).",
          });
          setPhase("empty");
          return;
        }

        const qs = new URLSearchParams({
          mode: "preview",
          page: "1",
          pageSize: "20",
          sort: sortForApi,
        });
        if (topicForApi) qs.set("topic", topicForApi);
        if (topicCodeFilter) qs.set("topicCode", topicCodeFilter);
        if (pathwayIdFilter) qs.set("pathwayId", pathwayIdFilter);
        if (efficiencyMode) qs.set("studyMode", efficiencyMode);
        if (append && seenIdsRef.current.length > 0) {
          qs.set("excludeIds", seenIdsRef.current.join(","));
        }

        const res = await fetch(`/api/questions?${qs.toString()}`);
        let data = {} as {
          questions?: QFull[];
          error?: string;
          code?: string;
          topicRelaxed?: boolean;
          topicRequested?: string | null;
          studyModeNote?: string | null;
          weakTopicConfidence?: "high" | "medium" | "low" | null;
          diagnostics?: QuestionListEmptyDiagnostics;
        };
        try {
          data = (await res.json()) as typeof data;
        } catch {
          /* non-JSON body */
        }
        if (!res.ok) {
          setPhase("error");
          setEmptyCopy(null);
          setError(messageForQuestionsApiFailure(res.status, data.code) || data.error || "Could not load questions.");
          return;
        }
        if (data.topicRelaxed && data.topicRequested) {
          setSoftNotice(
            `No exact matches for topic “${data.topicRequested}”. Showing questions for your pathway instead — use the topic menu to narrow further.`,
          );
        } else if (data.studyModeNote === "weak_topic_unavailable") {
          setSoftNotice(
            "Weak-area mode needs a few graded items first—we are showing a mixed pool until your topic ledger populates.",
          );
        } else if (data.studyModeNote === "weak_topic_low_confidence") {
          setSoftNotice(
            "Weak-area topic mapping is low-confidence right now. Continue grading items and we will tighten topic alignment.",
          );
        } else {
          setSoftNotice(null);
        }
        const list = data.questions ?? [];
        if (list.length === 0) {
          if (!append) {
            setQuestions([]);
            setEmptyCopy(questionBankEmptyCopy(data.diagnostics));
            setPhase("empty");
            seenIdsRef.current = [];
          }
          return;
        }
        setEmptyCopy(null);

        if (append) {
          setQuestions((prev) => {
            const prevIds = new Set(prev.map((q) => q.id));
            const merged = [...prev];
            for (const q of list) {
              if (!prevIds.has(q.id)) {
                merged.push(q);
                prevIds.add(q.id);
              }
            }
            return merged;
          });
          seenIdsRef.current = [...new Set([...seenIdsRef.current, ...list.map((q) => q.id)])];
        } else {
          setQuestions(list);
          seenIdsRef.current = list.map((q) => q.id);
          setIdx(0);
          setAnswer(null);
          setGraded({});

          try {
            const sk = sessionKey(userId);
            const raw = localStorage.getItem(sk);
            if (raw) {
              const saved = JSON.parse(raw) as {
                ids?: string[];
                idx?: number;
                topic?: string | null;
                pathwayId?: string | null;
                preset?: QuestionBankPreset;
                graded?: Record<
                  string,
                  {
                    correct: boolean;
                    rationale: string | null;
                    rationaleQuality?: RationaleQualityClient | null;
                    rationaleSections?: Array<{ heading: string; body: string }> | null;
                    referenceMedia?: RationaleReferenceMedia[] | null;
                    teaching?: NormalizedTeachingPayload | null;
                    teachingMedia?: TeachingMediaBundle | null;
                    learningLoop?: {
                      topicCode: string | null;
                      confidence: "high" | "medium" | "low";
                      lessonHref: string | null;
                      flashcardsHref: string | null;
                      topicDrillHref: string | null;
                    } | null;
                  }
                >;
              };
              const listIds = list.map((q) => q.id);
              if (
                saved.preset === preset &&
                (saved.topic ?? null) === (topicForApi ?? null) &&
                (saved.pathwayId ?? null) === (pathwayIdFilter ?? null) &&
                saved.ids &&
                sameIdListOrderIndependent(saved.ids, listIds)
              ) {
                setIdx(Math.min(saved.idx ?? 0, list.length - 1));
                if (saved.graded) setGraded(saved.graded);
              }
            }
          } catch {
            /* ignore */
          }
        }

        setPhase("ready");
      } catch {
        setPhase("error");
        setEmptyCopy(null);
        setError("Network error loading questions.");
      }
    },
    [userId, preset, topicForApi, topicCodeFilter, topic, pathwayIdFilter, sortForApi, efficiencyMode],
  );

  useEffect(() => {
    const tp = searchParams.get("topic")?.trim();
    const tpc = searchParams.get("topicCode")?.trim().toLowerCase();
    const pid = searchParams.get("pathwayId")?.trim();
    const pr = searchParams.get("preset")?.trim();
    const sm = searchParams.get("studyMode")?.trim().toLowerCase();
    if (tp) setTopic(tp);
    if (tpc) setTopicCodeFilter(tpc);
    if (pid) setPathwayIdFilter(pid);
    if (pr === "random" || pr === "random_bank") setPreset("random_bank");
    else if (pr === "topic" || pr === "topic_drill") setPreset("topic_drill");
    else if (pr === "mixed" || pr === "pathway_mixed") setPreset("pathway_mixed");
    const okSm = sm && ["weak", "high_yield", "rapid", "final_prep"].includes(sm);
    setEfficiencyMode(okSm ? sm : null);
    const ex = searchParams.get("examShell");
    const examOn = ex === "1" || ex === "true";
    setExamShell(examOn);
    setExamShowExplanation(!examOn);
  }, [searchParams]);

  useEffect(() => {
    if (preset === "random_bank") return;
    if (defaultPathwayId && pathwayIdFilter === null) {
      setPathwayIdFilter(defaultPathwayId);
    }
  }, [defaultPathwayId, pathwayIdFilter, preset]);

  useEffect(() => {
    if (preset !== "pathway_mixed") return;
    if (pathwayIdFilter) return;
    if (pathwayOptions.length > 0) setPathwayIdFilter(pathwayOptions[0]!.id);
  }, [preset, pathwayIdFilter, pathwayOptions]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/questions/discovery");
        if (!res.ok) {
          let code: string | undefined;
          try {
            const err = (await res.json()) as { code?: string };
            code = err.code;
          } catch {
            /* ignore */
          }
          if (!cancelled) {
            setTopicMenuTruncationNotice(null);
            setDiscoveryNotice(messageForDiscoveryFailure(res.status, code));
          }
          return;
        }
        const data = (await res.json()) as {
          buckets?: { topic: string; count: number }[];
          limits?: {
            topicsTruncated?: boolean;
            topicsOmittedCount?: number;
            topicBucketCap?: number;
          };
        };
        if (cancelled) return;
        setDiscoveryNotice(null);
        if (data.buckets) setTopics(data.buckets);
        if (data.limits?.topicsTruncated) {
          const cap = data.limits.topicBucketCap ?? 250;
          const omitted = data.limits.topicsOmittedCount ?? 0;
          setTopicMenuTruncationNotice(
            `Showing the ${cap} most common topics in your bank (${omitted} question${omitted === 1 ? "" : "s"} in additional topics are not listed). Choose “All topics” in topic drill to browse discovery buckets.`,
          );
        } else {
          setTopicMenuTruncationNotice(null);
        }
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pathwayMixedReady) return;
    void loadBatch(false);
  }, [loadBatch, pathwayMixedReady]);

  useEffect(() => {
    if (phase !== "ready" || questions.length === 0) return;
    try {
      localStorage.setItem(
        sessionKey(userId),
        JSON.stringify({
          ids: questions.map((q) => q.id),
          idx,
          topic: topicForApi,
          pathwayId: pathwayIdFilter,
          preset,
          graded,
          savedAt: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
  }, [phase, questions, idx, topicForApi, pathwayIdFilter, preset, graded, userId]);

  const opts = useMemo(() => (current ? parseOptions(current.options) : []), [current]);

  const g = current ? graded[current.id] : undefined;

  async function checkAnswer() {
    if (!current) return;
    if (answer === null || (Array.isArray(answer) && answer.length === 0)) return;
    setGrading(true);
    try {
      const res = await fetch("/api/questions/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: current.id, answer }),
      });
      const data = (await res.json()) as {
        correct?: boolean;
        rationale?: string | null;
        rationaleQuality?: RationaleQualityClient | null;
        rationaleSections?: Array<{ heading: string; body: string }> | null;
        referenceMedia?: RationaleReferenceMedia[] | null;
        teaching?: NormalizedTeachingPayload | null;
        teachingMedia?: TeachingMediaBundle | null;
        learningLoop?: {
          topicCode: string | null;
          confidence: "high" | "medium" | "low";
          lessonHref: string | null;
          flashcardsHref: string | null;
          topicDrillHref: string | null;
        } | null;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not grade this item.");
        return;
      }
      const correct = Boolean(data.correct);
      setGraded((prev) => ({
        ...prev,
        [current.id]: {
          correct,
          rationale: data.rationale ?? null,
          rationaleQuality: data.rationaleQuality ?? null,
          rationaleSections: data.rationaleSections ?? null,
          referenceMedia: data.referenceMedia ?? null,
          teaching: data.teaching ?? null,
          teachingMedia: data.teachingMedia ?? null,
          learningLoop: data.learningLoop ?? null,
        },
      }));
      const opened = questionOpenedAtMsRef.current;
      const timeSpentMs =
        typeof opened === "number" ? Math.min(1_800_000, Math.max(0, Date.now() - opened)) : undefined;
      appendRollup(userId, current.topic, correct, {
        questionId: current.id,
        subtopic: current.subtopic,
        pathwayId: pathwayIdFilter,
        exam: current.exam,
        timeSpentMs,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nn-topic-stats-updated"));
        window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
      }
    } finally {
      setGrading(false);
    }
  }

  function next() {
    setAnswer(null);
    setIdx((i) => Math.min(total - 1, i + 1));
  }

  function prev() {
    setAnswer(null);
    setIdx((i) => Math.max(0, i - 1));
  }

  if (phase === "loading") {
    return <p className="text-sm text-muted">Loading your question bank…</p>;
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">{error ?? "Something went wrong."}</p>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void loadBatch(false)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (phase === "empty") {
    const { title, body } = emptyCopy ?? questionBankEmptyCopy(undefined);
    return (
      <div className="nn-card mt-4 p-6 text-sm text-muted">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-2">{body}</p>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const isSata = current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY";
  const raw = answer;

  const sessionRight = Object.values(graded).filter((x) => x.correct).length;
  const sessionTotal = Object.keys(graded).length;

  return (
    <div className="mt-6 space-y-4">
      {discoveryNotice ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{discoveryNotice}</p>
      ) : null}
      {topicMenuTruncationNotice ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {topicMenuTruncationNotice}
        </p>
      ) : null}
      {softNotice ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{softNotice}</p>
      ) : null}

      <div className="flex flex-wrap items-end gap-4">
        <label className="block text-sm">
          <span className="text-muted">Study mode</span>
          <select
            className="ml-2 rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
            value={preset}
            onChange={(e) => {
              const v = e.target.value as QuestionBankPreset;
              setPreset(v);
              if (v === "random_bank") {
                setTopic(null);
                setPathwayIdFilter(null);
              }
              if (v === "pathway_mixed" && pathwayOptions[0]) setPathwayIdFilter(pathwayOptions[0].id);
            }}
          >
            <option value="pathway_mixed">Pathway mixed exam (random, exam-aligned)</option>
            <option value="topic_drill">Topic drill (recent)</option>
            <option value="random_bank">Random (full tier pool)</option>
          </select>
        </label>
        {pathwayOptions.length > 0 ? (
          <label className="block text-sm">
            <span className="text-muted">Pathway / exam mix</span>
            <select
              className="ml-2 max-w-[min(100%,280px)] rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
              value={pathwayIdFilter ?? ""}
              onChange={(e) => setPathwayIdFilter(e.target.value === "" ? null : e.target.value)}
              disabled={preset === "random_bank"}
            >
              {preset === "random_bank" || preset === "topic_drill" ? (
                <option value="">All pathways (tier + country)</option>
              ) : null}
              {pathwayOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="text-muted">Topic (topic drill)</span>
          <select
            className="ml-2 max-w-[min(100%,260px)] rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
            value={topic ?? ""}
            onChange={(e) => setTopic(e.target.value === "" ? null : e.target.value)}
            disabled={preset !== "topic_drill"}
          >
            <option value="">Select topic…</option>
            {topics.map((b) => (
              <option key={b.topic} value={b.topic}>
                {b.topic} ({b.count})
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted">
          Session: {sessionTotal > 0 ? `${sessionRight}/${sessionTotal} correct` : "Answer and check to track this session"}
        </p>
        <label className="block text-sm">
          <span className="text-muted">Efficiency mode</span>
          <select
            className="ml-2 rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
            value={efficiencyMode ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setEfficiencyMode(v || null);
              const qs = new URLSearchParams(searchParams.toString());
              if (v) qs.set("studyMode", v);
              else qs.delete("studyMode");
              router.replace(`${pathname}?${qs.toString()}`);
            }}
          >
            <option value="">Off</option>
            <option value="weak">Weak areas (ledger)</option>
            <option value="high_yield">High-yield / harder items</option>
            <option value="rapid">Rapid (short batch)</option>
            <option value="final_prep">Final prep mix</option>
          </select>
        </label>
      </div>

      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="question_bank">
        <div className="nn-card space-y-4 p-6">
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            <span>
              Question {idx + 1} of {total}
            </span>
            {current.topic ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{current.topic}</span> : null}
            {current.exam ? <span>{current.exam}</span> : null}
            <span className="uppercase">{current.questionType}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              {sortForApi === "random" ? "Random" : "Recent"}
            </span>
          </div>

          <p className="text-base font-medium leading-relaxed">{current.stem}</p>

          {isSata ? (
            <ul className="space-y-2">
              {opts.map((label) => {
                const selected = Array.isArray(raw) ? raw.includes(label) : false;
                return (
                  <li key={label}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!!g}
                        onChange={(e) => {
                          const prev = Array.isArray(raw) ? [...raw] : [];
                          const next = e.target.checked ? [...prev, label] : prev.filter((x) => x !== label);
                          setAnswer(next);
                        }}
                        className="mt-1"
                      />
                      <span>{label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-2">
              {opts.map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    disabled={!!g}
                    onClick={() => setAnswer(label)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      raw === label ? "border-primary bg-primary/10" : "border-border hover:bg-primary/5"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!g ? (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                disabled={grading || answer === null || (Array.isArray(answer) && answer.length === 0)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={() => void checkAnswer()}
              >
                {grading ? "Checking…" : "Check answer"}
              </button>
            </div>
          ) : (
            <>
              {examShell && !examShowExplanation ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className={`text-sm font-semibold ${g.correct ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                    {g.correct ? "Correct" : "Incorrect"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Exam-style session: explanations stay hidden until you choose—mirrors closed-book pacing (still practice only).
                  </p>
                  <button
                    type="button"
                    className="mt-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                    onClick={() => setExamShowExplanation(true)}
                  >
                    Show explanation
                  </button>
                </div>
              ) : (
                <PremiumRationalePanel
                  correct={g.correct}
                  rationale={g.rationale}
                  rationaleQuality={g.rationaleQuality}
                  rationaleSections={g.rationaleSections}
                  referenceMedia={g.referenceMedia}
                  teaching={g.teaching}
                  teachingMedia={g.teachingMedia}
                />
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
                  onClick={prev}
                >
                  Previous
                </button>
                {idx < total - 1 ? (
                  <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={next}>
                    Next question
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
                    onClick={() => void loadBatch(true)}
                  >
                    Load more (no repeats)
                  </button>
                )}
              </div>
              {g.learningLoop?.topicCode ? (
                <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reinforce this topic</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Topic code: <span className="font-medium text-foreground">{g.learningLoop.topicCode}</span> · confidence{" "}
                    {g.learningLoop.confidence}
                  </p>
                  {g.learningLoop.confidence !== "low" ? (
                    <p className="mt-1 text-xs text-amber-900 dark:text-amber-200">
                      Your weak areas: this topic is currently prioritized for remediation.
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.learningLoop.lessonHref ? (
                      <Link
                        href={g.learningLoop.lessonHref}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
                      >
                        Reinforce this topic
                      </Link>
                    ) : null}
                    {g.learningLoop.flashcardsHref ? (
                      <Link
                        href={g.learningLoop.flashcardsHref}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
                      >
                        Related flashcards
                      </Link>
                    ) : null}
                    {g.learningLoop.topicDrillHref ? (
                      <Link
                        href={g.learningLoop.topicDrillHref}
                        className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Test again on this topic
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          )}

          {g ? null : (
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <button
                type="button"
                disabled={idx === 0}
                className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
                onClick={prev}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={idx >= total - 1}
                className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
                onClick={next}
              >
                Skip for now
              </button>
            </div>
          )}

          <p className="text-xs text-muted">
            Progress for this batch is saved in your browser so you can refresh and continue. Random and mixed modes exclude
            questions you have already seen this session when you load more. Scoring runs on the server—answers are not graded in
            the page alone.
          </p>
        </div>
      </ProtectedPremiumContent>
      <StudyNotesPanel
        userId={userId}
        scope={LearnerNoteScope.QUESTION_BANK}
        contextId={current.id}
        topic={current.topic}
        sourceLabel={`Question ${current.id.slice(0, 8)}…${current.topic ? ` · ${current.topic}` : ""}`}
        userLabel={userLabel}
        flags={protectionFlags}
      />
    </div>
  );
}
