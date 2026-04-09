import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

const LINKS: { href: string; labelKey: string }[] = [
  { href: "/app/account/report-card", labelKey: "learner.account.nav.reportCard" },
  { href: "/app/account/readiness", labelKey: "learner.account.nav.readiness" },
  { href: "/app/account/progress", labelKey: "learner.account.nav.progress" },
  { href: "/app/account/question-bank-performance", labelKey: "learner.account.nav.questionBankPerf" },
  { href: "/app/account/focus-areas", labelKey: "learner.account.nav.focusAreas" },
  { href: "/app/account/study-history", labelKey: "learner.account.nav.studyHistory" },
  { href: "/app/account/cat-history", labelKey: "learner.account.nav.catHistory" },
  { href: "/app/account/review-queue", labelKey: "learner.account.nav.reviewQueue" },
  { href: "/app/account/billing", labelKey: "learner.account.nav.billing" },
  { href: "/app/account/personal", labelKey: "learner.account.nav.personal" },
  { href: "/app/account/study-preferences", labelKey: "learner.account.nav.settingsHub" },
];

export function LearnerAccountToolGrid({ t }: { t: LearnerMarketingT }) {
  return (
    <section className="nn-card p-6" aria-labelledby="account-tool-grid-heading">
      <h2 id="account-tool-grid-heading" className="text-lg font-bold text-[var(--theme-heading-text)]">
        {t("learner.account.toolsGrid.title")}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.toolsGrid.subtitle")}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex rounded-full border border-border/80 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.06]"
            >
              {t(l.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
