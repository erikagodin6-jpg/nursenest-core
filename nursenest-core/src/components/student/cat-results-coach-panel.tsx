"use client";

import Link from "next/link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examContextAnalyticsProps } from "@/lib/exam-context/global-exam-context";
import type { CatExamFeedbackMode } from "@/lib/practice-tests/types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import {
  isSafeInternalStudyLinkHref,
  normalizeCatResultsCoachSnapshot,
} from "@/lib/practice-tests/cat-practice-fallbacks";

function difficultySparkline(series: number[], height = 40, width = 200) {
  if (series.length === 0) {
    return <p className="text-xs text-muted-foreground">No difficulty history for this session.</p>;
  }
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pad = 4;
  const span = Math.max(0.001, max - min);
  const pts = series.map((v, i) => {
    const x = pad + (i / Math.max(1, series.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg
      width={width}
      height={height}
      className="text-primary motion-reduce:opacity-95"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        points={pts.join(" ")}
      />
    </svg>
  );
}

export function CatResultsCoachPanel({
  coach: coachProp,
  catExamFeedbackMode,
  pathwayId = null,
}: {
  coach: CatResultsCoachSnapshot | null | undefined;
  catExamFeedbackMode?: CatExamFeedbackMode | null;
  pathwayId?: string | null;
}) {
  const coach = normalizeCatResultsCoachSnapshot(coachProp);
  const examContextProps = examContextAnalyticsProps(buildGlobalExamContext(pathwayId, "en"));
  const modeLabel =
    catExamFeedbackMode === "study"
      ? "Study Mode"
      : catExamFeedbackMode === "test"
        ? "Test Mode"
        : "Test Mode";

  return (
    <div className="nn-semantic-inset--cool space-y-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Your CAT summary</p>
          <p className="mt-2 text-lg font-semibold leading-snug text-[var(--semantic-text-primary)]">
            {coach.readinessHeadline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{coach.readinessNarrative}</p>
        </div>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {modeLabel}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-xs text-muted-foreground">Practice pass outlook</p>
          {coach.passOutlookOmitted ? (
            <>
              <p className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">Outlook not stored</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                This run predates detailed outlook labels. Your score and classification above are still valid; compare newer
                CAT sessions for trend-style coaching.
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold tabular-nums text-[var(--semantic-brand)]">{coach.passOutlookPercent}%</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{coach.passOutlookDisclaimer}</p>
            </>
          )}
        </div>
        {!coach.confidenceOmitted ? (
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Confidence</p>
            <p className="text-sm font-medium capitalize text-foreground">{coach.confidenceLevel}</p>
            <p className="mt-1 max-w-[14rem] text-xs text-muted-foreground">{coach.confidenceSummary}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/40 px-4 py-3 text-xs text-muted-foreground">
            Confidence detail was not stored for this session.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stronger in</p>
          {coach.strongestDomains.length ? (
            <ul className="mt-2 list-inside list-disc text-sm text-foreground">
              {coach.strongestDomains.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No area stood out as clearly strong in this short window.</p>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Needs focus</p>
          {coach.weakestDomains.length ? (
            <ul className="mt-2 list-inside list-disc text-sm text-foreground">
              {coach.weakestDomains.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No weak domain cluster this run — still review mistakes below.</p>
          )}
        </div>
      </div>

      {coach.keyRiskFactor ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,transparent)] bg-[var(--semantic-warning-soft)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground">Main risk to address</p>
          <p className="mt-1 text-sm text-foreground">{coach.keyRiskFactor}</p>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passing band (practice)</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{coach.passingBandCopy}</p>
        {coach.examPassingStandardLine ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{coach.examPassingStandardLine}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item difficulty</p>
          <p className="text-xs capitalize text-muted-foreground">{coach.difficultyTrendLabel.replace(/_/g, " ")}</p>
          <div className="mt-2">{difficultySparkline(coach.difficultySeries)}</div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ability trend (this session)</p>
          <p className="text-xs capitalize text-muted-foreground">{coach.stabilityTrendLabel.replace(/_/g, " ")}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{coach.stabilityInterpretation}</p>
        </div>
      </div>

      {coach.specificStudyActions.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Focus next (specific)</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
            {coach.specificStudyActions.map((line) => (
              <li key={line.slice(0, 100)} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {coach.weaknessInsights.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Session notes</p>
          <ul className="mt-2 space-y-1 text-sm text-foreground">
            {coach.weaknessInsights.map((line) => (
              <li key={line.slice(0, 80)} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {coach.errorPatterns.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detected patterns</p>
          <ul className="mt-2 space-y-2">
            {coach.errorPatterns.map((p) => (
              <li key={p.code} className="rounded-lg border border-border/80 bg-card/60 px-3 py-2 text-sm">
                <span className="font-semibold text-foreground">{p.title}</span>
                <span className="mt-1 block text-muted-foreground">{p.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What to study next</p>
        <ol className="mt-3 space-y-4">
          {(coach.studyNext ?? []).map((s, i) => (
            <li key={`${s.title}-${i}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-background/80 p-4">
              <p className="text-sm font-semibold text-foreground">
                {i + 1}. {s.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(s.links ?? [])
                  .filter((l) => l && typeof l.href === "string" && isSafeInternalStudyLinkHref(l.href))
                  .map((l) => (
                  <Link
                    key={`${s.title}-${l.kind}-${l.href.slice(0, 40)}`}
                    href={l.href}
                    className="inline-flex rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                    onClick={() =>
                      trackClientEvent(PH.learnerCatLearningLinkClicked, {
                        surface: "cat_results_coach",
                        link_kind: l.kind,
                        ...examContextProps,
                      })
                    }
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{coach.multiSessionGuidance}</p>

      <details className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/50 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-foreground">How NurseNest CAT works</summary>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Questions adapt to your answers: the pool stays aligned to your pathway, and difficulty shifts based on how you
          perform. The pass outlook uses the same estimate the engine already computed — we only translate it into plain
          language and next steps. We never change how items are scored or selected on the server.
        </p>
      </details>

      <p className="text-center text-xs">
        <Link href="/app/practice-tests/cat-insights" className="font-semibold text-primary underline">
          CAT readiness over time
        </Link>
      </p>
    </div>
  );
}
