import { BookOpen, ClipboardList, Activity, Sparkles } from "lucide-react";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import type { PremiumEmptyTone } from "@/components/ui/premium-empty-state";

/**
 * Pathway / CAT / question empty catalog — delegates to {@link PremiumEmptyState}.
 */

type ContentVariant = "lessons" | "questions" | "cat" | "generic";

type CtaItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

type ContentEmptyStateProps = {
  variant?: ContentVariant;
  headline?: string;
  body?: string;
  hint?: string;
  primaryCta: CtaItem;
  secondaryCtas?: CtaItem[];
  showGrowthBadge?: boolean;
  tone?: PremiumEmptyTone;
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

export function ContentEmptyState({
  variant = "generic",
  headline,
  body,
  hint,
  primaryCta,
  secondaryCtas = [],
  showGrowthBadge,
  tone = "growth",
}: ContentEmptyStateProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const displayHeadline = headline ?? defaults.headline;
  const displayBody = body ?? defaults.body;
  const displayBadge = showGrowthBadge ?? defaults.showGrowthBadge;
  const Icon = defaults.Icon;

  return (
    <PremiumEmptyState
      data-nn-empty={variant}
      tone={tone}
      className="mt-8"
      visualLayout="split"
      Icon={Icon}
      badge={displayBadge ? "Adding daily" : undefined}
      headline={displayHeadline}
      body={displayBody}
      hint={hint}
      label={displayHeadline}
      primaryCta={{ ...primaryCta, variant: primaryCta.variant ?? "primary" }}
      secondaryCtas={secondaryCtas.map((c) => ({ ...c, variant: c.variant ?? "secondary" }))}
      primaryShowArrow
    />
  );
}
