"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

type CatInsightRow = {
  id: string;
  title: string | null;
  completedAt: string | null;
  passOutlookPercent: number | null;
  confidenceLevel: string | null;
  decision: string | null;
  totalQuestions: number | null;
  catPresentationMode: string | null;
};

export default function CatInsightsPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CatInsightRow[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number, append: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/practice-tests/cat-insights?page=${nextPage}`);
      const data = (await res.json()) as {
        items?: CatInsightRow[];
        hasMore?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load CAT history.");
      const next = data.items ?? [];
      setItems((prev) => (append ? [...prev, ...next] : next));
      setHasMore(Boolean(data.hasMore));
      setPage(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const outlooks = items.map((r) => r.passOutlookPercent).filter((n): n is number => typeof n === "number");
  const best = outlooks.length ? Math.max(...outlooks) : null;
  const latest = items[0]?.passOutlookPercent ?? null;
  const delta =
    outlooks.length >= 2 && latest != null ? latest - (items[1]?.passOutlookPercent ?? latest) : null;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <div className="nn-learner-page-hero">
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">CAT confidence dashboard</h1>
        <p className="mt-2 max-w-prose text-sm text-[var(--semantic-text-secondary)]">
          Readiness outlook and confidence are practice estimates from your adaptive sessions — not official exam
          results. Use this view to see whether your pass outlook is trending up over time.
        </p>
      </div>

      {error ? (
        <p className="nn-card p-4 text-sm text-destructive">{error}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="nn-card border-[var(--semantic-border-soft)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Sessions listed</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{items.length}</p>
            </div>
            <div className="nn-card border-[var(--semantic-border-soft)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Best outlook (loaded)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-brand)]">
                {best != null ? `${best}%` : "—"}
              </p>
            </div>
            <div className="nn-card border-[var(--semantic-border-soft)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Latest vs prior</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {delta == null ? "—" : `${delta > 0 ? "+" : ""}${delta} pts`}
              </p>
            </div>
          </div>

          <div className="nn-card border-[var(--semantic-border-soft)] p-0 overflow-hidden">
            <div className="border-b border-[var(--semantic-border-soft)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Recent CAT sessions</h2>
              <p className="text-xs text-muted-foreground">Newest first</p>
            </div>
            {items.length === 0 && !loading ? (
              <p className="p-6 text-sm text-muted-foreground">
                No completed CAT sessions yet.{" "}
                <Link className="font-semibold text-primary underline" href="/app/practice-tests">
                  Start an adaptive test
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-[var(--semantic-border-soft)]">
                {items.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <Link href={`/app/practice-tests/${r.id}/results`} className="font-semibold text-primary hover:underline">
                        {r.title?.trim() || "CAT session"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {r.completedAt ? new Date(r.completedAt).toLocaleString() : "—"}
                        {r.catPresentationMode === "exam_simulation" ? " · Exam simulation" : ""}
                      </p>
                    </div>
                    <div className="text-right tabular-nums">
                      <p className="font-semibold text-[var(--semantic-text-primary)]">
                        {r.passOutlookPercent != null ? `${r.passOutlookPercent}% outlook` : "—"}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {r.decision ?? "—"} · {r.confidenceLevel ?? "—"} confidence
                        {r.totalQuestions != null ? ` · ${r.totalQuestions} items` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {hasMore ? (
              <div className="border-t border-[var(--semantic-border-soft)] p-4">
                <button
                  type="button"
                  disabled={loading}
                  className="nn-btn-secondary rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-40"
                  onClick={() => void load(page + 1, true)}
                >
                  {loading ? "Loading…" : "Load more"}
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}

      <p className="text-sm">
        <Link href="/app/practice-tests" className="font-semibold text-primary underline">
          Back to practice tests
        </Link>
      </p>
    </div>
  );
}
