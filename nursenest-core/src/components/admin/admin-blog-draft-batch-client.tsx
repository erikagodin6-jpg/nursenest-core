"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BlogDraftGenerationBatchItemStatus,
  BlogDraftGenerationBatchStatus,
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostTemplate,
  CountryCode,
} from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";
import {
  DRAFT_BATCH_MAX_ITEMS_PER_PROCESS,
  DRAFT_BATCH_MAX_TOPICS,
} from "@/lib/blog/blog-draft-generation-batch-constants";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

const templates: BlogPostTemplate[] = [
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
];

type BatchRow = {
  id: string;
  status: BlogDraftGenerationBatchStatus;
  exam: string;
  country: string;
  totalItems: number;
  completedCount: number;
  failedCount: number;
  skippedCount: number;
  allowDuplicateCanonicalTopic: boolean;
  backgroundProcessing?: boolean;
  createdAt: string;
};

type ItemRow = {
  id: string;
  ordinal: number;
  topicRaw: string;
  status: BlogDraftGenerationBatchItemStatus;
  blogPostId: string | null;
  error: string | null;
  blogPost: { id: string; slug: string; title: string } | null;
};

type BatchDetail = BatchRow & {
  defaultTemplate: BlogPostTemplate;
  defaultIntent: BlogPostIntent | null;
  funnelStage: BlogFunnelStage | null;
  tone: string;
  keywords: string | null;
  keywordCluster: string | null;
  countryTarget: CountryCode | null;
  includeImage: boolean;
  includeAiImage: boolean;
  items: ItemRow[];
  jobPhase?: "queued" | "running" | "completed" | "cancelled" | "partial";
  lastProcessorError?: string | null;
};

type GenerationJobApiPayload = {
  id: string;
  phase: NonNullable<BatchDetail["jobPhase"]>;
  batchStatus: BlogDraftGenerationBatchStatus;
  exam: string;
  country: string;
  backgroundProcessing: boolean;
  defaultTemplate: BlogPostTemplate;
  defaultIntent: BlogPostIntent | null;
  funnelStage: BlogFunnelStage | null;
  tone: string;
  keywords: string | null;
  keywordCluster: string | null;
  countryTarget: CountryCode | null;
  includeImage: boolean;
  includeAiImage: boolean;
  allowDuplicateCanonicalTopic: boolean;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  skippedItems: number;
  lastProcessorError: string | null;
  items: ItemRow[];
};

function mapJobPayloadToBatchDetail(job: GenerationJobApiPayload): BatchDetail {
  return {
    id: job.id,
    status: job.batchStatus,
    exam: job.exam,
    country: job.country,
    totalItems: job.totalItems,
    completedCount: job.completedItems,
    failedCount: job.failedItems,
    skippedCount: job.skippedItems,
    allowDuplicateCanonicalTopic: job.allowDuplicateCanonicalTopic,
    backgroundProcessing: job.backgroundProcessing,
    createdAt: "",
    defaultTemplate: job.defaultTemplate,
    defaultIntent: job.defaultIntent,
    funnelStage: job.funnelStage,
    tone: job.tone,
    keywords: job.keywords,
    keywordCluster: job.keywordCluster,
    countryTarget: job.countryTarget,
    includeImage: job.includeImage,
    includeAiImage: job.includeAiImage,
    items: job.items,
    jobPhase: job.phase,
    lastProcessorError: job.lastProcessorError,
  };
}

function jobPhaseBadge(phase: NonNullable<BatchDetail["jobPhase"]>) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (phase) {
    case "queued":
      return `${base} bg-violet-500/15 text-violet-950 dark:text-violet-100`;
    case "running":
      return `${base} bg-amber-500/20 text-amber-950 dark:text-amber-100`;
    case "partial":
      return `${base} bg-orange-500/15 text-orange-950 dark:text-orange-100`;
    case "completed":
      return `${base} bg-emerald-500/15 text-emerald-950 dark:text-emerald-100`;
    case "cancelled":
      return `${base} bg-zinc-500/15 text-zinc-800 dark:text-zinc-200`;
    default:
      return `${base} bg-muted text-foreground`;
  }
}

function statusBadge(status: BlogDraftGenerationBatchItemStatus | BlogDraftGenerationBatchStatus) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (status) {
    case BlogDraftGenerationBatchItemStatus.PENDING:
      return `${base} bg-slate-500/15 text-slate-900 dark:text-slate-100`;
    case BlogDraftGenerationBatchItemStatus.GENERATING:
      return `${base} bg-amber-500/20 text-amber-950 dark:text-amber-100`;
    case BlogDraftGenerationBatchItemStatus.COMPLETED:
      return `${base} bg-emerald-500/15 text-emerald-950 dark:text-emerald-100`;
    case BlogDraftGenerationBatchItemStatus.FAILED:
      return `${base} bg-rose-500/15 text-rose-950 dark:text-rose-100`;
    case BlogDraftGenerationBatchItemStatus.SKIPPED:
      return `${base} bg-zinc-500/15 text-zinc-800 dark:text-zinc-200`;
    case BlogDraftGenerationBatchStatus.ACTIVE:
      return `${base} bg-sky-500/15 text-sky-950 dark:text-sky-100`;
    case BlogDraftGenerationBatchStatus.COMPLETED:
      return `${base} bg-emerald-500/15 text-emerald-950 dark:text-emerald-100`;
    case BlogDraftGenerationBatchStatus.CANCELLED:
      return `${base} bg-zinc-500/15 text-zinc-800 dark:text-zinc-200`;
    default:
      return `${base} bg-muted text-foreground`;
  }
}

export function AdminBlogDraftBatchClient() {
  const [topicsText, setTopicsText] = useState("");
  const [exam, setExam] = useState(ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value);
  const [country, setCountry] = useState<"US" | "CA" | "unspecified">("unspecified");
  const [countryTarget, setCountryTarget] = useState<"" | CountryCode>("");
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [tone, setTone] = useState<"professional" | "supportive" | "direct">("professional");
  const [intent, setIntent] = useState<BlogPostIntent>(BlogPostIntent.EXAM_PREP);
  const [funnelStage, setFunnelStage] = useState<BlogFunnelStage>(BlogFunnelStage.CONSIDERATION);
  const [keywords, setKeywords] = useState("");
  const [keywordCluster, setKeywordCluster] = useState("");
  const [includeImage, setIncludeImage] = useState(true);
  const [includeAiImage, setIncludeAiImage] = useState(false);
  const [allowDuplicateCanonicalTopic, setAllowDuplicateCanonicalTopic] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [batch, setBatch] = useState<BatchDetail | null>(null);
  const [recent, setRecent] = useState<BatchRow[]>([]);
  const [processChunk, setProcessChunk] = useState(2);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);

  const loadRecent = useCallback(async () => {
    const res = await fetch("/api/admin/blog/draft-batch?limit=15", { credentials: "include", cache: "no-store" });
    const json = (await res.json()) as { ok?: boolean; batches?: BatchRow[] };
    if (res.ok && json.batches) setRecent(json.batches);
  }, []);

  const loadBatch = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/blog/generation-jobs/${id}`, { credentials: "include", cache: "no-store" });
    const json = (await res.json()) as { ok?: boolean; job?: GenerationJobApiPayload; error?: string };
    if (!res.ok || !json.job) {
      setErr(
        res.status === 429
          ? formatAdminRateLimitMessageFromJson(json)
          : json && typeof json === "object" && "error" in json
            ? String((json as { error?: string }).error)
            : "Load failed",
      );
      return;
    }
    setBatch(mapJobPayloadToBatchDetail(json.job));
    setErr(null);
  }, []);

  useEffect(() => {
    void loadRecent();
  }, [loadRecent]);

  useEffect(() => {
    const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const fromUrl = q.get("batch");
    if (fromUrl) {
      setBatchId(fromUrl);
      void loadBatch(fromUrl);
    }
  }, [loadBatch]);

  const pendingCount = useMemo(() => {
    if (!batch?.items) return 0;
    return batch.items.filter((i) => i.status === BlogDraftGenerationBatchItemStatus.PENDING).length;
  }, [batch]);

  const isProcessing = useMemo(() => {
    if (!batch?.items) return false;
    return batch.items.some((i) => i.status === BlogDraftGenerationBatchItemStatus.GENERATING);
  }, [batch]);

  const shouldPollJob = useMemo(() => {
    if (!batchId || !batch) return false;
    if (batch.status !== BlogDraftGenerationBatchStatus.ACTIVE) return false;
    if (!batch.backgroundProcessing) return false;
    const ph = batch.jobPhase;
    if (ph === "queued" || ph === "running") return true;
    return pendingCount > 0 || isProcessing;
  }, [batchId, batch, pendingCount, isProcessing]);

  useEffect(() => {
    if (!batchId || !shouldPollJob) return;
    const t = setInterval(() => {
      void loadBatch(batchId);
    }, 3000);
    return () => clearInterval(t);
  }, [batchId, shouldPollJob, loadBatch]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/admin/blog/generation-jobs", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicsText,
          exam,
          country,
          template,
          tone,
          intent,
          funnelStage,
          keywords: keywords || undefined,
          keywordCluster: keywordCluster || undefined,
          countryTarget: countryTarget || undefined,
          includeImage,
          includeAiImage,
          allowDuplicateCanonicalTopic,
          idempotencyKey,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        jobId?: string;
        job?: GenerationJobApiPayload;
        droppedShortLines?: number;
        idempotentReplay?: boolean;
      };
      if (!res.ok) {
        setErr(res.status === 429 ? formatAdminRateLimitMessageFromJson(json) : (json.error ?? "Create failed"));
        return;
      }
      const id = json.jobId ?? json.job?.id;
      if (!id || !json.job) {
        setErr("Missing job id");
        return;
      }
      setBatchId(id);
      setBatch(mapJobPayloadToBatchDetail(json.job));
      if (!json.idempotentReplay) {
        setIdempotencyKey(newIdempotencyKey());
      }
      setMsg(
        `${json.idempotentReplay ? "Returned existing job (same idempotency key)." : "Server job created."} Progress updates automatically; cron runs every few minutes. Use “Process chunk” to nudge sooner.${json.droppedShortLines ? ` Dropped ${json.droppedShortLines} short lines.` : ""}`,
      );
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("batch", id);
        window.history.replaceState({}, "", url.toString());
      }
      await loadRecent();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onProcess(limit: number) {
    if (!batchId) return;
    setBusy(true);
    setErr(null);
    try {
      const useTick = batch?.backgroundProcessing === true;
      const safeLimit = Math.min(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS, Math.max(1, limit));
      const url = useTick
        ? `/api/admin/blog/generation-jobs/${batchId}/tick`
        : `/api/admin/blog/draft-batch/${batchId}/process`;
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: safeLimit }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        processed?: number;
        errors?: string[];
        job?: GenerationJobApiPayload;
      };
      if (!res.ok) {
        setErr(
          res.status === 429
            ? formatAdminRateLimitMessageFromJson(json)
            : (json.error ?? json.errors?.[0] ?? "Process failed"),
        );
        return;
      }
      setMsg(`Processed ${json.processed ?? 0} item(s) in this request.`);
      if (useTick && json.job) {
        setBatch(mapJobPayloadToBatchDetail(json.job));
      } else {
        await loadBatch(batchId);
      }
      await loadRecent();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function openBatch(id: string) {
    setBatchId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("batch", id);
      window.history.replaceState({}, "", url.toString());
    }
    void loadBatch(id);
  }

  const lineCount = topicsText.split(/\r?\n/).filter((l) => l.trim().length >= 3).length;

  return (
    <div className="space-y-8">
      <form onSubmit={onCreate} className="space-y-4 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Batch AI draft generation</h2>
        <p className="text-sm text-muted-foreground">
          One draft per non-empty line. Results are stored on each <code className="rounded bg-muted px-1">BlogPost</code> row; queue
          state is persisted so you can refresh safely. Process in chunks (
          {DRAFT_BATCH_MAX_ITEMS_PER_PROCESS} max per request) to avoid timeouts. Requires{" "}
          <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and OpenAI.
        </p>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Topics (one per line, max {DRAFT_BATCH_MAX_TOPICS}) — {lineCount} valid lines
          </span>
          <textarea
            className="min-h-[180px] w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
            placeholder={"Fluid balance for NCLEX\nElectrolyte emergencies\n..."}
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Exam focus *</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
            >
              {ADMIN_BLOG_TARGET_EXAM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Country context</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as typeof country)}
            >
              <option value="unspecified">Unspecified</option>
              <option value="US">US</option>
              <option value="CA">Canada</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Country target (SEO)</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={countryTarget}
              onChange={(e) => setCountryTarget(e.target.value as "" | CountryCode)}
            >
              <option value="">—</option>
              <option value={CountryCode.US}>US</option>
              <option value={CountryCode.CA}>CA</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Template</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={template}
              onChange={(e) => setTemplate(e.target.value as BlogPostTemplate)}
            >
              {templates.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Intent</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={intent}
              onChange={(e) => setIntent(e.target.value as BlogPostIntent)}
            >
              {Object.values(BlogPostIntent).map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Funnel stage</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={funnelStage}
              onChange={(e) => setFunnelStage(e.target.value as BlogFunnelStage)}
            >
              {Object.values(BlogFunnelStage).map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Tone</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
            >
              <option value="professional">Professional</option>
              <option value="supportive">Supportive</option>
              <option value="direct">Direct</option>
            </select>
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Keywords (comma-separated, applied to every item)</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Keyword cluster (optional)</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              value={keywordCluster}
              onChange={(e) => setKeywordCluster(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)} />
            Request featured image workflow
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={includeAiImage} onChange={(e) => setIncludeAiImage(e.target.checked)} />
            Request AI-generated image (async)
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={allowDuplicateCanonicalTopic}
              onChange={(e) => setAllowDuplicateCanonicalTopic(e.target.checked)}
            />
            Allow duplicate canonical topic (skips intent dedupe; slugs still unique)
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Working…" : "Create batch queue"}
        </button>
        {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}
        {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}
      </form>

      {batchId && batch ? (
        <section className="space-y-4 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Current batch</h3>
              <p className="text-xs text-muted-foreground">
                ID <code className="rounded bg-muted px-1">{batchId}</code> ·{" "}
                <span className={statusBadge(batch.status)}>{batch.status}</span> · pending {pendingCount} / {batch.totalItems}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 text-sm">
                Chunk
                <select
                  className="rounded-md border border-border px-2 py-1 text-sm"
                  value={processChunk}
                  onChange={(e) => setProcessChunk(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={busy || pendingCount === 0}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                onClick={() => void onProcess(processChunk)}
              >
                Process chunk
              </button>
              <button
                type="button"
                disabled={busy || pendingCount === 0}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                onClick={() => void onProcessAll()}
              >
                Process all (loop)
              </button>
              <Link
                href="/admin/blog/control-panel"
                className="rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary"
              >
                Open control panel
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Topic</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {batch.items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-2 pr-2 align-top text-muted-foreground">{row.ordinal + 1}</td>
                    <td className="py-2 pr-2 align-top">{row.topicRaw}</td>
                    <td className="py-2 pr-2 align-top">
                      <span className={statusBadge(row.status)}>{row.status}</span>
                    </td>
                    <td className="py-2 pr-2 align-top">
                      {row.blogPost ? (
                        <Link href={`/admin/blog/control-panel?id=${row.blogPost.id}`} className="font-medium text-primary underline">
                          {row.blogPost.slug}
                        </Link>
                      ) : null}
                      {row.error ? (
                        <p className="mt-1 max-w-md text-xs text-rose-700 dark:text-rose-300">{row.error}</p>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-border/70 bg-muted/15 p-6">
        <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Recent batches</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {recent.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-[var(--theme-card-bg)] px-3 py-2">
              <button type="button" className="text-left font-mono text-xs text-primary underline" onClick={() => openBatch(b.id)}>
                {b.id.slice(0, 8)}…
              </button>
              <span className="text-muted-foreground">
                {b.exam} · {b.completedCount}/{b.totalItems} ok · {b.failedCount} fail · {b.skippedCount} skip
              </span>
              <span className={statusBadge(b.status)}>{b.status}</span>
            </li>
          ))}
          {recent.length === 0 ? <li className="text-muted-foreground">No batches yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
