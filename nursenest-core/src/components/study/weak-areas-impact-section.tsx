/**
 * WeakAreasImpactSection
 *
 * Shows the top 3–5 topics most affecting readiness with horizontal accuracy bars,
 * diagnostic descriptors, and links to lesson/practice remediation.
 *
 * Design: calm warning/info palette, thin polished bars — not a heavy analytics chart.
 * Each topic row links to targeted lesson and practice drill for that area.
 */

import Link from "next/link";
import type { ExamPlanWeakArea } from "@/lib/study/exam-plan/exam-plan-data";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

// ── Descriptor styling ────────────────────────────────────────────────────────

const DESCRIPTOR_STYLE: Record<ExamPlanWeakArea["descriptor"], { accent: string; surface: string }> = {
  "Major gap": {
    accent: "var(--semantic-danger)",
    surface: "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))",
  },
  "Needs reinforcement": {
    accent: "var(--semantic-warning)",
    surface: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
  },
  "Inconsistent": {
    accent: "var(--semantic-info)",
    surface: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
  },
  "Overconfident errors": {
    accent: "var(--semantic-warning)",
    surface: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
  },
};

// ── Topic row ────────────────────────────────────────────────────────────────

function WeakAreaRow({ area, pathwayId }: { area: ExamPlanWeakArea; pathwayId: string | null }) {
  const { accent, surface } = DESCRIPTOR_STYLE[area.descriptor];
  const lessonHref = pathwayId
    ? `/lessons?topic=${encodeURIComponent(area.topic)}&pathway=${encodeURIComponent(pathwayId)}`
    : `/lessons?topic=${encodeURIComponent(area.topic)}`;
  const practiceHref = `/app/questions?topic=${encodeURIComponent(area.topic)}`;

  return (
    <li
      className="rounded-xl p-4"
      style={{
        background: "color-mix(in srgb, var(--semantic-warning) 4%, var(--bg-page))",
        border: "1px solid color-mix(in srgb, var(--semantic-warning) 15%, transparent)",
      }}
    >
      {/* Topic name + descriptor */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
          {area.topic}
        </p>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: surface, color: accent, border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)` }}
        >
          {area.descriptor}
        </span>
      </div>

      {/* Accuracy bar */}
      <div className="mt-2 flex items-center gap-3">
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--md flex-1"
          role="progressbar"
          aria-valuenow={area.accuracyPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${area.topic} accuracy: ${area.accuracyPct}%`}
        >
          <div
            className={`h-full rounded-full ${semanticFillClassForAccuracyPct(area.accuracyPct)} nn-progress-fill-reveal transition-[width] duration-500`}
            style={{ width: `${Math.max(area.accuracyPct, 4)}%` }}
          />
        </div>
        <span
          className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          {area.accuracyPct}%
        </span>
      </div>

      {/* Quick links */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={lessonHref}
          className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold transition hover:opacity-90"
          style={{
            background: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
            color: "var(--semantic-info)",
            border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, transparent)",
          }}
        >
          Review lessons
        </Link>
        <Link
          href={practiceHref}
          className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold transition hover:opacity-90"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
            color: "var(--semantic-brand)",
            border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
          }}
        >
          Targeted practice
        </Link>
        <Link
          href="/app/review"
          className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold transition hover:opacity-90"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
            color: "var(--semantic-success)",
            border: "1px solid color-mix(in srgb, var(--semantic-success) 20%, transparent)",
          }}
        >
          Smart review
        </Link>
      </div>
    </li>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export function WeakAreasImpactSection({
  weakAreas,
  pathwayId,
}: {
  weakAreas: ExamPlanWeakArea[];
  pathwayId: string | null;
}) {
  if (weakAreas.length === 0) {
    return (
      <section id="weak-areas" aria-labelledby="weak-areas-heading">
        <h2
          id="weak-areas-heading"
          className="mb-3 text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Weak Areas Holding You Back
        </h2>
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 6%, var(--bg-page))",
            border: "1px solid color-mix(in srgb, var(--semantic-success) 15%, transparent)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            No significant weak areas detected yet. Complete more practice sessions to identify gaps.
          </p>
          <Link
            href="/app/questions"
            className="mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
            }}
          >
            Start practice
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="weak-areas" aria-labelledby="weak-areas-heading">
      <div className="mb-4">
        <h2
          id="weak-areas-heading"
          className="text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Weak Areas Holding You Back
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
          These topics currently have the biggest impact on your readiness score.
        </p>
      </div>

      <ul className="space-y-3">
        {weakAreas.map((area) => (
          <WeakAreaRow key={area.topic} area={area} pathwayId={pathwayId} />
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link
          href="/app/account/analytics"
          className="text-xs font-medium underline underline-offset-2"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          View full analytics
        </Link>
      </div>
    </section>
  );
}
