import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";

export type LearnerAccountCrossLinksVariant = "report-card" | "readiness" | "progress" | "billing" | "settings";

type ContinueLesson = { title: string; href: string };

function truncateTitle(title: string, max = 40): string {
  const s = title.trim();
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

export function LearnerAccountCrossLinks({
  variant,
  t,
  weakTopicKey,
  continueLesson,
}: {
  variant: LearnerAccountCrossLinksVariant;
  t: LearnerMarketingT;
  /** Normalized or display topic for remediation URLs */
  weakTopicKey?: string;
  continueLesson?: ContinueLesson | null;
}) {
  const links: { href: string; label: string }[] = [];

  switch (variant) {
    case "report-card": {
      if (weakTopicKey) {
        links.push({
          href: remediationTopicDrillHref(weakTopicKey),
          label: t("learner.account.crossLinks.reportCard.topicDrill"),
        });
        links.push({
          href: remediationWeakModeTestHref(weakTopicKey),
          label: t("learner.account.crossLinks.reportCard.weakMode"),
        });
      } else {
        links.push({ href: "/app/questions", label: t("learner.account.crossLinks.reportCard.qbankFallback") });
        links.push({
          href: "/app/practice-tests?focus=weak",
          label: t("learner.account.crossLinks.reportCard.weakModeGeneric"),
        });
      }
      links.push({ href: "/app/lessons", label: t("learner.account.crossLinks.reportCard.lessons") });
      links.push({ href: "/app/account/readiness", label: t("learner.account.crossLinks.reportCard.readiness") });
      break;
    }
    case "readiness": {
      links.push({ href: "/app", label: t("learner.account.crossLinks.readiness.dashboard") });
      links.push({ href: "/app/study-plan", label: t("learner.account.crossLinks.readiness.planner") });
      links.push({ href: "/app/questions", label: t("learner.account.crossLinks.readiness.qbank") });
      links.push({ href: "/app/account/overview", label: t("learner.account.crossLinks.readiness.overview") });
      break;
    }
    case "progress": {
      if (continueLesson?.href) {
        links.push({
          href: continueLesson.href,
          label: t("learner.account.crossLinks.progress.continueNamed", { title: truncateTitle(continueLesson.title) }),
        });
      } else {
        links.push({ href: "/app/lessons", label: t("learner.account.crossLinks.progress.continueGeneric") });
      }
      links.push({ href: "/app/questions", label: t("learner.account.crossLinks.progress.qbank") });
      links.push({ href: "/app/lessons", label: t("learner.account.crossLinks.progress.lessons") });
      links.push({ href: "/app/account/report-card", label: t("learner.account.crossLinks.progress.reportCard") });
      break;
    }
    case "billing": {
      links.push({ href: "/pricing", label: t("learner.account.crossLinks.billing.plans") });
      links.push({
        href: "/app/account/billing#account-billing-manage",
        label: t("learner.account.crossLinks.billing.manage"),
      });
      links.push({ href: "/app/account/overview", label: t("learner.account.crossLinks.billing.overview") });
      links.push({ href: "/app", label: t("learner.account.crossLinks.billing.dashboard") });
      break;
    }
    case "settings": {
      links.push({ href: "/app", label: t("learner.account.crossLinks.settings.dashboard") });
      links.push({ href: "/app/account/overview", label: t("learner.account.crossLinks.settings.overview") });
      links.push({ href: "/app/account/billing", label: t("learner.account.crossLinks.settings.billing") });
      break;
    }
  }

  return (
    <section className="nn-card border-dashed border-primary/20 bg-muted/5 p-5" aria-labelledby="account-cross-links-heading">
      <h2 id="account-cross-links-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
        {t("learner.account.crossLinks.title")}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{t(`learner.account.crossLinks.${variant}.lead`)}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={`${l.href}|${l.label}`}>
            <Link
              href={l.href}
              className="inline-flex rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
