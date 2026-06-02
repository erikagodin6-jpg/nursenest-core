import { useState } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/seo";
import { AutoRelatedContent, YouMayAlsoLike } from "@/components/auto-related-content";
import { getLabValueBySlug, getAllLabValueSlugs, type LabValuePracticeQuestion } from "@/data/seo-lab-values";
import { LocaleLink } from "@/lib/LocaleLink";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FlaskConical,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Stethoscope,
  BookOpen,
  HelpCircle,
  Activity,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
function PracticeQuestion({ question, index }: { question: LabValuePracticeQuestion; index: number }) {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  const handleSelect = (optIndex: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(optIndex);
    setShowRationale(true);
  };

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4 text-sm leading-relaxed">
        <span className="text-primary font-bold mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, optIdx) => {
          let optionClass = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5";
          if (selectedIndex !== null) {
            if (optIdx === question.correctIndex) {
              optionClass = "border-2 border-emerald-500 rounded-lg p-3 text-sm bg-emerald-50";
            } else if (optIdx === selectedIndex && !isCorrect) {
              optionClass = "border-2 border-red-400 rounded-lg p-3 text-sm bg-red-50";
            } else {
              optionClass = "border border-gray-200 rounded-lg p-3 text-sm opacity-60";
            }
          }

          return (
            <button
              key={optIdx}
              onClick={() => handleSelect(optIdx)}
              className={`w-full text-left flex items-start gap-3 ${optionClass}`}
              disabled={selectedIndex !== null}
              data-testid={`question-${index}-option-${optIdx}`}
            >
              <span className="font-semibold text-gray-500 mt-0.5 shrink-0">
                {String.fromCharCode(65 + optIdx)}.
              </span>
              <span className="text-gray-700">{option}</span>
              {selectedIndex !== null && optIdx === question.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 ml-auto" />
              )}
              {selectedIndex !== null && optIdx === selectedIndex && !isCorrect && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className={`mt-4 p-4 rounded-lg text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`} data-testid={`rationale-${index}`}>
          <p className="font-semibold mb-1 text-gray-900">
            {isCorrect ? "Correct!" : "Incorrect"} - Rationale:
          </p>
          <p className="text-gray-700">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        data-testid={`faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 text-sm">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function LabValuePage() {
  const params = useParams<{ slug: string }>();
  const labData = getLabValueBySlug(params.slug || "");
  const allSlugs = getAllLabValueSlugs();

  if (!labData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" data-testid="lab-value-not-found">
          <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.labValuePage.labValueNotFound")}</h1>
          <p className="text-gray-500 mb-6">{t("pages.labValuePage.theRequestedLabValuePage")}</p>
          <LocaleLink href="/lab-values">
            <Button variant="outline" data-testid="link-back-lab-values">{t("pages.labValuePage.browseLabValues")}</Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: labData.h1Title,
    description: labData.metaDescription,
    url: `https://www.nursenest.ca/lab-values/${labData.slug}`,
    about: {
      "@type": "MedicalTest",
      name: labData.fullName,
      normalRange: `${labData.normalRange.value} ${labData.normalRange.unit}`,
    },
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Nursing Students",
    },
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: labData.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={labData.h1Title}
        description={labData.metaDescription}
        keywords={labData.keywords}
        canonicalPath={`/lab-values/${labData.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Lab Values", url: "https://www.nursenest.ca/lab-values" },
          { name: labData.name, url: `https://www.nursenest.ca/lab-values/${labData.slug}` },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.labValuePage.breadcrumb")} data-testid="breadcrumb-nav">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500">
            <LocaleLink href="/" className="hover:text-primary transition-colors">{t("pages.labValuePage.home")}</LocaleLink>
            <span>/</span>
            <LocaleLink href="/lab-values" className="hover:text-primary transition-colors">{t("pages.labValuePage.labValues")}</LocaleLink>
            <span>/</span>
            <span className="text-gray-900 font-medium">{labData.name}</span>
          </div>
        </nav>

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="lab-value-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.labValuePage.labValueReference")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-lab-value-title">
              {labData.h1Title}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              {labData.overview}
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-normal-range">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.normalRange")}</h2>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-primary mb-1" data-testid="text-normal-range-value">
                {labData.normalRange.value} {labData.normalRange.unit}
              </p>
              {labData.normalRange.notes && (
                <p className="text-sm text-gray-600 mt-2">{labData.normalRange.notes}</p>
              )}
            </div>
            {labData.criticalValues && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {labData.criticalValues.high && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-red-700 text-sm">{t("pages.labValuePage.criticalHigh")}</span>
                    </div>
                    <p className="text-red-900 font-bold text-lg" data-testid="text-critical-high">{labData.criticalValues.high}</p>
                  </div>
                )}
                {labData.criticalValues.low && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-700 text-sm">{t("pages.labValuePage.criticalLow")}</span>
                    </div>
                    <p className="text-blue-900 font-bold text-lg" data-testid="text-critical-low">{labData.criticalValues.low}</p>
                  </div>
                )}
              </div>
            )}
            {labData.criticalValues && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-semibold">{t("pages.labValuePage.criticalAction")} </span>
                  {labData.criticalValues.action}
                </p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-clinical-significance">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.clinicalSignificance")}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{labData.clinicalSignificance}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-high-causes">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-900">Causes of Elevated {labData.name}</h2>
              </div>
              <div className="space-y-3">
                {labData.highCauses.map((cause, idx) => (
                  <div key={idx} className="border-l-2 border-red-200 pl-4">
                    <p className="font-semibold text-gray-900 text-sm">{cause.condition}</p>
                    <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{cause.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-low-causes">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900">Causes of Low {labData.name}</h2>
              </div>
              <div className="space-y-3">
                {labData.lowCauses.map((cause, idx) => (
                  <div key={idx} className="border-l-2 border-blue-200 pl-4">
                    <p className="font-semibold text-gray-900 text-sm">{cause.condition}</p>
                    <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{cause.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-interventions-high">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-900">{t("pages.labValuePage.nursingInterventionsHigh")}</h2>
              </div>
              <ul className="space-y-2">
                {labData.nursingInterventions.forHigh.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-interventions-low">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900">{t("pages.labValuePage.nursingInterventionsLow")}</h2>
              </div>
              <ul className="space-y-2">
                {labData.nursingInterventions.forLow.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8" data-testid="section-exam-tips">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.examTips")}</h2>
            </div>
            <ul className="space-y-3">
              {labData.examTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section data-testid="section-practice-questions">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.practiceQuestions")}</h2>
            </div>
            <div className="space-y-6">
              {labData.practiceQuestions.map((q, idx) => (
                <PracticeQuestion key={idx} question={q} index={idx} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {labData.faqItems.map((item, idx) => (
                <FAQItem key={idx} question={item.question} answer={item.answer} index={idx} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-related-labs">
            <div className="flex items-center gap-3 mb-4">
              <FlaskConical className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.relatedLabValues")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allSlugs
                .filter((s) => s !== labData.slug)
                .map((slug) => (
                  <LocaleLink
                    key={slug}
                    href={`/lab-values/${slug}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                    data-testid={`link-related-lab-${slug}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                  </LocaleLink>
                ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-exam-resources">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValuePage.examPrepResources")}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Strengthen your {labData.name} knowledge with targeted practice questions and lessons across all nursing tiers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <LocaleLink
                href="/rpn/questions"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-rpn-questions"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.rpnPracticeQuestions")}</span>
              </LocaleLink>
              <LocaleLink
                href="/rn/questions"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-rn-questions"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.rnPracticeQuestions")}</span>
              </LocaleLink>
              <LocaleLink
                href="/np/test-bank"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-np-test-bank"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.npQuestionBank")}</span>
              </LocaleLink>
              <LocaleLink
                href="/lessons"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-lessons"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.allLessons")}</span>
              </LocaleLink>
              <LocaleLink
                href="/question-bank"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-question-bank"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.fullQuestionBank")}</span>
              </LocaleLink>
              <LocaleLink
                href="/lab-values"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                data-testid="link-lab-interpretation"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{t("pages.labValuePage.labInterpretationEngine")}</span>
              </LocaleLink>
            </div>
          </section>

          <AutoRelatedContent slug={labData.slug} contentType="lab-value" title={labData.name} category={labData.fullName} />
          <YouMayAlsoLike slug={labData.slug} contentType="lab-value" title={labData.name} category={labData.fullName} />

          <section className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-8 text-center text-white" data-testid="section-cta">
            <h2 className="text-2xl font-bold mb-3">{t("pages.labValuePage.masterLabValuesForYour")}</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Access hundreds of practice questions, interactive lab simulations, and comprehensive study guides with NurseNest.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/start-free">
                <Button className="bg-[#BFA6F6] hover:bg-[#a88de8] text-[#2E3A59] font-semibold px-6" data-testid="button-cta-start-free">
                  Start Free
                </Button>
              </LocaleLink>
              <LocaleLink href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6" data-testid="button-cta-pricing">
                  View Plans
                </Button>
              </LocaleLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
