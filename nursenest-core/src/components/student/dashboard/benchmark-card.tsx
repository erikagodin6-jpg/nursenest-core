"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Lock, Users } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { BenchmarkData } from "@/lib/learner/benchmark-engine";
import { readinessBandLabel } from "@/lib/learner/readiness-score";

/* ═══════════════════════════════════════════════════════════════════════
   BenchmarkCard — peer comparison surface (subscriber view)
   ═══════════════════════════════════════════════════════════════════════ */

export function BenchmarkCard({ data }: { data: BenchmarkData }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackClientEvent("benchmark_viewed", {
      band: data.band,
      percentile: data.percentile ?? undefined,
      has_percentile: data.hasEnoughData,
    });
  }, [data.band, data.percentile, data.hasEnoughData]);

  return (
    <article className="nn-benchmark-card">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-info)_10%,transparent),transparent_65%)] blur-2xl" aria-hidden />

      {/* Header */}
      <div className="relative flex items-center gap-2.5 px-5 pt-5 sm:px-6">
        <BarChart3 className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
        <h3 className="text-sm font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          How You Compare
        </h3>
      </div>

      {/* Body */}
      <div className="relative space-y-4 px-5 pb-5 pt-3 sm:px-6">
        {/* Percentile (conditional) */}
        {data.hasEnoughData && data.percentile != null ? (
          <div className="nn-benchmark-percentile-block">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-[var(--semantic-brand)]">
                {data.percentile}%
              </span>
              <span className="text-xs font-medium text-[var(--semantic-text-muted)]">
                percentile
              </span>
            </div>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--semantic-text-secondary)]">
              You are performing better than {data.percentile}% of students on the platform.
            </p>
          </div>
        ) : null}

        {/* Band context (always shown) */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))] text-[var(--semantic-info)]">
            <Users className="h-3.5 w-3.5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-medium text-[var(--semantic-text-primary)]">
              {readinessBandLabel(data.band)}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {data.bandContext}
            </p>
          </div>
        </div>

        {/* Low data notice */}
        {!data.hasEnoughData ? (
          <p className="rounded-lg bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
            Benchmarking will become more precise as more students use the platform.
          </p>
        ) : null}

        {/* Improvement hint */}
        <div className="flex items-start gap-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
          <span>{data.improvementHint}</span>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BenchmarkLockedCard — trial / free users
   ═══════════════════════════════════════════════════════════════════════ */

export function BenchmarkLockedCard() {
  return (
    <article className="nn-benchmark-card">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-info)_8%,transparent),transparent_65%)] blur-2xl" aria-hidden />

      <div className="relative space-y-3 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-[var(--semantic-text-muted)]" aria-hidden />
          <h3 className="text-sm font-semibold tracking-tight text-[var(--semantic-text-primary)]">
            How You Compare
          </h3>
        </div>

        <p className="text-[0.8125rem] leading-relaxed text-[var(--semantic-text-secondary)]">
          See how your performance compares and where you stand among other students.
        </p>

        <Link
          href="/pricing"
          className="inline-flex rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105"
        >
          Unlock Full Performance Insights
        </Link>
      </div>
    </article>
  );
}
