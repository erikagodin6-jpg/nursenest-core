"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Stethoscope,
  Award,
  GraduationCap,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

export default function HomeChoosePath() {
  const { t } = useMarketingI18n();
  const router = useRouter();

  const paths = [
    {
      id: "nursing-students",
      icon: BookOpen,
      title: "Nursing Exam Prep",
      subtitle: "RPN / LVN / RN",
      desc: "Prepare for REx-PN and NCLEX-RN with practice questions, flashcards, clinical lessons, and adaptive mock exams tailored to your tier.",
      cta: "Start Nursing Prep",
      href: "/exam-prep",
      testId: "card-nursing-students",
      btnTestId: "button-start-nursing-prep",
    },
    {
      id: "np-certification",
      icon: Stethoscope,
      title: "Nurse Practitioner Prep",
      subtitle: "AANP / ANCC / FNP-BC & More",
      desc: "Advanced NP certification exam prep covering FNP-BC, AGPCNP-BC, AGACNP-BC, PMHNP-BC, PNP-BC, NNP-BC, ENP-C, and CNM exams.",
      cta: "Explore NP Prep",
      href: "/np-exam-practice-questions",
      testId: "card-np-certification",
      btnTestId: "button-explore-np-prep",
    },
    {
      id: "allied-health",
      icon: Users,
      title: "Allied Health Prep",
      subtitle: "RT / MLT / Paramedic & More",
      desc: "Study for respiratory therapy, paramedic, pharmacy technician, medical lab, diagnostic imaging, social work, and OT/PT certifications.",
      cta: "Explore Allied Health",
      href: "/allied-health",
      testId: "card-allied-health",
      btnTestId: "button-explore-allied-health",
    },
    {
      id: "certifications",
      icon: Award,
      title: "Certifications & Specialties",
      subtitle: "ICU / NICU / Trauma & More",
      desc: "Targeted prep for nursing specialty certifications and continuing education — CCRN, CEN, PCCN, and clinical specialty guides.",
      cta: "Browse Certifications",
      href: "/nursing-specialties",
      testId: "card-certifications",
      btnTestId: "button-browse-certifications",
    },
    {
      id: "new-grad",
      icon: GraduationCap,
      title: "New Graduate Hub",
      subtitle: "Your First Year in Practice",
      desc: "Clinical survival guides, certification pathways, resume tools, and career development resources for new nursing and allied health graduates.",
      cta: "Enter the New Grad Hub",
      href: "/new-grad",
      testId: "card-new-grad",
      btnTestId: "button-enter-new-grad-hub",
    },
    {
      id: "pharmacology",
      icon: Trophy,
      title: "Pharmacology & Study Tools",
      subtitle: "Flashcards / Mock Exams / Med Math",
      desc: "Master medications with flashcard decks, spaced repetition, med math calculators, lab value references, and pharmacology-focused question banks.",
      cta: "Explore Study Tools",
      href: "/flashcards",
      testId: "card-pharmacology-tools",
      btnTestId: "button-explore-study-tools",
    },
  ];

  return (
    <section className="border-t border-gray-100" style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }} data-testid="section-choose-your-path">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">{t("components.homeChoosePath.chooseYourPath")}</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">{t("components.homeChoosePath.whetherYoureANursingStudent")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <div
              key={path.id}
              className="flex flex-col rounded-2xl border border-gray-150 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              data-testid={path.testId}
            >
              <div className="mb-1 flex items-center gap-3">
                <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                  <path.icon className="nn-accent-icon h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{path.title}</h3>
              </div>
              <p className="mb-3 ml-[52px] text-xs font-medium uppercase tracking-wide text-gray-400">{path.subtitle}</p>
              <p className="mb-6 flex-1 text-sm text-gray-600">{path.desc}</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                onClick={() => router.push(mapLegacyMarketingHref(path.href))}
                data-testid={path.btnTestId}
              >
                {path.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4" data-testid="metrics-credibility-bar">
          <div className="p-4 text-center" data-testid="metric-practice-questions">
            <p className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">40,000+</p>
            <p className="mt-1 text-sm text-gray-500">{t("components.homeChoosePath.practiceQuestions")}</p>
          </div>
          <div className="p-4 text-center" data-testid="metric-flashcards">
            <p className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">13,000+</p>
            <p className="mt-1 text-sm text-gray-500">{t("components.homeChoosePath.flashcards")}</p>
          </div>
          <div className="p-4 text-center" data-testid="metric-clinical-lessons">
            <p className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">8,000+</p>
            <p className="mt-1 text-sm text-gray-500">{t("components.homeChoosePath.clinicalLessons")}</p>
          </div>
          <div className="p-4 text-center" data-testid="metric-languages">
            <p className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl">15</p>
            <p className="mt-1 text-sm text-gray-500">{t("components.homeChoosePath.languagesSupported")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
