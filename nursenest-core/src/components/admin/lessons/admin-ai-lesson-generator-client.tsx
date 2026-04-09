"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createLessonAiBatch,
  pickLessonDraftIdFromBatchSummary,
  runLessonAiBatchSteps,
} from "@/lib/admin/admin-lesson-ai-queue";
import type { AdminAiGeneratedLesson } from "@/lib/lessons/admin-ai-lesson-schema";
import type { AdminAiLessonDraftNormalized } from "@/lib/lessons/admin-ai-lesson-schema";
import type { LessonBatchResultSummaryV1 } from "@/lib/lessons/admin-ai-lesson-batch";

type CategoryOpt = { id: string; name: string; slug: string };

const PATHWAYS = [
  "NCLEX-RN",
  "NCLEX-PN",
  "REx-PN",
  "NP-US",
  "CNPLE",
  "Allied",
] as const;

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

export function AdminAiLessonGeneratorClient() {
  const searchParams = useSearchParams();
  const draftFromUrl = searchParams.get("draft");

  const [topic, setTopic] = useState("");
  const [pathway, setPathway] = useState<(typeof PATHWAYS)[number]>("NCLEX-RN");
  const [country, setCountry] = useState<"CA" | "US">("US");
  const [topicDomain, setTopicDomain] = useState("");
  const [lessonType, setLessonType] = useState<(typeof LESSON_TYPES)[number][0]>("disease");
  const [difficulty, setDifficulty] = useState<"" | "foundation" | "intermediate" | "advanced">("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);

  const [busy, setBusy] = useState(false);
  const [batchSummary, setBatchSummary] = useState<LessonBatchResultSummaryV1 | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lesson, setLesson] = useState<AdminAiGeneratedLesson | null>(null);
  const [normalized, setNormalized] = useState<AdminAiLessonDraftNormalized | null>(null);
  const [promoteCategoryId, setPromoteCategoryId] = useState("");
  const [sectionBusy, setSectionBusy] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/categories?pageSize=200");
      const j = (await res.json()) as { categories?: CategoryOpt[] };
      if (res.ok && j.categories) setCategories(j.categories);
    })();
  }, []);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 12)));
  };

  const reloadDraft = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/lessons/ai-drafts/${id}`);
    const j = (await res.json()) as { draft?: { normalizedJson?: AdminAiLessonDraftNormalized } };
    if (res.ok && j.draft?.normalizedJson?.lesson) {
      setNormalized(j.draft.normalizedJson);
      setLesson(j.draft.normalizedJson.lesson);
    }
  }, []);

  useEffect(() => {
    if (!draftFromUrl || draftFromUrl.length < 8) return;
    setDraftId(draftFromUrl);
    void reloadDraft(draftFromUrl);
  }, [draftFromUrl, reloadDraft]);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    setBatchSummary(null);
    setDraftId(null);
    setLesson(null);
    setNormalized(null);
    try {
      const { jobId } = await createLessonAiBatch({
        topicsRaw: topic,
        pathway,
        country,
        topicDomain,
        lessonType,
        allowDuplicates: false,
        ...(difficulty ? { difficulty } : {}),
        ...(categoryIds.length ? { relatedCategoryIds: categoryIds } : {}),
      });
      const summary = await runLessonAiBatchSteps(jobId, {
        onSummary: (s) => setBatchSummary(s),
      });
      setBatchSummary(summary);
      const id = pickLessonDraftIdFromBatchSummary(summary);
      setDraftId(id);
      await reloadDraft(id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function regen(payload: Record<string, unknown>) {
    if (!draftId) return;
    setSectionBusy(JSON.stringify(payload));
    setErr(null);
    try {
      const res = await fetch(`/api/admin/lessons/ai-drafts/${draftId}/regenerate-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = (await res.json()) as { error?: string; message?: string; normalized?: AdminAiLessonDraftNormalized };
      if (!res.ok) {
        setErr(j.message ?? j.error ?? "Regeneration failed");
        return;
      }
      if (j.normalized?.lesson) {
        setNormalized(j.normalized);
        setLesson(j.normalized.lesson);
      }
    } finally {
      setSectionBusy(null);
    }
  }

  async function onPromote() {
    if (!draftId || !promoteCategoryId) {
      setErr("Choose a category to promote into a ContentItem draft.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/lessons/ai-drafts/${draftId}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: promoteCategoryId }),
      });
      const j = (await res.json()) as { error?: string; editUrl?: string; contentItem?: { id: string } };
      if (!res.ok) {
        setErr(j.error ?? "Promote failed");
        return;
      }
      if (j.editUrl) {
        window.location.href = j.editUrl;
      } else if (j.contentItem?.id) {
        window.location.href = `/admin/lessons/${j.contentItem.id}`;
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-[var(--theme-card-bg)] to-emerald-500/[0.06] p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">AI lesson generator</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Generates a structured draft stored in <code className="rounded bg-muted px-1">GeneratedLessonDraft</code> for
          review. Generation is{" "}
          <span className="font-semibold text-foreground">queued and stepped asynchronously</span>{" "}
          (same pipeline as batch) so the browser is not blocked on one long HTTP request. Pathway and country steer scope,
          tone, and internal link patterns. Promote when ready to create a real{" "}
          <code className="rounded bg-muted px-1">ContentItem</code> lesson (still DRAFT).
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Requires <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and OpenAI credentials.
        </p>
      </div>

      <form onSubmit={onGenerate} className="space-y-6 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Inputs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Lesson topic *</span>
            <textarea
              className="min-h-[88px] w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              minLength={4}
              placeholder="e.g. Spinal shock vs neurogenic shock in acute SCI"
            />
          </label>
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
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Topic domain *</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={topicDomain}
              onChange={(e) => setTopicDomain(e.target.value)}
              required
              placeholder="e.g. Neurology · emergency"
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
            <span className="text-xs font-medium text-muted-foreground">Difficulty / depth</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            >
              <option value="">Default (exam-strong)</option>
              <option value="foundation">Foundation</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">Related question categories (optional)</p>
          <div className="mt-2 max-h-40 overflow-auto rounded-lg border border-border/60 bg-muted/10 p-3">
            {categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">Loading categories…</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={categoryIds.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                      />
                      <span>{c.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}

        {busy && batchSummary?.items?.length ? (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Batch step:{" "}
            {batchSummary.items.map((it) => `${it.topic.slice(0, 48)}${it.topic.length > 48 ? "…" : ""} (${it.status})`).join(" · ")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Running async steps…" : "Generate structured draft"}
        </button>
      </form>

      {lesson && normalized ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Draft preview</h2>
              {draftId ? (
                <p className="text-xs text-muted-foreground">
                  Draft id <code className="rounded bg-muted px-1">{draftId}</code>
                  {normalized.lastSectionRegenAt ? (
                    <> · last section regen {new Date(normalized.lastSectionRegenAt).toLocaleString()}</>
                  ) : null}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-primary underline"
              onClick={() => draftId && void reloadDraft(draftId)}
            >
              Reload from server
            </button>
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[var(--theme-heading-text)]">{lesson.title}</h3>
                <p className="font-mono text-xs text-muted-foreground">{lesson.slug}</p>
              </div>
              <button
                type="button"
                disabled={!draftId || Boolean(sectionBusy)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                onClick={() => void regen({ section: "title_slug_summary" })}
              >
                Regenerate title &amp; slug
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{lesson.shortDescription}</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Pathway-aware intro</h3>
              <button
                type="button"
                disabled={!draftId || Boolean(sectionBusy)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                onClick={() => void regen({ section: "intro" })}
              >
                Regenerate intro
              </button>
            </div>
            <div
              className="prose prose-sm mt-3 max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: lesson.pathwayAwareIntro }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!draftId || Boolean(sectionBusy)}
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-40"
              onClick={() => void regen({ section: "structured_body_all" })}
            >
              Regenerate all body sections
            </button>
          </div>

          {lesson.structuredBody.map((block, i) => (
            <div key={i} className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-[var(--theme-heading-text)]">{block.sectionTitle}</h3>
                <button
                  type="button"
                  disabled={!draftId || Boolean(sectionBusy)}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                  onClick={() => void regen({ section: "structured_body", bodyIndex: i })}
                >
                  Regenerate section
                </button>
              </div>
              <div
                className="prose prose-sm mt-3 max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          ))}

          <div className="grid gap-4 lg:grid-cols-3">
            {(
              [
                ["key_points", "Key points", lesson.keyPoints],
                ["red_flags", "Red flags", lesson.redFlags],
                ["priorities", "Priorities", lesson.priorities],
              ] as const
            ).map(([key, label, items]) => (
              <div key={key} className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{label}</h3>
                  <button
                    type="button"
                    disabled={!draftId || Boolean(sectionBusy)}
                    className="text-xs font-semibold text-primary underline disabled:opacity-40"
                    onClick={() => void regen({ section: key })}
                  >
                    Regen
                  </button>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {items.map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Internal link suggestions</h3>
              <button
                type="button"
                disabled={!draftId || Boolean(sectionBusy)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                onClick={() => void regen({ section: "internal_links" })}
              >
                Regenerate
              </button>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {lesson.internalLinkSuggestions.map((l, i) => (
                <li key={i} className="rounded-lg border border-border/50 p-3">
                  <p className="font-medium">{l.label}</p>
                  <p className="font-mono text-xs text-primary">{l.suggestedPath}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.rationale}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">End-of-lesson CTAs</h3>
              <button
                type="button"
                disabled={!draftId || Boolean(sectionBusy)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                onClick={() => void regen({ section: "ctas" })}
              >
                Regenerate
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {lesson.endOfLessonCtas.map((c, i) => (
                <li key={i}>
                  <strong>{c.label}</strong> — {c.copy}{" "}
                  <span className="font-mono text-xs text-muted-foreground">({c.suggestedHref})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Metadata</h3>
              <button
                type="button"
                disabled={!draftId || Boolean(sectionBusy)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                onClick={() => void regen({ section: "metadata" })}
              >
                Regenerate
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Tags: {lesson.metadata.suggestedTags.join(", ")}</p>
            <p className="text-xs text-muted-foreground">Body system: {lesson.metadata.suggestedBodySystem ?? "—"}</p>
            {lesson.metadata.clinicalPearl ? (
              <p className="mt-2 text-sm">
                <strong>Pearl:</strong> {lesson.metadata.clinicalPearl}
              </p>
            ) : null}
            {lesson.metadata.safetyNote ? (
              <p className="mt-2 text-sm">
                <strong>Safety:</strong> {lesson.metadata.safetyNote}
              </p>
            ) : null}
          </div>

          {draftId ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 shadow-sm">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Promote to ContentItem (draft)</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Creates a new row in <code className="rounded bg-muted px-1">content_items</code> with status DRAFT. You can
                edit HTML and publish from the standard lesson editor.
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Category *</span>
                  <select
                    className="min-w-[220px] rounded-lg border border-border px-3 py-2 text-sm"
                    value={promoteCategoryId}
                    onChange={(e) => setPromoteCategoryId(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={busy || !promoteCategoryId}
                  onClick={() => void onPromote()}
                  className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Promote to lesson draft
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/admin/lessons" className="font-semibold text-primary underline">
          ← Lesson library
        </Link>
      </p>
    </div>
  );
}
