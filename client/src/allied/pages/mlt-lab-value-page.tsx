import { useState } from "react";
import { Link, useParams } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  getMltLabValueBySlug,
  getAllMltLabValueSlugs,
  mltLabValues,
  type MltLabValuePageData,
  type MltLabValuePracticeQuestion,
} from "@/data/mlt-lab-values";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lock,
  Microscope,
  FlaskConical,
  BookOpen,
  AlertTriangle,
  Beaker,
  Brain,
  FileText,
  HelpCircle,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

function Breadcrumbs({ labName }: { labName?: string }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t("allied.mltLabValuePage.breadcrumb")} className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link href="/allied-health" className="hover:text-purple-600">{t("allied.mltLabValuePage.alliedHealth")}</Link></li>
        <li><ChevronRight className="w-3 h-3 inline" /></li>
        <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
        <li><ChevronRight className="w-3 h-3 inline" /></li>
        <li><Link href="/allied-health/mlt/lab-values" className="hover:text-purple-600">{t("allied.mltLabValuePage.labValues")}</Link></li>
        {labName && (
          <>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">{labName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}

function UnitToggle({ unit, setUnit }: { unit: "si" | "conventional"; setUnit: (u: "si" | "conventional") => void }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-sm" data-testid="unit-toggle">
      <button
        onClick={() => setUnit("si")}
        className={`px-4 py-2 font-medium transition-colors ${unit === "si" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        data-testid="button-unit-si"
      >
        SI Units (Canada)
      </button>
      <button
        onClick={() => setUnit("conventional")}
        className={`px-4 py-2 font-medium transition-colors ${unit === "conventional" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        data-testid="button-unit-conventional"
      >
        Conventional (US)
      </button>
    </div>
  );
}

function ComparisonTable({ data, unit }: { data: MltLabValuePageData; unit: "si" | "conventional" }) {
  const range = data.normalRange[unit];
  return (
    <div className="overflow-x-auto" data-testid="comparison-table">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-purple-50">
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuePage.parameter")}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuePage.normal")}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuePage.abnormalHigh")}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuePage.abnormalLow")}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 font-medium text-gray-800">{data.name} ({range.unit})</td>
            <td className="px-4 py-3 text-emerald-700 font-medium">{range.value}</td>
            <td className="px-4 py-3 text-red-600">{data.criticalValues.high || "—"}</td>
            <td className="px-4 py-3 text-amber-600">{data.criticalValues.low || "—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PracticeQuestionWidget({ questions }: { questions: MltLabValuePracticeQuestion[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const q = questions[currentIdx];
  if (!q) return null;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
    setStats((prev) => ({
      correct: prev.correct + (selected === q.correctIndex ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) return;
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-4" data-testid="practice-questions-widget">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">{t("allied.mltLabValuePage.practiceQuestions")}</h3>
        </div>
        <span className="text-sm text-gray-500" data-testid="badge-question-progress">{currentIdx + 1} / {questions.length}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm" data-testid="card-practice-question">
        <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed" data-testid="text-question-stem">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isCorrect = revealed && idx === q.correctIndex;
            const isWrong = revealed && idx === selected && idx !== q.correctIndex;
            const isSelected = idx === selected;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : isWrong
                      ? "border-red-400 bg-red-50 text-red-800"
                      : isSelected
                        ? "border-purple-400 bg-purple-50 text-gray-900"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                data-testid={`button-option-${idx}`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                {opt}
                {isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2 text-emerald-600" />}
                {isWrong && <XCircle className="w-4 h-4 inline ml-2 text-red-500" />}
              </button>
            );
          })}
        </div>

        {revealed && q.rationale && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100" data-testid="text-rationale">
            <p className="text-sm text-gray-700 leading-relaxed"><strong>{t("allied.mltLabValuePage.rationale")}</strong> {q.rationale}</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="button-check-answer"
            >
              Check Answer
            </button>
          ) : currentIdx < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
              data-testid="button-next-question"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
          {stats.total > 0 && (
            <span className="text-sm text-gray-500 self-center ml-auto" data-testid="text-score">
              {stats.correct}/{stats.total} correct
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LockedPremiumTeaser() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center" data-testid="premium-teaser">
      <Lock className="w-10 h-10 text-purple-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.mltLabValuePage.unlockFullMltQuestionBank")}</h3>
      <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
        Access 1,000+ exam-authentic MLT practice questions with detailed rationales, adaptive difficulty, and performance tracking across all 16 laboratory disciplines.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          href="/allied-health/mlt"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          data-testid="cta-unlock-qbank"
        >
          Unlock Full MLT Question Bank <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/allied-health/mlt/lab-values"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          data-testid="cta-browse-labs"
        >
          Browse All Lab Values
        </Link>
      </div>
    </div>
  );
}

function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-accordion">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{item.question}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`faq-answer-${i}`}>{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function RelatedLabLinks({ slugs, currentSlug }: { slugs: string[]; currentSlug: string }) {
  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => mltLabValues.find((lv) => lv.slug === s))
    .filter(Boolean) as MltLabValuePageData[];

  if (related.length === 0) return null;

  return (
    <div data-testid="related-labs">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <ExternalLink className="w-5 h-5 text-purple-500" />
        Related Lab Values
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((lab) => (
          <Link
            key={lab.slug}
            href={`/allied-health/mlt/lab-values/${lab.slug}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
            data-testid={`link-related-${lab.slug}`}
          >
            <FlaskConical className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 text-sm">{lab.name}</div>
              <div className="text-xs text-gray-500">{lab.discipline}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MltLabValuePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const data = getMltLabValueBySlug(slug);
  const [unit, setUnit] = useState<"si" | "conventional">("si");

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.mltLabValuePage.labValueNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.mltLabValuePage.theLabValuePageYoure")}</p>
        <Link href="/allied-health/mlt/lab-values" className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="link-back-hub">
          Back to Lab Values Hub
        </Link>
      </div>
    );
  }

  const range = data.normalRange[unit];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.h1Title,
    description: data.metaDescription,
    author: { "@type": "Organization", name: "NurseNest Allied" },
    publisher: {
      "@type": "Organization",
      name: "NurseNest Allied",
      url: "https://www.nursenest.ca/allied-health",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/allied-health/mlt/lab-values/${data.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: "MLT", item: "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", position: 3, name: "Lab Values", item: "https://www.nursenest.ca/allied-health/mlt/lab-values" },
      { "@type": "ListItem", position: 4, name: data.name, item: `https://www.nursenest.ca/allied-health/mlt/lab-values/${data.slug}` },
    ],
  };

  return (
    <>
      <AlliedSEO
        title={data.seoTitle}
        description={data.metaDescription}
        keywords={data.keywords}
        canonicalPath={`/allied-health/mlt/lab-values/${data.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8" data-testid={`mlt-lab-value-${data.slug}`}>
        <Breadcrumbs labName={data.name} />

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            <Microscope className="w-3.5 h-3.5" />
            {data.discipline}
          </span>
          <UnitToggle unit={unit} setUnit={setUnit} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="h1-title">
          {data.h1Title}
        </h1>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-100" data-testid="normal-range-card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-purple-600 font-medium mb-1">Normal Range ({unit === "si" ? "SI" : "Conventional"})</div>
              <div className="text-2xl font-bold text-gray-900">{range.value} <span className="text-lg text-gray-500">{range.unit}</span></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-medium mb-1">{t("allied.mltLabValuePage.specimen")}</div>
              <div className="text-sm text-gray-700">{data.specimen}</div>
            </div>
          </div>
        </div>

        <section className="mb-8" data-testid="section-overview">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Overview
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.overview}</p>
        </section>

        <section className="mb-8" data-testid="section-clinical-significance">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            Clinical Significance
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.clinicalSignificance}</p>
        </section>

        <section className="mb-8" data-testid="section-comparison-table">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("allied.mltLabValuePage.normalVsAbnormal")}</h2>
          <ComparisonTable data={data} unit={unit} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <section data-testid="section-high-causes">
            <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Causes of Elevated {data.name}
            </h2>
            <div className="space-y-3">
              {data.highCauses.map((cause, i) => (
                <div key={i} className="bg-red-50 rounded-lg p-4 border border-red-100" data-testid={`high-cause-${i}`}>
                  <div className="font-medium text-red-800 text-sm">{cause.condition}</div>
                  <div className="text-xs text-red-600 mt-1">{cause.explanation}</div>
                </div>
              ))}
            </div>
          </section>

          <section data-testid="section-low-causes">
            <h2 className="text-lg font-bold text-amber-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Causes of Decreased {data.name}
            </h2>
            <div className="space-y-3">
              {data.lowCauses.map((cause, i) => (
                <div key={i} className="bg-amber-50 rounded-lg p-4 border border-amber-100" data-testid={`low-cause-${i}`}>
                  <div className="font-medium text-amber-800 text-sm">{cause.condition}</div>
                  <div className="text-xs text-amber-600 mt-1">{cause.explanation}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mb-8 bg-red-50 rounded-xl p-6 border border-red-200" data-testid="section-critical-values">
          <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Critical Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            {data.criticalValues.high && (
              <div>
                <span className="text-sm font-medium text-red-700">{t("allied.mltLabValuePage.criticalHigh")}</span>
                <span className="text-sm text-red-600 ml-2">{data.criticalValues.high}</span>
              </div>
            )}
            {data.criticalValues.low && (
              <div>
                <span className="text-sm font-medium text-amber-700">{t("allied.mltLabValuePage.criticalLow")}</span>
                <span className="text-sm text-amber-600 ml-2">{data.criticalValues.low}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-red-700">{data.criticalValues.action}</p>
        </section>

        <section className="mb-8" data-testid="section-associated-conditions">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("allied.mltLabValuePage.associatedConditions")}</h2>
          <div className="flex flex-wrap gap-2">
            {data.associatedConditions.map((cond, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium" data-testid={`condition-${i}`}>
                {cond}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8" data-testid="section-lab-correlations">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("allied.mltLabValuePage.labCorrelations")}</h2>
          <div className="flex flex-wrap gap-2">
            {data.labCorrelations.map((corr, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium" data-testid={`correlation-${i}`}>
                {corr}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8 bg-purple-50 rounded-xl p-6 border border-purple-100" data-testid="section-exam-tips">
          <h2 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            MLT Exam Tips
          </h2>
          <ul className="space-y-2">
            {data.examTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-purple-800" data-testid={`exam-tip-${i}`}>
                <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8" data-testid="section-practice-questions">
          <PracticeQuestionWidget questions={data.practiceQuestions} />
        </section>

        <section className="mb-8">
          <LockedPremiumTeaser />
        </section>

        <section className="mb-8">
          <RelatedLabLinks slugs={data.relatedLabSlugs} currentSlug={data.slug} />
        </section>

        <section className="mb-8" data-testid="section-internal-links">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Continue Studying
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/allied-health/mlt/lab-values"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-all-lab-values"
            >
              <Beaker className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuePage.allLabValues")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuePage.completeMltLabValuesReference")}</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/lab-values/complete-chart"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-complete-chart"
            >
              <ClipboardList className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuePage.completeLabValuesChart")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuePage.printableReferenceForExamPrep")}</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/questions"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-mlt-questions"
            >
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuePage.mltQuestionBank")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuePage.1000PracticeQuestionsWithRationales")}</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/exams"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-mlt-exams"
            >
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuePage.mltPracticeExams")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuePage.csmlsAscpMockExams")}</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mb-8" data-testid="section-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={data.faqItems} />
        </section>
      </div>
    </>
  );
}
