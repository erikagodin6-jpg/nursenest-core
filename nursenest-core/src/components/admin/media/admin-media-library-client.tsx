"use client";

import { Copy, Loader2, RefreshCw, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type UsageRef = {
  type: string;
  id: string;
  label: string;
  href: string;
};

export type MediaRow = {
  id: string;
  publicUrl: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  kind: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  tags: string[];
  usageRefCount: number | null;
  usageRefs: unknown;
  usageScannedAt: string | null;
  createdAt: string;
};

type ListResponse = {
  items: MediaRow[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function parseUsageRefs(raw: unknown): UsageRef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is UsageRef => x && typeof x === "object" && typeof (x as UsageRef).href === "string")
    .slice(0, 12);
}

export function AdminMediaLibraryClient() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [tag, setTag] = useState("");
  const [debouncedTag, setDebouncedTag] = useState("");
  const [used, setUsed] = useState<string>("any");
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [scanBusy, setScanBusy] = useState(false);
  const [preview, setPreview] = useState<MediaRow | null>(null);

  const [draftAlt, setDraftAlt] = useState<Record<string, string>>({});
  const [draftTags, setDraftTags] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedTag(tag.trim().toLowerCase()), 300);
    return () => window.clearTimeout(t);
  }, [tag]);

  useEffect(() => {
    setPage(1);
  }, [debounced, debouncedTag, type, used]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("pageSize", "24");
    if (debounced) sp.set("q", debounced);
    if (type !== "all") sp.set("type", type);
    if (debouncedTag) sp.set("tag", debouncedTag);
    if (used !== "any") sp.set("used", used === "yes" ? "yes" : "no");
    return sp.toString();
  }, [page, debounced, debouncedTag, type, used]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/media?${queryString}`, { cache: "no-store" });
      const json = (await res.json()) as ListResponse;
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

  async function onUploadFile(file: File, kind: "image" | "pdf" | "media" = "image") {
    setUploadBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Upload failed");
        return;
      }
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploadBusy(false);
    }
  }

  async function patchRow(id: string, payload: { altText?: string | null; tags?: string[] }) {
    const res = await fetch(`/api/admin/media/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(j.error ?? "Save failed");
      return;
    }
    await load();
  }

  async function scanRow(id: string) {
    setScanBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(id)}/scan`, { method: "POST" });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Scan failed");
        return;
      }
      await load();
    } finally {
      setScanBusy(false);
    }
  }

  async function scanVisible() {
    if (!data?.items.length) return;
    setScanBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/media/batch-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: data.items.map((r) => r.id) }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Batch scan failed");
        return;
      }
      await load();
    } finally {
      setScanBusy(false);
    }
  }

  function copyUrl(url: string) {
    void navigator.clipboard.writeText(url);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      {err ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">{err}</div>
      ) : null}

      <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-xs">
              <span className="font-medium text-muted-foreground">Search</span>
              <span className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filename, URL, alt…"
                />
              </span>
            </label>
            <label className="space-y-1 text-xs">
              <span className="font-medium text-muted-foreground">Type</span>
              <select
                className="w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="image">Image</option>
                <option value="pdf">PDF</option>
                <option value="media">Media</option>
              </select>
            </label>
            <label className="space-y-1 text-xs">
              <span className="font-medium text-muted-foreground">Tag (exact)</span>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. blog-hero"
              />
            </label>
            <label className="space-y-1 text-xs">
              <span className="font-medium text-muted-foreground">Usage</span>
              <select
                className="w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm"
                value={used}
                onChange={(e) => setUsed(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="yes">In use (scanned &gt; 0)</option>
                <option value="no">Unused / not scanned</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
              <Upload className="h-3.5 w-3.5" aria-hidden />
              {uploadBusy ? "Uploading…" : "Upload"}
              <input
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                disabled={uploadBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
                  const isVid = f.type.startsWith("video/") || f.type.startsWith("audio/");
                  void onUploadFile(f, isPdf ? "pdf" : isVid ? "media" : "image");
                }}
              />
            </label>
            <button
              type="button"
              disabled={scanBusy || !data?.items.length}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
              onClick={() => void scanVisible()}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scanBusy ? "animate-spin" : ""}`} aria-hidden />
              Scan this page
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Preview</th>
                <th className="px-3 py-3">File</th>
                <th className="px-3 py-3">Alt</th>
                <th className="px-3 py-3">Tags</th>
                <th className="px-3 py-3">Usage</th>
                <th className="px-3 py-3">Uploaded</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" aria-label="Loading" />
                  </td>
                </tr>
              ) : null}
              {!loading && data
                ? data.items.map((row) => {
                    const altVal = draftAlt[row.id] ?? row.altText ?? "";
                    const tagsVal = draftTags[row.id] ?? row.tags.join(", ");
                    const refs = parseUsageRefs(row.usageRefs);
                    return (
                      <tr key={row.id} className="border-b border-border/40 align-top">
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            className="relative block h-16 w-28 overflow-hidden rounded-lg border border-border/60 bg-muted/30"
                            onClick={() => setPreview(row)}
                          >
                            {row.kind === "image" || row.mimeType.startsWith("image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={row.publicUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] font-medium">{row.kind}</span>
                            )}
                          </button>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {formatBytes(row.fileSizeBytes)}
                            {row.width && row.height ? ` · ${row.width}×${row.height}` : ""}
                          </p>
                        </td>
                        <td className="max-w-[200px] px-3 py-3">
                          <p className="font-medium leading-snug">{row.filename}</p>
                          <p className="mt-1 line-clamp-2 break-all font-mono text-[10px] text-muted-foreground">{row.publicUrl}</p>
                        </td>
                        <td className="px-3 py-3">
                          <textarea
                            className="min-h-[64px] w-full max-w-[220px] rounded-md border border-border px-2 py-1.5 text-xs"
                            value={altVal}
                            onChange={(e) => setDraftAlt((d) => ({ ...d, [row.id]: e.target.value }))}
                            onBlur={() => {
                              const next = altVal.trim();
                              const prev = (row.altText ?? "").trim();
                              if (next === prev) return;
                              void patchRow(row.id, { altText: next || null });
                            }}
                            placeholder="Alt text…"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="w-full max-w-[200px] rounded-md border border-border px-2 py-1.5 font-mono text-xs"
                            value={tagsVal}
                            onChange={(e) => setDraftTags((d) => ({ ...d, [row.id]: e.target.value }))}
                            onBlur={() => {
                              const tags = tagsVal
                                .split(/[,]+/)
                                .map((s) => s.trim().toLowerCase().replace(/\s+/g, "-"))
                                .filter(Boolean)
                                .slice(0, 24);
                              const same =
                                tags.length === row.tags.length && tags.every((t, i) => t === row.tags[i]);
                              if (same) return;
                              void patchRow(row.id, { tags });
                            }}
                            placeholder="comma-separated"
                          />
                        </td>
                        <td className="px-3 py-3 text-xs">
                          <div className="space-y-1">
                            <p className="font-semibold tabular-nums">
                              {row.usageRefCount === null || row.usageRefCount === undefined ? "—" : row.usageRefCount}
                            </p>
                            {row.usageScannedAt ? (
                              <p className="text-[10px] text-muted-foreground">
                                Scanned {new Date(row.usageScannedAt).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-[10px] text-muted-foreground">Not scanned</p>
                            )}
                            {refs.length ? (
                              <ul className="mt-2 max-w-[220px] space-y-0.5 text-[10px]">
                                {refs.map((r) => (
                                  <li key={`${r.type}-${r.id}`} className="truncate">
                                    <span className="text-muted-foreground">{r.type}:</span>{" "}
                                    <Link className="text-primary underline" href={r.href}>
                                      {r.label.slice(0, 48)}
                                      {r.label.length > 48 ? "…" : ""}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            <button
                              type="button"
                              disabled={scanBusy}
                              className="mt-1 text-[10px] font-semibold text-primary underline disabled:opacity-40"
                              onClick={() => void scanRow(row.id)}
                            >
                              Scan row
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted/60"
                            onClick={() => copyUrl(row.publicUrl)}
                          >
                            <Copy className="h-3 w-3" aria-hidden />
                            Copy URL
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
              {!loading && data?.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-muted-foreground">
                    No media yet. Upload a file or adjust filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {data && totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs">
            <span className="text-muted-foreground">
              Page {page} / {totalPages} · {data.total} assets
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                className="rounded-lg border border-border px-3 py-1 font-semibold disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                className="rounded-lg border border-border px-3 py-1 font-semibold disabled:opacity-40"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {preview ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close" onClick={() => setPreview(null)} />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{preview.filename}</p>
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{preview.publicUrl}</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1 text-xs font-semibold"
                onClick={() => setPreview(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex justify-center rounded-xl bg-muted/20 p-4">
              {preview.kind === "image" || preview.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.publicUrl} alt={preview.altText ?? ""} className="max-h-[min(70vh,640px)] max-w-full object-contain" />
              ) : (
                <p className="text-sm text-muted-foreground">Preview not available for this type. Open the URL or download from CDN.</p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                onClick={() => copyUrl(preview.publicUrl)}
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
