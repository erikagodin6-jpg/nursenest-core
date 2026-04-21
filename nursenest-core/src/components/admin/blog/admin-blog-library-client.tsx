"use client";

import { BlogPostStatus } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AdminBlogLibraryRow = {
  id: string;
  slug: string;
  title: string;
  exam: string | null;
  postStatus: BlogPostStatus;
  publishAt: string | null;
  createdAt: string;
  updatedAt: string;
  countryTarget: string | null;
  legacySource: string | null;
  campaignId: string | null;
  targetKeyword: string | null;
};

type ListResponse = {
  posts: AdminBlogLibraryRow[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<string, number>;
};

function statusChipClass(s: BlogPostStatus) {
  switch (s) {
    case BlogPostStatus.PUBLISHED:
      return "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100";
    case BlogPostStatus.SCHEDULED:
      return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
    case BlogPostStatus.APPROVED:
      return "bg-sky-500/15 text-sky-950 dark:text-sky-100";
    case BlogPostStatus.NEEDS_REVIEW:
      return "bg-orange-500/15 text-orange-950 dark:text-orange-100";
    case BlogPostStatus.FAILED:
      return "bg-red-500/15 text-red-950 dark:text-red-100";
    default:
      return "bg-muted text-foreground";
  }
}

function formatSource(row: AdminBlogLibraryRow) {
  if (row.legacySource?.trim()) return row.legacySource.trim();
  if (row.campaignId) return `Campaign · ${row.campaignId.slice(0, 8)}…`;
  return "—";
}

function previewHref(row: AdminBlogLibraryRow) {
  const live =
    row.postStatus === BlogPostStatus.PUBLISHED ||
    (row.postStatus === BlogPostStatus.SCHEDULED &&
      row.publishAt &&
      new Date(row.publishAt).getTime() <= Date.now());
  if (live) return `/blog/${row.slug}`;
  return `/admin/blog/control-panel?id=${encodeURIComponent(row.id)}&preview=1`;
}

export function AdminBlogLibraryClient() {
  const [status, setStatus] = useState<string>("");
  const [exam, setExam] = useState("");
  const [country, setCountry] = useState<string>("");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setQDebounced(q.trim()), 320);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [qDebounced]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("pageSize", "40");
    if (status) sp.set("status", status);
    if (exam.trim()) sp.set("exam", exam.trim());
    if (country) sp.set("country", country);
    if (qDebounced) sp.set("q", qDebounced);
    return sp.toString();
  }, [page, status, exam, country, qDebounced]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/blog?${queryString}`, { cache: "no-store", credentials: "include" });
      const json = (await res.json()) as ListResponse & { error?: string };
      if (!res.ok) {
        setErr(json.error ?? "Failed to load");
        setData(null);
        return;
      }
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchAction(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = (await res.json()) as {
        error?: string;
        reasons?: string[];
        needsAcknowledgement?: boolean;
      };
      if (!res.ok) {
        const base = j.reasons?.length ? j.reasons.join(" · ") : j.error ?? "Action failed";
        const hint =
          res.status === 422
            ? " Open this post in the control panel for full pre-publish checks, fixes, and optional warning acknowledgment."
            : "";
        setErr(`${base}${hint}`);
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(row: AdminBlogLibraryRow) {
    if (row.postStatus === BlogPostStatus.PUBLISHED) {
      setErr("Unpublish before deleting.");
      return;
    }
    if (!window.confirm(`Delete draft “${row.title}” (${row.slug})? This cannot be undone.`)) return;
    setBusyId(row.id);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${row.id}`, { method: "DELETE", credentials: "include" });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Delete failed");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function duplicatePost(id: string) {
    setBusyId(id);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}/duplicate`, { method: "POST", credentials: "include" });
      const j = (await res.json()) as { error?: string; post?: { id: string } };
      if (!res.ok) {
        setErr(j.error ?? "Duplicate failed");
        return;
      }
      await load();
      if (j.post?.id) {
        window.open(`/admin/blog/control-panel?id=${encodeURIComponent(j.post.id)}`, "_blank", "noopener,noreferrer");
      }
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      {err ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">{err}</div>
      ) : null}

      <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">
          <label className="space-y-1 text-xs">
            <span className="font-medium text-muted-foreground">Status</span>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {Object.values(BlogPostStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs sm:col-span-2">
            <span className="font-medium text-muted-foreground">Pathway / audience (exam)</span>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="e.g. nclex-rn, RN"
              value={exam}
              onChange={(e) => {
                setPage(1);
                setExam(e.target.value);
              }}
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-medium text-muted-foreground">Country</span>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={country}
              onChange={(e) => {
                setPage(1);
                setCountry(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="US">US</option>
              <option value="CA">Canada</option>
              <option value="GLOBAL">Global / unspecified</option>
            </select>
          </label>
          <label className="space-y-1 text-xs lg:col-span-2">
            <span className="font-medium text-muted-foreground">Keyword / topic</span>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Title, slug, keyword cluster…"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </label>
        </div>
        {data?.counts ? (
          <p className="mt-3 text-[11px] text-muted-foreground">
            Totals — Draft: {data.counts.draft ?? 0} · Review: {data.counts.needsReview ?? 0} · Approved: {data.counts.approved ?? 0} ·
            Scheduled: {data.counts.scheduled ?? 0} · Published: {data.counts.published ?? 0} · Failed: {data.counts.failed ?? 0}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
            {loading ? "Loading…" : data ? `${data.total} posts` : "—"}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted/60 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {data?.page ?? page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={loading || !data || page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted/60 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="sticky top-0 z-[1] bg-muted/90 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
              <tr>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Pathway</th>
                <th className="px-3 py-3">Country</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Updated</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Publish</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !data ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                    Loading library…
                  </td>
                </tr>
              ) : null}
              {data?.posts.map((row) => (
                <tr key={row.id} className="border-t border-border/50 transition hover:bg-muted/30">
                  <td className="max-w-[220px] px-3 py-2.5">
                    <p className="line-clamp-2 font-medium text-foreground">{row.title}</p>
                    {row.targetKeyword ? (
                      <p className="mt-0.5 text-[10px] text-muted-foreground">KW: {row.targetKeyword}</p>
                    ) : null}
                  </td>
                  <td className="max-w-[140px] px-3 py-2.5 font-mono text-[11px] text-muted-foreground">{row.slug}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusChipClass(row.postStatus)}`}>
                      {row.postStatus.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{row.exam?.trim() || "—"}</td>
                  <td className="px-3 py-2.5 text-xs">{row.countryTarget ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                    {new Date(row.updatedAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="max-w-[120px] px-3 py-2.5 text-[11px] text-muted-foreground">{formatSource(row)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                    {row.publishAt ? new Date(row.publishAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex min-w-[200px] flex-col gap-1">
                      <Link
                        href={`/admin/blog/control-panel?id=${encodeURIComponent(row.id)}`}
                        className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                      <a
                        href={previewHref(row)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Preview
                      </a>
                      {row.postStatus !== BlogPostStatus.PUBLISHED ? (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          className="text-left text-xs font-semibold text-emerald-700 hover:underline disabled:opacity-40 dark:text-emerald-400"
                          onClick={() => void patchAction(row.id, { action: "publish_now" })}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          className="text-left text-xs font-semibold text-amber-800 hover:underline disabled:opacity-40 dark:text-amber-200"
                          onClick={() => void patchAction(row.id, { action: "unpublish" })}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        className="text-left text-xs font-semibold text-muted-foreground hover:underline disabled:opacity-40"
                        onClick={() => void duplicatePost(row.id)}
                      >
                        Duplicate
                      </button>
                      {row.postStatus !== BlogPostStatus.PUBLISHED ? (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          className="text-left text-xs font-semibold text-rose-700 hover:underline disabled:opacity-40 dark:text-rose-400"
                          onClick={() => void deletePost(row)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.posts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                    No posts match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
