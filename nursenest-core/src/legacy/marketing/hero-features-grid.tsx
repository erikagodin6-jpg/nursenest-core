"use client";

import Link from "next/link";
import { PLATFORM_FEATURES } from "@shared/platform-manifest";
import {
  Zap,
  MessageSquareText,
  BookOpen,
  Brain,
  BarChart3,
  GraduationCap,
  Stethoscope,
  Globe,
  Languages,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  adaptiveTesting: Zap,
  explanationEngine: MessageSquareText,
  studyGuides: BookOpen,
  flashcards: Brain,
  readinessPredictor: BarChart3,
  aiTutor: GraduationCap,
  clinicalSimulator: Stethoscope,
  globalQuestionBanks: Globe,
  multiLanguage: Languages,
  mockExams: ClipboardCheck,
};

export default function HeroFeaturesGrid() {
  const { t } = useMarketingI18n();
  return (
    <section
      className="bg-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-features-grid"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-features-grid-heading">
            Every Tool You Need to Pass
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 lg:text-lg">
            NurseNest combines adaptive testing, clinical reasoning, and smart study tools into one comprehensive platform.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.key] || Globe;

            return (
              <Link
                key={feature.key}
                href={mapLegacyMarketingHref(feature.route)}
                className="group no-underline rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                data-testid={`card-feature-${feature.key}`}
              >
                <div className="nn-theme-gradient-br mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 text-[var(--theme-primary-foreground)]" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[var(--theme-heading-text)]">{feature.headline}</h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-500">{feature.description}</p>
                <div className="flex items-center text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <span>{t("components.heroFeaturesGrid.learnMore")}</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
