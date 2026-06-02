import Link from "next/link";
import { Brain, Compass, Lightbulb, ListChecks } from "lucide-react";
import type { LearnerInsightSnapshot } from "@/lib/insights/types";

function tierLabel(t: string): string {
  switch (t) {
    case "critical":
      return "Critical gap";
    case "weak":
      return "Weak";
    case "moderate":
      return "Moderate";
    case "strong":
      return "Stable";
    default:
      return t;
  }
}

export function LearnerInsightEnginePanel({ insights }: { insights: LearnerInsightSnapshot }) {
  const p = insights.performance;
  const primary = insights.recommendations.primary;

  return (
    <section className="nn-card border-primary/15 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Brain className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Insight engine</h2>
      </div>
      <p className="mt-1 text-xs text-muted">
        Interpretation of your recent activity. Not medical advice and not a guarantee of exam outcome.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Performance</p>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">
            Overall session accuracy:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {p.overallAccuracyPct != null ? `${p.overallAccuracyPct}%` : "N/A"}
            </span>
            {p.recencyWeightedAccuracyPct != null ? (
              <>
                {" "}
                · Recency-weighted:{" "}
                <span className="font-medium tabular-nums text-foreground">{p.recencyWeightedAccuracyPct}%</span>
              </>
            ) : null}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{p.trendSummary}</p>
          <p className="mt-2 text-[11px] text-muted">
            Mock trend: <span className="font-medium text-foreground">{p.mockTrend}</span> · Consistency:{" "}
            <span className="font-medium text-foreground">{p.mockConsistency}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Adaptive & cards</p>
          {insights.cat.line ? (
            <p className="mt-2 text-sm text-[var(--theme-body-text)]">{insights.cat.line}</p>
          ) : (
            <p className="mt-2 text-sm text-muted">No recent CAT-style practice test on file.</p>
          )}
          <p className="mt-2 text-xs text-muted">{insights.flashcards.line}</p>
        </div>
      </div>

      {insights.weakAreas.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Priority review signals</p>
          <ul className="mt-2 space-y-2">
            {insights.weakAreas.slice(0, 5).map((w) => (
              <li
                key={w.topic}
                className="rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm text-[var(--theme-body-text)]"
              >
                <span className="font-semibold text-foreground">{w.topic}</span>{" "}
                <span className="text-xs text-muted">({tierLabel(w.tier)} · risk {w.risk})</span>
                <p className="mt-1 text-xs text-muted">{w.why}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {insights.knowledgeGaps.length > 0 ? (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Gaps detected
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            {insights.knowledgeGaps.map((g) => (
              <li key={`${g.kind}:${g.topic}`}>
                <span className="font-medium text-foreground">{g.topic}</span>: {g.detail}{" "}
                <span className="text-muted">({g.suggestedAction})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <Lightbulb className="h-4 w-4" aria-hidden />
          Best next action
        </p>
        <p className="mt-1 font-semibold text-foreground">{primary.title}</p>
        <dl className="mt-3 space-y-2 text-xs text-muted">
          <div>
            <dt className="font-semibold text-foreground">Why</dt>
            <dd>{primary.why}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">What</dt>
            <dd>{primary.what}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">How it helps</dt>
            <dd>{primary.how}</dd>
          </div>
        </dl>
        <Link
          href={primary.href}
          className="mt-3 inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
        >
          Go
        </Link>
      </div>

      {insights.recommendations.secondary.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Also consider</p>
          <ul className="mt-2 space-y-2">
            {insights.recommendations.secondary.map((a) => (
              <li key={a.href + a.title} className="flex flex-wrap items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted">{a.why}</p>
                </div>
                <Link href={a.href} className="shrink-0 text-primary underline">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <ListChecks className="h-4 w-4" aria-hidden />
          Today & this week
        </p>
        <ul className="mt-2 list-inside list-decimal space-y-1 text-sm text-[var(--theme-body-text)]">
          {insights.dailyPlan.todayTasks.map((t, i) => (
            <li key={i}>
              {t.label}{" "}
              <Link className="text-primary underline" href={t.href}>
                (open)
              </Link>
              <span className="text-muted"> · {t.reason}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
          {insights.dailyPlan.weeklyPriorities.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
