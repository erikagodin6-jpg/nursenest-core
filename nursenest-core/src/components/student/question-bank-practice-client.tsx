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
import type { EmptyCopyI18n } from "@/lib/student/gated-state-messages-i18n";
import {
  discoveryFailureKey,
  questionBankEmptyKeys,
  questionsApiFailureKey,
} from "@/lib/student/gated-state-messages-i18n";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type QFull = {
  id: string;
  stem: string;
  questionType: string;
  rationale?: string | null;
  options?: unknown;
  /** Localized labels aligned to `options` (canonical English strings for grading). */
  displayOptions?: string[] | null;
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
  const { t } = useMarketingI18n();
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
  const [emptyCopy, setEmptyCopy] = useState<EmptyCopyI18n | "pick_topic" | null>(null);
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
          setEmptyCopy("pick_topic");
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
          setError(t(questionsApiFailureKey(res.status, data.code)));
          return;
        }
        if (data.topicRelaxed && data.topicRequested) {
          setSoftNotice(t("learner.qbank.notice.topicRelaxed", { topic: data.topicRequested }));
        } else if (data.studyModeNote === "weak_topic_unavailable") {
          setSoftNotice(t("learner.qbank.notice.weakUnavailable"));
        } else if (data.studyModeNote === "weak_topic_low_confidence") {
          setSoftNotice(t("learner.qbank.notice.weakLowConfidence"));
        } else {
          setSoftNotice(null);
        }
        const list = data.questions ?? [];
        if (list.length === 0) {
          if (!append) {
            setQuestions([]);
            setEmptyCopy(questionBankEmptyKeys(data.diagnostics));
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
        setError(t("learner.qbank.networkError"));
      }
    },
    [userId, preset, topicForApi, topicCodeFilter, topic, pathwayIdFilter, sortForApi, efficiencyMode, t],
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
            setDiscoveryNotice(t(discoveryFailureKey(res.status, code)));
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
          setTopicMenuTruncationNotice(t("learner.qbank.notice.topicMenuTruncated", { cap, omitted }));
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
  }, [t]);

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

  const optsCanonical = useMemo(() => (current ? parseOptions(current.options) : []), [current]);
  const optsDisplay = useMemo(() => {
    if (!current) return [];
    const d = current.displayOptions;
    if (Array.isArray(d) && d.length === optsCanonical.length) return d.map((x) => String(x));
    return optsCanonical;
  }, [current, optsCanonical]);

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
        setError(data.error?.trim() || t("learner.qbank.gradeFailed"));
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
    return <p className="text-sm text-muted">{t("learner.qbank.loading")}</p>;
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">{error ?? t("learner.qbank.genericError")}</p>
        <button
          type="button"
          className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
          onClick={() => void loadBatch(false)}
        >
          {t("learner.qbank.retry")}
        </button>
      </div>
    );
  }

  if (phase === "empty") {
    const keys: EmptyCopyI18n =
      emptyCopy === "pick_topic"
        ? { titleKey: "learner.qbank.pickTopic.title", bodyKey: "learner.qbank.pickTopic.body" }
        : (emptyCopy ?? questionBankEmptyKeys(undefined));
    const title = t(keys.titleKey, keys.bodyParams);
    const body = t(keys.bodyKey, keys.bodyParams);
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
        <p className="rounded-lg border border-role-warning-border bg-role-warning-soft px-3 py-2 text-sm text-role-warning-text">{discoveryNotice}</p>
      ) : null}
      {topicMenuTruncationNotice ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {topicMenuTruncationNotice}
        </p>
      ) : null}
      {softNotice ? (
        <p className="rounded-lg border border-role-warning-border bg-role-warning-soft px-3 py-2 text-sm text-role-warning-text">{softNotice}</p>
      ) : null}

      <div className="flex flex-wrap items-end gap-4">
        <label className="block text-sm">
          <span className="text-muted">{t("learner.qbank.ui.studyMode")}</span>
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
            <option value="pathway_mixed">{t("learner.qbank.preset.pathwayMixed")}</option>
            <option value="topic_drill">{t("learner.qbank.preset.topicDrill")}</option>
            <option value="random_bank">{t("learner.qbank.preset.randomBank")}</option>
          </select>
        </label>
        {pathwayOptions.length > 0 ? (
          <label className="block text-sm">
            <span className="text-muted">{t("learner.qbank.ui.pathwayFilter")}</span>
            <select
              className="ml-2 max-w-[min(100%,280px)] rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
              value={pathwayIdFilter ?? ""}
              onChange={(e) => setPathwayIdFilter(e.target.value === "" ? null : e.target.value)}
              disabled={preset === "random_bank"}
            >
              {preset === "random_bank" || preset === "topic_drill" ? (
                <option value="">{t("learner.qbank.ui.pathwayAll")}</option>
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
          <span className="text-muted">{t("learner.qbank.ui.topicDrill")}</span>
          <select
            className="ml-2 max-w-[min(100%,260px)] rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
            value={topic ?? ""}
            onChange={(e) => setTopic(e.target.value === "" ? null : e.target.value)}
            disabled={preset !== "topic_drill"}
          >
            <option value="">{t("learner.qbank.ui.selectTopic")}</option>
            {topics.map((b) => (
              <option key={b.topic} value={b.topic}>
                {b.topic} ({b.count})
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted">
          {sessionTotal > 0
            ? t("learner.qbank.ui.sessionLine", { correct: sessionRight, total: sessionTotal })
            : t("learner.qbank.ui.sessionLineIdle")}
        </p>
        <label className="block text-sm">
          <span className="text-muted">{t("learner.qbank.ui.efficiencyMode")}</span>
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
            <option value="">{t("learner.qbank.efficiency.off")}</option>
            <option value="weak">{t("learner.qbank.efficiency.weak")}</option>
            <option value="high_yield">{t("learner.qbank.efficiency.highYield")}</option>
            <option value="rapid">{t("learner.qbank.efficiency.rapid")}</option>
            <option value="final_prep">{t("learner.qbank.efficiency.finalPrep")}</option>
          </select>
        </label>
      </div>

      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="question_bank">
        <div className="nn-card space-y-4 p-6">
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            <span>
              {t("learner.qbank.ui.questionOf", { n: idx + 1, total })}
            </span>
            {current.topic ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{current.topic}</span> : null}
            {current.exam ? <span>{current.exam}</span> : null}
            <span className="uppercase">{current.questionType}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              {sortForApi === "random" ? t("learner.qbank.ui.sortRandom") : t("learner.qbank.ui.sortRecent")}
            </span>
          </div>

          <p className="text-base font-medium leading-relaxed">{current.stem}</p>

          {isSata ? (
            <ul className="space-y-2">
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
                return (
                  <li key={canonical}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!!g}
                        onChange={(e) => {
                          const prev = Array.isArray(raw) ? [...raw] : [];
                          const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
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
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                return (
                  <li key={canonical}>
                    <button
                      type="button"
                      disabled={!!g}
                      onClick={() => setAnswer(canonical)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                        raw === canonical ? "border-primary bg-primary/10" : "border-border hover:bg-primary/5"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {!g ? (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                disabled={grading || answer === null || (Array.isArray(answer) && answer.length === 0)}
                className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
                onClick={() => void checkAnswer()}
              >
                {grading ? t("learner.qbank.ui.checking") : t("learner.qbank.ui.checkAnswer")}
              </button>
            </div>
          ) : (
            <>
              {examShell && !examShowExplanation ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className={`text-sm font-semibold ${g.correct ? "text-role-success" : "text-red-700 dark:text-red-400"}`}>
                    {g.correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{t("learner.qbank.ui.examShellHint")}</p>
                  <button
                    type="button"
                    className="mt-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                    onClick={() => setExamShowExplanation(true)}
                  >
                    {t("learner.qbank.ui.showExplanation")}
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
                  {t("learner.qbank.ui.previous")}
                </button>
                {idx < total - 1 ? (
                  <button type="button" className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground" onClick={next}>
                    {t("learner.qbank.ui.nextQuestion")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
                    onClick={() => void loadBatch(true)}
                  >
                    {t("learner.qbank.ui.loadMore")}
                  </button>
                )}
              </div>
              {g.learningLoop?.topicCode ? (
                <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("learner.qbank.ui.continuePriority")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("learner.qbank.ui.topicCodeLine", {
                      code: g.learningLoop.topicCode ?? "",
                      confidence: g.learningLoop.confidence,
                    })}
                  </p>
                  {g.learningLoop.confidence === "high" ? (
                    <p className="mt-1 text-xs text-muted-foreground">{t("learner.qbank.ui.learningHigh")}</p>
                  ) : g.learningLoop.confidence === "medium" ? (
                    <p className="mt-1 text-xs text-muted-foreground">{t("learner.qbank.ui.learningMedium")}</p>
                  ) : (
                    <p className="mt-1 text-xs text-role-warning">{t("learner.qbank.ui.learningLow")}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.learningLoop.lessonHref ? (
                      <Link
                        href={g.learningLoop.lessonHref}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
                      >
                        {t("learner.qbank.ui.relatedLesson")}
                      </Link>
                    ) : null}
                    {g.learningLoop.flashcardsHref ? (
                      <Link
                        href={g.learningLoop.flashcardsHref}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
                      >
                        {t("learner.qbank.ui.reviewFlashcards")}
                      </Link>
                    ) : null}
                    {g.learningLoop.topicDrillHref ? (
                      <Link
                        href={g.learningLoop.topicDrillHref}
                        className="rounded-full bg-role-cta px-3 py-1.5 text-xs font-semibold text-role-cta-foreground"
                      >
                        {t("learner.qbank.ui.topicDrillSameCode")}
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
                {t("learner.qbank.ui.previous")}
              </button>
              <button
                type="button"
                disabled={idx >= total - 1}
                className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
                onClick={next}
              >
                {t("learner.qbank.ui.skipForNow")}
              </button>
            </div>
          )}

          <p className="text-xs text-muted">{t("learner.qbank.ui.batchProgressNote")}</p>
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
