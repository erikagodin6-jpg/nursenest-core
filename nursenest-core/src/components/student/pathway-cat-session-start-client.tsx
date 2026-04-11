"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS } from "@/lib/exam-pathways/pathway-cat-flow";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { CatAmbiguityPathwayPicker } from "@/components/student/cat-ambiguity-pathway-picker";

const MIN_CAT = 10;
const MAX_CAT_PRACTICE = 75;

export function PathwayCatSessionStartClient({
  initialPathwayId,
  pathwayOptions,
}: {
  initialPathwayId: string | null;
  pathwayOptions: PracticeTestPathwayOption[];
}) {
  const [pathwayId, setPathwayId] = useState(() => {
    if (initialPathwayId && pathwayOptions.some((p) => p.id === initialPathwayId)) return initialPathwayId;
    if (pathwayOptions.length === 1) return pathwayOptions[0]!.id;
    return "";
  });
  const needsPathwayChoice = pathwayOptions.length > 1 && pathwayId.length === 0;
  const [questionCap, setQuestionCap] = useState(PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS);
  const [catBasis, setCatBasis] = useState<"random" | "weak">("random");
  const [catExamFeedbackMode, setCatExamFeedbackMode] = useState<"study" | "test">("test");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(false);
  const [readiness, setReadiness] = useState<CatPracticeReadinessResult | null>(null);

  const pathwayMeta = useMemo(() => (pathwayId ? getExamPathwayById(pathwayId) : undefined), [pathwayId]);
  const catShort = pathwayMeta ? catPathwayShortCatLabel(pathwayMeta) : null;
  const catLine = pathwayMeta ? catPathwayRegionalExamLine(pathwayMeta) : null;
  const examTitle = pathwayMeta ? catShort : "Exam pathway";

  useEffect(() => {
    if (!pathwayId.trim()) {
      setReadiness(null);
      return;
    }
    let cancelled = false;
    setReadinessLoading(true);
    setReadiness(null);
    void (async () => {
      try {
        const res = await fetch(`/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(pathwayId)}`, {
          method: "GET",
          credentials: "same-origin",
        });
        const data = (await res.json()) as CatPracticeReadinessResult;
        if (!cancelled) setReadiness(data);
      } catch {
        if (!cancelled) {
          setReadiness({
            ok: false,
            code: "readiness_fetch_failed",
            message: "Could not verify adaptive pool readiness. Check your connection and try again.",
          });
        }
      } finally {
        if (!cancelled) setReadinessLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathwayId]);

  const start = useCallback(async () => {
    if (!pathwayId.trim()) return;
    setCreating(true);
    setError(null);
    setErrorCode(null);
    try {
      const cap = Math.min(MAX_CAT_PRACTICE, Math.max(MIN_CAT, Math.round(questionCap)));
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${pathwayMeta?.shortName ?? "Pathway"} CAT`,
          questionCount: cap,
          topicNames: [],
          difficultyMin: null,
          difficultyMax: null,
          selectionMode: "cat",
          catSelectionBasis: catBasis,
          catPresentationMode: "practice",
          catExamFeedbackMode,
          pathwayId,
          timedMode: false,
          timeLimitSec: null,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? "Could not start session.");
      }
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }, [pathwayId, questionCap, catBasis, catExamFeedbackMode, pathwayMeta?.shortName]);

  if (pathwayOptions.length === 0) {
    return (
      <div className="nn-card p-6 text-sm text-muted-foreground">
        <p>No exam pathways match your subscription region and tier.</p>
        <Link href="/app/practice-tests" className="mt-3 inline-block font-semibold text-primary underline">
          Back to practice tests
        </Link>
      </div>
    );
  }

  return (
    <div className="nn-card space-y-6 p-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{catLine ?? "CAT practice"}</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">{examTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {catLine ? (
            <>
              <span className="font-medium text-foreground">{catLine}</span> — adaptive session: one question at a time,
              pool filtered to this exam and your plan. Choose Study Mode (rationales as you go) or Test Mode (rationales after
              the run).
            </>
          ) : (
            <>
              Adaptive session: one question at a time, pool filtered to this pathway and your plan. Choose whether you want
              explanations after each item (Study Mode) or only after the session (Test Mode).
            </>
          )}
        </p>
      </div>

      <label className="block text-sm">
        <span className="text-muted-foreground">Pathway</span>
        <select
          data-nn-qa-cat-pathway-select
          className="mt-1 w-full max-w-xl rounded-lg border border-border px-3 py-2 text-sm"
          value={pathwayId}
          onChange={(e) => setPathwayId(e.target.value)}
        >
          {pathwayOptions.length > 1 ? (
            <option value="">Choose which exam pathway you want to practice…</option>
          ) : null}
          {pathwayOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      {needsPathwayChoice ? (
        <p className="text-xs text-[var(--semantic-text-secondary)]">
          We need your pathway before starting CAT so the adaptive pool matches the right exam.
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="text-muted-foreground">Maximum questions (cap {MIN_CAT}–{MAX_CAT_PRACTICE})</span>
        <input
          type="number"
          min={MIN_CAT}
          max={MAX_CAT_PRACTICE}
          className="mt-1 w-full max-w-xs rounded-lg border border-border px-3 py-2 text-sm tabular-nums"
          value={questionCap}
          onChange={(e) => setQuestionCap(Number(e.target.value))}
        />
      </label>

      <div>
        <p className="text-sm font-medium text-foreground">How do you want to run this CAT?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Same adaptive engine and scoring either way — only on-screen teaching and pacing differ.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCatExamFeedbackMode("study")}
            className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              catExamFeedbackMode === "study"
                ? "border-primary bg-primary/8 shadow-sm"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Study Mode</p>
            <p className="mt-2 text-sm font-semibold text-foreground">See rationales as you go</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Correctness and full teaching support after each item. Best when you are learning and want immediate
              clinical context.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setCatExamFeedbackMode("test")}
            className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              catExamFeedbackMode === "test"
                ? "border-primary bg-primary/8 shadow-sm"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Test Mode</p>
            <p className="mt-2 text-sm font-semibold text-foreground">No rationales until the end</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Exam-style focus — no hints during the live CAT. Explanations unlock in post-exam review.
            </p>
          </button>
        </div>
      </div>

      <fieldset className="text-sm">
        <legend className="text-muted-foreground">Pool basis</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="catBasis"
              checked={catBasis === "random"}
              onChange={() => setCatBasis("random")}
            />
            Balanced pool
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="catBasis" checked={catBasis === "weak"} onChange={() => setCatBasis("weak")} />
            Prioritize weak areas (when history exists)
          </label>
        </div>
      </fieldset>

      {readinessLoading ? (
        <p className="text-sm text-muted-foreground">
          Checking adaptive question pool{catShort ? ` for ${catShort}` : ""}…
        </p>
      ) : null}
      {readiness && !readiness.ok ? (
        <aside className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-warning-soft)] p-4 text-sm text-[var(--semantic-text-primary)] shadow-sm">
          <p className="font-semibold">{catShort ? `${catShort} cannot start yet` : "CAT cannot start yet"}</p>
          <p className="mt-1 text-muted-foreground">{readiness.message}</p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid && pathwayMeta ? (
              <li>
                <Link className="font-medium text-primary underline" href={buildExamPathwayPath(pathwayMeta, "questions")}>
                  Open pathway question bank
                </Link>{" "}
                (practice items may still be available)
              </li>
            ) : null}
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ? (
              <li>
                <Link className="font-medium text-primary underline" href="/app/account/billing">
                  Review subscription &amp; billing
                </Link>
              </li>
            ) : null}
            {(readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready ||
              readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found) &&
            pathwayMeta ? (
              <li>
                <Link className="font-medium text-primary underline" href={buildExamPathwayPath(pathwayMeta)}>
                  Pathway hub
                </Link>{" "}
                for lessons, waitlist, or alternate tracks
              </li>
            ) : null}
            <li>
              <Link className="font-medium text-primary underline" href="/app/questions">
                App question bank
              </Link>
            </li>
          </ul>
        </aside>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-semibold text-destructive">Something went wrong</p>
          <p className="mt-1 text-foreground">{error}</p>
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous && pathwayOptions.length > 1 ? (
            <CatAmbiguityPathwayPicker catEligibleOptions={pathwayOptions} className="mt-3" />
          ) : errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? (
            <p className="mt-2 text-muted-foreground">
              Select a pathway from the dropdown above and try again.
            </p>
          ) : null}
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_weak_areas_empty ? (
            <p className="mt-2 text-muted-foreground">
              Tip: switch <strong>Pool basis</strong> to <strong>Balanced pool</strong>, use the question bank, then try weak
              areas again.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          data-nn-qa-cat-start-session
          disabled={
            creating || !pathwayId.trim() || needsPathwayChoice || readinessLoading || (readiness !== null && !readiness.ok)
          }
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          onClick={() => void start()}
        >
          {creating ? "Starting…" : readinessLoading ? "Checking…" : catShort ? `Start ${catShort}` : "Start session"}
        </button>
        <Link
          href="/app/practice-tests"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Full practice test builder
        </Link>
      </div>
    </div>
  );
}
