"use client";

import { ArrowRight, BookOpen, Brain, ClipboardCheck, Layers3 } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const FLOW_STEPS = [
  {
    key: "read",
    label: "Read",
    title: "Lessons",
    body: "Build the concept map with concise clinical teaching and exam-focused examples.",
    icon: BookOpen,
    hrefKey: "lessons",
    tone: "brand",
  },
  {
    key: "recall",
    label: "Recall",
    title: "Flashcards",
    body: "Rehearse high-yield facts, medication holds, precautions, and priority frameworks.",
    icon: Layers3,
    hrefKey: "flashcards",
    tone: "accent",
  },
  {
    key: "practice",
    label: "Practice",
    title: "Questions",
    body: "Apply judgment to NGN-style prompts, rationales, and clinical distractors.",
    icon: Brain,
    hrefKey: "questionBank",
    tone: "info",
  },
  {
    key: "assess",
    label: "Assess",
    title: "CAT readiness",
    body: "Use adaptive exams to check pacing, stamina, and topic-level readiness.",
    icon: ClipboardCheck,
    hrefKey: "practiceExams",
    tone: "success",
  },
] as const;

export function PremiumStudyEcosystem() {
  const { hrefs, region } = usePremiumHomepageRoutes();
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--ecosystem nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-study-ecosystem-heading"
      data-testid="section-premium-study-ecosystem"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {tr("pages.home.premium.studyEcosystem.eyebrow", "Study ecosystem")}
          </p>
          <h2 id="premium-study-ecosystem-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {tr("pages.home.premium.studyEcosystem.heading", "Read, recall, practice, assess — one loop.")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {tr(
              "pages.home.premium.studyEcosystem.body",
              "The public homepage keeps the same study destinations while presenting them as a single clinical workflow.",
            )}
          </p>
        </div>

        <div className="nn-premium-flow mt-10 grid gap-4 md:grid-cols-4">
          {FLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            const href = hrefs[step.hrefKey];
            return (
              <MarketingTrackedLink
                key={step.title}
                href={href}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ surface: "premium_study_ecosystem", step: step.title, region }}
                className="nn-premium-flow-card group min-w-0 rounded-2xl border p-5"
                data-testid={`premium-study-flow-${step.label.toLowerCase()}`}
                style={{ ["--premium-flow-accent" as string]: `var(--nn-premium-tone-${step.tone})` }}
              >
                <span className="nn-premium-flow-card__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="nn-premium-flow-card__icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="nn-marketing-caption mt-5 block font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                  {tr(`pages.home.premium.studyEcosystem.steps.${step.key}.label`, step.label)}
                </span>
                <span className="mt-1 block text-lg font-black text-[var(--palette-heading)]">
                  {tr(`pages.home.premium.studyEcosystem.steps.${step.key}.title`, step.title)}
                </span>
                <span className="nn-marketing-body-sm mt-3 block text-pretty text-[var(--palette-text-muted)]">
                  {tr(`pages.home.premium.studyEcosystem.steps.${step.key}.body`, step.body)}
                </span>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-[var(--premium-flow-accent)]">
                  {tr(`pages.home.premium.studyEcosystem.steps.${step.key}.cta`, `Open ${step.title}`)}
                  <ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </MarketingTrackedLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
