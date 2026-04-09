import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { ContinueLearningLink } from "@/lib/learner/build-continue-learning-items";

export function LearnerContinueLearningCard({
  t,
  links,
}: {
  t: LearnerMarketingT;
  links: ContinueLearningLink[];
}) {
  if (links.length === 0) return null;

  return (
    <section
      className="nn-card border border-border/70 bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] p-5 sm:p-6"
      aria-labelledby="continue-learning-heading"
    >
      <h2 id="continue-learning-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
        {t("learner.retention.continueHeading")}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("learner.retention.continueSub")}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-border/60 bg-card px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted/50 [overflow-wrap:anywhere]"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
