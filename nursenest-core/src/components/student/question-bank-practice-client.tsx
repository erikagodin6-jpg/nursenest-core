"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  exam?: string | null;
};

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

function appendRollup(userId: string, topic: string | null | undefined, correct: boolean) {
  try {
    const k = rollupsKey(userId);
    const raw = localStorage.getItem(k);
    const data = raw
      ? (JSON.parse(raw) as { events: Array<{ topic?: string | null; correct: boolean; at: string }> })
      : { events: [] };
    data.events.push({ topic: topic ?? null, correct, at: new Date().toISOString() });
    data.events = data.events.slice(-120);
    localStorage.setItem(k, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

export function QuestionBankPracticeClient({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [softNotice, setSoftNotice] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QFull[]>([]);
  const [topic, setTopic] = useState<string | null>(null);
  const [pathwayIdFilter, setPathwayIdFilter] = useState<string | null>(null);
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [topicMenuTruncationNotice, setTopicMenuTruncationNotice] = useState<string | null>(null);
  const [discoveryNotice, setDiscoveryNotice] = useState<string | null>(null);
  const [emptyCopy, setEmptyCopy] = useState<{ title: string; body: string } | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [graded, setGraded] = useState<Record<string, { correct: boolean; rationale: string | null }>>({});
  const [grading, setGrading] = useState(false);

  const current = questions[idx];
  const total = questions.length;

  const loadBatch = useCallback(
    async (t: string | null, pathwayId: string | null) => {
      setPhase("loading");
      setError(null);
      try {
        const qs = new URLSearchParams({
          mode: "preview",
          page: "1",
          pageSize: "20",
        });
        if (t) qs.set("topic", t);
        if (pathwayId) qs.set("pathwayId", pathwayId);
        const res = await fetch(`/api/questions?${qs.toString()}`);
        let data = {} as {
          questions?: QFull[];
          error?: string;
          code?: string;
          topicRelaxed?: boolean;
          topicRequested?: string | null;
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
        }
        const list = data.questions ?? [];
        if (list.length === 0) {
          setQuestions([]);
          setEmptyCopy(questionBankEmptyCopy(data.diagnostics));
          setPhase("empty");
          return;
        }
        setEmptyCopy(null);
        setQuestions(list);
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
              graded?: Record<string, { correct: boolean; rationale: string | null }>;
            };
            if (
              saved.ids?.[0] === list[0]?.id &&
              (saved.topic ?? null) === (t ?? null) &&
              (saved.pathwayId ?? null) === (pathwayId ?? null) &&
              typeof saved.idx === "number"
            ) {
              setIdx(Math.min(saved.idx, list.length - 1));
              if (saved.graded) setGraded(saved.graded);
            }
          }
        } catch {
          /* ignore */
        }

        setPhase("ready");
      } catch {
        setPhase("error");
        setEmptyCopy(null);
        setError("Network error loading questions.");
      }
    },
    [userId],
  );

  useEffect(() => {
    const tp = searchParams.get("topic")?.trim();
    const pid = searchParams.get("pathwayId")?.trim();
    if (tp) setTopic(tp);
    if (pid) setPathwayIdFilter(pid);
  }, [searchParams]);

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
            `Showing the ${cap} most common topics in your bank (${omitted} question${omitted === 1 ? "" : "s"} in additional topics are not listed). Choose “All topics” to study across the full pool.`,
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
    void loadBatch(topic, pathwayIdFilter);
  }, [loadBatch, topic, pathwayIdFilter]);

  useEffect(() => {
    if (phase !== "ready" || questions.length === 0) return;
    try {
      localStorage.setItem(
        sessionKey(userId),
        JSON.stringify({
          ids: questions.map((q) => q.id),
          idx,
          topic,
          pathwayId: pathwayIdFilter,
          graded,
          savedAt: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
  }, [phase, questions, idx, topic, pathwayIdFilter, graded, userId]);

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
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not grade this item.");
        return;
      }
      const correct = Boolean(data.correct);
      setGraded((prev) => ({
        ...prev,
        [current.id]: { correct, rationale: data.rationale ?? null },
      }));
      appendRollup(userId, current.topic, correct);
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
          onClick={() => void loadBatch(topic, pathwayIdFilter)}
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block text-sm">
          <span className="text-muted">Filter by topic</span>
          <select
            className="ml-2 rounded-lg border border-border bg-white px-2 py-1.5 text-sm"
            value={topic ?? ""}
            onChange={(e) => setTopic(e.target.value === "" ? null : e.target.value)}
          >
            <option value="">All topics</option>
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
      </div>

      <div className="nn-card space-y-4 p-6">
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span>
            Question {idx + 1} of {total}
          </span>
          {current.topic ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{current.topic}</span> : null}
          {current.exam ? <span>{current.exam}</span> : null}
          <span className="uppercase">{current.questionType}</span>
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
          <div className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
            <p className={`font-semibold ${g.correct ? "text-emerald-700" : "text-amber-800"}`}>
              {g.correct ? "Correct" : "Incorrect"}
            </p>
            {g.rationale ? <p className="mt-2 text-muted leading-relaxed">{g.rationale}</p> : null}
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
                  onClick={() => void loadBatch(topic, pathwayIdFilter)}
                >
                  Load more
                </button>
              )}
            </div>
          </div>
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
          Progress for this batch is saved in your browser so you can refresh and continue. Scoring runs on the server—answers
          are not graded in the page alone.
        </p>
      </div>
    </div>
  );
}
