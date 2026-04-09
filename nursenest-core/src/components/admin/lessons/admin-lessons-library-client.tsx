"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContentStatus } from "@prisma/client";

type ContentRow = {
  id: string;
  title: string;
  slug: string;
  pathwayLabel: string;
  countryLabel: string;
  topicDomain: string | null;
  lessonType: string;
  versionKey: string | null;
  status: string | null;
  updatedAt: string;
  gapWeakSummary: boolean;
  gapNoSummary: boolean;
  progressUsersOpened: number;
  progressUsersCompleted: number;
};

type PathwayRow = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  countryCode: string | null;
  tierCode: string | null;
  status: string;
  locale: string;
  updatedAt: string;
  progressUsersOpened: number;
  progressUsersCompleted: number;
  publicPathHint: string;
};

function statusChipClass(status: string | null | undefined) {
  const s = (status ?? "").toLowerCase();
  if (s === "published") return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-100";
  if (s === "draft") return "bg-muted text-foreground";
  if (s === "in_review") return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
  if (s === "archived") return "bg-slate-500/15 text-slate-800 dark:text-slate-100";
  return "bg-muted text-muted-foreground";
}

export function AdminLessonsLibraryClient() {
  const [tab, setTab] = useState<"content" | "pathway">("content");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [tier, setTier] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [topicDomain, setTopicDomain] = useState("");

  const [pPage, setPPage] = useState(1);
  const [pTotal, setPTotal] = useState(0);
  const [pRows, setPRows] = useState<PathwayRow[]>([]);
  const [pLoading, setPLoading] = useState(false);
  const [pErr, setPErr] = useState<string | null>(null);
  const [pPathwayId, setPPathwayId] = useState("");
  const [pQ, setPQ] = useState("");
  const [pStatus, setPStatus] = useState("");
  const [pCountry, setPCountry] = useState("");
  const [pTier, setPTier] = useState("");

  const loadContent = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(page));
      sp.set("pageSize", String(pageSize));
      if (q.trim()) sp.set("q", q.trim());
      if (tier) sp.set("tier", tier);
      if (country) sp.set("country", country);
      if (status) sp.set("status", status);
      if (topicDomain.trim()) sp.set("topicDomain", topicDomain.trim());
      const res = await fetch(`/api/admin/lessons?${sp.toString()}`, { cache: "no-store" });
      const j = (await res.json()) as { error?: string; lessons?: ContentRow[]; total?: number };
      if (!res.ok) {
        setErr(j.error ?? "Failed to load");
        setRows([]);
        return;
      }
      setRows(j.lessons ?? []);
      setTotal(j.total ?? 0);
    } catch {
      setErr("Network error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q, tier, country, status, topicDomain]);

  const loadPathway = useCallback(async () => {
    setPLoading(true);
    setPErr(null);
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(pPage));
      sp.set("pageSize", String(pageSize));
      if (pPathwayId.trim()) sp.set("pathwayId", pPathwayId.trim());
      if (pQ.trim()) sp.set("q", pQ.trim());
      if (pStatus) sp.set("status", pStatus);
      if (pCountry) sp.set("country", pCountry);
      if (pTier) sp.set("tier", pTier);
      const res = await fetch(`/api/admin/pathway-lessons?${sp.toString()}`, { cache: "no-store" });
      const j = (await res.json()) as { error?: string; lessons?: PathwayRow[]; total?: number };
      if (!res.ok) {
        setPErr(j.error ?? "Failed to load pathway lessons");
        setPRows([]);
        return;
      }
      setPRows(j.lessons ?? []);
      setPTotal(j.total ?? 0);
    } catch {
      setPErr("Network error");
      setPRows([]);
    } finally {
      setPLoading(false);
    }
  }, [pPage, pageSize, pPathwayId, pQ, pStatus, pCountry, pTier]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (tab === "pathway") void loadPathway();
  }, [tab, loadPathway]);

  const gapCount = useMemo(() => rows.filter((r) => r.gapNoSummary || r.gapWeakSummary).length, [rows]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Lessons</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Lesson library</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            <strong>App lessons</strong> (ContentItem) power in-app experiences; <strong>pathway lessons</strong> feed
            marketing exam hubs. Use filters to find gaps, duplicates, and cross-pathway coverage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/lessons/generate"
            className="rounded-full border border-primary/50 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary/15"
          >
            AI generate draft
          </Link>
          <Link
            href="/admin/lessons/generate-batch"
            className="rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-2.5 text-sm font-semibold text-sky-800 shadow-sm hover:bg-sky-500/15 dark:text-sky-200"
          >
            Batch AI drafts
          </Link>
          <Link
            href="/admin/lessons/new"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            + New app lesson
          </Link>
          <Link
            href="/admin/content"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted/60"
          >
            Content & coverage →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "content" ? "bg-primary/15 text-primary ring-1 ring-primary/25" : "text-muted-foreground hover:bg-muted/60"
          }`}
        >
          App lessons (ContentItem)
        </button>
        <button
          type="button"
          onClick={() => setTab("pathway")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "pathway" ? "bg-primary/15 text-primary ring-1 ring-primary/25" : "text-muted-foreground hover:bg-muted/60"
          }`}
        >
          Pathway lessons (marketing)
        </button>
      </div>

      {tab === "content" ? (
        <>
          <section className="grid gap-3 rounded-2xl border border-border/80 bg-gradient-to-br from-primary/[0.05] to-transparent p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Search</p>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title or slug…"
                onKeyDown={(e) => e.key === "Enter" && void loadContent()}
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Pathway (tier)</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={tier}
                onChange={(e) => {
                  setTier(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="rn">RN</option>
                <option value="rpn">RPN</option>
                <option value="lvn">LPN/LVN</option>
                <option value="np">NP</option>
                <option value="allied">Allied</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Country scope</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="ca">Canada</option>
                <option value="us">United States</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value={ContentStatus.DRAFT}>Draft</option>
                <option value={ContentStatus.PUBLISHED}>Published</option>
                <option value={ContentStatus.IN_REVIEW}>In review</option>
                <option value={ContentStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Topic domain</p>
              <input
                className="mt-1 w-full max-w-xl rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={topicDomain}
                onChange={(e) => setTopicDomain(e.target.value)}
                placeholder="Filter by category or body system (contains)…"
                onKeyDown={(e) => e.key === "Enter" && void loadContent()}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  void loadContent();
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Apply filters
              </button>
              <span className="text-xs text-muted-foreground">
                {total} total · {gapCount} summary gaps on this page (use search + topic filters to hunt duplicates)
              </span>
            </div>
          </section>

          {err ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">{err}</p>
          ) : null}

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] shadow-sm">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Pathway</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                      No lessons match filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="max-w-[220px] truncate" title={r.title}>
                          {r.title}
                        </div>
                        {r.gapNoSummary ? (
                          <span className="mt-1 inline-block rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-800 dark:text-rose-200">
                            No summary
                          </span>
                        ) : null}
                        {r.gapWeakSummary ? (
                          <span className="mt-1 inline-block rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-900 dark:text-orange-100">
                            Short summary
                          </span>
                        ) : null}
                        {r.versionKey ? (
                          <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground" title={r.versionKey}>
                            {r.versionKey}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.slug}</td>
                      <td className="px-4 py-3">{r.pathwayLabel}</td>
                      <td className="px-4 py-3">{r.countryLabel}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground" title={r.topicDomain ?? ""}>
                        {r.topicDomain ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{r.lessonType}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusChipClass(r.status)}`}>
                          {(r.status ?? "—").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {r.progressUsersOpened} open · {r.progressUsersCompleted} done
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <Link href={`/admin/lessons/${r.id}`} className="font-semibold text-primary underline">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                            onClick={async () => {
                              const res = await fetch(`/api/admin/lessons/${r.id}/duplicate`, { method: "POST" });
                              const j = (await res.json()) as { lesson?: { id: string }; error?: string };
                              if (j.lesson?.id) window.location.href = `/admin/lessons/${j.lesson.id}`;
                              else alert(j.error ?? "Duplicate failed");
                            }}
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            className="text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                            onClick={async () => {
                              if (!window.confirm("Archive this lesson?")) return;
                              const res = await fetch("/api/admin/lessons/bulk", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  action: "set_status",
                                  ids: [r.id],
                                  status: ContentStatus.ARCHIVED,
                                }),
                              });
                              if (res.ok) void loadContent();
                              else alert("Archive failed");
                            }}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= Math.ceil(total / pageSize)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="grid gap-3 rounded-2xl border border-border/80 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Pathway ID</p>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
                value={pPathwayId}
                onChange={(e) => setPPathwayId(e.target.value)}
                placeholder="e.g. nclex-rn-us"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Search</p>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={pQ}
                onChange={(e) => setPQ(e.target.value)}
                placeholder="Title, slug, topic…"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={pStatus}
                onChange={(e) => setPStatus(e.target.value)}
              >
                <option value="">All</option>
                {Object.values(ContentStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Country</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={pCountry}
                onChange={(e) => setPCountry(e.target.value)}
              >
                <option value="">All</option>
                <option value="CA">CA</option>
                <option value="US">US</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Tier</p>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={pTier}
                onChange={(e) => setPTier(e.target.value)}
              >
                <option value="">All</option>
                <option value="RN">RN</option>
                <option value="RPN">RPN</option>
                <option value="LVN_LPN">LPN/LVN</option>
                <option value="NP">NP</option>
                <option value="ALLIED">Allied</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setPPage(1);
                  void loadPathway();
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Apply
              </button>
            </div>
          </section>

          {pErr ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">{pErr}</p>
          ) : null}

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] shadow-sm">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Pathway</th>
                  <th className="px-4 py-3">Locale</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Topic / system</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {pLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : pRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                      No pathway lessons match.
                    </td>
                  </tr>
                ) : (
                  pRows.map((r) => (
                    <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{r.title}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.slug}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.pathwayId}</td>
                      <td className="px-4 py-3">{r.locale}</td>
                      <td className="px-4 py-3">{r.countryCode ?? "—"}</td>
                      <td className="px-4 py-3">{r.tierCode ?? "—"}</td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-xs text-muted-foreground" title={`${r.topic} / ${r.bodySystem}`}>
                        {r.topicSlug} · {r.bodySystem}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusChipClass(r.status)}`}>
                          {r.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {r.progressUsersOpened} open · {r.progressUsersCompleted} done
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            {pTotal} pathway rows · synthetic progress id <code className="rounded bg-muted px-1">pathway:pathwayId:slug</code>.
            Full CRUD for pathway lessons is not exposed here yet — use DB/scripts or add a dedicated editor next.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pPage <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
              onClick={() => setPPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pPage >= Math.ceil(pTotal / pageSize)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
              onClick={() => setPPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
