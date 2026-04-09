"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentStatus } from "@prisma/client";

type CategoryOpt = { id: string; name: string; slug: string };

type LinkMapping = {
  generatedQuestionDrafts: number;
  generatedFlashcardDrafts: number;
  generatedLessonEnhancements: number;
  progressUsersOpened: number;
  progressUsersCompleted: number;
};

const TIERS = ["RPN", "LVN_LPN", "RN", "NP", "ALLIED"] as const;
const STATUSES = [
  ContentStatus.DRAFT,
  ContentStatus.IN_REVIEW,
  ContentStatus.PUBLISHED,
  ContentStatus.ARCHIVED,
] as const;

export function AdminLessonFormClient({ lessonId }: { lessonId?: string }) {
  const router = useRouter();
  const isCreate = !lessonId;

  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);
  const [linkMapping, setLinkMapping] = useState<LinkMapping | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("RN");
  const [country, setCountry] = useState<"CA" | "US">("US");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ContentStatus>(ContentStatus.DRAFT);
  const [tagsText, setTagsText] = useState("");
  const [bodySystem, setBodySystem] = useState("");
  const [versionKey, setVersionKey] = useState("");
  const [acknowledgeBelowQualityBar, setAcknowledgeBelowQualityBar] = useState(false);
  const [adaptOpen, setAdaptOpen] = useState(false);
  const [adaptTier, setAdaptTier] = useState<(typeof TIERS)[number]>("RN");
  const [adaptCountry, setAdaptCountry] = useState<"CA" | "US">("CA");
  const [adaptSuffix, setAdaptSuffix] = useState("");
  const [actionBusy, setActionBusy] = useState(false);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories?pageSize=500");
    const j = (await res.json()) as { categories?: CategoryOpt[] };
    if (res.ok && j.categories) setCategories(j.categories);
  }, []);

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`);
      const j = (await res.json()) as {
        lesson?: {
          title: string;
          slug: string;
          summary: string | null;
          tier: string | null;
          regionScope: string | null;
          status: string | null;
          tags: string[];
          bodySystem: string | null;
          versionKey: string | null;
        };
        body?: string;
        categoryMatch?: { id: string } | null;
        linkMapping?: LinkMapping;
      };
      if (!res.ok || !j.lesson) {
        setErr("Could not load lesson.");
        return;
      }
      const l = j.lesson;
      setTitle(l.title);
      setSlug(l.slug);
      setSummary(l.summary ?? "");
      setBody(j.body ?? "");
      const raw = (l.tier ?? "rn").toLowerCase();
      const tierMap: Record<string, (typeof TIERS)[number]> = {
        rpn: "RPN",
        lvn: "LVN_LPN",
        rn: "RN",
        np: "NP",
        allied: "ALLIED",
      };
      setTier(tierMap[raw] ?? "RN");
      setCountry(l.regionScope === "CA_ONLY" ? "CA" : "US");
      const st = (l.status ?? "draft").toLowerCase();
      const map: Record<string, ContentStatus> = {
        published: ContentStatus.PUBLISHED,
        draft: ContentStatus.DRAFT,
        in_review: ContentStatus.IN_REVIEW,
        archived: ContentStatus.ARCHIVED,
      };
      if (map[st]) setStatus(map[st]);
      setTagsText((l.tags ?? []).join(", "));
      setBodySystem(l.bodySystem ?? "");
      setVersionKey(l.versionKey ?? "");
      if (j.categoryMatch?.id) setCategoryId(j.categoryMatch.id);
      if (j.linkMapping) setLinkMapping(j.linkMapping);
    } catch {
      setErr("Load failed.");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (lessonId) void loadLesson();
  }, [lessonId, loadLesson]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30);
    try {
      if (isCreate) {
        if (!categoryId) {
          setErr("Choose a category.");
          setSaving(false);
          return;
        }
        const res = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            summary,
            body,
            country,
            tier,
            categoryId,
            status,
            tags,
            systemTag: bodySystem.trim() || undefined,
            versionKey: versionKey.trim() || null,
          }),
        });
        const j = (await res.json()) as { error?: string; lesson?: { id: string }; reasons?: string[] };
        if (!res.ok) {
          setErr(j.reasons?.length ? j.reasons.join(" · ") : j.error ?? "Save failed");
          setSaving(false);
          return;
        }
        if (j.lesson?.id) {
          router.push(`/admin/lessons/${j.lesson.id}`);
          router.refresh();
          return;
        }
        setErr("Unexpected response.");
      } else {
        const res = await fetch(`/api/admin/lessons/${lessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            summary,
            body,
            country,
            tier,
            ...(categoryId ? { categoryId } : {}),
            status,
            tags,
            systemTag: bodySystem.trim() || null,
            topicTag: bodySystem.trim() || null,
            versionKey: versionKey.trim() || null,
            ...(status === ContentStatus.PUBLISHED && acknowledgeBelowQualityBar
              ? { acknowledgeBelowQualityBar: true }
              : {}),
          }),
        });
        const j = (await res.json()) as {
          error?: string;
          reasons?: string[];
          quality?: { warnings?: string[] };
          lesson?: unknown;
        };
        if (!res.ok) {
          setErr(j.reasons?.length ? j.reasons.join(" · ") : j.error ?? "Save failed");
          setSaving(false);
          return;
        }
        if (j.quality?.warnings?.length) {
          setMsg(`Saved with warnings: ${j.quality.warnings.join(" · ")}`);
        } else {
          setMsg("Saved.");
        }
        void loadLesson();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function onDuplicate() {
    if (!lessonId) return;
    setActionBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/duplicate`, { method: "POST" });
      const j = (await res.json()) as { error?: string; lesson?: { id: string } };
      if (!res.ok || !j.lesson?.id) {
        setErr(j.error ?? "Duplicate failed");
        return;
      }
      router.push(`/admin/lessons/${j.lesson.id}`);
      router.refresh();
    } finally {
      setActionBusy(false);
    }
  }

  async function onAdapt() {
    if (!lessonId) return;
    setActionBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/adapt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetTier: adaptTier,
          targetCountry: adaptCountry,
          ...(adaptSuffix.trim() ? { titleSuffix: adaptSuffix.trim() } : {}),
        }),
      });
      const j = (await res.json()) as { error?: string; lesson?: { id: string } };
      if (!res.ok || !j.lesson?.id) {
        setErr(j.error ?? "Adapt failed");
        return;
      }
      setAdaptOpen(false);
      router.push(`/admin/lessons/${j.lesson.id}`);
      router.refresh();
    } finally {
      setActionBusy(false);
    }
  }

  async function onDelete() {
    if (!lessonId) return;
    if (!window.confirm("Permanently delete this lesson? This cannot be undone.")) return;
    setErr(null);
    const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    if (!res.ok) {
      const j = (await res.json()) as { error?: string };
      setErr(j.error ?? "Delete failed");
      return;
    }
    router.push("/admin/lessons");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading lesson…</p>;
  }

  return (
    <form onSubmit={onSave} className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {isCreate ? "New lesson" : "Edit lesson"}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">
            {isCreate ? "Create ContentItem lesson" : title || "Untitled"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            App lessons live in <code className="rounded bg-muted px-1">content_items</code> (type lesson). Pathway
            marketing lessons are managed separately on the library tab.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/lessons"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/60"
          >
            ← Library
          </Link>
          {!isCreate ? (
            <>
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => void onDuplicate()}
                className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-semibold hover:bg-muted/50 disabled:opacity-50"
              >
                Duplicate
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setAdaptOpen(true)}
                className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 disabled:opacity-50"
              >
                Adapt pathway…
              </button>
              <button
                type="button"
                onClick={() => void onDelete()}
                className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!isCreate && adaptOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="max-w-md rounded-2xl border border-border bg-[var(--theme-card-bg)] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Adapt to pathway / country</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Creates a new <strong>draft</strong> clone with updated tier and region scope. Edit the copy before publishing.
            </p>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Target tier</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={adaptTier}
                onChange={(e) => setAdaptTier(e.target.value as (typeof TIERS)[number])}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, "/")}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Target country</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={adaptCountry}
                onChange={(e) => setAdaptCountry(e.target.value as "CA" | "US")}
              >
                <option value="CA">Canada</option>
                <option value="US">United States</option>
              </select>
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Title suffix (optional)</span>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={adaptSuffix}
                onChange={(e) => setAdaptSuffix(e.target.value)}
                placeholder="e.g. — Ontario clinical notes"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
                onClick={() => setAdaptOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionBusy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                onClick={() => void onAdapt()}
              >
                Create adapted draft
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {err ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">{err}</p> : null}
      {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Core fields</h2>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Title *</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={4}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Slug * (unique)</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              minLength={4}
              spellCheck={false}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Summary *</span>
            <textarea
              className="min-h-[88px] w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              minLength={10}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Body (HTML/text) *</span>
            <textarea
              className="min-h-[min(360px,45vh)] w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={20}
            />
          </label>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/[0.06] to-transparent p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Pathway & scope</h2>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Tier / pathway</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={tier}
                onChange={(e) => setTier(e.target.value as (typeof TIERS)[number])}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, "/")}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Country scope</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={country}
                onChange={(e) => setCountry(e.target.value as "CA" | "US")}
              >
                <option value="US">United States (US_ONLY)</option>
                <option value="CA">Canada (CA_ONLY)</option>
              </select>
            </label>
            <p className="mt-2 text-[10px] text-muted-foreground">
              For “both regions”, save as one row per region or extend schema — current API maps CA/US to regionScope.
            </p>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Status</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            {status === ContentStatus.PUBLISHED ? (
              <label className="mt-3 flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={acknowledgeBelowQualityBar}
                  onChange={(e) => setAcknowledgeBelowQualityBar(e.target.checked)}
                  className="mt-0.5"
                />
                <span>Acknowledge below editorial quality bar (when policy requires it)</span>
              </label>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Taxonomy</h2>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Category * {isCreate ? "" : "(optional change)"}</span>
              <select
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required={isCreate}
              >
                <option value="">{isCreate ? "Select…" : "— keep —"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Topic / body system</span>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={bodySystem}
                onChange={(e) => setBodySystem(e.target.value)}
                placeholder="e.g. Cardiovascular"
              />
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</span>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Version key (scoped variant)</span>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
                value={versionKey}
                onChange={(e) => setVersionKey(e.target.value)}
                placeholder="canonical:key or leave empty"
              />
            </label>
          </div>

          {!isCreate && linkMapping ? (
            <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.06] p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Internal links & usage</h2>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Question drafts</span> linked:{" "}
                  {linkMapping.generatedQuestionDrafts}
                </li>
                <li>
                  <span className="font-medium text-foreground">Flashcard drafts</span> linked:{" "}
                  {linkMapping.generatedFlashcardDrafts}
                </li>
                <li>
                  <span className="font-medium text-foreground">Lesson enhancement drafts</span>:{" "}
                  {linkMapping.generatedLessonEnhancements}
                </li>
                <li>
                  <span className="font-medium text-foreground">Learners opened</span>: {linkMapping.progressUsersOpened}{" "}
                  · <span className="font-medium text-foreground">completed</span>:{" "}
                  {linkMapping.progressUsersCompleted}
                </li>
              </ul>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Progress uses <code className="rounded bg-muted px-0.5">lessonId = ContentItem.id</code> for app lessons.
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : isCreate ? "Create lesson" : "Save changes"}
          </button>
        </aside>
      </div>
    </form>
  );
}
