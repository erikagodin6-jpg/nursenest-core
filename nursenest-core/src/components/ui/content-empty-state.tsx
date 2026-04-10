import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Activity, Sparkles } from "lucide-react";

/**
 * Reusable empty-state block for lessons, questions, and CAT surfaces.
 *
 * Design goals:
 * - Never looks broken — feels like a product that is actively growing.
 * - Always includes at least one conversion CTA so the user has somewhere to go.
 * - Maintains the full column height of its sibling content blocks.
 * - Uses semantic color tokens so it adapts across themes.
 */

type ContentVariant = "lessons" | "questions" | "cat" | "generic";

type CtaItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

type ContentEmptyStateProps = {
  variant?: ContentVariant;
  /** Override the default headline for this variant. */
  headline?: string;
  /** Override the default sub-copy. */
  body?: string;
  /** Primary CTA — shown as a filled pill. */
  primaryCta: CtaItem;
  /** Optional additional CTAs — shown as outlined pills. */
  secondaryCtas?: CtaItem[];
  /** When true, shows the "adding daily" notice badge. Default true for lessons/questions. */
  showGrowthBadge?: boolean;
};

const VARIANT_DEFAULTS: Record<
  ContentVariant,
  { headline: string; body: string; showGrowthBadge: boolean; Icon: typeof BookOpen }
> = {
  lessons: {
    headline: "Lessons are being added for this pathway",
    body: "Our content team publishes new structured lessons continuously. While you wait, you can practise with pathway-scoped questions and run CAT sessions — they use the exact same exam scope.",
    showGrowthBadge: true,
    Icon: BookOpen,
  },
  questions: {
    headline: "More questions are being added daily",
    body: "Questions for this pathway are published on a rolling schedule. Start with the topics already available — your progress and weak-area signals are saved as new items land.",
    showGrowthBadge: true,
    Icon: ClipboardList,
  },
  cat: {
    headline: "CAT sessions aren't available yet for this pathway",
    body: "Adaptive practice requires a minimum pool of eligible questions. We're actively growing the bank — in the meantime, use the question bank to study at your own pace.",
    showGrowthBadge: false,
    Icon: Activity,
  },
  generic: {
    headline: "Content is on its way",
    body: "This section is actively being built. Use the links below to find study resources available right now.",
    showGrowthBadge: true,
    Icon: Sparkles,
  },
};

function ctaClass(v: CtaItem["variant"] = "secondary"): string {
  switch (v) {
    case "primary":
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 active:opacity-90";
    case "ghost":
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5";
    default:
      return "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--theme-primary)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-card-bg))] px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--theme-card-bg))]";
  }
}

export function ContentEmptyState({
  variant = "generic",
  headline,
  body,
  primaryCta,
  secondaryCtas = [],
  showGrowthBadge,
}: ContentEmptyStateProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const displayHeadline = headline ?? defaults.headline;
  const displayBody = body ?? defaults.body;
  const displayBadge = showGrowthBadge ?? defaults.showGrowthBadge;
  const Icon = defaults.Icon;

  return (
    <div
      className="nn-study-card nn-study-card--wash mt-8 p-6 sm:p-8"
      data-nn-content-empty-state={variant}
      role="status"
      aria-label={displayHeadline}
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--theme-page-bg))] text-[var(--theme-primary)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          {displayBadge ? (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_90%,var(--semantic-text-primary))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--semantic-info)]" aria-hidden />
              Adding daily
            </span>
          ) : null}
          <h2 className="text-base font-bold leading-snug text-[var(--theme-heading-text)]">{displayHeadline}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--theme-muted-text)]">{displayBody}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={primaryCta.href} className={ctaClass("primary")}>
          {primaryCta.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {secondaryCtas.map((cta) => (
          <Link key={cta.href} href={cta.href} className={ctaClass(cta.variant ?? "secondary")}>
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
