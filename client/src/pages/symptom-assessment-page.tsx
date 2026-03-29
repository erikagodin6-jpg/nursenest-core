import { useState } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import {
  getSymptomAssessmentBySlug,
  getAllSymptomAssessmentSlugs,
  type SymptomPracticeQuestion,
} from "@/data/seo-symptom-assessments";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  AlertTriangle,
  Stethoscope,
  Brain,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Activity,
  FileText,
  Shield,
  Target,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
const URGENCY_STYLES = {
  emergent: { label: "Emergent", bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  urgent: { label: "Urgent", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
  "non-urgent": { label: "Non-Urgent", bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
};

function PracticeQuestion({ question, index }: { question: SymptomPracticeQuestion; index: number }) {
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
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function SymptomAssessmentPage() {
  const params = useParams<{ slug: string }>();
  const data = getSymptomAssessmentBySlug(params.slug || "");
  const allSlugs = getAllSymptomAssessmentSlugs();

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center" data-testid="symptom-not-found">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.symptomAssessmentPage.symptomAssessmentNotFound")}</h1>
            <p className="text-gray-500 mb-6">{t("pages.symptomAssessmentPage.theRequestedSymptomAssessmentPage")}</p>
            <LocaleLink href="/symptoms">
              <Button variant="outline" data-testid="link-back-symptoms">{t("pages.symptomAssessmentPage.browseSymptomAssessments")}</Button>
            </LocaleLink>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "Symptom Assessments", url: "https://www.nursenest.ca/symptoms" },
    { name: data.symptom, url: `https://www.nursenest.ca/symptoms/${data.slug}` },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: data.title,
    description: data.metaDescription,
    url: `https://www.nursenest.ca/symptoms/${data.slug}`,
    about: {
      "@type": "MedicalSignOrSymptom",
      name: data.symptom,
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

  const faqStructuredData = buildFaqStructuredData(
    data.faq.map(f => ({ question: f.question, answer: f.answer }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        keywords={data.keywords}
        canonicalPath={`/symptoms/${data.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.symptomAssessmentPage.breadcrumb")} data-testid="breadcrumb-nav">
        <div className="max-w-5xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="symptom-hero">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#BFA6F6]" />
            </div>
            <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.symptomAssessmentPage.symptomAssessment")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-symptom-title">
            {data.title}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            {data.introduction}
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <section className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8" data-testid="section-red-flags">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">{t("pages.symptomAssessmentPage.redFlagsSeekImmediateIntervention")}</h2>
          </div>
          <ul className="space-y-2">
            {data.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-differential-diagnoses">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.differentialDiagnoses")}</h2>
          </div>
          <div className="space-y-3">
            {data.differentialDiagnoses.map((dx, idx) => {
              const style = URGENCY_STYLES[dx.urgency];
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4" data-testid={`differential-${idx}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{dx.condition}</h3>
                    <Badge className={`shrink-0 text-xs ${style.bg} ${style.text} ${style.border} border`} variant="outline">
                      {style.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{dx.keyFeatures}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-assessment-steps">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.assessmentSteps")}</h2>
          </div>
          <div className="space-y-4">
            {data.assessmentSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4" data-testid={`assessment-step-${idx}`}>
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{step.step}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 rounded-2xl border border-blue-200 p-6 md:p-8" data-testid="section-clinical-decision">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold text-blue-900">{t("pages.symptomAssessmentPage.clinicalDecisionmaking")}</h2>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">{data.clinicalDecisionMaking}</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-nursing-interventions">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.nursingInterventions")}</h2>
          </div>
          <ul className="space-y-2">
            {data.nursingInterventions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8" data-testid="section-exam-tips">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.examTips")}</h2>
          </div>
          <ul className="space-y-3">
            {data.examTips.map((tip, idx) => (
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
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.practiceQuestions")}</h2>
          </div>
          <div className="space-y-6">
            {data.practiceQuestions.map((q, idx) => (
              <PracticeQuestion key={idx} question={q} index={idx} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-faq">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.faq.map((item, idx) => (
              <FAQItem key={idx} question={item.question} answer={item.answer} index={idx} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-related-symptoms">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.symptomAssessmentPage.relatedSymptomAssessments")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allSlugs
              .filter((s) => s !== data.slug)
              .map((slug) => (
                <LocaleLink
                  key={slug}
                  href={`/symptoms/${slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                  data-testid={`link-related-symptom-${slug}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                </LocaleLink>
              ))}
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-4">
          <MedicalReviewBadge />
          <MedicalReferences lessonId={data.slug} />
        </div>

        <MedicalReviewJsonLd
          title={data.title}
          slug={data.slug}
          description={data.metaDescription}
          pageUrl={`https://www.nursenest.ca/symptoms/${data.slug}`}
        />

        <section className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-8 text-center text-white" data-testid="section-cta">
          <h2 className="text-2xl font-bold mb-3">{t("pages.symptomAssessmentPage.masterClinicalAssessmentForYour")}</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Access hundreds of practice questions, clinical simulations, and comprehensive study guides with NurseNest.
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

      <Footer />
    </div>
  );
}
