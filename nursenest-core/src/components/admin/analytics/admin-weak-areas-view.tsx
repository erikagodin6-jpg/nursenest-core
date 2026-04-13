import Link from "next/link";
import type { AdminWeakAreasData, RankedWeakArea } from "@/lib/admin/load-admin-weak-areas";

const severityStyles: Record<RankedWeakArea["severity"], string> = {
  critical: "bg-rose-500/15 text-rose-800 dark:text-rose-100 border-rose-500/40",
  high: "bg-amber-500/15 text-amber-950 dark:text-amber-50 border-amber-500/40",
  medium: "bg-sky-500/12 text-sky-950 dark:text-sky-50 border-sky-500/35",
  watch: "bg-muted/50 text-muted-foreground border-border/60",
};

const classificationLabel: Record<string, string> = {
  underperforming: "Underperforming",
  low_exposure: "Low exposure",
  active_decline: "Active decline",
  mixed: "Mixed / watch",
};

function TrendBar({ trend, summary }: { trend: RankedWeakArea["trend"]; summary: string | null }) {
  const tone =
    trend === "worsening"
      ? "from-rose-500/80 to-rose-500/20"
      : trend === "improving"
        ? "from-emerald-500/80 to-emerald-500/20"
        : trend === "flat"
          ? "from-sky-500/60 to-sky-500/15"
          : "from-muted-foreground/40 to-muted/20";
  return (
    <div className="mt-3 space-y-1">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${tone}`} />
      <p className="text-xs text-muted-foreground">{summary ?? "Trend unavailable for this signal."}</p>
    </div>
  );
}

function WeakCard({ item, rank }: { item: RankedWeakArea; rank: number }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tabular-nums text-muted-foreground">#{rank}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityStyles[item.severity]}`}
            >
              {item.severity}
            </span>
            <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {classificationLabel[item.classification] ?? item.classification}
            </span>
          </div>
          <h3 className="mt-2 break-words text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
            {item.title}
          </h3>
          {item.subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle}</p> : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Weak score</p>
          <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{item.score.toFixed(1)}</p>
          <p className="text-[10px] text-muted-foreground">0–100 · higher = weaker</p>
        </div>
      </div>
      <TrendBar trend={item.trend} summary={item.trendSummary} />
      <ul className="mt-3 flex flex-wrap gap-2">
        {item.signals.map((s) => (
          <li
            key={s.label}
            className="rounded-lg border border-border/50 bg-background/60 px-2.5 py-1 text-xs text-foreground/90"
          >
            <span className="text-muted-foreground">{s.label}:</span>{" "}
            <span className="font-semibold tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-3 space-y-1.5 border-t border-border/40 pt-3 text-sm leading-relaxed text-muted-foreground">
        {item.reasons.map((r, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" aria-hidden />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function AdminWeakAreasView({ data }: { data: AdminWeakAreasData }) {
  const q = data.query;

  return (
    <div className="space-y-12">
      <form
        method="get"
        className="grid gap-4 rounded-2xl border border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-primary/[0.03] p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        <label className="text-xs font-semibold text-muted-foreground">
          From
          <input
            type="date"
            name="from"
            defaultValue={q.fromDay}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          To
          <input
            type="date"
            name="to"
            defaultValue={q.toDay}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Pathway (lesson slice)
          <select
            name="pathway"
            defaultValue={q.pathwayId ?? "all"}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">All pathways</option>
            {data.pathwayOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Country
          <select
            name="country"
            defaultValue={q.country ?? "all"}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="US">US</option>
            <option value="CA">CA</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Subscription
          <select
            name="sub"
            defaultValue={q.subscriptionFilter}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">All learners</option>
            <option value="paying">Paying (active sub)</option>
            <option value="trial_active">Trial (no active sub)</option>
            <option value="free_no_sub">Free (no trial, no sub)</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Accounts
          <select
            name="recency"
            defaultValue={q.recencyFilter}
            className="mt-1 block w-full min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="new_accounts">New in window</option>
            <option value="returning_accounts">Returning (created before window)</option>
          </select>
        </label>
        <div className="flex items-end xl:col-span-6">
          <button
            type="submit"
            className="min-h-[42px] w-full rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm md:w-auto"
          >
            Apply filters
          </button>
        </div>
      </form>

      {data.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-50">
          <p className="font-semibold">Partial data</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {data.warnings.slice(0, 8).map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cohort learners</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {data.cohortLearnerCount != null ? data.cohortLearnerCount.toLocaleString() : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Users matching filters (role = learner).</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Practice abandon</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {data.practiceSlice.abandonRatePct != null ? `${data.practiceSlice.abandonRatePct}%` : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.practiceSlice.abandoned} abandoned / {data.practiceSlice.started} started (cohort window).
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm sm:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Active filters</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs text-foreground/90">
            {data.filterSummary.map((line, i) => (
              <li key={i} className="rounded-lg bg-muted/40 px-2 py-1 font-medium">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-[var(--theme-heading-text)]">Scoring model (transparent)</p>
        <p className="mt-2">{data.scoringNote}</p>
        <p className="mt-2">
          Weights and normalizers live in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">src/lib/admin/weak-areas-scoring.ts</code>. Each card
          shows <strong>classification</strong> (underperforming vs low exposure vs decline) so low-traffic items are not
          misread as “avoided.”
        </p>
        <p className="mt-2">
          Compare window: <span className="font-mono">{q.prevFromDay}</span> → <span className="font-mono">{q.prevToDay}</span>{" "}
          (same length as current).{" "}
          <Link href="/admin/analytics/product-intelligence" className="font-semibold text-primary underline">
            Product intelligence
          </Link>{" "}
          for narrative insights.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm font-semibold">
        <a href="#weak-pages" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-primary shadow-sm">
          Weak surfaces
        </a>
        <a href="#weak-features" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-primary shadow-sm">
          Learner features
        </a>
        <a href="#weak-lessons" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-primary shadow-sm">
          Lessons
        </a>
        <a href="#weak-topics" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-primary shadow-sm">
          Questions & confusion
        </a>
        <a href="#weak-conversion" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-primary shadow-sm">
          Conversion URLs
        </a>
      </nav>

      <Section
        id="weak-pages"
        title="Weak or noisy surfaces (feedback)"
        subtitle="Ranked by friction density and report-volume trend vs the prior window. Authenticated cohort only — anonymous reports are excluded when any cohort filter is applied."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {data.rankedUnpopularPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No feedback in this cohort/window.</p>
          ) : (
            data.rankedUnpopularPages.map((item, i) => <WeakCard key={item.id} item={item} rank={i + 1} />)
          )}
        </div>
      </Section>

      <Section
        id="weak-features"
        title="Weak learner features (PostHog sections)"
        subtitle="Authenticated `app_section_view` volume vs prior window and cohort median. Low counts are labeled low-exposure, not avoidance."
      >
        {data.rankedWeakLearnerFeatures.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            PostHog not configured or no section events in range. Set POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.rankedWeakLearnerFeatures.map((item, i) => (
              <WeakCard key={item.id} item={item} rank={i + 1} />
            ))}
          </div>
        )}
      </Section>

      <Section
        id="weak-lessons"
        title="Weak lesson experiences"
        subtitle="Progress in-window: completion, never-engaged proxy, revisit proxy, vs prior window. Pathway filter applies to lesson content, not learner goal."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {data.rankedWeakLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lesson progress for this cohort/window.</p>
          ) : (
            data.rankedWeakLessons.map((item, i) => <WeakCard key={item.id} item={item} rank={i + 1} />)
          )}
        </div>
      </Section>

      <Section
        id="weak-topics"
        title="Confusing question routes & weak topics"
        subtitle="Routes: windowed confusing-question reports with trend. Topics: cumulative bank accuracy for the cohort (not window-differenced) plus wrong-streak pain."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {data.rankedConfusingQuestionAreas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topic or confusion-route rows for this cohort.</p>
          ) : (
            data.rankedConfusingQuestionAreas.map((item, i) => <WeakCard key={item.id} item={item} rank={i + 1} />)
          )}
        </div>
      </Section>

      <Section
        id="weak-conversion"
        title="Weak conversion pages (PostHog)"
        subtitle="URLs matching pricing / subscribe / checkout / upgrade patterns. Score blends traffic decline with a global checkout-start gap vs summed UV (directional)."
      >
        {data.rankedWeakConversionPages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No qualifying PostHog traffic or PostHog not configured.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.rankedWeakConversionPages.map((item, i) => (
              <WeakCard key={item.id} item={item} rank={i + 1} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
