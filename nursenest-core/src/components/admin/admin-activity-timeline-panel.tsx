"use client";

import { useState, useMemo } from "react";
import type { AdminActivityTimelineItem } from "@/lib/admin/account-activity-evidence";

type Props = {
  userId: string;
  timeline: AdminActivityTimelineItem[];
};

const KIND_ICONS: Record<string, string> = {
  login:        "🔑",
  session:      "📖",
  lesson:       "📗",
  flashcard:    "🃏",
  exam:         "📋",
  practice:     "🎯",
  question:     "❓",
  subscription: "💳",
  security:     "🛡️",
};

const ALL_KINDS = ["login", "session", "lesson", "flashcard", "exam", "practice", "question", "subscription", "security"] as const;
type Kind = typeof ALL_KINDS[number];

const PAGE_SIZE = 40;

export function AdminActivityTimelinePanel({ userId, timeline }: Props) {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<Kind | "all">("all");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const filtered = useMemo(() => {
    let items = timeline;
    if (kindFilter !== "all") items = items.filter((t) => t.kind === kindFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((t) =>
        t.label.toLowerCase().includes(q) ||
        t.detail.toLowerCase().includes(q) ||
        t.kind.toLowerCase().includes(q),
      );
    }
    return items;
  }, [timeline, kindFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const page0 = Math.min(page, Math.max(0, totalPages - 1));
  const slice = filtered.slice(page0 * PAGE_SIZE, (page0 + 1) * PAGE_SIZE);

  // Group by day
  const grouped = useMemo(() => {
    const map = new Map<string, AdminActivityTimelineItem[]>();
    for (const item of slice) {
      const day = new Date(item.at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(item);
    }
    return [...map.entries()];
  }, [slice]);

  return (
    <section className="mt-6 nn-card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Activity Timeline · Phase 11A</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
            Full Activity Timeline
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {timeline.length.toLocaleString()} event{timeline.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:border-primary/40"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search events…"
              className="min-w-[200px] rounded-full border border-border bg-background px-4 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setKindFilter("all"); setPage(0); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${kindFilter === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                All
              </button>
              {ALL_KINDS.map((k) => (
                <button
                  key={k}
                  onClick={() => { setKindFilter(k); setPage(0); }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition capitalize ${kindFilter === k ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                >
                  {KIND_ICONS[k]} {k}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events match the current filter.</p>
          ) : (
            <>
              <ol className="space-y-5">
                {grouped.map(([day, items]) => (
                  <li key={day}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{day}</p>
                    <ol className="space-y-0 rounded-xl border border-border/60 overflow-hidden">
                      {items.map((item, idx) => (
                        <li
                          key={`${item.at}-${idx}`}
                          className="flex gap-3 border-b border-border/40 px-4 py-2.5 last:border-b-0 hover:bg-muted/20"
                        >
                          <span className="mt-0.5 shrink-0 text-base">{KIND_ICONS[item.kind] ?? "◦"}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {new Date(item.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.kind}</span>
                              <span className="font-medium text-sm text-[var(--theme-heading-text)]">{item.label}</span>
                            </div>
                            {item.detail && (
                              <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <p className="text-xs text-muted-foreground">
                    Showing {page0 * PAGE_SIZE + 1}–{Math.min((page0 + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} events
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page0 === 0}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:border-primary/40 disabled:opacity-40"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page0 >= totalPages - 1}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:border-primary/40 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Export links */}
          <div className="flex flex-wrap gap-3 border-t border-border/50 pt-4">
            <a
              href={`/api/admin/users/${encodeURIComponent(userId)}/activity-evidence?format=txt`}
              className="text-xs text-primary underline underline-offset-2 hover:text-primary/70"
            >
              Download evidence report (.txt)
            </a>
            <a
              href={`/api/admin/users/${encodeURIComponent(userId)}/activity-evidence?format=html`}
              className="text-xs text-primary underline underline-offset-2 hover:text-primary/70"
            >
              Print / save PDF
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
