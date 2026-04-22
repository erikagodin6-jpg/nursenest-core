"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminAiGenerationGate } from "@/components/admin/admin-ai-generation-context";

type DraftRow = {
  id: string;
  stemPreview: string | null;
  reviewStatus: string;
  batchId: string | null;
  createdAt: string;
};

export function ExamQuestionsTool() {
  const aiGate = useAdminAiGenerationGate();
  const [topic, setTopic] = useState("");
  const [quantity, setQuantity] = useState(5);
  const [tier, setTier] = useState("rn");
  const [pathway, setPathway] = useState("");
  const [country, setCountry] = useState("CA");
  const [examFamily, setExamFamily] = useState("GENERIC");
  const [difficulty, setDifficulty] = useState<"FOUNDATION" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");
  const [questionTypeMode, setQuestionTypeMode] = useState<"auto" | "mcq" | "sata">("auto");
  const [questionTypes, setQuestionTypes] = useState("prioritization, pharmacology, labs");
  const [lessonId, setLessonId] = useState("");
  const [lessonTargets, setLessonTargets] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    jobId?: string;
    batchId?: string;
    draftIds?: string[];
    message?: string;
  } | null>(null);
  const [recent, setRecent] = useState<DraftRow[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/ai/drafts/questions", { credentials: "include" });
      const data = (await res.json().catch(() => ({}))) as { drafts?: DraftRow[] };
      if (res.ok && data.drafts) setRecent(data.drafts);
    })();
  }, [result]);

  async function run() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const hints = questionTypes
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const targets = lessonTargets
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/ai/exam-questions/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          topic: topic.trim(),
          quantity,
          country,
          examFamily,
          difficulty,
          questionTypeMode,
          ...(hints.length ? { questionTypes: hints } : {}),
          ...(pathway.trim() ? { pathway: pathway.trim() } : {}),
          ...(lessonId.trim() ? { lessonId: lessonId.trim() } : {}),
          ...(categoryId.trim() ? { categoryId: categoryId.trim() } : {}),
          ...(targets.length ? { lessonTargets: targets } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setError(String(data.error ?? res.status));
        return;
      }
      setResult({
        jobId: typeof data.jobId === "string" ? data.jobId : undefined,
        batchId: typeof data.batchId === "string" ? data.batchId : undefined,
        draftIds: Array.isArray(data.draftIds) ? (data.draftIds as string[]) : undefined,
        message: typeof data.message === "string" ? data.message : undefined,
      });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm">
        <Link href="/admin/ai/exam-questions/batch" className="font-semibold text-primary underline">
          Batch: one draft per topic (queue + dedup)
        </Link>
      </p>
      <div className="nn-card space-y-4 p-6">
        <p className="text-sm text-muted">
          Generates <strong>draft records</strong> for review (pathway/country/exam-aware prompts, rationales, lesson-link
          suggestions). Nothing is published to the live question bank until you promote an approved draft.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            Topic / clinical focus
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Heart failure exacerbation — diuretics and monitoring"
            />
          </label>
          <label className="text-sm">
            Pathway label (optional)
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
              placeholder="e.g. Med-Surg RN, FNP"
            />
          </label>
          <label className="text-sm">
            Quantity (max 15)
            <input
              type="number"
              min={1}
              max={15}
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
              onChange={(e) => setCountry(e.target.value)}
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
            Difficulty band
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
              <option value="auto">Auto (mix MCQ + SATA)</option>
              <option value="mcq">MCQ only</option>
              <option value="sata">SATA only</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            Style hints (comma-separated, optional)
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={questionTypes}
              onChange={(e) => setQuestionTypes(e.target.value)}
              placeholder="prioritization, pharmacology, lab-values"
            />
          </label>
          <label className="text-sm">
            Category ID (optional)
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              placeholder="cuid — for promotion defaults"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Primary lesson ID (optional)
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Stored on draft for linkage"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Lesson targets for AI mapping (optional, comma-separated content IDs)
            <input
              className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
              value={lessonTargets}
              onChange={(e) => setLessonTargets(e.target.value)}
              placeholder="cuid1, cuid2 — model prefers these in lessonLinkSuggestions"
            />
          </label>
        </div>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          disabled={loading || !topic.trim() || !aiGate.runnable}
          onClick={() => void run()}
        >
          {loading ? "Generating…" : "Generate drafts"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {result ? (
          <div className="space-y-2 rounded border border-border/60 bg-black/[0.02] p-3 text-sm">
            <p className="font-medium">{result.message ?? "Done"}</p>
            {result.batchId ? <p className="text-xs text-muted">Batch: {result.batchId}</p> : null}
            {result.jobId ? <p className="text-xs text-muted">Job: {result.jobId}</p> : null}
            {result.draftIds?.length ? (
              <ul className="space-y-1 text-xs">
                {result.draftIds.map((id) => (
                  <li key={id}>
                    <Link className="text-primary underline" href={`/admin/ai/drafts/questions/${id}`}>
                      Open draft: {id.slice(0, 8)}…
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="nn-card space-y-3 p-6">
        <h2 className="text-sm font-semibold">Recent drafts</h2>
        <p className="text-xs text-muted">Last 100 pending or approved. Open a row to review, regenerate sections, or approve.</p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No drafts loaded.</p>
        ) : (
          <ul className="divide-y divide-border/60 text-sm">
            {recent.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <div>
                  <Link className="font-medium text-primary underline" href={`/admin/ai/drafts/questions/${d.id}`}>
                    {d.stemPreview?.slice(0, 72) ?? d.id}
                    {(d.stemPreview?.length ?? 0) > 72 ? "…" : ""}
                  </Link>
                  <p className="text-xs text-muted">
                    {d.reviewStatus}
                    {d.batchId ? ` · ${d.batchId}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
