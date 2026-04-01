"use client";

import { useState } from "react";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";

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
    const res = await fetch("/api/admin/blog/campaigns");
    const json = (await res.json()) as { campaigns?: CampaignSummary[] };
    if (res.ok) setCampaigns(json.campaigns ?? []);
  }

  async function createCampaign() {
    const res = await fetch("/api/admin/blog/campaigns", {
      method: "POST",
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
    try {
      await fetch(`/api/admin/blog/campaigns/${id}/run-chunk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 3, mode: "generate" }),
      });
      await reload();
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
                Queue: {c.queueItems} · Posts: {c.postsLinked} · Generated: {c.counts.GENERATED ?? 0} · Scheduled: {c.counts.SCHEDULED ?? 0} · Failed: {c.counts.FAILED ?? 0}
              </p>
            </div>
          ))}
          {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">No campaigns yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
