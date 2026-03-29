"use client";

import { Brain, RefreshCw, Stethoscope, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const features = [
  { icon: Brain, labelKey: "hero.featureStrip.activeRecall", fallback: "Active Recall Learning" },
  { icon: RefreshCw, labelKey: "hero.featureStrip.spacedRepetition", fallback: "Spaced Repetition" },
  { icon: Stethoscope, labelKey: "hero.featureStrip.clinicalDecision", fallback: "Clinical Decision Training" },
  { icon: Target, labelKey: "hero.featureStrip.examBlueprint", fallback: "Exam Blueprint Alignment" },
];

/** Restored from `client/src/components/hero-feature-strip.tsx` */
export default function HeroFeatureStrip() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-4 sm:py-5"
      data-testid="section-hero-feature-strip"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-8">
          {features.map((f) => {
            const translated = t(f.labelKey);
            const label = translated === f.labelKey ? f.fallback : translated;
            return (
              <div
                key={f.labelKey}
                className="flex items-center gap-2"
                data-testid={`feature-strip-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="nn-accent-icon-wrap h-8 w-8 shrink-0">
                  <f.icon className="nn-accent-icon h-4 w-4" />
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-gray-700 sm:text-sm">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
