import Link from "next/link";
import { BookOpen, Cpu, LineChart } from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

/**
 * Premium positioning: integrated prep (lessons + bank + analytics), adaptive practice, readiness insight.
 * Dashboard-only; copy is i18n-driven.
 */
export function LearnerDashboardAdvantageStrip({ t }: { t: LearnerMarketingT }) {
  const cards = [
    {
      icon: BookOpen,
      title: t("learner.adv.strip.card1.title"),
      body: t("learner.adv.strip.card1.body"),
      href: "/app/lessons",
      cta: t("learner.adv.strip.card1.cta"),
    },
    {
      icon: Cpu,
      title: t("learner.adv.strip.card2.title"),
      body: t("learner.adv.strip.card2.body"),
      href: "/app/practice-tests",
      cta: t("learner.adv.strip.card2.cta"),
    },
    {
      icon: LineChart,
      title: t("learner.adv.strip.card3.title"),
      body: t("learner.adv.strip.card3.body"),
      href: "/app/account/readiness",
      cta: t("learner.adv.strip.card3.cta"),
    },
  ] as const;

  return (
    <section
      className="grid gap-3 sm:grid-cols-3"
      aria-label={t("learner.adv.strip.aria")}
    >
      {cards.map(({ icon: Icon, title, body, href, cta }) => (
        <div
          key={href}
          className="flex flex-col rounded-2xl border border-border/60 bg-[var(--bg-card)] p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04]"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold leading-snug text-[var(--theme-heading-text)]">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </div>
          <Link
            href={href}
            className="mt-3 inline-flex text-xs font-semibold text-primary underline-offset-2 hover:underline"
          >
            {cta}
          </Link>
        </div>
      ))}
    </section>
  );
}
