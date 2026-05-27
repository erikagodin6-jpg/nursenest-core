"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { LearnerLessonsVirtualList, type LearnerLessonVirtualRow } from "@/components/student/learner-lessons-virtual-list";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type LessonsPayload = {
  rows: LearnerLessonVirtualRow[];
  progressByRowId: Record<string, PathwayLessonProgressStatus>;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

type FilterState = {
  q: string;
  topic: string | null;
  topicSlug: string | null;
  pathwayId: string | null;
  limit: number;
  page: number;
};

function filterKey(filters: FilterState): string {
  return JSON.stringify({
    q: filters.q.trim(),
    topic: filters.topic?.trim() || "",
    topicSlug: filters.topicSlug?.trim().toLowerCase() || "",
    pathwayId: filters.pathwayId?.trim() || "",
    limit: filters.limit,
    page: filters.page,
  });
}

function urlForFilters(filters: FilterState): string {
  const qs = new URLSearchParams();
  if (filters.page > 1) qs.set("page", String(filters.page));
  if (filters.topicSlug?.trim()) qs.set("topicSlug", filters.topicSlug.trim().toLowerCase());
  else if (filters.topic?.trim()) qs.set("topic", filters.topic.trim());
  if (filters.pathwayId?.trim()) qs.set("pathwayId", filters.pathwayId.trim());
  if (filters.q.trim()) qs.set("q", filters.q.trim());
  if (filters.limit > 0) qs.set("limit", String(filters.limit));
  const s = qs.toString();
  return s ? `/app/lessons?${s}` : "/app/lessons";
}

function apiUrlForFilters(filters: FilterState): string {
  const url = urlForFilters(filters);
  const query = url.includes("?") ? url.slice(url.indexOf("?")) : "";
  return `/api/learner/pathway-lessons${query}`;
}

function progressByRowIdFromApi(rows: LearnerLessonVirtualRow[], raw: Record<string, PathwayLessonProgressStatus> | null): Record<string, PathwayLessonProgressStatus> {
  if (!raw) return {};
  const next: Record<string, PathwayLessonProgressStatus> = {};
  for (const row of rows) {
    const pm = row.pathwayMeta;
    if (!pm) continue;
    next[row.id] = raw[`${pm.pathwayId}:${pm.slug}`] ?? "not_started";
  }
  return next;
}

function visiblePageNumbers(current: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= 10) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const set = new Set<number>([1, pageCount]);
  for (let page = current - 2; page <= current + 2; page += 1) {
    if (page >= 1 && page <= pageCount) set.add(page);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let index = 0; index < sorted.length; index += 1) {
    if (index > 0 && sorted[index] - sorted[index - 1] > 1) out.push("ellipsis");
    out.push(sorted[index]);
  }
  return out;
}

function LessonsListSkeleton({ count }: { count: number }) {
  return (
    <div
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_20%,var(--semantic-surface))] px-4 py-4 shadow-[var(--semantic-shadow-soft)] sm:px-5"
      aria-label="Loading lessons"
    >
      <div className="grid gap-4">
        {Array.from({ length: Math.max(3, Math.min(count, 6)) }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
          >
            <div className="flex gap-2">
              <div className="h-5 w-24 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-panel-muted))]" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-panel-muted))]" />
            </div>
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-primary)_8%,var(--semantic-panel-muted))]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-primary)_6%,var(--semantic-panel-muted))]" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-primary)_6%,var(--semantic-panel-muted))]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LearnerLessonsResponsiveResults({
  initialRows,
  initialProgressByRowId,
  initialTotal,
  initialPage,
  initialPageCount,
  initialPageSize,
  initialFilters,
  openLessonCta,
  initialListSummaryLine,
  clientFilteringEnabled,
}: {
  initialRows: LearnerLessonVirtualRow[];
  initialProgressByRowId: Record<string, PathwayLessonProgressStatus>;
  initialTotal: number;
  initialPage: number;
  initialPageCount: number;
  initialPageSize: number;
  initialFilters: Omit<FilterState, "page" | "limit">;
  openLessonCta: string;
  initialListSummaryLine: string | null;
  clientFilteringEnabled: boolean;
}) {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    page: initialPage,
    limit: initialPageSize,
  });
  const [searchValue, setSearchValue] = useState(initialFilters.q);
  const [payload, setPayload] = useState<LessonsPayload>({
    rows: initialRows,
    progressByRowId: initialProgressByRowId,
    total: initialTotal,
    page: initialPage,
    pageCount: initialPageCount,
    pageSize: initialPageSize,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const latestKeyRef = useRef(filterKey({ ...initialFilters, page: initialPage, limit: initialPageSize }));
  const cacheRef = useRef(new Map<string, LessonsPayload>([[latestKeyRef.current, payload]]));
  const prefetchingKeysRef = useRef(new Set<string>());
  const prefetchControllersRef = useRef(new Set<AbortController>());

  const summaryLine = useMemo(() => {
    if (loading) return "Loading lessons...";
    if (error) return error;
    if (payload.rows.length > 0) return `Showing ${payload.rows.length} of ${payload.total} lessons`;
    return initialListSummaryLine;
  }, [error, initialListSummaryLine, loading, payload.rows.length, payload.total]);

  const loadFilters = useCallback(
    async (nextFilters: FilterState, opts: { pushUrl?: boolean } = {}) => {
      if (!clientFilteringEnabled) {
        window.location.href = urlForFilters(nextFilters);
        return;
      }

      const key = filterKey(nextFilters);
      latestKeyRef.current = key;
      setFilters(nextFilters);
      setError(null);
      if (opts.pushUrl !== false) {
        window.history.pushState(null, "", urlForFilters(nextFilters));
      }

      const cached = cacheRef.current.get(key);
      if (cached) {
        setPayload(cached);
        setLoading(false);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const res = await fetch(apiUrlForFilters(nextFilters), {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as {
          rows?: LearnerLessonVirtualRow[];
          total?: number;
          page?: number;
          pageCount?: number;
          pageSize?: number;
          progressByPathwaySlug?: Record<string, PathwayLessonProgressStatus> | null;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Lessons are still loading. Try again.");
        const rows = Array.isArray(data.rows) ? data.rows : [];
        const nextPayload: LessonsPayload = {
          rows,
          progressByRowId: progressByRowIdFromApi(rows, data.progressByPathwaySlug ?? null),
          total: typeof data.total === "number" ? data.total : rows.length,
          page: typeof data.page === "number" ? data.page : nextFilters.page,
          pageCount: typeof data.pageCount === "number" ? data.pageCount : 1,
          pageSize: typeof data.pageSize === "number" ? data.pageSize : nextFilters.limit,
        };
        cacheRef.current.set(key, nextPayload);
        if (latestKeyRef.current === key) {
          setPayload(nextPayload);
          setLoading(false);
        }
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        if (latestKeyRef.current === key) {
          setLoading(false);
          setError(cause instanceof Error ? cause.message : "Lessons could not load. Try again.");
        }
      }
    },
    [clientFilteringEnabled],
  );

  const prefetchFilters = useCallback(
    async (nextFilters: FilterState) => {
      if (!clientFilteringEnabled) return;
      const key = filterKey(nextFilters);
      if (cacheRef.current.has(key) || prefetchingKeysRef.current.has(key)) return;
      prefetchingKeysRef.current.add(key);
      const controller = new AbortController();
      prefetchControllersRef.current.add(controller);
      try {
        const res = await fetch(apiUrlForFilters(nextFilters), {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json().catch(() => ({}))) as {
          rows?: LearnerLessonVirtualRow[];
          total?: number;
          page?: number;
          pageCount?: number;
          pageSize?: number;
          progressByPathwaySlug?: Record<string, PathwayLessonProgressStatus> | null;
        };
        const rows = Array.isArray(data.rows) ? data.rows : [];
        cacheRef.current.set(key, {
          rows,
          progressByRowId: progressByRowIdFromApi(rows, data.progressByPathwaySlug ?? null),
          total: typeof data.total === "number" ? data.total : rows.length,
          page: typeof data.page === "number" ? data.page : nextFilters.page,
          pageCount: typeof data.pageCount === "number" ? data.pageCount : 1,
          pageSize: typeof data.pageSize === "number" ? data.pageSize : nextFilters.limit,
        });
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
      } finally {
        prefetchControllersRef.current.delete(controller);
        prefetchingKeysRef.current.delete(key);
      }
    },
    [clientFilteringEnabled],
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      for (const controller of prefetchControllersRef.current) {
        controller.abort();
      }
      prefetchControllersRef.current.clear();
      prefetchingKeysRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextQ = searchValue.trim();
      if (nextQ === filters.q.trim()) return;
      startTransition(() => {
        void loadFilters({ ...filters, q: nextQ, page: 1 });
      });
    }, 250);
    return () => window.clearTimeout(id);
  }, [filters, loadFilters, searchValue, startTransition]);

  const selectTopic = useCallback(
    (topic: { topic: string; topicSlug?: string | null }) => {
      startTransition(() => {
        void loadFilters({
          ...filters,
          topic: topic.topic,
          topicSlug: topic.topicSlug?.trim() || null,
          page: 1,
        });
      });
    },
    [filters, loadFilters, startTransition],
  );
  const prefetchTopic = useCallback(
    (topic: { topic: string; topicSlug?: string | null }) => {
      void prefetchFilters({
        ...filters,
        topic: topic.topic,
        topicSlug: topic.topicSlug?.trim() || null,
        page: 1,
      });
    },
    [filters, prefetchFilters],
  );
  const pages = useMemo(() => visiblePageNumbers(payload.page, payload.pageCount), [payload.page, payload.pageCount]);

  return (
    <section className="space-y-6" aria-busy={loading}>
      <div className="nn-product-surface-accent nn-card relative overflow-hidden rounded-2xl border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_94%,color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface)))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5">
        <label className="block text-sm font-semibold text-[var(--semantic-text-primary)]" htmlFor="learner-lessons-q">
          Search lessons
        </label>
        <input
          id="learner-lessons-q"
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by title, topic, or keyword"
          autoComplete="off"
          className="mt-2 min-h-11 w-full max-w-xl rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-base text-[var(--semantic-text-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--semantic-text-primary)_04%,transparent)] placeholder:text-[var(--semantic-text-muted)] transition-[border-color,box-shadow] motion-safe:duration-200 focus-visible:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)] sm:min-h-0 sm:py-2 sm:text-sm"
        />
      </div>

      {summaryLine ? (
        <p className="text-sm font-medium text-[var(--semantic-text-secondary)]" data-testid="lessons-hub-list-summary">
          {summaryLine}
        </p>
      ) : null}

      <div className="nn-premium-lessons-app-list" data-nn-premium-lessons-hub-body="">
        {loading ? (
          <LessonsListSkeleton count={payload.rows.length || initialPageSize} />
        ) : (
          <LearnerLessonsVirtualList
            lessons={payload.rows}
            progressByRowId={payload.progressByRowId}
            openLessonCta={openLessonCta}
            activeTopic={filters.topic}
            activeTopicSlug={filters.topicSlug}
            onTopicSelect={selectTopic}
            onTopicPrefetch={prefetchTopic}
          />
        )}
      </div>

      {payload.pageCount > 1 ? (
        <nav
          className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--border-subtle)_90%,var(--theme-primary))] pt-8 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          aria-label="Lesson list pages"
        >
          <p className="text-[var(--theme-muted-text)]">
            Page <span className="font-medium text-[var(--theme-heading-text)]">{payload.page}</span> of{" "}
            <span className="font-medium text-[var(--theme-heading-text)]">{payload.pageCount}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={payload.page <= 1 || loading}
              onClick={() => void loadFilters({ ...filters, page: Math.max(1, payload.page - 1) })}
              className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous
            </button>
            <div className="flex flex-wrap items-center gap-1" aria-label="Page numbers">
              {pages.map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="px-1 text-[var(--theme-muted-text)]">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    disabled={loading || item === payload.page}
                    onClick={() => void loadFilters({ ...filters, page: item })}
                    className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold disabled:cursor-default ${
                      item === payload.page
                        ? "bg-[color-mix(in_srgb,var(--theme-primary)_18%,transparent)] text-[var(--theme-heading-text)]"
                        : "text-[var(--theme-muted-text)] hover:bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] hover:text-[var(--theme-heading-text)]"
                    }`}
                    aria-current={item === payload.page ? "page" : undefined}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              disabled={payload.page >= payload.pageCount || loading}
              onClick={() => void loadFilters({ ...filters, page: Math.min(payload.pageCount, payload.page + 1) })}
              className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
