"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { CatSelectionBasis, PracticeTestSelectionMode } from "@/lib/practice-tests/types";

type TestListRow = {
  id: string;
  title: string | null;
  status: string;
  questionCount: number;
  selectionMode: string | null;
  timedMode: boolean;
  timeLimitSec: number | null;
  elapsedMs: number | null;
  startedAt: string;
  completedAt: string | null;
  accuracyPct: number | null;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  updatedAt: string;
};

export function PracticeTestsHubClient() {
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<TestListRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [selectionMode, setSelectionMode] = useState<PracticeTestSelectionMode>("random");
  const [catSelectionBasis, setCatSelectionBasis] = useState<CatSelectionBasis>("random");
  const [topicPicks, setTopicPicks] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [difficultyMin, setDifficultyMin] = useState<number | "">("");
  const [difficultyMax, setDifficultyMax] = useState<number | "">("");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(45);

  const loadList = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/practice-tests");
      const data = (await res.json()) as { tests?: TestListRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not load tests.");
      setList(data.tests ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (searchParams.get("focus") !== "weak") return;
    setSelectionMode((prev) => {
      if (prev === "cat") {
        setCatSelectionBasis("weak");
        return prev;
      }
      return "weak";
    });
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/questions/discovery");
        if (!res.ok) return;
        const data = (await res.json()) as { buckets?: { topic: string; count: number }[] };
        if (!cancelled && data.buckets) setTopics(data.buckets);
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function addTopicFromMenu(t: string) {
    if (!t || topicPicks.includes(t)) return;
    setTopicPicks((prev) => [...prev, t]);
  }

  function removeTopic(t: string) {
    setTopicPicks((prev) => prev.filter((x) => x !== t));
  }

  function addCustomTopic() {
    const t = topicInput.trim();
    if (!t || topicPicks.includes(t)) return;
    setTopicPicks((prev) => [...prev, t]);
    setTopicInput("");
  }

  async function createTest() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          questionCount: selectionMode === "cat" ? Math.max(10, questionCount) : questionCount,
          topicNames: topicPicks,
          difficultyMin: difficultyMin === "" ? null : difficultyMin,
          difficultyMax: difficultyMax === "" ? null : difficultyMax,
          selectionMode,
          ...(selectionMode === "cat" ? { catSelectionBasis } : {}),
          pathwayId: null,
          timedMode,
          timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not create test.");
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }

  function formatDuration(ms: number | null): string {
    if (ms == null) return "N/A";
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  }

  return (
    <div className="space-y-8">
      <section className="nn-card p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Build a practice test</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions are drawn only from your plan’s tier and region. Choose a linear test or{" "}
          <strong className="text-foreground">adaptive (CAT)</strong> that adjusts difficulty from your performance and
          weak-area history.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Title (optional)</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cardio sprint"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">
              {selectionMode === "cat" ? "Maximum questions (cap, 10–75)" : "Number of questions (5–75)"}
            </span>
            <input
              type="number"
              min={selectionMode === "cat" ? 10 : 5}
              max={75}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-4">
          <span className="text-sm text-muted-foreground">Selection</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["random", "Random mix"],
                ["targeted", "Targeted topics"],
                ["weak", "Target weak areas"],
                ["cat", "Adaptive (CAT)"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectionMode(v)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  selectionMode === v ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectionMode === "targeted"
              ? "Pick one or more topics below (required)."
              : selectionMode === "weak"
                ? "Uses topics you’ve missed on recent scored practice exams."
                : selectionMode === "cat"
                  ? "CAT starts near mid difficulty, then moves up or down; may stop early when the estimate stabilizes."
                  : "Optional topic filters narrow the pool; leave empty for a broad mix."}
          </p>
        </div>

        {selectionMode === "cat" ? (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Pool for adaptive draws</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["random", "Broad mix"],
                  ["targeted", "Filtered topics"],
                  ["weak", "Weak areas first"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCatSelectionBasis(v)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    catSelectionBasis === v ? "bg-sky-600 text-white dark:bg-sky-700" : "border border-border hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Same tier rules apply. Weak-area mode needs prior scored exam history.
            </p>
          </div>
        ) : null}

        {(selectionMode === "random" || selectionMode === "targeted" || selectionMode === "cat") && (
          <div className="mt-4 space-y-2">
            <span className="text-sm text-muted-foreground">Topics (optional unless targeted)</span>
            <div className="flex flex-wrap gap-2">
              {topicPicks.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                  onClick={() => removeTopic(t)}
                >
                  {t} ✕
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value=""
                onChange={(e) => {
                  addTopicFromMenu(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">Add from bank…</option>
                {topics.map((b) => (
                  <option key={b.topic} value={b.topic}>
                    {b.topic} ({b.count})
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                placeholder="Custom topic label"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTopic())}
              />
              <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={addCustomTopic}>
                Add
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Difficulty min (1–5, optional)</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficultyMin}
              onChange={(e) => setDifficultyMin(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Difficulty max (1–5, optional)</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficultyMax}
              onChange={(e) => setDifficultyMax(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Bank uses numeric difficulty when set; items without a level still qualify when filters are loose.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timedMode} onChange={(e) => setTimedMode(e.target.checked)} />
            Timed mode
          </label>
          {timedMode ? (
            <label className="text-sm">
              <span className="text-muted-foreground">Time limit (minutes)</span>
              <input
                type="number"
                min={2}
                max={240}
                className="ml-2 rounded-lg border border-border px-2 py-1 text-sm"
                value={timeLimitMin}
                onChange={(e) => setTimeLimitMin(Number(e.target.value))}
              />
            </label>
          ) : (
            <span className="text-xs text-muted-foreground">Untimed. Elapsed time is still recorded when you finish.</span>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-amber-800">{error}</p> : null}

        <button
          type="button"
          disabled={creating}
          onClick={() => void createTest()}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {creating ? "Building…" : "Start test"}
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Saved tests & history</h2>
        <p className="mt-1 text-sm text-muted-foreground">Resume in-progress sessions or review completed scores.</p>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : list.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No saved tests yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {list.map((t) => (
              <li key={t.id} className="nn-card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{t.title || "Practice test"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.questionCount} Q · {t.selectionMode ?? "N/A"} · {t.timedMode ? `timed ${t.timeLimitSec ? `${Math.round(t.timeLimitSec / 60)} min` : ""}` : "untimed"}
                    {t.status === "COMPLETED" && t.accuracyPct != null ? ` · ${t.accuracyPct}% (${t.scoreCorrect}/${t.scoreTotal})` : null}
                    {t.status === "IN_PROGRESS" ? " · in progress" : null}
                    {t.status === "ABANDONED" ? " · abandoned" : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(t.startedAt).toLocaleString()}
                    {t.elapsedMs != null ? ` · ${formatDuration(t.elapsedMs)}` : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  {t.status === "IN_PROGRESS" ? (
                    <Link
                      href={`/app/practice-tests/${t.id}`}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      Resume
                    </Link>
                  ) : t.status === "COMPLETED" ? (
                    <Link
                      href={`/app/practice-tests/${t.id}`}
                      className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                    >
                      Review
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
