"use client";

/**
 * Static, lightweight “report” panels so the homepage shows real product shapes, not decorative mockups.
 */
export function HomeMarketingProductProof() {
  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="home-product-proof">
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-text)]">Session report</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">68%</p>
              <p className="text-xs text-[var(--theme-muted-text)]">Last 20 items · Pharmacology</p>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
              Needs review
            </span>
          </div>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4 border-t border-[var(--theme-card-border)] pt-2">
              <dt className="text-[var(--theme-muted-text)]">Priority risk</dt>
              <dd className="font-medium text-[var(--theme-heading-text)]">Cardiac monitoring</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--theme-muted-text)]">Trend</dt>
              <dd className="font-medium text-emerald-700 dark:text-emerald-300">+6% vs last set</dd>
            </div>
          </dl>
          <div className="mt-4 h-16 rounded-lg bg-[var(--theme-muted-surface)] p-2">
            <div className="flex h-full items-end gap-1">
              {[40, 52, 48, 61, 55, 68].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${h}%` }}
                  title={`Block ${i + 1}: ${h}%`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[var(--theme-muted-text)]">Bars are example score blocks, not live data.</p>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-text)]">Rationale</p>
          <p className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">After a wrong answer</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
            A strong rationale names the decision rule, cites the cue in the stem, and states why the distractors fail. You should see that pattern on every scored item, not a generic pep talk.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/80 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-text)]">Clinical stem</p>
          <p className="mt-2 text-sm italic leading-relaxed text-[var(--theme-body-text)]">
            “Adult post-op day 2 after bowel resection. BP 92/58, HR 112, urine 15 mL last hour. Next step?”
          </p>
          <p className="mt-3 text-xs text-[var(--theme-muted-text)]">This is where students often rush past volume status.</p>
        </div>
      </div>
    </div>
  );
}
