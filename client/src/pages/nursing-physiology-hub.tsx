import { useEffect } from "react";
import { Link } from "wouter";
import { BookOpen, ArrowRight, Beaker, Heart, Brain, Activity, Stethoscope, GraduationCap } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const PHYSIOLOGY_TOPICS = [
  {
    slug: "why-burns-cause-hyperkalemia",
    title: "Why Burns Cause Hyperkalemia",
    description: "Explore how thermal injury releases intracellular potassium through cellular destruction, RAAS activation, and fluid shifts.",
    color: "#DC2626",
    icon: Activity,
  },
  {
    slug: "potassium-effects-on-cardiac-conduction",
    title: "Potassium Effects on Cardiac Conduction",
    description: "Understand how potassium levels affect resting membrane potential, action potentials, and ECG patterns in hypo/hyperkalemia.",
    color: "#7C3AED",
    icon: Heart,
  },
  {
    slug: "metabolic-acidosis-in-aki",
    title: "Metabolic Acidosis in AKI",
    description: "Learn why acute kidney injury impairs hydrogen ion excretion and bicarbonate regeneration, leading to metabolic acidosis.",
    color: "#EA580C",
    icon: Beaker,
  },
  {
    slug: "pyloric-stenosis-metabolic-alkalosis",
    title: "Pyloric Stenosis & Metabolic Alkalosis",
    description: "Discover the pathophysiology connecting projectile vomiting, HCl loss, and hypochloremic metabolic alkalosis in infants.",
    color: "#0891B2",
    icon: Stethoscope,
  },
  {
    slug: "qrs-complex-explained-for-nurses",
    title: "QRS Complex Explained for Nurses",
    description: "Master ventricular depolarization, bundle branch blocks, and the clinical significance of wide vs narrow QRS complexes.",
    color: "#059669",
    icon: Activity,
  },
  {
    slug: "hyperkalemia-effects-on-heart",
    title: "Hyperkalemia Effects on the Heart",
    description: "Review the cardiac consequences of elevated potassium including ECG changes, arrhythmia progression, and emergency treatment.",
    color: "#DC2626",
    icon: Heart,
  },
  {
    slug: "barrel-chest-copd",
    title: "Barrel Chest in COPD",
    description: "Understand the anatomical changes that create barrel chest in COPD and their impact on respiratory function and nursing assessment.",
    color: "#2563EB",
    icon: Brain,
  },
];

const RELATED_LAB_VALUES = [
  { slug: "potassium", label: "Potassium (K+)" },
  { slug: "sodium", label: "Sodium (Na+)" },
  { slug: "calcium", label: "Calcium (Ca2+)" },
  { slug: "bicarbonate", label: "Bicarbonate (HCO3-)" },
  { slug: "magnesium", label: "Magnesium (Mg2+)" },
];

const EXAM_TIERS = [
  { path: "/rpn/test-bank", label: "RPN Test Bank", tier: "RPN" },
  { path: "/rn/test-bank", label: "RN Test Bank", tier: "RN" },
  { path: "/np/test-bank", label: "NP Test Bank", tier: "NP" },
];

export default function NursingPhysiologyHub() {
  const { t } = useI18n();
  useEffect(() => {
    document.title = t("pages.nursing_physiology_hub.nursingPhysiologyExplainedClinicalPathop");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Explore nursing pathophysiology topics explained clearly for students. Burns and hyperkalemia, cardiac conduction, acid-base disorders, pyloric stenosis, and ECG interpretation.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8" data-testid="breadcrumb-nav">
          <Link href="/" className="hover:text-blue-600" data-testid="breadcrumb-home">{t("pages.nursingPhysiologyHub.home")}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{t("pages.nursingPhysiologyHub.nursingPhysiologyExplained")}</span>
        </nav>

        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>{t("pages.nursingPhysiologyHub.clinicalPathophysiology")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4" data-testid="page-title">
            Nursing Physiology Explained
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-testid="page-subtitle">
            Go beyond memorization. Understand the <em>{t("pages.nursingPhysiologyHub.why")}</em> behind clinical conditions, electrolyte imbalances, and cardiac conduction — the knowledge that makes you a safer, more confident nurse.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8" data-testid="topics-heading">
            Explore Pathophysiology Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHYSIOLOGY_TOPICS.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <Link
                  key={topic.slug}
                  href={`/${topic.slug}`}
                  className="group block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                  data-testid={`topic-card-${topic.slug}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: topic.color + "15", color: topic.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t("pages.nursingPhysiologyHub.readMore")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-16 bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" data-testid="lab-values-heading">
            Related Lab Values
          </h2>
          <p className="text-slate-600 mb-6">
            Deepen your understanding of the electrolytes and lab values connected to these pathophysiology topics.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {RELATED_LAB_VALUES.map((lab) => (
              <Link
                key={lab.slug}
                href={`/lab-values/${lab.slug}`}
                className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors"
                data-testid={`lab-link-${lab.slug}`}
              >
                <Beaker className="w-4 h-4 flex-shrink-0" />
                <span>{lab.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4" data-testid="exam-prep-heading">
            Prepare for Your Exam
          </h2>
          <p className="text-slate-600 mb-6">
            Apply your pathophysiology knowledge with practice questions tailored to your nursing certification level.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {EXAM_TIERS.map((tier) => (
              <Link
                key={tier.path}
                href={tier.path}
                className="flex items-center justify-between bg-white rounded-lg border border-slate-200 hover:border-blue-300 px-5 py-4 hover:shadow-md transition-all group"
                data-testid={`exam-link-${tier.tier.toLowerCase()}`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">{tier.tier}</div>
                    <div className="text-xs text-slate-500">{tier.label}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" data-testid="study-guides-heading">
            Comprehensive Study Guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { slug: "lab-values-complete-nursing-guide", title: "Lab Values for Nurses: Complete Reference" },
              { slug: "electrolytes-nursing-exam-guide", title: "Electrolytes for Nursing Exams" },
              { slug: "acid-base-disorders-nursing", title: "Acid-Base Disorders Explained" },
              { slug: "nursing-clinical-assessment-complete-guide", title: "Clinical Assessment Guide" },
            ].map((guide) => (
              <Link
                key={guide.slug}
                href={`/${guide.slug}`}
                className="flex items-center gap-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg px-5 py-4 transition-colors group"
                data-testid={`guide-link-${guide.slug}`}
              >
                <BookOpen className="w-5 h-5 text-slate-500 group-hover:text-blue-600 flex-shrink-0" />
                <span className="font-medium text-slate-700 group-hover:text-blue-700">{guide.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
