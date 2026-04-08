"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS } from "@/lib/exam-pathways/pathway-cat-flow";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

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
    const first = pathwayOptions[0]?.id ?? "";
    if (initialPathwayId && pathwayOptions.some((p) => p.id === initialPathwayId)) return initialPathwayId;
    return first;
  });
  const [questionCap, setQuestionCap] = useState(PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS);
  const [catBasis, setCatBasis] = useState<"random" | "weak">("random");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pathwayMeta = useMemo(() => (pathwayId ? getExamPathwayById(pathwayId) : undefined), [pathwayId]);
  const examTitle = pathwayMeta?.displayName ?? "Exam pathway";

  const start = useCallback(async () => {
    if (!pathwayId) return;
    setCreating(true);
    setError(null);
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
          pathwayId,
          timedMode: false,
          timeLimitSec: null,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not start session.");
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }, [pathwayId, questionCap, catBasis, pathwayMeta?.shortName]);

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
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">CAT practice</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">{examTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Adaptive session: one question at a time, pool filtered to this pathway and your plan. Rationales unlock after you
          finish (same behavior as other CAT runs).
        </p>
      </div>

      <label className="block text-sm">
        <span className="text-muted-foreground">Pathway</span>
        <select
          className="mt-1 w-full max-w-xl rounded-lg border border-border px-3 py-2 text-sm"
          value={pathwayId}
          onChange={(e) => setPathwayId(e.target.value)}
        >
          {pathwayOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

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

      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={creating || !pathwayId}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          onClick={() => void start()}
        >
          {creating ? "Starting…" : "Start session"}
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
