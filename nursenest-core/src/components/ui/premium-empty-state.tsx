import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type PremiumEmptyCtaVariant = "primary" | "secondary" | "ghost";

export type PremiumEmptyCta = {
  label: string;
  href: string;
  variant?: PremiumEmptyCtaVariant;
};

export type PremiumEmptyTone = "default" | "growth" | "locked" | "early";

function toneCardClass(tone: PremiumEmptyTone): string {
  switch (tone) {
    case "locked":
      return "border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,var(--semantic-panel-muted)_0%,var(--semantic-surface)_45%,color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))_100%)]";
    case "early":
      return "border-[var(--semantic-border-soft)] bg-[linear-gradient(135deg,var(--semantic-panel-positive)_0%,var(--semantic-surface)_50%,var(--semantic-panel-cool)_100%)]";
    case "growth":
      return "border-[var(--semantic-border-soft)] bg-[linear-gradient(135deg,var(--semantic-panel-muted)_0%,var(--semantic-surface)_40%,var(--semantic-panel-warm)_100%)]";
    default:
      return "border-[var(--semantic-border-soft)] bg-[linear-gradient(135deg,var(--semantic-panel-muted)_0%,var(--semantic-surface)_42%,var(--semantic-panel-positive)_100%)]";
  }
}

function ctaClass(v: PremiumEmptyCtaVariant = "secondary"): string {
  switch (v) {
    case "primary":
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition motion-safe:duration-200 hover:opacity-95 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--semantic-surface)]";
    case "ghost":
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]";
    default:
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] px-5 py-2.5 text-sm font-semibold text-primary transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]";
  }
}

export type PremiumEmptyStateProps = {
  /** Analytics / QA hook */
  "data-nn-empty"?: string;
  tone?: PremiumEmptyTone;
  headline: string;
  body: string;
  /** Screen-reader-friendly region label; defaults to headline */
  label?: string;
  hint?: string;
  primaryCta: PremiumEmptyCta;
  secondaryCtas?: PremiumEmptyCta[];
  /** Optional growth / status chip */
  badge?: string;
  /** Lucide icon — decorative */
  Icon?: LucideIcon;
  /** `split` = icon left + text (lesson hub style); `stack` = centered */
  visualLayout?: "stack" | "split";
  /** Tighter padding when nested in dashboard cards */
  density?: "comfortable" | "compact";
  /** Primary CTA trailing arrow (lesson hub pattern) */
  primaryShowArrow?: boolean;
  className?: string;
};

/**
 * Shared premium empty-state shell: calm hierarchy, semantic surfaces, no “broken UI” feel.
 */
export function PremiumEmptyState({
  "data-nn-empty": dataNnEmpty,
  tone = "default",
  headline,
  body,
  label,
  hint,
  primaryCta,
  secondaryCtas = [],
  badge,
  Icon,
  visualLayout = "stack",
  density = "comfortable",
  primaryShowArrow = false,
  className = "",
}: PremiumEmptyStateProps) {
  const pad = density === "compact" ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const regionLabel = label ?? headline;
  const split = visualLayout === "split";

  const iconEl = Icon ? (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-page-bg))] text-[var(--semantic-brand)] ${split ? "mt-0.5" : "mx-auto mb-4 sm:mx-0"}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
    </span>
  ) : null;

  const textBlock = (
    <div className={`min-w-0 flex-1 ${split ? "" : "flex flex-col items-center text-center sm:items-start sm:text-left"}`}>
      {badge ? (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--semantic-info)]" aria-hidden />
          {badge}
        </span>
      ) : null}
      <h2 className="text-base font-bold leading-snug text-[var(--theme-heading-text)]">{headline}</h2>
      <p
        className={`mt-2 max-w-2xl text-sm leading-relaxed text-[var(--theme-muted-text)] ${split ? "" : "mx-auto sm:mx-0"}`}
      >
        {body}
      </p>
      {hint ? (
        <p className={`mt-2 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-secondary)] ${split ? "" : "mx-auto sm:mx-0"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );

  return (
    <section
      className={`nn-study-card nn-study-card--wash ${pad} ${toneCardClass(tone)} ${className}`.trim()}
      data-nn-premium-empty={dataNnEmpty ?? true}
      role="region"
      aria-label={regionLabel}
    >
      {split ? (
        <div className="flex items-start gap-4">
          {iconEl}
          {textBlock}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          {iconEl}
          {textBlock}
        </div>
      )}

      <div
        className={`mt-6 flex flex-wrap gap-3 ${split ? "justify-start" : "justify-center sm:justify-start"}`}
      >
        <Link href={primaryCta.href} className={ctaClass(primaryCta.variant ?? "primary")}>
          {primaryCta.label}
          {primaryShowArrow ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </Link>
        {secondaryCtas.map((cta) => (
          <Link key={`${cta.href}-${cta.label}`} href={cta.href} className={ctaClass(cta.variant ?? "secondary")}>
            {cta.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
