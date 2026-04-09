"use client";

import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type MediaPickerItem = {
  id: string;
  publicUrl: string;
  filename: string;
  kind: string;
  altText: string | null;
  mimeType: string;
};

type ListResponse = {
  items: MediaPickerItem[];
  total: number;
  page: number;
  pageSize: number;
};

export function AdminMediaPickerDialog({
  open,
  title = "Choose from media library",
  onOpenChange,
  onPick,
  imageOnly = true,
}: {
  open: boolean;
  title?: string;
  onOpenChange: (open: boolean) => void;
  onPick: (sel: { url: string; alt: string; id: string }) => void;
  imageOnly?: boolean;
}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 280);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("pageSize", "36");
    if (debounced) sp.set("q", debounced);
    if (imageOnly) sp.set("type", "image");
    return sp.toString();
  }, [page, debounced, imageOnly]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/media?${queryString}`, { cache: "no-store" });
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
    if (!open) return;
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) {
      setQ("");
      setDebounced("");
      setPage(1);
      setErr(null);
    }
  }, [open]);

  if (!open) return null;

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative flex max-h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{title}</h2>
            <p className="text-[11px] text-muted-foreground">CDN URLs from Spaces · click a tile to insert</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>

        <div className="border-b border-border/50 px-5 py-3">
          <label className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/20 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search filename, URL, alt, tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {err ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-900 dark:text-rose-100">{err}</p>
          ) : null}

          {loading && !data ? (
            <div className="flex justify-center py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : null}

          {data ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {data.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onPick({
                      id: item.id,
                      url: item.publicUrl,
                      alt: (item.altText ?? "").trim() || item.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
                    });
                    onOpenChange(false);
                  }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-muted/10 text-left transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-video bg-muted/40">
                    {item.kind === "image" || item.mimeType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.publicUrl}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {item.kind.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 p-2">
                    <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground">{item.filename}</p>
                    {item.altText ? (
                      <p className="line-clamp-2 text-[10px] text-muted-foreground">{item.altText}</p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {data && data.items.length === 0 && !loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No assets match this search. Upload from the media library page.</p>
          ) : null}
        </div>

        {data && totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs">
            <span className="text-muted-foreground">
              Page {page} / {totalPages} · {data.total} total
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                className="rounded-lg border border-border px-3 py-1 font-semibold disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
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
    </div>
  );
}
