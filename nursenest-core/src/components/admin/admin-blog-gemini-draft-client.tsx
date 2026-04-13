"use client";

import { useState } from "react";
import { BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";

type ApiResult =
  | {
      ok: true;
      skipped: false;
      post: { id: string; slug: string; title: string; postStatus: string };
      wordCount: number;
    }
  | { ok: true; skipped: true; reason: string; existingSlug?: string; slug?: string }
  | { ok: false; error: string; code?: string };

export function AdminBlogGeminiDraftClient() {
  const [topic, setTopic] = useState("");
  const [exam, setExam] = useState(ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value);
  const [country, setCountry] = useState<"US" | "CA" | "unspecified">("US");
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [minWordCount, setMinWordCount] = useState(1200);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/blog/generate-gemini-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          exam,
          country,
          template,
          minWordCount,
        }),
      });
      const json = (await res.json()) as ApiResult;
      setResult(json);
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Gemini draft generator (Phase 1)</h2>
      <p className="text-sm text-muted-foreground">
        Admin-only, single-post generation. Saves draft only. No auto-publish, no auto-translation.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Topic *</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            minLength={3}
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Exam</span>
          <select className="w-full rounded-md border border-border px-3 py-2 text-sm" value={exam} onChange={(e) => setExam(e.target.value)}>
            {ADMIN_BLOG_TARGET_EXAM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Country</span>
          <select
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value as "US" | "CA" | "unspecified")}
          >
            <option value="US">US</option>
            <option value="CA">Canada</option>
            <option value="unspecified">Unspecified</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Template</span>
          <select
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={template}
            onChange={(e) => setTemplate(e.target.value as BlogPostTemplate)}
          >
            <option value={BlogPostTemplate.TOPIC_EXPLAINED}>TOPIC_EXPLAINED</option>
            <option value={BlogPostTemplate.EXAM_GUIDE}>EXAM_GUIDE</option>
            <option value={BlogPostTemplate.STUDY_PLAN}>STUDY_PLAN</option>
            <option value={BlogPostTemplate.COMPARISON_ARTICLE}>COMPARISON_ARTICLE</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Minimum word count</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            type="number"
            min={800}
            max={3000}
            step={50}
            value={minWordCount}
            onChange={(e) => setMinWordCount(Number(e.target.value) || 1200)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Generating..." : "Generate draft"}
      </button>

      {result?.ok && !result.skipped ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Draft created: <strong>{result.post.title}</strong> (`{result.post.slug}`) - {result.post.postStatus} - {result.wordCount} words.
        </p>
      ) : null}
      {result?.ok && result.skipped ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Skipped ({result.reason})
          {result.existingSlug ? ` - existing slug: ${result.existingSlug}` : ""}
          {result.slug ? ` - slug: ${result.slug}` : ""}
        </p>
      ) : null}
      {result && !result.ok ? (
        <p className="text-sm text-rose-700 dark:text-rose-300">
          {result.code ? `[${result.code}] ` : ""}
          {result.error}
        </p>
      ) : null}
    </form>
  );
}
