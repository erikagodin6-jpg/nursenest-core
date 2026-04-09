import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

/**
 * Topic strength key — success / warning / danger (strong · developing · needs focus).
 * Aligns dashboard color logic: not a single brand wash.
 */
export function MasteryLegend({ t, className = "" }: { t: LearnerMarketingT; className?: string }) {
  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-[var(--semantic-text-secondary)] ${className}`.trim()}
      role="list"
      aria-label={t("learner.product.mastery.legendAria")}
    >
      <span role="listitem" className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--semantic-success)]" aria-hidden />
        {t("learner.product.mastery.high")}
      </span>
      <span role="listitem" className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--semantic-warning)]" aria-hidden />
        {t("learner.product.mastery.mid")}
      </span>
      <span role="listitem" className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--semantic-danger)]" aria-hidden />
        {t("learner.product.mastery.low")}
      </span>
    </div>
  );
}
