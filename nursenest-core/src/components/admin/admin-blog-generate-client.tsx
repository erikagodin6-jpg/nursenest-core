"use client";

import { useState } from "react";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";

const templates: BlogPostTemplate[] = [
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
];

export function AdminBlogGenerateClient() {
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
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const parsedTopics = topicsBatch
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const res = await fetch("/api/admin/blog/generate-ai", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      const json = (await res.json()) as {
        summary?: { created: number; skipped: number; failed: number };
        results?: Array<{ post?: { slug: string }; reason?: string }>;
        error?: string;
        code?: string;
        scope?: string;
        limiter?: string;
        retryAfterSec?: number;
      };
      if (!res.ok) {
        if (res.status === 429) {
          const hint = [json.scope, json.limiter].filter(Boolean).join(" · ");
          setErr(
            json.error
              ? `${json.error}${hint ? ` (${hint})` : ""}${json.retryAfterSec != null ? ` — retry after ~${json.retryAfterSec}s` : ""}`
              : `Too many requests${hint ? ` (${hint})` : ""}`,
          );
          return;
        }
        setErr(json.error ?? "Request failed");
        return;
      }
      const created = json.summary?.created ?? 0;
      const skipped = json.summary?.skipped ?? 0;
      const failed = json.summary?.failed ?? 0;
      const firstSlug = json.results?.find((r) => r.post?.slug)?.post?.slug;
      setMsg(
        created > 0
          ? `Generated ${created} post(s)${firstSlug ? ` (e.g. ${firstSlug})` : ""}. Skipped ${skipped}, failed ${failed}.`
          : `No posts created. Skipped ${skipped}, failed ${failed}.`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Single-post AI draft</h2>
      <p className="text-sm text-muted-foreground">
        Requires <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and{" "}
        <code className="rounded bg-muted px-1">AI_INTEGRATIONS_OPENAI_API_KEY</code>. One model call per submit. No batch timeouts.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={enableBatch} onChange={(e) => setEnableBatch(e.target.checked)} />
          Batch mode (up to 3 topics per run)
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
            <span className="text-xs font-medium text-muted-foreground">Topics (one per line, max 3)</span>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              rows={4}
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
        disabled={busy}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Generating…" : "Generate blog post"}
      </button>
      {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}
    </form>
  );
}
