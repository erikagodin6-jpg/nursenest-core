import { Brain, RefreshCw, Stethoscope, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const features = [
  { icon: Brain, labelKey: "hero.featureStrip.activeRecall", fallback: "Active Recall Learning", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: RefreshCw, labelKey: "hero.featureStrip.spacedRepetition", fallback: "Spaced Repetition", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Stethoscope, labelKey: "hero.featureStrip.clinicalDecision", fallback: "Clinical Decision Training", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Target, labelKey: "hero.featureStrip.examBlueprint", fallback: "Exam Blueprint Alignment", color: "text-amber-600", bg: "bg-amber-50" },
];

export default function HeroFeatureStrip() {
  const { t } = useI18n();

  return (
    <section
      className="border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-4 sm:py-5"
      data-testid="section-hero-feature-strip"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center shrink-0`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
