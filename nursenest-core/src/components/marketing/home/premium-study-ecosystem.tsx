"use client";

import { ArrowRight, BookOpen, Brain, ClipboardCheck, RefreshCw, SearchCheck } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

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
    key: "practice",
    label: "Practice",
    title: "Questions",
    body: "Practice who to see first, what to escalate, and which delegation choices are safe under pressure.",
    icon: Brain,
    hrefKey: "questionBank",
    tone: "info",
  },
  {
    key: "detectWeakness",
    label: "Detect Weakness",
    title: "Readiness Signals",
    body: "Use recent results, domain trends, and weak-area routing to see what is slipping before exam day.",
    icon: SearchCheck,
    hrefKey: "dashboard",
    tone: "warning",
  },
  {
    key: "remediate",
    label: "Remediate",
    title: "Flashcards and Focused Review",
    body: "Go straight into weak topics with recall drills, medication holds, precautions, and targeted refreshers.",
    icon: ClipboardCheck,
    hrefKey: "flashcards",
    tone: "accent",
  },
  {
    key: "reassess",
    label: "Reassess",
    title: "CAT Readiness",
    body: "Return to adaptive practice to confirm the fix, rebuild confidence, and decide what to study next.",
    icon: RefreshCw,
    hrefKey: "practiceExams",
    tone: "success",
  },
] as const;

export function PremiumStudyEcosystem() {
  const { hrefs, region } = usePremiumHomepageRoutes();
  const { t, locale } = useMarketingI18n();
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
            {formatTitleCase(tr("pages.home.premium.studyEcosystem.eyebrow", "Adaptive Loop"), locale)}
          </p>
          <h2 id="premium-study-ecosystem-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {formatTitleCase(
              tr(
                "pages.home.premium.studyEcosystem.heading",
                "Read → Practice → Detect Weakness → Remediate → Reassess",
              ),
              locale,
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              tr(
                "pages.home.premium.studyEcosystem.body",
                "The same public study destinations now read as one adaptive clinical workflow instead of a disconnected feature list.",
              ),
              locale,
            )}
          </p>
        </div>

        <div className="nn-premium-flow mx-auto mt-8 grid max-w-7xl justify-center gap-4 md:grid-cols-2 xl:grid-cols-5">
          {FLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            const href = hrefs[step.hrefKey];
            return (
              <MarketingTrackedLink
                key={step.title}
                href={href}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ surface: "premium_study_ecosystem", step: step.title, region }}
                className="nn-premium-flow-card group flex h-full min-w-0 flex-col rounded-2xl border p-5"
                data-testid={`premium-study-flow-${step.key}`}
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
                <span className="nn-premium-flow-card__cta mt-5 inline-flex items-center justify-center text-sm font-bold text-[var(--premium-flow-accent)]">
                  {formatTitleCase("Start", locale)}
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
