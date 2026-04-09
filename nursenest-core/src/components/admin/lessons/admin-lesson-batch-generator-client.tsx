"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { LessonBatchItem, LessonBatchResultSummaryV1 } from "@/lib/lessons/admin-ai-lesson-batch";

type CategoryOpt = { id: string; name: string; slug: string };

const PATHWAYS = ["NCLEX-RN", "NCLEX-PN", "REx-PN", "NP-US", "CNPLE", "Allied"] as const;

const LESSON_TYPES = [
  ["disease", "Disease"],
  ["syndrome", "Syndrome"],
  ["medication", "Medication"],
  ["safety", "Safety"],
  ["prioritization", "Prioritization"],
  ["delegation", "Delegation"],
  ["diagnostics_labs", "Diagnostics / labs"],
  ["intervention_procedure", "Intervention / procedure"],
  ["case_study", "Case study"],
] as const;

function statusBadge(status: LessonBatchItem["status"]) {
  const base = "rounded-full px-2 py-0.5 text-xs font-medium";
  switch (status) {
    case "pending":
      return `${base} bg-zinc-500/15 text-zinc-700 dark:text-zinc-300`;
    case "generating":
      return `${base} bg-sky-500/15 text-sky-800 dark:text-sky-200`;
    case "completed":
      return `${base} bg-emerald-500/15 text-emerald-800 dark:text-emerald-200`;
    case "failed":
      return `${base} bg-red-500/15 text-red-800 dark:text-red-200`;
    case "skipped_duplicate":
      return `${base} bg-amber-500/15 text-amber-900 dark:text-amber-100`;
    default:
      return base;
  }
}

export function AdminLessonBatchGeneratorClient() {
  const [topicsRaw, setTopicsRaw] = useState("");
  const [pathway, setPathway] = useState<(typeof PATHWAYS)[number]>("NCLEX-RN");
  const [country, setCountry] = useState<"CA" | "US">("US");
  const [topicDomain, setTopicDomain] = useState("");
  const [lessonType, setLessonType] = useState<(typeof LESSON_TYPES)[number][0]>("disease");
  const [difficulty, setDifficulty] = useState<"" | "foundation" | "intermediate" | "advanced">("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [resumeJobId, setResumeJobId] = useState("");

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [summary, setSummary] = useState<LessonBatchResultSummaryV1 | null>(null);
  const [running, setRunning] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (categoriesLoaded) return;
    const res = await fetch("/api/admin/categories?pageSize=200");
    const j = (await res.json()) as { categories?: CategoryOpt[] };
    if (res.ok && j.categories) setCategories(j.categories);
    setCategoriesLoaded(true);
  }, [categoriesLoaded]);

  const refreshJob = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/lessons/ai-generate-batch/${id}`);
    const j = (await res.json()) as { error?: string; summary?: LessonBatchResultSummaryV1 };
    if (!res.ok) {
      setErr(j.error ?? String(res.status));
      return;
    }
    if (j.summary) setSummary(j.summary);
  }, []);

  async function createBatch(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLastMessage(null);
    await loadCategories();
    try {
      const res = await fetch("/api/admin/lessons/ai-generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicsRaw,
          pathway,
          country,
          topicDomain,
          lessonType,
          allowDuplicates,
          ...(difficulty ? { difficulty } : {}),
          ...(categoryIds.length ? { relatedCategoryIds: categoryIds } : {}),
        }),
      });
      const j = (await res.json()) as {
        error?: string;
        details?: unknown;
        jobId?: string;
        summary?: LessonBatchResultSummaryV1;
      };
      if (!res.ok) {
        setErr(typeof j.error === "string" ? j.error : "Create failed");
        return;
      }
      if (j.jobId) setJobId(j.jobId);
      if (j.summary) setSummary(j.summary);
    } catch {
      setErr("Network error");
    }
  }

  async function resumeJob(e: React.FormEvent) {
    e.preventDefault();
    const id = resumeJobId.trim();
    if (id.length < 8) return;
    setErr(null);
    setJobId(id);
    await refreshJob(id);
  }

  async function runSteps() {
    if (!jobId) return;
    setErr(null);
    setRunning(true);
    setLastMessage(null);
    try {
      let done = false;
      while (!done) {
        const res = await fetch(`/api/admin/lessons/ai-generate-batch/${jobId}/step`, { method: "POST" });
        const j = (await res.json()) as {
          error?: string;
          done?: boolean;
          message?: string;
          summary?: LessonBatchResultSummaryV1;
        };
        if (!res.ok) {
          setErr(j.error ?? `Step failed (${res.status})`);
          if (j.summary) setSummary(j.summary);
          break;
        }
        if (j.summary) setSummary(j.summary);
        if (j.done) {
          done = true;
          setLastMessage(j.message ?? "Batch finished");
          break;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch {
      setErr("Network error during batch");
    } finally {
      setRunning(false);
    }
  }

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 12)));
  };

  const counts = summary
    ? summary.items.reduce(
        (acc, it) => {
          acc[it.status] = (acc[it.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-[var(--theme-card-bg)] to-sky-500/[0.06] p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">Batch AI lesson drafts</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Create one <code className="rounded bg-muted px-1">GeneratedLessonDraft</code> per topic. Queue processes one
          topic at a time so a single failure does not stop the rest. Duplicates (same topic + pathway + country + lesson
          type as an existing pending/approved draft) are skipped unless you allow duplicates.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Statuses: <span className={statusBadge("pending")}>pending</span>{" "}
          <span className={statusBadge("generating")}>generating</span>{" "}
          <span className={statusBadge("completed")}>completed</span>{" "}
          <span className={statusBadge("failed")}>failed</span>{" "}
          <span className={statusBadge("skipped_duplicate")}>skipped_duplicate</span>
        </p>
      </div>

      <form
        onSubmit={createBatch}
        className="space-y-6 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">1. Topics & settings</h2>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Topics (one per line, or comma / semicolon separated) *</span>
          <textarea
            className="min-h-[140px] w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
            value={topicsRaw}
            onChange={(e) => setTopicsRaw(e.target.value)}
            placeholder={"Acute kidney injury nursing assessment\nHyperkalemia emergencies"}
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Pathway *</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={pathway}
              onChange={(e) => setPathway(e.target.value as (typeof PATHWAYS)[number])}
            >
              {PATHWAYS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Country *</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as "CA" | "US")}
            >
              <option value="US">US</option>
              <option value="CA">CA</option>
            </select>
          </label>
          <label className="block space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Topic domain (body system / area) *</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={topicDomain}
              onChange={(e) => setTopicDomain(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Renal / fluid & electrolytes"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Lesson type *</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value as (typeof LESSON_TYPES)[number][0])}
            >
              {LESSON_TYPES.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Difficulty</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            >
              <option value="">Default</option>
              <option value="foundation">Foundation</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} />
          Allow duplicate topics (skip fingerprint check against existing drafts)
        </label>

        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Related categories (optional)</span>
          <button type="button" className="text-xs text-primary underline" onClick={() => void loadCategories()}>
            Load categories
          </button>
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border/60 p-2">
            {categories.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Create batch queue
        </button>
      </form>

      <form onSubmit={resumeJob} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border/80 p-4">
        <label className="min-w-[200px] flex-1 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Resume job id</span>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
            value={resumeJobId}
            onChange={(e) => setResumeJobId(e.target.value)}
            placeholder="cuid…"
          />
        </label>
        <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
          Load status
        </button>
      </form>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {lastMessage ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{lastMessage}</p> : null}

      {jobId ? (
        <div className="space-y-4 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">2. Queue</h2>
              <p className="font-mono text-xs text-muted-foreground">Job {jobId}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={running}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                onClick={() => void runSteps()}
              >
                {running ? "Running…" : "Run / continue batch"}
              </button>
              <button
                type="button"
                disabled={running}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                onClick={() => void refreshJob(jobId)}
              >
                Refresh
              </button>
            </div>
          </div>

          {summary ? (
            <>
              <p className="text-sm text-muted-foreground">
                {Object.entries(counts)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ")}
              </p>
              <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
                {summary.items.map((it) => (
                  <li key={it.itemId} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">{it.topic}</p>
                      {it.error ? <p className="text-xs text-red-600">{it.error}</p> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={statusBadge(it.status)}>{it.status}</span>
                      {it.draftId ? (
                        <Link
                          className="text-xs font-semibold text-primary underline"
                          href={`/admin/lessons/generate?draft=${it.draftId}`}
                        >
                          Open draft
                        </Link>
                      ) : null}
                      {it.existingDraftId ? (
                        <Link
                          className="text-xs font-semibold text-amber-800 underline dark:text-amber-200"
                          href={`/admin/lessons/generate?draft=${it.existingDraftId}`}
                        >
                          Existing draft
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No summary yet — create a batch or load a job.</p>
          )}
        </div>
      ) : null}

      <p className="text-center text-xs text-muted-foreground">
        Promote drafts from the{" "}
        <Link href="/admin/lessons/generate" className="underline">
          single-lesson generator
        </Link>{" "}
        (per draft). Published lessons appear in the{" "}
        <Link href="/admin/lessons" className="underline">
          lesson library
        </Link>{" "}
        after promotion.
      </p>
    </div>
  );
}
