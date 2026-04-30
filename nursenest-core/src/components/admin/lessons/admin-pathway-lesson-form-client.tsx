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

export function AdminPathwayLessonFormClient({ pathwayLessonId }: { pathwayLessonId: string }) {
  const router = useRouter();
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

  const loadLesson = useCallback(async () => {
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
    void loadLesson();
  }, [loadLesson]);

  async function save(nextStatus?: ContentStatus) {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
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

  if (loading) {
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
