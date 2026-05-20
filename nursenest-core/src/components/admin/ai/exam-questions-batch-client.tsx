"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useAdminAiGenerationGate } from "@/components/admin/admin-ai-generation-context";
import type { QuestionBatchItem, QuestionBatchResultSummaryV1 } from "@/lib/ai/admin-ai-question-batch";

function statusBadge(status: QuestionBatchItem["status"]) {
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
    case "skipped_duplicate_stem":
      return `${base} bg-orange-500/15 text-orange-900 dark:text-orange-100`;
    default:
      return base;
  }
}

async function readJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function errorMessageFromResponse(
  body: { error?: string; message?: string } | null,
  fallback: string,
): string {
  return body?.error ?? body?.message ?? fallback;
}

export function ExamQuestionsBatchClient() {
  const aiGate = useAdminAiGenerationGate();

  const [topicsRaw, setTopicsRaw] = useState("");
  const [tier, setTier] = useState("rn");
  const [pathway, setPathway] = useState("");
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [examFamily, setExamFamily] = useState("GENERIC");
  const [difficulty, setDifficulty] = useState<"FOUNDATION" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");
  const [questionTypeMode, setQuestionTypeMode] = useState<"auto" | "mcq" | "sata">("auto");
  const [questionTypes, setQuestionTypes] = useState("prioritization, pharmacology, labs");
  const [lessonId, setLessonId] = useState("");
  const [lessonTargets, setLessonTargets] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [resumeJobId, setResumeJobId] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [summary, setSummary] = useState<QuestionBatchResultSummaryV1 | null>(null);
  const [running, setRunning] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const refreshJob = useCallback(async (id: string, repair?: boolean) => {
    const q = repair ? "?repair=1" : "";

    try {
      const res = await fetch(`/api/admin/ai/exam-questions/generate-batch/${encodeURIComponent(id)}${q}`, {
        credentials: "include",
      });

      const body = await readJsonSafe<{ error?: string; summary?: QuestionBatchResultSummaryV1 }>(res);

      if (!res.ok) {
        setErr(errorMessageFromResponse(body, `Refresh failed (${res.status})`));
        return;
      }

      if (body?.summary) {
        setSummary(body.summary);
      }
    } catch {
      setErr("Network error while loading batch status.");
    }
  }, []);

  async function createBatch(e: React.FormEvent) {
    e.preventDefault();

    if (!aiGate.runnable) {
      setErr("AI generation is not available right now.");
      return;
    }

    setErr(null);
    setLastMessage(null);
    setJobId(null);
    setSummary(null);

    try {
      const res = await fetch("/api/admin/ai/exam-questions/generate-batch", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicsRaw,
          tier,
          country,
          examFamily,
          difficulty,
          questionTypeMode,
          questionTypes: questionTypes.trim() || undefined,
          allowDuplicates,
          ...(pathway.trim() ? { pathway: pathway.trim() } : {}),
          ...(lessonId.trim() ? { lessonId: lessonId.trim() } : {}),
          ...(categoryId.trim() ? { categoryId: categoryId.trim() } : {}),
          ...(lessonTargets.trim() ? { lessonTargets: lessonTargets.trim() } : {}),
        }),
      });

      const body = await readJsonSafe<{
        error?: string;
        jobId?: string;
        summary?: QuestionBatchResultSummaryV1;
      }>(res);

      if (!res.ok) {
        setErr(errorMessageFromResponse(body, `Create batch failed (${res.status})`));
        return;
      }

      if (body?.jobId) setJobId(body.jobId);
      if (body?.summary) setSummary(body.summary);
    } catch {
      setErr("Network error while creating batch.");
    }
  }

  async function resumeJob(e: React.FormEvent) {
    e.preventDefault();

    const id = resumeJobId.trim();

    if (id.length < 8) {
      setErr("Enter a valid job id.");
      return;
    }

    setErr(null);
    setLastMessage(null);
    setJobId(id);

    await refreshJob(id, true);
  }

  async function runSteps() {
    if (!jobId || running || !aiGate.runnable) return;

    setErr(null);
    setRunning(true);
    setLastMessage(null);

    try {
      let done = false;

      while (!done) {
        const res = await fetch(`/api/admin/ai/exam-questions/generate-batch/${encodeURIComponent(jobId)}/step`, {
          method: "POST",
          credentials: "include",
        });

        const body = await readJsonSafe<{
          error?: string;
          done?: boolean;
          message?: string;
          summary?: QuestionBatchResultSummaryV1;
          warning?: string;
        }>(res);

        if (!res.ok) {
          setErr(errorMessageFromResponse(body, `Step failed (${res.status})`));
          if (body?.summary) setSummary(body.summary);
          break;
        }

        if (body?.summary) setSummary(body.summary);
        if (body?.warning) setLastMessage(body.warning);

        if (body?.done) {
          done = true;
          setLastMessage((m) => m ?? body.message ?? "Batch finished");
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch {
      setErr("Network error during batch.");
    } finally {
      setRunning(false);
    }
  }

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
    <div className="space-y-8">
      <div className="nn-card space-y-3 p-6">
        <p className="text-sm text-muted">
          One <strong>GeneratedQuestionDraft</strong> per topic. Process topics sequentially so one failure does not
          stop the rest. Fingerprint dedup skips topics already generated with the same settings; stem dedup skips when
          a matching question or draft already exists unless duplicates are allowed.
        </p>
        <p className="text-xs text-muted">
          Open drafts in the question studio to regenerate sections, approve, and promote.
        </p>
      </div>

      <form onSubmit={createBatch} className="nn-card space-y-4 p-6">
        <h2 className="text-sm font-semibold">1. Topics & settings</h2>

        <label className="block text-sm">
          Topics *
          <textarea
            className="mt-1 min-h-[120px] w-full rounded border border-border px-2 py-1.5 font-mono text-sm"
            value={topicsRaw}
            onChange={(e) => setTopicsRaw(e.target.value)}
            required
            placeholder={"Acute kidney injury — nursing priorities\nHyperkalemia management"}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Pathway label
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
              placeholder="e.g. Med-Surg RN"
            />
          </label>

          <label className="text-sm">
            Tier
            <select
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              {["free", "rpn", "rn", "np"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Country
            <select
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as "CA" | "US")}
            >
              <option value="CA">CA</option>
              <option value="US">US</option>
            </select>
          </label>

          <label className="text-sm">
            Exam family
            <select
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={examFamily}
              onChange={(e) => setExamFamily(e.target.value)}
            >
              {["GENERIC", "NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED"].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Difficulty
            <select
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            >
              <option value="FOUNDATION">Foundation</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </label>

          <label className="text-sm">
            Question type mode
            <select
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={questionTypeMode}
              onChange={(e) => setQuestionTypeMode(e.target.value as typeof questionTypeMode)}
            >
              <option value="auto">Auto</option>
              <option value="mcq">MCQ only</option>
              <option value="sata">SATA only</option>
            </select>
          </label>

          <label className="text-sm sm:col-span-2">
            Style hints
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={questionTypes}
              onChange={(e) => setQuestionTypes(e.target.value)}
            />
          </label>

          <label className="text-sm">
            Category ID
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </label>

          <label className="text-sm">
            Primary lesson ID
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            />
          </label>

          <label className="text-sm sm:col-span-2">
            Lesson targets for link hints
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={lessonTargets}
              onChange={(e) => setLessonTargets(e.target.value)}
              placeholder="comma-separated content IDs"
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} />
          Allow duplicates
        </label>

        <button
          type="submit"
          disabled={!aiGate.runnable || running}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          Create batch queue
        </button>
      </form>

      <form onSubmit={resumeJob} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border p-4">
        <label className="min-w-[200px] flex-1 text-sm">
          Resume job id
          <input
            className="mt-1 w-full rounded border border-border px-2 py-1.5 font-mono text-sm"
            value={resumeJobId}
            onChange={(e) => setResumeJobId(e.target.value)}
            placeholder="cuid…"
          />
        </label>

        <button type="submit" disabled={running} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50">
          Load status
        </button>
      </form>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {lastMessage ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{lastMessage}</p> : null}

      {jobId ? (
        <div className="nn-card space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">2. Queue</h2>
              <p className="font-mono text-xs text-muted">Job {jobId}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={running || !aiGate.runnable}
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
              <p className="text-sm text-muted">
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
                        <Link className="text-xs font-semibold text-primary underline" href={`/admin/ai/drafts/questions/${it.draftId}`}>
                          Open draft
                        </Link>
                      ) : null}

                      {it.existingDraftId ? (
                        <Link
                          className="text-xs font-semibold text-amber-800 underline dark:text-amber-200"
                          href={`/admin/ai/drafts/questions/${it.existingDraftId}`}
                        >
                          Existing draft
                        </Link>
                      ) : null}

                      {it.existingQuestionBankId ? (
                        <Link
                          className="text-xs font-semibold text-orange-800 underline dark:text-orange-200"
                          href={`/admin/questions?q=${it.existingQuestionBankId}`}
                        >
                          Bank match
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">No summary yet.</p>
          )}
        </div>
      ) : null}

      <p className="text-center text-xs text-muted">
        <Link href="/admin/ai/exam-questions" className="underline">
          Single-topic multi-question generator
        </Link>
      </p>
    </div>
  );
}