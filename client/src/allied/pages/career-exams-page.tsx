import { Link } from "wouter";
import {
  FileText, ChevronRight, Target, Zap, ArrowRight, Clock, BarChart3, Code
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { CAREER_SUBPAGE_DATA } from "@/allied/data/career-subpage-data";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";
import { ExplanationPromoBanner } from "@/components/explanation-panel";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  FileText, Target, Zap, Code,
};

function getIcon(name: string) {

  return ICON_MAP[name] || FileText;
}

interface CareerExamsPageProps {
  careerSlug: string;
}

export default function CareerExamsPage({ careerSlug }: CareerExamsPageProps) {
  const subpageData = CAREER_SUBPAGE_DATA[careerSlug];
  const hubData = PROFESSION_HUB_DATA[careerSlug];
  if (!subpageData || !hubData) return null;

  const modes = subpageData.examModes;
  const basePath = `/allied-health/${careerSlug}`;

  return (
    <div data-testid={`career-exams-page-${careerSlug}`}>
      <AlliedSEO
        title={`${hubData.shortName} Practice Exams — Mock Exams & Question Bank | NurseNest Allied`}
        description={`Prepare for the ${hubData.examInfo.examNames.join(", ")} with ${modes.length} exam modes including full-length mock exams, domain-focused practice, and quick quizzes.`}
        keywords={`${hubData.shortName} practice exam, ${hubData.shortName} mock exam, ${hubData.name} exam prep, ${hubData.shortName} test bank`}
        canonicalPath={`${basePath}/exams`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: hubData.shortName, item: `https://www.nursenest.ca${basePath}` },
            { "@type": "ListItem", position: 3, name: "Practice Exams", item: `https://www.nursenest.ca${basePath}/exams` },
          ],
        }}
      />

      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50/30 py-12 sm:py-16" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/allied-health" className="hover:text-gray-700">{t("allied.careerExamsPage.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={basePath} className="hover:text-gray-700">{hubData.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: hubData.color }}>{t("allied.careerExamsPage.practiceExams")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
            {hubData.shortName} Practice Exams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Simulate real exam conditions with blueprint-weighted mock exams for the {hubData.examInfo.examNames.join(" and ")} certifications.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-5">
          {modes.map((mode, i) => {
            const Icon = getIcon(mode.icon);
            return (
              <Link
                key={mode.slug}
                href={basePath}
                className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                data-testid={`card-exam-${mode.slug}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: hubData.colorAccent }}>
                    <Icon className="w-6 h-6" style={{ color: hubData.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{mode.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{mode.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {mode.questionCount} questions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {mode.timeMinutes} min
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: hubData.color }}>
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.careerExamsPage.examInformation")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: hubData.color }} />
                Exam Format
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{hubData.examInfo.examFormat}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: hubData.color }} />
                Exam Names
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {hubData.examInfo.examNames.map(name => (
                  <span key={name} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: hubData.colorAccent, color: hubData.color }}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <ExplanationPromoBanner variant="compact" />
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerExamsPage.startYourExamPrep")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.careerExamsPage.takeAFreeDiagnosticTo")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/diagnostic?career=${hubData.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={basePath} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700" data-testid="button-back-to-hub">
              Back to {hubData.shortName} Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
