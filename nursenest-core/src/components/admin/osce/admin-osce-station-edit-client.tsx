"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Props = {
  station: {
    id: string;
    slug: string;
    title: string;
    description: string;
    scenarioIntro: string;
    isPublished: boolean;
  };
};

export function AdminOsceStationEditClient({ station: initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [scenarioIntro, setScenarioIntro] = useState(initial.scenarioIntro);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/osce-stations/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          description,
          scenarioIntro,
          isPublished,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? `Save failed (${res.status})`);
        return;
      }
      setMessage("Saved. Public /app/osce surfaces revalidate on PATCH.");
      router.refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }, [description, initial.id, isPublished, router, scenarioIntro, slug, title]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/admin/osce-stations">
          ← All stations
        </Link>
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href={`/app/osce/${encodeURIComponent(slug)}`}
          prefetch={false}
        >
          Learner preview (/app/osce/…)
        </Link>
      </div>

      {message ? <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">{message}</p> : null}
      {error ? <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
          Slug (public URL segment)
          <input
            className="rounded-md border border-border bg-background px-2 py-2 font-mono text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
          Published
          <span className="flex items-center gap-2 py-2">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            <span className="text-foreground">Visible on public learner + marketing OSCE routes</span>
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
        Title
        <input
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
        Short description (card / summary)
        <textarea
          className="min-h-[80px] rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
        Scenario intro
        <textarea
          className="min-h-[160px] rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={scenarioIntro}
          onChange={(e) => setScenarioIntro(e.target.value)}
        />
      </label>

      <button
        type="button"
        disabled={saving}
        onClick={() => void onSave()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save to database"}
      </button>
    </div>
  );
}
