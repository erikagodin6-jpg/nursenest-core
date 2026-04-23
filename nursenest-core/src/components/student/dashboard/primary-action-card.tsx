"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Target, Layers, Brain, Play } from "lucide-react";
import type { NextBestAction } from "@/lib/learner/next-best-action";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-t";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";

function displayNextAction(action: NextBestAction, t: LearnerMarketingT): {
  title: string;
  subtitle: string;
  reasoning: string;
} {
  const i18n = action.i18n;
  if (!i18n) {
    return { title: action.title, subtitle: action.subtitle, reasoning: action.reasoning };
  }
  const params = i18n.params;
  return {
    title: t(i18n.titleKey, params),
    subtitle: t(i18n.subtitleKey, params),
    reasoning: t(i18n.reasoningKey, params),
  };
}

const KIND_ICONS: Record<string, ReactNode> = {
  lesson: <BookOpen className="h-6 w-6" />,
  quiz: <Target className="h-6 w-6" />,
  mock: <Layers className="h-6 w-6" />,
  cat: <Layers className="h-6 w-6" />,
  review: <Brain className="h-6 w-6" />,
  continue: <Play className="h-6 w-6" />,
  flashcards: <Layers className="h-6 w-6" />,
  fallback: <Play className="h-6 w-6" />,
};

/**
 * PrimaryActionCard — the dominant CTA on the dashboard.
 *
 * Always renders. Shows the next-best-action from the insight engine
 * with a clear, actionable title and dynamic subtitle.
 */
export function PrimaryActionCard({
  action,
  t,
}: {
  action: NextBestAction;
  t: LearnerMarketingT;
}) {
  const { title, subtitle, reasoning } = displayNextAction(action, t);
  return (
    <Link
      href={action.href}
      className="nn-primary-action-card group"
      onClick={() => {
        trackProductEvent(PH.conversionCtaClick, {
          surface: "dashboard_primary_next_action",
          contextual_variant: action.kind,
          href_kind: action.href.startsWith("/app/") ? "app" : "other",
        });
      }}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="nn-primary-action-card__icon">
          {KIND_ICONS[action.kind] ?? <Play className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="nn-primary-action-card__title">
            {title}
          </h2>
          <p className="nn-primary-action-card__subtitle">
            {subtitle}
          </p>
          <p className="nn-primary-action-card__reasoning">
            {reasoning}
          </p>
        </div>
        <div className="nn-primary-action-card__arrow">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
