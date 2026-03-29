import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { getBloodBankTopicBySlug, getAllBloodBankSlugs, type BloodBankPracticeQuestion } from "@/data/seo-blood-bank";
import { bloodBankInternalLinks } from "@/data/internal-links";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Droplets,
  Shield,
  ListChecks,
  Table2,
  Lock,
  FlaskConical,
  Microscope,
} from "lucide-react";

function PracticeQuestion({ question, index }: { question: BloodBankPracticeQuestion; index: number }) {
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
        <span className="text-red-600 font-bold mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, optIdx) => {
          let optionClass = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-red-300 hover:bg-red-50/30";
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
          <p className="font-semibold mb-2 text-gray-900">
            {isCorrect ? "Correct!" : "Incorrect"} — Rationale:
          </p>
          <p className="text-gray-700 mb-3">{question.rationale}</p>
          {question.whyWrong.some(w => w.length > 0) && (
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              <p className="font-semibold text-gray-800 text-xs uppercase tracking-wider">Why each distractor is wrong:</p>
              {question.options.map((opt, i) => {
                if (i === question.correctIndex || !question.whyWrong[i]) return null;
                return (
                  <p key={i} className="text-gray-600 text-xs">
                    <span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {question.whyWrong[i]}
                  </p>
                );
              })}
            </div>
          )}
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
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && <p className="pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>}
    </div>
  );
}

export default function MltBloodBankTopicPage() {
  const params = useParams<{ slug: string }>();
  const topicData = getBloodBankTopicBySlug(params.slug || "");
  const allSlugs = getAllBloodBankSlugs();

  if (!topicData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" data-testid="blood-bank-not-found">
          <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Topic Not Found</h1>
          <p className="text-gray-500 mb-6">The requested blood bank topic could not be found.</p>
          <Link href="/allied-health/mlt/blood-bank" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors" data-testid="link-back-blood-bank">
            Back to Blood Bank Hub
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topicData.seoTitle,
    description: topicData.metaDescription,
    url: `https://www.nursenest.ca/allied-health/mlt/blood-bank/${topicData.slug}`,
    author: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    about: { "@type": "MedicalEntity", name: topicData.name },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topicData.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <AlliedSEO
        title={topicData.seoTitle}
        description={topicData.metaDescription}
        keywords={topicData.keywords}
        canonicalPath={`/allied-health/mlt/blood-bank/${topicData.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
      />

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/allied-health" className="hover:text-red-600 transition-colors">Allied Health</Link>
            <span>/</span>
            <Link href="/allied-health/mlt" className="hover:text-red-600 transition-colors">MLT</Link>
            <span>/</span>
            <Link href="/allied-health/mlt/blood-bank" className="hover:text-red-600 transition-colors">Blood Bank</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{topicData.name}</span>
          </div>
        </nav>

        <header className="bg-gradient-to-br from-red-800 to-red-950 text-white py-12 px-4" data-testid="blood-bank-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-red-300" />
              </div>
              <span className="text-red-300 text-sm font-semibold uppercase tracking-wider">Blood Bank / Transfusion Medicine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-blood-bank-title">
              {topicData.name}
            </h1>
            <p className="text-red-200 text-lg leading-relaxed max-w-3xl">
              {topicData.overview}
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {topicData.antigenAntibodyInfo && topicData.antigenAntibodyInfo.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-antigen-antibody">
              <div className="flex items-center gap-3 mb-6">
                <Microscope className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Antigen-Antibody Concepts</h2>
              </div>
              <div className="space-y-6">
                {topicData.antigenAntibodyInfo.map((info, idx) => (
                  <div key={idx} className="border-l-3 border-red-200 pl-5">
                    <h3 className="font-bold text-gray-900 mb-2">{info.heading}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{info.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {topicData.procedureSteps && topicData.procedureSteps.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-procedure-steps">
              <div className="flex items-center gap-3 mb-6">
                <ListChecks className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Step-by-Step Procedure</h2>
              </div>
              <div className="space-y-4">
                {topicData.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{step.step.replace(/^\d+\.\s*/, '')}</p>
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {topicData.rules && topicData.rules.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-rules">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Transfusion Rules & Principles</h2>
              </div>
              <div className="space-y-4">
                {topicData.rules.map((rule, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                    <p className="font-bold text-red-800 text-sm mb-1">{rule.rule}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{rule.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {topicData.reactionTypes && topicData.reactionTypes.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-reaction-types">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Reaction Types</h2>
              </div>
              <div className="space-y-6">
                {topicData.reactionTypes.map((reaction, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-3">{reaction.type}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">Timing</span>
                        <span className="text-gray-600">{reaction.timing}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">Signs & Symptoms</span>
                        <span className="text-gray-600">{reaction.signs}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">Management</span>
                        <span className="text-gray-600">{reaction.management}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {topicData.comparisonTable && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-comparison-table">
              <div className="flex items-center gap-3 mb-6">
                <Table2 className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Comparison Table</h2>
              </div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-red-50">
                      {topicData.comparisonTable.headers.map((header, i) => (
                        <th key={i} className="text-left px-3 py-2.5 font-semibold text-red-900 border-b border-red-100 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topicData.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">{row.feature}</td>
                        {row.values.map((val, vIdx) => (
                          <td key={vIdx} className="px-3 py-2.5 text-gray-600">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200/50 p-6 md:p-8" data-testid="section-exam-traps">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Critical Exam Traps</h2>
            </div>
            <ul className="space-y-3">
              {topicData.examTraps.map((trap, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                  <span className="w-6 h-6 rounded-full bg-red-200/60 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{trap}</span>
                </li>
              ))}
            </ul>
          </section>

          <section data-testid="section-practice-questions">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Free Practice Questions</h2>
            </div>
            <div className="space-y-6">
              {topicData.practiceQuestions.map((q, idx) => (
                <PracticeQuestion key={idx} question={q} index={idx} />
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 text-center text-white" data-testid="section-premium-cta">
            <Lock className="w-10 h-10 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Struggling with Blood Bank Questions?</h2>
            <p className="text-red-200 mb-6 max-w-xl mx-auto">
              Unlock 300+ Blood Bank Practice Questions with detailed rationales explaining why each answer is right — and why every distractor is wrong.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/allied-health/mlt/questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-800 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-lg" data-testid="button-cta-unlock-questions">
                Unlock 300+ Blood Bank Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="button-cta-pricing">
                View Plans
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {topicData.faqItems.map((item, idx) => (
                <FAQItem key={idx} question={item.question} answer={item.answer} index={idx} />
              ))}
            </div>
          </section>

          {bloodBankInternalLinks[topicData.slug] && bloodBankInternalLinks[topicData.slug].length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-internal-links">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Recommended Reading</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bloodBankInternalLinks[topicData.slug].map((link, i) => (
                  <Link
                    key={i}
                    href={link.target}
                    className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm"
                    data-testid={`link-internal-${i}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700 hover:text-red-700">{link.anchor}</span>
                      <span className="text-gray-400 text-xs ml-2">— {link.reason}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-related-topics">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Related Blood Bank Topics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allSlugs
                .filter((s) => s !== topicData.slug)
                .map((slug) => (
                  <Link
                    key={slug}
                    href={`/allied-health/mlt/blood-bank/${slug}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700"
                    data-testid={`link-related-topic-${slug}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                  </Link>
                ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-exam-resources">
            <div className="flex items-center gap-3 mb-4">
              <FlaskConical className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">MLT Exam Resources</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link href="/allied-health/mlt/blood-bank" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-blood-bank-hub">
                <ArrowRight className="w-3.5 h-3.5" /><span>Blood Bank Hub</span>
              </Link>
              <Link href="/allied-health/mlt/blood-bank/cheat-sheet" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-cheat-sheet">
                <ArrowRight className="w-3.5 h-3.5" /><span>Blood Bank Cheat Sheet</span>
              </Link>
              <Link href="/allied-health/mlt/questions" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-mlt-questions">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Question Bank</span>
              </Link>
              <Link href="/allied-health/mlt/exam-prep" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-mlt-exam-prep">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Exam Prep</span>
              </Link>
              <Link href="/lab-values" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-lab-values">
                <ArrowRight className="w-3.5 h-3.5" /><span>Lab Values Reference</span>
              </Link>
              <Link href="/allied-health/mlt/flashcard-prep" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-flashcards">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Flashcards</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
