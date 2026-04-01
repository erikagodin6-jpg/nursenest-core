"use client";

import { useState } from "react";
import { BlogPostTemplate } from "@prisma/client";

const templates: BlogPostTemplate[] = [
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
];

export function AdminBlogGenerateClient() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [exam, setExam] = useState("NCLEX-RN");
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [tone, setTone] = useState<"professional" | "supportive" | "direct">("professional");
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
      const res = await fetch("/api/admin/blog/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          keywords: keywords || undefined,
          exam,
          template,
          tone,
          slug: slug.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { post?: { slug: string; id: string }; error?: string };
      if (!res.ok) {
        setErr(json.error ?? "Request failed");
        return;
      }
      setMsg(`Draft created: ${json.post?.slug ?? ""} — review in scheduler or edit via API.`);
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
        <code className="rounded bg-muted px-1">AI_INTEGRATIONS_OPENAI_API_KEY</code>. One model call per submit — no batch timeouts.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Topic *</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            minLength={3}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Exam focus *</span>
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={exam} onChange={(e) => setExam(e.target.value)} />
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
            placeholder="auto if empty"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Generating…" : "Generate draft"}
      </button>
      {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}
    </form>
  );
}
