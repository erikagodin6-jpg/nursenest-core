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
  getClinicalComparisonBySlug,
  getAllClinicalComparisonSlugs,
  type ComparisonPracticeQuestion,
} from "@/data/seo-clinical-comparisons";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Scale,
  Stethoscope,
  Brain,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Activity,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
function PracticeQuestion({ question, index }: { question: ComparisonPracticeQuestion; index: number }) {
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

export default function ClinicalComparisonPage() {
  const params = useParams<{ slug: string }>();
  const data = getClinicalComparisonBySlug(params.slug || "");
  const allSlugs = getAllClinicalComparisonSlugs();

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center" data-testid="comparison-not-found">
            <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.clinicalComparisonPage.comparisonNotFound")}</h1>
            <p className="text-gray-500 mb-6">{t("pages.clinicalComparisonPage.theRequestedClinicalComparisonPage")}</p>
            <LocaleLink href="/compare">
              <Button variant="outline" data-testid="link-back-comparisons">{t("pages.clinicalComparisonPage.browseComparisons")}</Button>
            </LocaleLink>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "Clinical Comparisons", url: "https://www.nursenest.ca/clinical-comparisons" },
    { name: data.title, url: `https://www.nursenest.ca/clinical-comparisons/${data.slug}` },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: data.title,
    description: data.metaDescription,
    url: `https://www.nursenest.ca/clinical-comparisons/${data.slug}`,
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
        canonicalPath={`/clinical-comparisons/${data.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.clinicalComparisonPage.breadcrumb")} data-testid="breadcrumb-nav">
        <div className="max-w-5xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="comparison-hero">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#BFA6F6]" />
            </div>
            <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.clinicalComparisonPage.clinicalComparison")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-comparison-title">
            {data.title}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            {data.introduction}
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-pathophysiology-a">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">{data.conditionA}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pathophysiologyA}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-pathophysiology-b">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">{data.conditionB}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pathophysiologyB}</p>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-testid="section-comparison-table">
          <div className="flex items-center gap-3 p-6 pb-0 mb-4">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalComparisonPage.sidebysideComparison")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700 w-1/4">{t("pages.clinicalComparisonPage.category")}</th>
                  <th className="text-left p-4 font-semibold text-blue-700 w-[37.5%]">{data.conditionA}</th>
                  <th className="text-left p-4 font-semibold text-purple-700 w-[37.5%]">{data.conditionB}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-testid={`comparison-row-${idx}`}>
                    <td className="p-4 font-medium text-gray-900">{row.category}</td>
                    <td className="p-4 text-gray-700">{row.conditionA}</td>
                    <td className="p-4 text-gray-700">{row.conditionB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-interventions-a">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Nursing Interventions: {data.conditionA.split("(")[0].trim()}</h2>
            </div>
            <ul className="space-y-2">
              {data.nursingInterventionsA.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-interventions-b">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Nursing Interventions: {data.conditionB.split("(")[0].trim()}</h2>
            </div>
            <ul className="space-y-2">
              {data.nursingInterventionsB.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8" data-testid="section-exam-tips">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalComparisonPage.examTips")}</h2>
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
            <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalComparisonPage.practiceQuestions")}</h2>
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
            <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalComparisonPage.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.faq.map((item, idx) => (
              <FAQItem key={idx} question={item.question} answer={item.answer} index={idx} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-related-comparisons">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalComparisonPage.moreClinicalComparisons")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allSlugs
              .filter((s) => s !== data.slug)
              .map((slug) => (
                <LocaleLink
                  key={slug}
                  href={`/clinical-comparisons/${slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                  data-testid={`link-related-comparison-${slug}`}
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
          pageUrl={`https://www.nursenest.ca/clinical-comparisons/${data.slug}`}
        />

        <section className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-8 text-center text-white" data-testid="section-cta">
          <h2 className="text-2xl font-bold mb-3">{t("pages.clinicalComparisonPage.masterClinicalComparisonsForYour")}</h2>
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
