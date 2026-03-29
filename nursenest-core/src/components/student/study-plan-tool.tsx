"use client";

import { useState } from "react";

const EXAMS = [
  { value: "NCLEX_RN", label: "NCLEX-RN" },
  { value: "NCLEX_PN", label: "NCLEX-PN" },
  { value: "REX_PN", label: "REX-PN" },
  { value: "NP", label: "NP" },
  { value: "GENERIC", label: "General nursing / other" },
] as const;

export function StudyPlanTool() {
  const [examTarget, setExamTarget] = useState<(typeof EXAMS)[number]["value"]>("NCLEX_RN");
  const [weeksUntilExam, setWeeksUntilExam] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [weakAreas, setWeakAreas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);

  async function run() {
    setError(null);
    setOutput(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/study-plan/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examTarget,
          weeksUntilExam,
          hoursPerWeek,
          ...(weakAreas.trim() ? { weakAreas: weakAreas.trim() } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; plan?: unknown; disclaimer?: string };
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        return;
      }
      setOutput(JSON.stringify({ plan: data.plan, disclaimer: data.disclaimer }, null, 2));
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nn-card space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Exam target</span>
          <select
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
            value={examTarget}
            onChange={(e) => setExamTarget(e.target.value as (typeof EXAMS)[number]["value"])}
          >
            {EXAMS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Weeks until exam</span>
          <input
            type="number"
            min={1}
            max={52}
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
            value={weeksUntilExam}
            onChange={(e) => setWeeksUntilExam(Number(e.target.value))}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="font-medium">Hours per week (study budget)</span>
        <input
          type="number"
          min={1}
          max={40}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(Number(e.target.value))}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Weak areas (optional)</span>
        <textarea
          className="mt-1 min-h-[88px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
          placeholder="e.g. pharmacology calculations, cardiac meds, SATA questions"
          value={weakAreas}
          onChange={(e) => setWeakAreas(e.target.value)}
        />
      </label>

      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        disabled={loading}
        onClick={() => void run()}
      >
        {loading ? "Generating…" : "Generate study plan"}
      </button>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          {error}
        </div>
      ) : null}

      {output ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Your plan (JSON)</span>
            <button
              type="button"
              className="text-xs font-medium text-primary underline"
              onClick={() => void navigator.clipboard.writeText(output)}
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="h-80 w-full resize-y rounded-md border border-border bg-black/[0.03] p-3 font-mono text-xs dark:bg-white/5"
            value={output}
          />
        </div>
      ) : null}
    </div>
  );
}
