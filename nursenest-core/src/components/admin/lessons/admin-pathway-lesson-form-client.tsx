"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentStatus } from "@prisma/client";

const STATUSES = [
  ContentStatus.DRAFT,
  ContentStatus.IN_REVIEW,
  ContentStatus.PUBLISHED,
  ContentStatus.ARCHIVED,
] as const;

export type AdminPathwayLessonFormClientProps =
  | { pathwayLessonId: string }
  | { resolve: { pathwayId: string; slug: string; locale?: string } };

export function AdminPathwayLessonFormClient(props: AdminPathwayLessonFormClientProps) {
  const router = useRouter();
  const [resolvedPathwayLessonId, setResolvedPathwayLessonId] = useState<string | null>(
    "pathwayLessonId" in props ? props.pathwayLessonId : null,
  );
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [pathwayId, setPathwayId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<ContentStatus>(ContentStatus.DRAFT);
  const [acknowledgeBelowQualityBar, setAcknowledgeBelowQualityBar] = useState(false);

  useEffect(() => {
    if ("pathwayLessonId" in props) return;
    const { pathwayId: pid, slug: sl, locale } = props.resolve;
    if (!pid || !sl) {
      setResolveError("pathwayId and slug are required (use query string on this page).");
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      setResolveError(null);
      try {
        const sp = new URLSearchParams({ pathwayId: pid, slug: sl });
        if (locale) sp.set("locale", locale);
        const res = await fetch(`/api/admin/pathway-lessons/lookup?${sp.toString()}`);
        const j = (await res.json()) as { error?: string; lesson?: { id: string } };
        if (cancelled) return;
        if (!res.ok || !j.lesson?.id) {
          setResolveError(j.error ?? "Could not resolve pathway lesson.");
          setLoading(false);
          return;
        }
        setResolvedPathwayLessonId(j.lesson.id);
      } catch {
        if (!cancelled) {
          setResolveError("Lookup failed.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props]);

  const pathwayLessonId = resolvedPathwayLessonId ?? "";

  const loadLesson = useCallback(async () => {
    if (!pathwayLessonId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`);
      const j = (await res.json()) as {
        lesson?: {
          pathwayId: string;
          title: string;
          slug: string;
          seoTitle: string;
          seoDescription: string;
          status: ContentStatus;
        };
        body?: string;
      };
      if (!res.ok || !j.lesson) {
        setErr("Could not load pathway lesson.");
        return;
      }
      const l = j.lesson;
      setPathwayId(l.pathwayId);
      setTitle(l.title);
      setSlug(l.slug);
      setSeoTitle(l.seoTitle);
      setSeoDescription(l.seoDescription);
      setBody(j.body ?? "");
      setStatus(l.status ?? ContentStatus.DRAFT);
    } finally {
      setLoading(false);
    }
  }, [pathwayLessonId]);

  useEffect(() => {
    if (!pathwayLessonId) return;
    void loadLesson();
  }, [loadLesson, pathwayLessonId]);

  async function save(nextStatus?: ContentStatus) {
    if (!pathwayLessonId) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      if (nextStatus === ContentStatus.PUBLISHED) {
        console.info("[ADMIN_PUBLISH_CLICK]", {
          pathwayLessonId,
          pathwayId: pathwayId || null,
          slug,
          titlePreview: title.slice(0, 120),
        });
      }
      const res = await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          seoTitle,
          seoDescription,
          body,
          status: nextStatus ?? status,
          acknowledgeBelowQualityBar: acknowledgeBelowQualityBar || undefined,
        }),
      });
      const j = (await res.json()) as { error?: string; lesson?: { status: ContentStatus } };
      if (!res.ok) {
        setErr(j.error ?? "Save failed.");
        return;
      }
      setMsg("Saved.");
      if (j.lesson?.status) setStatus(j.lesson.status);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (resolveError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{resolveError}</p>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          Back to pathway lessons
        </Link>
      </div>
    );
  }

  if (loading || !pathwayLessonId) {
    return <p className="text-sm text-muted-foreground">Loading pathway lesson…</p>;
  }
  if (err && !title) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{err}</p>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          Back to pathway lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit pathway lesson</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Source of truth: <code className="rounded bg-muted px-1">pathway_lessons</code> · pathwayId{" "}
            <code className="rounded bg-muted px-1">{pathwayId}</code>
          </p>
        </div>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          All pathway lessons
        </Link>
      </div>

      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      {msg ? <p className="text-sm text-green-600 dark:text-green-400">{msg}</p> : null}

      <label className="block space-y-1">
        <span className="text-sm font-medium">Title</span>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Slug</span>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">SEO title</span>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">SEO description / summary</span>
        <textarea
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Body (plain text / markdown → sections)</span>
        <textarea
          className="min-h-[240px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Status</span>
        <select
          className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContentStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={acknowledgeBelowQualityBar}
          onChange={(e) => setAcknowledgeBelowQualityBar(e.target.checked)}
        />
        Acknowledge below quality bar (publish only)
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium"
          onClick={() => void save()}
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => void save(ContentStatus.PUBLISHED)}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
