import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Stethoscope,
  Award,
  GraduationCap,
} from "lucide-react";

export default function HomeChoosePath() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  const paths = [
    {
      id: "nursing-students",
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
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
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
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
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
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
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
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
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
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
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
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
    <section className="border-t border-gray-100" style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }} data-testid="section-choose-your-path">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("components.homeChoosePath.chooseYourPath")}</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{t("components.homeChoosePath.whetherYoureANursingStudent")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <div
              key={path.id}
              className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
              data-testid={path.testId}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-10 h-10 rounded-xl ${path.iconBg} flex items-center justify-center`}>
                  <path.icon className={`w-5 h-5 ${path.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 ml-[52px]">{path.subtitle}</p>
              <p className="text-sm text-gray-600 mb-6 flex-1">{path.desc}</p>
              <Button
                onClick={() => setLocation(path.href)}
                className="w-full"
                data-testid={path.btnTestId}
              >
                {path.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" data-testid="metrics-credibility-bar">
          <div className="text-center p-4" data-testid="metric-practice-questions">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">40,000+</p>
            <p className="text-sm text-gray-500 mt-1">{t("components.homeChoosePath.practiceQuestions")}</p>
          </div>
          <div className="text-center p-4" data-testid="metric-flashcards">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">13,000+</p>
            <p className="text-sm text-gray-500 mt-1">{t("components.homeChoosePath.flashcards")}</p>
          </div>
          <div className="text-center p-4" data-testid="metric-clinical-lessons">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">8,000+</p>
            <p className="text-sm text-gray-500 mt-1">{t("components.homeChoosePath.clinicalLessons")}</p>
          </div>
          <div className="text-center p-4" data-testid="metric-languages">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">15</p>
            <p className="text-sm text-gray-500 mt-1">{t("components.homeChoosePath.languagesSupported")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
