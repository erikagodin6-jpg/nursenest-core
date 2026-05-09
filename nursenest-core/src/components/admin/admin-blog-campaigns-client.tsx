"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";

type RunChunkItem = {
  itemId: string;
  status: string;
  postId?: string;
  slug?: string;
  publicUrl?: string;
  scheduledFor?: string;
  error?: string;
};

type RunChunkResponse = {
  ok?: boolean;
  processed?: number;
  items?: RunChunkItem[];
  message?: string;
  error?: string;
};

type CampaignSummary = {
  id: string;
  name: string;
  keywordCluster: string;
  desiredPostCount: number;
  status: string;
  postsPerWeek: number | null;
  startDate: string | null;
  counts: Record<string, number>;
  postsLinked: number;
  queueItems: number;
  updatedAt: string;
};

export function AdminBlogCampaignsClient({ initialCampaigns }: { initialCampaigns: CampaignSummary[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [publishNow, setPublishNow] = useState(false);
  const [chunkPublishAtLocal, setChunkPublishAtLocal] = useState("");
  const [lastChunkByCampaign, setLastChunkByCampaign] = useState<Record<string, RunChunkResponse>>({});
  const [chunkErrByCampaign, setChunkErrByCampaign] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    keywordCluster: "",
    targetExam: ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value,
    desiredPostCount: 12,
    postsPerWeek: 3,
    startDate: "",
    includeImages: true,
    includeAiImages: false,
    requireReferences: true,
  });

  async function reload() {
    const res = await fetch("/api/admin/blog/campaigns", { credentials: "include" });
    const json = (await res.json()) as { campaigns?: CampaignSummary[] };
    if (res.ok) setCampaigns(json.campaigns ?? []);
  }

  async function createCampaign() {
    const res = await fetch("/api/admin/blog/campaigns", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      }),
    });
    if (res.ok) {
      setForm((f) => ({ ...f, name: "", keywordCluster: "" }));
      await reload();
    }
  }

  async function runChunk(id: string) {
    setBusyId(id);
    setChunkErrByCampaign((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
    try {
      const payload: Record<string, unknown> = { limit: 3, mode: "generate" as const, publishNow };
      if (!publishNow && chunkPublishAtLocal.trim()) {
        const when = new Date(chunkPublishAtLocal);
        if (!Number.isNaN(when.getTime())) payload.exactPublishAt = when.toISOString();
      }
      const res = await fetch(`/api/admin/blog/campaigns/${id}/run-chunk`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as RunChunkResponse;
      if (!res.ok) {
        setChunkErrByCampaign((m) => ({
          ...m,
          [id]: typeof json.error === "string" && json.error.trim() ? json.error : `Request failed (${res.status})`,
        }));
        return;
      }
      setLastChunkByCampaign((m) => ({ ...m, [id]: json }));
      await reload();
    } catch (e) {
      setChunkErrByCampaign((m) => ({
        ...m,
        [id]: e instanceof Error ? e.message : "Network error running chunk.",
      }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-border/70 p-5">
        <h2 className="text-lg font-semibold">SEO campaign builder</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quantity-based generation with queue + cadence scheduling. Run chunks repeatedly to avoid timeout.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <input className="rounded border border-border px-3 py-2 text-sm" placeholder="Campaign name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="rounded border border-border px-3 py-2 text-sm" placeholder="Keyword cluster" value={form.keywordCluster} onChange={(e) => setForm((f) => ({ ...f, keywordCluster: e.target.value }))} />
          <select
            className="rounded border border-border px-3 py-2 text-sm"
            value={form.targetExam}
            onChange={(e) => setForm((f) => ({ ...f, targetExam: e.target.value }))}
            aria-label="Target exam"
          >
            {ADMIN_BLOG_TARGET_EXAM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input className="rounded border border-border px-3 py-2 text-sm" type="number" min={1} max={200} value={form.desiredPostCount} onChange={(e) => setForm((f) => ({ ...f, desiredPostCount: Number(e.target.value) }))} />
          <input className="rounded border border-border px-3 py-2 text-sm" type="number" min={1} max={14} value={form.postsPerWeek} onChange={(e) => setForm((f) => ({ ...f, postsPerWeek: Number(e.target.value) }))} />
          <input className="rounded border border-border px-3 py-2 text-sm" type="datetime-local" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <label><input type="checkbox" checked={form.includeImages} onChange={(e) => setForm((f) => ({ ...f, includeImages: e.target.checked }))} /> Include images</label>
          <label><input type="checkbox" checked={form.includeAiImages} onChange={(e) => setForm((f) => ({ ...f, includeAiImages: e.target.checked }))} /> Request AI images</label>
          <label><input type="checkbox" checked={form.requireReferences} onChange={(e) => setForm((f) => ({ ...f, requireReferences: e.target.checked }))} /> Require references</label>
        </div>
        <button type="button" onClick={() => void createCampaign()} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Create campaign
        </button>
      </div>

      <div className="rounded-xl border border-border/70 p-5">
        <h3 className="text-base font-semibold">Campaign queue</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Per chunk: choose <strong>Publish now</strong> for an immediate public <code className="text-xs">/blog/[slug]</code> row, or set a{" "}
          <strong>scheduled publish</strong> time (applies to each item in the chunk that does not already have a planned slot). Errors from the API
          are shown under the campaign.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4 rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
            Publish now (live on blog)
          </label>
          <label className="flex min-w-[200px] flex-col gap-1 text-xs text-muted-foreground">
            <span>Override publish date/time (local)</span>
            <input
              type="datetime-local"
              className="rounded border border-border bg-background px-2 py-1 text-foreground"
              value={chunkPublishAtLocal}
              disabled={publishNow}
              onChange={(e) => setChunkPublishAtLocal(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-3 space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.keywordCluster} · {c.desiredPostCount} planned · {c.status}</p>
                </div>
                <button type="button" disabled={busyId === c.id} onClick={() => void runChunk(c.id)} className="rounded border border-border px-3 py-1 text-sm">
                  {busyId === c.id ? "Running…" : "Generate next chunk"}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Queue: {c.queueItems} · Posts: {c.postsLinked} · Generated: {c.counts.GENERATED ?? 0} · Scheduled: {c.counts.SCHEDULED ?? 0} · Published:{" "}
                {c.counts.PUBLISHED ?? 0} · Failed: {c.counts.FAILED ?? 0}
              </p>
              {chunkErrByCampaign[c.id] ? (
                <p className="mt-2 text-xs font-medium text-rose-700 dark:text-rose-300" role="alert">
                  {chunkErrByCampaign[c.id]}
                </p>
              ) : null}
              {lastChunkByCampaign[c.id]?.items?.length ? (
                <ul className="mt-2 space-y-1 border-t border-border/40 pt-2 text-xs">
                  {lastChunkByCampaign[c.id]!.items!.map((row) => (
                    <li key={row.itemId} className="text-muted-foreground">
                      <span className="font-mono">{row.itemId.slice(0, 8)}…</span> ·{" "}
                      <span className={row.status === "failed" ? "text-rose-700 dark:text-rose-300" : ""}>{row.status}</span>
                      {row.slug ? <span className="ml-1 font-mono text-foreground">{row.slug}</span> : null}
                      {row.publicUrl ? (
                        <span className="ml-2">
                          <Link href={row.publicUrl} className="font-semibold text-primary underline" target="_blank" rel="noreferrer">
                            Public URL
                          </Link>
                        </span>
                      ) : null}
                      {row.postId && !row.publicUrl ? (
                        <span className="ml-2">
                          <Link href={`/admin/blog?id=${encodeURIComponent(row.postId)}`} className="text-primary underline">
                            Open in blog console
                          </Link>
                        </span>
                      ) : null}
                      {row.scheduledFor ? (
                        <span className="ml-2 text-amber-800 dark:text-amber-200">Scheduled for {new Date(row.scheduledFor).toLocaleString()}</span>
                      ) : null}
                      {row.error ? <span className="ml-2 block text-rose-700 dark:text-rose-300">{row.error}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : lastChunkByCampaign[c.id]?.message ? (
                <p className="mt-2 text-xs text-muted-foreground">{lastChunkByCampaign[c.id]!.message}</p>
              ) : null}
            </div>
          ))}
          {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">No campaigns yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
