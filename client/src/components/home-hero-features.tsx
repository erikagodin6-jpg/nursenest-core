import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Globe,
  Languages,
  BookOpen,
  Stethoscope,
  FlaskConical,
  Droplets,
  GraduationCap,
  Brain,
  Target,
  HeartPulse,
  Baby,
  Pill,
  Activity,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function HomeHeroFeatures() {
  const { t } = useI18n();

  const platformCapabilities = [
    { icon: Languages, labelKey: "home.heroFeatures.multilingual", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: BookOpen, labelKey: "home.heroFeatures.examPrep", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Stethoscope, labelKey: "home.heroFeatures.clinicalScenarios", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Brain, labelKey: "home.heroFeatures.pathophysiology", color: "text-violet-600", bg: "bg-violet-50" },
    { icon: FlaskConical, labelKey: "home.heroFeatures.labValues", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Droplets, labelKey: "home.heroFeatures.bloodTransfusion", color: "text-rose-600", bg: "bg-rose-50" },
    { icon: GraduationCap, labelKey: "home.heroFeatures.newGrad", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const trustItems = [
    { icon: ShieldCheck, labelKey: "home.heroFeatures.trustEvidence" },
    { icon: Target, labelKey: "home.heroFeatures.trustExamAligned" },
    { icon: Brain, labelKey: "home.heroFeatures.trustClinicalReasoning" },
    { icon: Activity, labelKey: "home.heroFeatures.trustRetention" },
  ];

  const learningAreas = [
    { icon: Target, labelKey: "home.heroFeatures.areaPracticeQuestions", href: "/exam-prep", color: "from-blue-500 to-indigo-600" },
    { icon: Brain, labelKey: "home.heroFeatures.areaClinicalReasoning", href: "/lessons", color: "from-violet-500 to-purple-600" },
    { icon: FlaskConical, labelKey: "home.heroFeatures.areaLabInterpretation", href: "/lessons", color: "from-amber-500 to-orange-600" },
    { icon: HeartPulse, labelKey: "home.heroFeatures.areaCriticalCare", href: "/nursing-specialties", color: "from-rose-500 to-red-600" },
    { icon: Baby, labelKey: "home.heroFeatures.areaPediatric", href: "/lessons", color: "from-pink-500 to-rose-600" },
    { icon: Pill, labelKey: "home.heroFeatures.areaPharmacology", href: "/flashcards", color: "from-emerald-500 to-teal-600" },
    { icon: Activity, labelKey: "home.heroFeatures.areaPrioritization", href: "/mock-exams", color: "from-indigo-500 to-blue-600" },
  ];

  return (
    <>
      <section
        className="border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white"
        style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
        data-testid="section-feature-highlight-bar"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {platformCapabilities.map((cap) => (
              <div
                key={cap.labelKey}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
                data-testid={`feature-pill-${cap.labelKey.split('.').pop()}`}
              >
                <div className={`w-7 h-7 rounded-lg ${cap.bg} flex items-center justify-center shrink-0`}>
                  <cap.icon className={`w-3.5 h-3.5 ${cap.color}`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t(cap.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-gradient-to-r from-primary/5 via-blue-50/50 to-primary/5 border-y border-primary/10"
        data-testid="section-multilingual-callout"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Globe className="w-4.5 h-4.5 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700" data-testid="text-multilingual-callout">
              {t("home.heroFeatures.multilingualCallout")}
            </p>
          </div>
        </div>
      </section>

      <section
        className="bg-white border-b border-gray-100"
        data-testid="section-trust-authority"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {trustItems.map((item) => (
              <div
                key={item.labelKey}
                className="flex items-center gap-2 text-sm text-gray-600"
                data-testid={`trust-item-${item.labelKey.split('.').pop()}`}
              >
                <item.icon className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span className="font-medium">{t(item.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-b border-gray-100"
        style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
        data-testid="section-learning-areas-grid"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2
              className="font-bold text-gray-900 mb-2"
              style={{ fontSize: 'var(--text-section)' }}
              data-testid="text-learning-areas-heading"
            >
              {t("home.heroFeatures.learningAreasHeading")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
              {t("home.heroFeatures.learningAreasSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {learningAreas.map((area) => (
              <Link
                key={area.labelKey}
                href={area.href}
                className="group bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-5 no-underline"
                data-testid={`card-learning-area-${area.labelKey.split('.').pop()}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <area.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{t(area.labelKey)}</h3>
                <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t("home.heroFeatures.explore")}</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
