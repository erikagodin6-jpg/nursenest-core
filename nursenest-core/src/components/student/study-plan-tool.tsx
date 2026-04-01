"use client";

import { useEffect, useState, type ReactNode } from "react";

const EXAMS = [
  { value: "NCLEX_RN", label: "NCLEX-RN" },
  { value: "NCLEX_PN", label: "NCLEX-PN" },
  { value: "REX_PN", label: "REX-PN" },
  { value: "NP", label: "NP" },
  { value: "GENERIC", label: "General nursing / other" },
] as const;

type WeekBlock = {
  week?: number;
  focus?: string;
  objectives?: string[];
  suggestedSessions?: Array<{ label?: string; minutes?: number; activities?: string[] }>;
};

function renderPlanBody(plan: unknown): { readable: boolean; node: ReactNode } {
  if (plan == null || typeof plan !== "object") {
    return { readable: false, node: null };
  }
  const o = plan as Record<string, unknown>;
  const summary = typeof o.summary === "string" ? o.summary : null;
  const weeks = Array.isArray(o.weeks) ? (o.weeks as WeekBlock[]) : null;
  const examWeekTips = Array.isArray(o.examWeekTips)
    ? o.examWeekTips.filter((x): x is string => typeof x === "string")
    : null;

  if (!summary && !weeks?.length && !examWeekTips?.length) {
    return { readable: false, node: null };
  }

  return {
    readable: true,
    node: (
      <div className="space-y-6">
        {summary ? (
          <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Overview</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{summary}</p>
          </div>
        ) : null}

        {weeks && weeks.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Weekly structure</p>
            <ul className="mt-3 space-y-4">
              {weeks.map((w, i) => (
                <li
                  key={`w-${typeof w.week === "number" ? w.week : i}`}
                  className="rounded-xl border border-border/60 bg-[var(--theme-card-bg)] p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                    {typeof w.week === "number" ? `Week ${w.week}` : `Block ${i + 1}`}
                    {w.focus ? <span className="font-normal text-muted"> — {w.focus}</span> : null}
                  </p>
                  {w.objectives && w.objectives.length > 0 ? (
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                      {w.objectives.map((obj) => (
                        <li key={obj.slice(0, 80)}>{obj}</li>
                      ))}
                    </ul>
                  ) : null}
                  {w.suggestedSessions && w.suggestedSessions.length > 0 ? (
                    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                      {w.suggestedSessions.map((s, j) => (
                        <div key={`${i}-s-${j}`} className="rounded-lg bg-muted/25 px-3 py-2 text-sm">
                          <p className="font-medium text-foreground">
                            {s.label ?? `Session ${j + 1}`}
                            {typeof s.minutes === "number" ? (
                              <span className="ml-2 tabular-nums text-xs text-muted">~{s.minutes} min</span>
                            ) : null}
                          </p>
                          {s.activities && s.activities.length > 0 ? (
                            <ul className="mt-1 list-inside list-disc text-xs text-muted">
                              {s.activities.map((a) => (
                                <li key={a.slice(0, 100)}>{a}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {examWeekTips && examWeekTips.length > 0 ? (
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Exam week</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
              {examWeekTips.map((t) => (
                <li key={t.slice(0, 100)}>{t}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    ),
  };
}

export function StudyPlanTool() {
  const [examTarget, setExamTarget] = useState<(typeof EXAMS)[number]["value"]>("NCLEX_RN");
  const [weeksUntilExam, setWeeksUntilExam] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [weakAreas, setWeakAreas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<unknown>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [suggestedWeakAreas, setSuggestedWeakAreas] = useState<string[]>([]);
  async function loadWeakAreaSuggestions() {
    try {
      const res = await fetch("/api/learner/weak-areas", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { weakTopics?: Array<{ topic?: string }> };
      const topics = Array.isArray(data.weakTopics)
        ? data.weakTopics
            .map((w) => (typeof w.topic === "string" ? w.topic.trim() : ""))
            .filter((t) => t.length > 0)
            .slice(0, 5)
        : [];
      if (topics.length > 0) setSuggestedWeakAreas(topics);
    } catch {
      /* non-blocking */
    }
  }

  useEffect(() => {
    void loadWeakAreaSuggestions();
  }, []);


  async function run() {
    setError(null);
    setPlan(null);
    setDisclaimer(null);
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
      setPlan(data.plan ?? null);
      setDisclaimer(typeof data.disclaimer === "string" ? data.disclaimer : null);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const rendered = plan != null ? renderPlanBody(plan) : { readable: false, node: null };

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
      {suggestedWeakAreas.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Use my priority review queue
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestedWeakAreas.map((topic) => (
              <button
                key={topic}
                type="button"
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15"
                onClick={() =>
                  setWeakAreas((prev) => {
                    const parts = prev
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean);
                    if (parts.some((p) => p.toLowerCase() === topic.toLowerCase())) return prev;
                    return [...parts, topic].join(", ");
                  })
                }
              >
                {topic}
              </button>
            ))}
            <button
              type="button"
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-[var(--theme-menu-text)] hover:bg-muted/80"
              onClick={() => setWeakAreas(suggestedWeakAreas.join(", "))}
            >
              Use all
            </button>
          </div>
        </div>
      ) : null}

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

      {plan != null ? (
        <div className="space-y-4 border-t border-border/60 pt-6">
          {disclaimer ? <p className="text-xs leading-relaxed text-muted">{disclaimer}</p> : null}
          {rendered.readable ? (
            rendered.node
          ) : (
            <p className="text-sm text-muted">
              The model returned a plan in an unexpected shape. Use the raw JSON below, or try generating again.
            </p>
          )}
          <details className="rounded-lg border border-border/60 bg-muted/10">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-foreground">Raw JSON (advanced)</summary>
            <div className="border-t border-border/50 p-3">
              <button
                type="button"
                className="mb-2 text-xs font-medium text-primary underline"
                onClick={() => void navigator.clipboard.writeText(JSON.stringify(plan, null, 2))}
              >
                Copy JSON
              </button>
              <textarea
                readOnly
                className="h-64 w-full resize-y rounded-md border border-border bg-black/[0.03] p-3 font-mono text-xs dark:bg-white/5"
                value={JSON.stringify(plan, null, 2)}
              />
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
}
