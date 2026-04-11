import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, Zap, Target, TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// StatChip
// ---------------------------------------------------------------------------

function StatChip({ icon: Icon, label }: { icon: typeof Zap; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]">
      <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CatHeroSection
// ---------------------------------------------------------------------------

export type CatHeroPrimaryCta = { label: string; href: string };

type Props = {
  examLabel: string;
  primaryCta: CatHeroPrimaryCta | null;
  /** Pathway inventory strip rendered inside the hero after CTAs. */
  inventoryStrip?: ReactNode;
  backHref: string;
  backLabel: string;
};

export function CatHeroSection({ examLabel, primaryCta, inventoryStrip, backHref, backLabel }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
      aria-labelledby="cat-hero-heading"
    >
      {/* Purple-brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        aria-hidden
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--semantic-brand) 11%, var(--semantic-surface)) 0%, var(--semantic-surface) 55%, color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface)) 100%)",
        }}
      />

      <div className="relative">
        {/* Back link */}
        <Link
          href={backHref}
          className="nn-marketing-caption inline-flex items-center gap-1 font-medium text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)] transition-colors"
        >
          ← {backLabel}
        </Link>

        {/* Mode label */}
        <div className="mt-3 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
          <span className="nn-marketing-label nn-marketing-label--accent">Adaptive Exam Mode</span>
        </div>

        <h1
          id="cat-hero-heading"
          className="nn-marketing-h1 mt-2 text-[var(--theme-heading-text)]"
        >
          Computer Adaptive Testing (CAT)
        </h1>

        <p className="mt-3 max-w-2xl text-lg font-medium text-[var(--theme-muted-text)]">
          Questions adapt to your performance — just like the real exam.
        </p>

        {/* Stat chips */}
        <div className="mt-5 flex flex-wrap gap-2" role="list" aria-label="Key features">
          <StatChip icon={Zap} label="Adapts in real time" />
          <StatChip icon={Target} label="Exam-level difficulty" />
          <StatChip icon={TrendingUp} label="Readiness scoring" />
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {primaryCta ? (
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full nn-btn-primary px-8 py-3 text-sm font-semibold"
            >
              {primaryCta.label}
            </Link>
          ) : (
            <span
              className="inline-flex min-h-[48px] cursor-default items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)] px-8 py-3 text-sm font-semibold text-[var(--semantic-text-muted)]"
              aria-disabled="true"
            >
              {examLabel} CAT unavailable
            </span>
          )}

          <a
            href="#cat-how-it-works"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full nn-btn-secondary px-8 py-3 text-sm font-semibold"
          >
            How CAT works
          </a>
        </div>

        {inventoryStrip ? <div className="mt-4">{inventoryStrip}</div> : null}
      </div>
    </section>
  );
}
