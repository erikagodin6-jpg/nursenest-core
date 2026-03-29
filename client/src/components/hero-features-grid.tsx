import { Link } from "wouter";
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

import { useI18n } from "@/lib/i18n";
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

const FEATURE_COLORS: Record<string, { color: string; bg: string; gradient: string }> = {
  adaptiveTesting: { color: "text-blue-600", bg: "bg-blue-50", gradient: "from-blue-500 to-indigo-600" },
  explanationEngine: { color: "text-emerald-600", bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-600" },
  studyGuides: { color: "text-violet-600", bg: "bg-violet-50", gradient: "from-violet-500 to-purple-600" },
  flashcards: { color: "text-amber-600", bg: "bg-amber-50", gradient: "from-amber-500 to-orange-600" },
  readinessPredictor: { color: "text-indigo-600", bg: "bg-indigo-50", gradient: "from-indigo-500 to-blue-600" },
  aiTutor: { color: "text-purple-600", bg: "bg-purple-50", gradient: "from-purple-500 to-violet-600" },
  clinicalSimulator: { color: "text-rose-600", bg: "bg-rose-50", gradient: "from-rose-500 to-red-600" },
  globalQuestionBanks: { color: "text-teal-600", bg: "bg-teal-50", gradient: "from-teal-500 to-cyan-600" },
  multiLanguage: { color: "text-sky-600", bg: "bg-sky-50", gradient: "from-sky-500 to-blue-600" },
  mockExams: { color: "text-orange-600", bg: "bg-orange-50", gradient: "from-orange-500 to-amber-600" },
};

export default function HeroFeaturesGrid() {
  const { t } = useI18n();
  return (
    <section
      className="bg-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-features-grid"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-features-grid-heading"
          >
            Every Tool You Need to Pass
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            NurseNest combines adaptive testing, clinical reasoning, and smart study tools into one comprehensive platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORM_FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.key] || Globe;
            const colors = FEATURE_COLORS[feature.key] || { color: "text-gray-600", bg: "bg-gray-50", gradient: "from-gray-500 to-gray-600" };

            return (
              <Link
                key={feature.key}
                href={feature.route}
                className="group bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 no-underline"
                data-testid={`card-feature-${feature.key}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.headline}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{feature.description}</p>
                <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t("components.heroFeaturesGrid.learnMore")}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
