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
      className="nn-card nn-card-interactive rounded-xl border border-border/70 bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 ease-out sm:p-6"
      aria-labelledby="continue-learning-heading"
    >
      <h2 id="continue-learning-heading" className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)]">
        {t("learner.retention.continueStudyingHeading")}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("learner.retention.continueSub")}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium text-primary shadow-sm transition-[transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-md [overflow-wrap:anywhere]"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
