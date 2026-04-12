"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

type Row = {
  id: string;
  stem: string;
  questionType: string;
  options: unknown;
  displayOptions?: string[] | null;
  topic?: string | null;
  exam?: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

function gradedAnswerSurfaceClass(
  graded: boolean,
  grade: { correct: boolean; correctKeys?: string[] } | undefined,
  canonical: string,
  picked: boolean,
): string {
  const base = "nn-qopt-surface";
  if (!graded || !grade) return base;
  const keys = grade.correctKeys;
  if (keys && keys.length > 0) {
    const ck = new Set(keys);
    if (ck.has(canonical)) return `${base} nn-qopt-surface--correct`;
    if (picked) return `${base} nn-qopt-surface--incorrect`;
    return `${base} nn-qopt-surface--dim`;
  }
  if (picked) {
    return grade.correct ? `${base} nn-qopt-surface--correct` : `${base} nn-qopt-surface--incorrect`;
  }
  return `${base} nn-qopt-surface--dim`;
}

function activeAnswerSurfaceClass(picked: boolean): string {
  const parts = ["nn-qopt-surface", "nn-qopt-surface--interactive"];
  if (picked) parts.push("nn-qopt-surface--selected");
  return parts.join(" ");
}

function isSataType(t: string): boolean {
  const u = t.toUpperCase();
  return u === "SATA" || u === "SELECT_ALL_THAT_APPLY";
}

export function FreemiumQuestionPeek() {
  const [queue, setQueue] = useState<Row[]>([]);
  const [cursor, setCursor] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [extendLoading, setExtendLoading] = useState(false);
  const [graded, setGraded] = useState<{ correct: boolean; correctKeys: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const excludeIdsRef = useRef<string[]>([]);

  const current = queue[cursor] ?? null;

  /** @returns New rows added (0 if none / error). */
  const loadBatch = useCallback(async (append: boolean): Promise<number> => {
    if (!append) setListLoading(true);
    else setExtendLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: "1", sort: "random", pageSize: "5" });
      const ex = excludeIdsRef.current;
      if (ex.length > 0) qs.set("excludeIds", ex.join(","));
      const res = await fetch(`/api/questions?${qs}`);
      const data = (await res.json()) as {
        questions?: Row[];
        freemiumRemainingAfterBatch?: number;
        message?: string;
        code?: string;
      };
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Preview unavailable.");
        if (!append) setQueue([]);
        return 0;
      }
      const next = data.questions ?? [];
      if (next.length === 0) {
        setPoolExhausted(true);
        if (!append) setQueue([]);
        return 0;
      }
      excludeIdsRef.current = [...excludeIdsRef.current, ...next.map((q) => q.id)];
      setRemaining(
        typeof data.freemiumRemainingAfterBatch === "number" ? data.freemiumRemainingAfterBatch : null,
      );
      setQueue((prev) => (append ? [...prev, ...next] : next));
      if (!append) setCursor(0);
      return next.length;
    } catch {
      setError("Could not load preview.");
      if (!append) setQueue([]);
      return 0;
    } finally {
      setListLoading(false);
      setExtendLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBatch(false);
  }, [loadBatch]);

  const optsCanonical = useMemo(() => parseOptions(current?.options), [current?.options]);
  const optsDisplay = useMemo(() => {
    if (!current) return [];
    const d = current.displayOptions;
    if (Array.isArray(d) && d.length === optsCanonical.length) return d.map((x) => String(x));
    return optsCanonical;
  }, [current, optsCanonical.length]);

  const isSata = current ? isSataType(current.questionType) : false;
  const [answer, setAnswer] = useState<string | string[]>([]);

  useEffect(() => {
    if (!current) return;
    setAnswer(isSataType(current.questionType) ? [] : "");
    setGraded(null);
  }, [current?.id, current?.questionType]);

  const canSubmit = useMemo(() => {
    if (!current || graded) return false;
    if (isSata) return Array.isArray(answer) && answer.length > 0;
    return typeof answer === "string" && answer.length > 0;
  }, [answer, current, graded, isSata]);

  const submit = useCallback(async () => {
    if (!current || graded || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questions/freemium-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: current.id, answer }),
      });
      const data = (await res.json()) as {
        correct?: boolean;
        correctKeys?: string[];
        freemiumRemainingAfter?: number;
        message?: string;
        code?: string;
      };
      if (!res.ok) {
        if (res.status === 403 && data.code === "not_subscribed") {
          setRemaining(0);
          setError("You've reached the complimentary limit. Subscribe to keep practicing.");
          return;
        }
        setError(typeof data.message === "string" ? data.message : "Could not check answer.");
        return;
      }
      setGraded({
        correct: Boolean(data.correct),
        correctKeys: Array.isArray(data.correctKeys) ? data.correctKeys.map(String) : [],
      });
      if (typeof data.freemiumRemainingAfter === "number") {
        setRemaining(data.freemiumRemainingAfter);
      }
    } catch {
      setError("Could not check answer.");
    } finally {
      setSubmitting(false);
    }
  }, [answer, canSubmit, current, graded]);

  const handleNext = useCallback(async () => {
    if (!graded) return;
    const nextIdx = cursor + 1;
    if (nextIdx < queue.length) {
      setGraded(null);
      setCursor(nextIdx);
      return;
    }
    const rem = remaining ?? 0;
    if (rem <= 0) {
      setGraded(null);
      return;
    }
    const added = await loadBatch(true);
    if (added === 0) {
      setGraded(null);
      return;
    }
    setGraded(null);
    setCursor(nextIdx);
  }, [cursor, graded, loadBatch, queue.length, remaining]);

  if (listLoading && queue.length === 0) {
    return <p className="nn-card mt-4 p-4 text-sm text-muted">Loading complimentary preview…</p>;
  }

  if (error && queue.length === 0 && !listLoading) {
    return <p className="nn-card mt-4 p-4 text-sm text-muted">{error}</p>;
  }

  if (!current && (poolExhausted || queue.length === 0)) {
    return (
      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Complimentary preview</h2>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          {poolExhausted
            ? "No more unique preview items match your profile right now. Subscribe for the full rotating bank, filters, and rationales."
            : "Nothing to show yet. Try again shortly."}
        </p>
        <Link
          href="/pricing"
          className="inline-flex text-sm font-semibold text-primary underline"
          onClick={() => trackClientEvent(PH.freemiumSeeRationaleCta, { surface: "question_peek_empty" })}
        >
          View plans
        </Link>
      </section>
    );
  }

  if (!current) {
    return null;
  }

  const g = graded;
  const remLabel = remaining !== null ? `${remaining} complimentary answer${remaining === 1 ? "" : "s"} left` : null;

  return (
    <section className="mt-6 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Try a few questions</h2>
        {remLabel ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-muted)]">{remLabel}</p>
        ) : null}
      </div>
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        See instant scoring on a small sample. Step-by-step rationales unlock with a subscription.
      </p>

      {error ? <p className="text-sm text-[var(--semantic-danger)]">{error}</p> : null}

      <article className="nn-card nn-question-session border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {current.questionType}
          </span>
          {current.topic ? (
            <span className="text-xs text-[var(--semantic-text-muted)]">{current.topic}</span>
          ) : null}
        </div>

        <div className="nn-question-stem-card mb-6">
          <div className="nn-question-stem-wrap">
            <p className="nn-question-stem">{current.stem}</p>
          </div>
        </div>

        <div>
          <p className="nn-question-options-label mb-3">Answer choices</p>
          {isSata ? (
            <ul className="nn-qopt-list" role="group" aria-label="Answer choices">
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                const selected = Array.isArray(answer) ? answer.includes(canonical) : false;
                const rowClass = g
                  ? gradedAnswerSurfaceClass(true, g, canonical, selected)
                  : activeAnswerSurfaceClass(selected);
                return (
                  <li key={canonical}>
                    <label
                      className={`flex min-h-[3.25rem] cursor-pointer items-start gap-3 rounded-[inherit] px-3 py-2.5 sm:min-h-[3.5rem] sm:px-4 ${rowClass} ${g ? "cursor-default" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!!g}
                        onChange={(e) => {
                          const prev = Array.isArray(answer) ? [...answer] : [];
                          const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
                          setAnswer(next);
                        }}
                        className="mt-1 size-[1.125rem] shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary/30 sm:size-5"
                      />
                      <QuestionChoiceLetter index={i} />
                      <span className="min-w-0 flex-1 text-base leading-relaxed text-[var(--theme-body-text)]">
                        {label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="nn-qopt-list" role="radiogroup" aria-label="Answer choices">
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                const picked = answer === canonical;
                const surface = g
                  ? gradedAnswerSurfaceClass(true, g, canonical, picked)
                  : activeAnswerSurfaceClass(picked);
                return (
                  <li key={canonical}>
                    <button
                      type="button"
                      disabled={!!g}
                      onClick={() => setAnswer(canonical)}
                      className={`flex w-full items-start gap-3 px-4 py-4 text-left text-base font-normal leading-relaxed text-[var(--theme-body-text)] transition sm:px-5 ${surface}`}
                    >
                      <QuestionChoiceLetter index={i} />
                      <span className="min-w-0 flex-1">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!g ? (
          <div className="mt-6">
            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={() => void submit()}
              className="nn-btn nn-btn-primary w-full sm:w-auto"
            >
              {submitting ? "Checking…" : "Check answer"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p
              className={`text-sm font-semibold ${
                g.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"
              }`}
              role="status"
            >
              {g.correct ? "Correct — nice work." : "Not quite — compare your pick to the highlighted key(s)."}
            </p>

            <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-4">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Rationale & teaching</p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                Full step-by-step explanations, traps, and integrated lesson links are included with NurseNest access.
              </p>
              <Link
                href="/pricing"
                className="mt-3 inline-flex text-sm font-semibold text-primary underline"
                onClick={() => trackClientEvent(PH.freemiumSeeRationaleCta, { surface: "question_peek_rationale_lock" })}
              >
                Unlock rationales
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {(remaining ?? 0) > 0 || cursor + 1 < queue.length || extendLoading ? (
                <button
                  type="button"
                  disabled={extendLoading}
                  onClick={() => void handleNext()}
                  className="nn-btn nn-btn-secondary"
                >
                  {extendLoading ? "Loading…" : "Next question"}
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="nn-btn nn-btn-primary inline-flex items-center justify-center"
                  onClick={() => trackClientEvent(PH.freemiumSeeRationaleCta, { surface: "question_peek_limit" })}
                >
                  Continue with full access
                </Link>
              )}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
