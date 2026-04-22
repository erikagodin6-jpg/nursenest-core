"use client";

import { useState } from "react";
import { useAdminAiGenerationGate } from "@/components/admin/admin-ai-generation-context";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN } from "@/lib/admin/blog-generate-ai-constants";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";
import type { BlogAutomationSeoReadiness } from "@/lib/blog/blog-automation-engine";

type GenerateAiJsonBody = {
  ok?: boolean;
  summary?: { created: number; skipped: number; failed: number; requested?: number };
  results?: Array<
    | {
        ok: true;
        skipped?: false;
        topic?: string;
        post?: { slug: string };
        seoReadiness?: BlogAutomationSeoReadiness;
      }
    | { ok: true; skipped: true; topic?: string; reason?: string }
    | { ok: false; topic: string; error: string }
  >;
  error?: string;
  code?: string;
  scope?: string;
  limiter?: string;
  bucketKeyType?: string;
  path?: string;
  max?: number;
  windowMs?: number;
  retryAfterSec?: number;
};

type NdjsonCompleteEvent = GenerateAiJsonBody & { type: "complete"; httpStatus?: number };

function parseNdjsonLine(line: string, context: string): Record<string, unknown> {
  try {
    return JSON.parse(line) as Record<string, unknown>;
  } catch {
    const preview = line.length > 200 ? `${line.slice(0, 200)}…` : line;
    throw new Error(`Invalid NDJSON line (${context}): ${preview}`);
  }
}

async function consumeAdminBlogGenerateNdjson(
  res: Response,
  onEvent: (evt: Record<string, unknown>) => void,
): Promise<NdjsonCompleteEvent> {
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }
  const decoder = new TextDecoder();
  let buffer = "";
  let complete: NdjsonCompleteEvent | null = null;
  let lineIndex = 0;
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      lineIndex += 1;
      const evt = parseNdjsonLine(line, `line ${lineIndex}`);
      onEvent(evt);
      if (evt.type === "fatal") {
        throw new Error(typeof evt.error === "string" ? evt.error : "Batch failed");
      }
      if (evt.type === "complete") {
        complete = evt as NdjsonCompleteEvent;
      }
    }
    if (done) break;
  }
  const tail = buffer.trim();
  if (tail) {
    lineIndex += 1;
    const evt = parseNdjsonLine(tail, `tail line ${lineIndex}`);
    onEvent(evt);
    if (evt.type === "fatal") {
      throw new Error(typeof evt.error === "string" ? evt.error : "Batch failed");
    }
    if (evt.type === "complete") {
      complete = evt as NdjsonCompleteEvent;
    }
  }
  if (!complete) {
    throw new Error("Batch stream ended without a complete event (truncated response or proxy stripped the stream).");
  }
  return complete;
}

function summarizeGenerateAiResponse(json: GenerateAiJsonBody): string {
  const created = json.summary?.created ?? 0;
  const skipped = json.summary?.skipped ?? 0;
  const failed = json.summary?.failed ?? 0;
  const requested = json.summary?.requested ?? json.results?.length;
  const firstSlug = json.results?.find((r) => "post" in r && r.post?.slug)?.post?.slug;
  const seoRows = (json.results ?? []).filter(
    (r): r is { ok: true; seoReadiness?: BlogAutomationSeoReadiness } =>
      "ok" in r && r.ok === true && !("skipped" in r && r.skipped === true),
  );
  const publishHeldCount = seoRows.filter((r) => r.seoReadiness?.publishHeldAsDraft === true).length;
  const blockingSample = seoRows
    .flatMap((r) => r.seoReadiness?.blocking ?? [])
    .slice(0, 2)
    .map((b) => b.message.slice(0, 80) + (b.message.length > 80 ? "…" : ""));
  const seoSuffix =
    publishHeldCount > 0
      ? ` SEO: ${publishHeldCount} draft(s) held from auto-publish (review checklist).${
          blockingSample.length ? ` Examples: ${blockingSample.join(" | ")}` : ""
        }`
      : "";
  const failSamples = (json.results ?? [])
    .filter((r): r is { ok: false; topic: string; error: string } => "ok" in r && r.ok === false)
    .slice(0, 5)
    .map((r) => `${r.topic}: ${r.error.slice(0, 100)}${r.error.length > 100 ? "…" : ""}`);
  const failSuffix = failSamples.length ? ` Failures: ${failSamples.join(" | ")}` : "";
  return created > 0
    ? `Completed batch (${requested ?? "?"} requested): created ${created}${firstSlug ? ` (e.g. ${firstSlug})` : ""}, skipped ${skipped}, failed ${failed}.${seoSuffix}${failSuffix}`
    : `No posts created (${requested ?? "?"} requested). Skipped ${skipped}, failed ${failed}.${seoSuffix}${failSuffix}`;
}

const templates: BlogPostTemplate[] = [
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
];

export function AdminBlogGenerateClient() {
  const aiGate = useAdminAiGenerationGate();
  const [topic, setTopic] = useState("");
  const [topicsBatch, setTopicsBatch] = useState("");
  const [enableBatch, setEnableBatch] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const [keywords, setKeywords] = useState("");
  const [exam, setExam] = useState(ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value);
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [tone, setTone] = useState<"professional" | "supportive" | "direct">("professional");
  const [intent, setIntent] = useState<BlogPostIntent>(BlogPostIntent.EXAM_PREP);
  const [funnelStage, setFunnelStage] = useState<BlogFunnelStage>(BlogFunnelStage.CONSIDERATION);
  const [targetKeyword, setTargetKeyword] = useState("");
  const [keywordCluster, setKeywordCluster] = useState("");
  const [includeImage, setIncludeImage] = useState(true);
  const [includeAiImage, setIncludeAiImage] = useState(false);
  const [sourceRecordsJson, setSourceRecordsJson] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const parsedTopics = topicsBatch
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN);
    if (enableBatch && parsedTopics.length === 0) {
      setErr("Add at least one non-empty topic line for batch mode.");
      return;
    }
    setBusy(true);
    setMsg(null);
    setErr(null);
    setBatchStatus(
      enableBatch
        ? `Server batch: ${parsedTopics.length} topic(s) in one request (sequential generation — keep this tab open).`
        : null,
    );
    try {
      const useNdjsonBatch = enableBatch && parsedTopics.length > 1;
      const res = await fetch("/api/admin/blog/generate-ai", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(useNdjsonBatch ? { Accept: "application/x-ndjson" } : {}),
        },
        body: JSON.stringify({
          topic: enableBatch ? undefined : topic,
          topics: enableBatch ? parsedTopics : undefined,
          keywords: keywords || undefined,
          exam,
          template,
          tone,
          intent,
          funnelStage,
          targetKeyword: targetKeyword || undefined,
          keywordCluster: keywordCluster || undefined,
          includeImage,
          includeAiImage,
          sourceRecords: sourceRecordsJson.trim() ? JSON.parse(sourceRecordsJson) : undefined,
          slug: slug.trim() || undefined,
          publishNow,
        }),
      });
      if (!res.ok) {
        const json = (await res.json()) as GenerateAiJsonBody;
        if (res.status === 429) {
          setErr(formatAdminRateLimitMessageFromJson(json));
          return;
        }
        setErr(json.error ?? "Request failed");
        return;
      }

      const ct = res.headers.get("content-type") ?? "";
      if (useNdjsonBatch && ct.includes("ndjson")) {
        setBatchStatus(`Queued ${parsedTopics.length} topic(s)…`);
        const final = await consumeAdminBlogGenerateNdjson(res, (evt) => {
          if (evt.type === "queued" && typeof evt.total === "number") {
            setBatchStatus(`Queued ${evt.total} topic(s)…`);
          }
          if (
            evt.type === "generating" &&
            typeof evt.current === "number" &&
            typeof evt.total === "number" &&
            typeof evt.topic === "string"
          ) {
            setBatchStatus(`Generating ${evt.current}/${evt.total}: ${evt.topic}`);
          }
          if (
            evt.type === "item_done" &&
            typeof evt.current === "number" &&
            typeof evt.total === "number"
          ) {
            const outcome = typeof evt.outcome === "string" ? evt.outcome : "done";
            const held =
              evt.publishHeldAsDraft === true ? " — draft (SEO checks)" : "";
            setBatchStatus(`Finished ${evt.current}/${evt.total} (${outcome})${held}`);
          }
        });
        setMsg(summarizeGenerateAiResponse(final));
        if ((final.summary?.failed ?? 0) > 0 && (final.summary?.created ?? 0) === 0) {
          setErr("Every topic in this batch failed; see failure lines in the summary above.");
        }
        return;
      }

      const json = (await res.json()) as GenerateAiJsonBody;
      setMsg(summarizeGenerateAiResponse(json));
      if ((json.summary?.failed ?? 0) > 0 && (json.summary?.created ?? 0) === 0) {
        setErr("Every topic in this batch failed; see failure lines in the summary above.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setBatchStatus(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Single-post AI draft</h2>
      <p className="text-sm text-muted-foreground">
        Requires <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and{" "}
        <code className="rounded bg-muted px-1">AI_INTEGRATIONS_OPENAI_API_KEY</code>. Batch mode runs all lines in{" "}
        <strong>one server request</strong> (sequential topics, bounded retries on provider pressure). Large batches can take several minutes.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={enableBatch} onChange={(e) => setEnableBatch(e.target.checked)} />
          Batch mode (up to {ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN} topics per run, one POST)
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Topic *</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required={!enableBatch}
            disabled={enableBatch}
            minLength={3}
          />
        </label>
        {enableBatch ? (
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">
              Topics (one per line, max {ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN})
            </span>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              rows={8}
              value={topicsBatch}
              onChange={(e) => setTopicsBatch(e.target.value)}
              placeholder={"acid-base imbalance\nheart failure priorities\ninsulin safety"}
            />
          </label>
        ) : null}
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
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Keywords (comma-separated)</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. fluids, electrolytes"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Intent</span>
          <select className="w-full rounded-md border border-border px-3 py-2 text-sm" value={intent} onChange={(e) => setIntent(e.target.value as BlogPostIntent)}>
            {Object.values(BlogPostIntent).map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Funnel stage</span>
          <select className="w-full rounded-md border border-border px-3 py-2 text-sm" value={funnelStage} onChange={(e) => setFunnelStage(e.target.value as BlogFunnelStage)}>
            {Object.values(BlogFunnelStage).map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Primary target keyword</span>
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Keyword cluster</span>
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={keywordCluster} onChange={(e) => setKeywordCluster(e.target.value)} />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Structured sources JSON (optional)</span>
          <textarea className="w-full rounded-md border border-border px-3 py-2 font-mono text-xs" rows={5} value={sourceRecordsJson} onChange={(e) => setSourceRecordsJson(e.target.value)} placeholder='[{"authors":["CDC"],"year":"2024","title":"...","source":"...","url":"https://...","authority":"regulator"}]' />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)} />
          Request featured image workflow
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeAiImage} onChange={(e) => setIncludeAiImage(e.target.checked)} />
          Request AI-generated image (async state)
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
          <span className="text-xs font-medium text-muted-foreground">Optional slug (slug-case)</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={enableBatch}
            placeholder="auto if empty"
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
          Publish immediately (recommended)
        </label>
      </div>
      <button
        type="submit"
        disabled={busy || !aiGate.runnable}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? (enableBatch ? "Running batch…" : "Generating…") : "Generate blog post"}
      </button>
      {batchStatus ? <p className="text-sm text-muted-foreground">{batchStatus}</p> : null}
      {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}
    </form>
  );
}
