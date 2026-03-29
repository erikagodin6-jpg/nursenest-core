import { useState } from "react";
import { Link, useParams } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  getMicrobiologyTopicBySlug,
  microbiologyTopics,
  type MicrobiologyTopicData,
  type MicrobiologyPracticeQuestion,
} from "@/data/seo-microbiology";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lock,
  Microscope,
  FlaskConical,
  Brain,
  FileText,
  HelpCircle,
  ExternalLink,
  ClipboardList,
  Bug,
  Shield,
  Stethoscope,
  Pill,
} from "lucide-react";

function Breadcrumbs({ topicName }: { topicName?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link href="/allied-health" className="hover:text-purple-600">Allied Health</Link></li>
        <li><ChevronRight className="w-3 h-3 inline" /></li>
        <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
        <li><ChevronRight className="w-3 h-3 inline" /></li>
        <li><Link href="/allied-health/mlt/microbiology" className="hover:text-purple-600">Microbiology</Link></li>
        {topicName && (
          <>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">{topicName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}

function ComparisonTable({ data }: { data: MicrobiologyTopicData }) {
  const { comparisonTable } = data;
  return (
    <div className="overflow-x-auto" data-testid="comparison-table">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-purple-50">
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">Feature</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{comparisonTable.columnAHeader}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{comparisonTable.columnBHeader}</th>
          </tr>
        </thead>
        <tbody>
          {comparisonTable.rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-800">{row.feature}</td>
              <td className="px-4 py-3 text-gray-600">{row.columnA}</td>
              <td className="px-4 py-3 text-gray-600">{row.columnB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PracticeQuestionWidget({ questions }: { questions: MicrobiologyPracticeQuestion[] }) {
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
          <h3 className="text-lg font-bold text-gray-900">Practice Questions</h3>
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
            <p className="text-sm text-gray-700 leading-relaxed"><strong>Rationale:</strong> {q.rationale}</p>
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
      <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Full MLT Question Bank</h3>
      <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
        Access 1,000+ exam-authentic MLT practice questions covering microbiology, hematology, clinical chemistry, and all 16 laboratory disciplines with detailed rationales.
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
          href="/allied-health/mlt/microbiology"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          data-testid="cta-browse-micro"
        >
          Browse All Microbiology Topics
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

function RelatedTopicLinks({ slugs, currentSlug }: { slugs: string[]; currentSlug: string }) {
  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => microbiologyTopics.find((t) => t.slug === s))
    .filter(Boolean) as MicrobiologyTopicData[];

  if (related.length === 0) return null;

  return (
    <div data-testid="related-topics">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <ExternalLink className="w-5 h-5 text-purple-500" />
        Related Microbiology Topics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((topic) => (
          <Link
            key={topic.slug}
            href={`/allied-health/mlt/microbiology/${topic.slug}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
            data-testid={`link-related-${topic.slug}`}
          >
            <Bug className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 text-sm">{topic.name}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MltMicrobiologyTopic() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const data = getMicrobiologyTopicBySlug(slug);

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Topic Not Found</h1>
        <p className="text-gray-600 mb-4">The microbiology topic you're looking for doesn't exist.</p>
        <Link href="/allied-health/mlt/microbiology" className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="link-back-hub">
          Back to Microbiology Hub
        </Link>
      </div>
    );
  }

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
      "@id": `https://www.nursenest.ca/allied-health/mlt/microbiology/${data.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: "MLT", item: "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", position: 3, name: "Microbiology", item: "https://www.nursenest.ca/allied-health/mlt/microbiology" },
      { "@type": "ListItem", position: 4, name: data.name, item: `https://www.nursenest.ca/allied-health/mlt/microbiology/${data.slug}` },
    ],
  };

  return (
    <>
      <AlliedSEO
        title={data.seoTitle}
        description={data.metaDescription}
        keywords={data.keywords}
        canonicalPath={`/allied-health/mlt/microbiology/${data.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8" data-testid={`mlt-micro-${data.slug}`}>
        <Breadcrumbs topicName={data.name} />

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            <Microscope className="w-3.5 h-3.5" />
            Microbiology
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight" data-testid="h1-title">
          {data.h1Title}
        </h1>

        <section className="mb-8" data-testid="section-organism-characteristics">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Bug className="w-5 h-5 text-purple-500" />
            Organism Characteristics
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.organismCharacteristics}</p>
        </section>

        <section className="mb-8" data-testid="section-identification-steps">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            Laboratory Identification Steps
          </h2>
          <ol className="space-y-3 list-none">
            {data.identificationSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600" data-testid={`id-step-${i}`}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8" data-testid="section-staining">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Microscope className="w-5 h-5 text-purple-500" />
            Staining Methods
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.stainingMethods}</p>
        </section>

        <section className="mb-8" data-testid="section-culture-findings">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            Culture Findings
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.cultureFindings}</p>
        </section>

        <section className="mb-8" data-testid="section-disease-associations">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-500" />
            Disease Associations
          </h2>
          <div className="space-y-3">
            {data.diseaseAssociations.map((assoc, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-100" data-testid={`disease-${i}`}>
                <div className="font-medium text-gray-800 text-sm">{assoc.disease}</div>
                <div className="text-xs text-gray-500 mt-1">{assoc.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8" data-testid="section-antibiotics">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-500" />
            Antibiotic Considerations
          </h2>
          <p className="text-gray-600 leading-relaxed">{data.antibioticConsiderations}</p>
        </section>

        <section className="mb-8" data-testid="section-comparison-table">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{data.comparisonTable.title}</h2>
          <ComparisonTable data={data} />
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
          <PracticeQuestionWidget key={data.slug} questions={data.practiceQuestions} />
        </section>

        <section className="mb-8">
          <LockedPremiumTeaser />
        </section>

        <section className="mb-8">
          <RelatedTopicLinks slugs={data.relatedTopicSlugs} currentSlug={data.slug} />
        </section>

        <section className="mb-8" data-testid="section-internal-links">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Continue Studying
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/allied-health/mlt/microbiology"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-micro-hub"
            >
              <Bug className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">All Microbiology Topics</div>
                <div className="text-xs text-gray-500">Complete microbiology study cluster</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/microbiology/quick-guide"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-quick-guide"
            >
              <Shield className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Microbiology Quick Guide</div>
                <div className="text-xs text-gray-500">Shareable reference card</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/lab-values"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-lab-values"
            >
              <FlaskConical className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">MLT Lab Values</div>
                <div className="text-xs text-gray-500">Normal ranges for certification exams</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/blood-bank"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-blood-bank"
            >
              <Shield className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Blood Bank & Transfusion</div>
                <div className="text-xs text-gray-500">ABO/Rh typing, crossmatch & antibody ID</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/questions"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-mlt-questions"
            >
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">MLT Question Bank</div>
                <div className="text-xs text-gray-500">1,000+ practice questions with rationales</div>
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
