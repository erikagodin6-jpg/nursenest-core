import { useState } from "react";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { SEO_EXAM_PAGES, type SeoExamPageConfig, type SeoSampleQuestion } from "@/data/seo-exam-data";
import { getMockExamCountByExamCode } from "@/lib/flagship-mock-exam-configs";
import { useI18n } from "@/lib/i18n";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Shield,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  Target,
  Zap,
  GraduationCap,
} from "lucide-react";

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

function SampleQuestion({ q, index }: { q: SeoSampleQuestion; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowRationale(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`sample-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4">{index + 1}. {q.stem}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((option, i) => {
          let optionStyle = "border-gray-200 hover:border-[#BFA6F6] hover:bg-[#BFA6F6]/5 cursor-pointer";
          if (selected !== null) {
            if (i === q.correctIndex) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (i === selected && i !== q.correctIndex) {
              optionStyle = "border-red-400 bg-red-50 text-red-900";
            } else {
              optionStyle = "border-gray-200 opacity-60";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${optionStyle}`}
              disabled={selected !== null}
              data-testid={`question-${index}-option-${i}`}
            >
              <span className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{option}</span>
              {selected !== null && i === q.correctIndex && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
              {selected !== null && i === selected && i !== q.correctIndex && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="bg-[#BFA6F6]/10 border border-[#BFA6F6]/20 rounded-lg p-4 mt-3" data-testid={`question-${index}-rationale`}>
          <p className="text-sm font-semibold text-[#2E3A59] mb-1">{t("pages.examLanding.rationale")}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{q.rationale}</p>
        </div>
      )}
    </div>
  );
}

function ExamNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold text-[#2E3A59] mb-4" data-testid="text-exam-not-found">{t("pages.examLanding.examNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.examLanding.theExamPageYouAre")}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {SEO_EXAM_PAGES.map(page => (
            <LocaleLink
              key={page.slug}
              href={`/${page.slug}`}
              className="text-[#BFA6F6] hover:underline"
              data-testid={`link-exam-${page.slug}`}
            >
              {page.examName}
            </LocaleLink>
          ))}
        </div>
      </div>
    </div>
  );
}

const FEATURE_ICONS = [Zap, Clock, Layers, BarChart3, Target, Shield];

export default function ExamLandingPage() {
  const [location] = useLocation();
  const pathSlug = location.replace(/^\/(?:en|fr|es|fil|hi|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th)\//, "/").replace(/^\//, "").replace(/\//g, "-").replace(/-$/, "");
  const examData = SEO_EXAM_PAGES.find(p => p.slug === pathSlug);

  if (!examData) {
    return <ExamNotFound />;
  }

  const faqStructuredData = buildFaqStructuredData(
    examData.faqItems.map(f => ({ question: f.question, answer: f.answer }))
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: examData.h1Title,
    description: examData.introText,
    author: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/${examData.slug}`,
    },
  };

  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: examData.examName,
    credentialCategory: "Professional Licensure Examination",
    educationalLevel: examData.tier === "np" ? "Graduate" : examData.tier === "rn" ? "Undergraduate" : "Vocational",
    competencyRequired: examData.formatDetails.questionTypes.join(", "),
    recognizedBy: {
      "@type": "Organization",
      name: examData.region === "CA" ? "NCSBN Canada" : examData.region === "US" ? "NCSBN" : "NCSBN",
    },
  };

  const adaptiveLabel = examData.formatDetails.adaptiveOrFixed === "adaptive"
    ? "Computer Adaptive Testing (CAT)"
    : examData.formatDetails.adaptiveOrFixed === "fixed"
      ? "Fixed-Length Exam"
      : "Linear Scaled Testing";

  return (
    <>
      <SEO
        title={examData.h1Title}
        description={examData.introText.slice(0, 160)}
        keywords={examData.targetKeywords.join(", ")}
        canonicalPath={`/${examData.slug}`}
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData, credentialSchema]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Practice Exams", url: "https://www.nursenest.ca/mock-exams" },
          { name: examData.examName, url: `https://www.nursenest.ca/${examData.slug}` },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-[#2E3A59] to-[#3d4d73] text-white py-16 md:py-20" data-testid="exam-hero">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="exam-breadcrumb">
              <LocaleLink href="/" className="hover:text-white/80">{t("pages.examLanding.home")}</LocaleLink>
              <ChevronRight className="w-3 h-3" />
              <LocaleLink href="/mock-exams" className="hover:text-white/80">{t("pages.examLanding.practiceExams")}</LocaleLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{examData.examName}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#BFA6F6]/20 text-[#BFA6F6] rounded-full text-xs font-semibold uppercase tracking-wider" data-testid="text-exam-code">
                {examData.examCode}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium" data-testid="text-exam-region">
                {examData.region === "CA" ? "Canada" : examData.region === "US" ? "United States" : "US and Canada"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-exam-title">
              {examData.h1Title}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl" data-testid="text-exam-intro">
              {examData.introText}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
          <section data-testid="section-exam-format">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examLanding.examFormat")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div data-testid="text-question-count">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examLanding.questions")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{examData.formatDetails.questionCount}</p>
                </div>
                <div data-testid="text-time-limit">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examLanding.timeLimit")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{examData.formatDetails.timeLimit}</p>
                </div>
                <div data-testid="text-testing-format">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examLanding.testingFormat")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{adaptiveLabel}</p>
                </div>
                <div data-testid="text-pass-rate">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examLanding.passRate")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{examData.formatDetails.passRate}</p>
                </div>
                <div data-testid="text-mock-exam-count">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examLanding.mockExams")}</p>
                  <p className="text-lg font-bold text-[#2E3A59] flex items-center gap-1.5">
                    <GraduationCap className="w-5 h-5 text-[#BFA6F6]" />
                    {(() => {
                      const counts = getMockExamCountByExamCode();
                      const examCodes = examData.examCode ? [examData.examCode] : [];
                      const relatedCodes: Record<string, string[]> = {
                        "NCLEX-RN": ["NCLEX-RN"],
                        "NCLEX-PN": ["NCLEX-PN"],
                        "REX-PN": ["REX-PN"],
                        "AANP": ["AANP"],
                        "ANCC": ["ANCC"],
                      };
                      const codes = relatedCodes[examData.examCode] || examCodes;
                      const total = codes.reduce((s, c) => s + (counts[c] || 0), 0);
                      return total > 0 ? `${total} Available` : "Coming Soon";
                    })()}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t("pages.examLanding.questionTypes")}</p>
                <div className="flex flex-wrap gap-2">
                  {examData.formatDetails.questionTypes.map((qt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      data-testid={`badge-question-type-${i}`}
                    >
                      {qt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section data-testid="section-features">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examLanding.platformFeatures")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {examData.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#BFA6F6]/30 transition-colors"
                    data-testid={`card-feature-${i}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#BFA6F6]" />
                      </div>
                      <h3 className="font-semibold text-[#2E3A59]">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section data-testid="section-sample-questions">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examLanding.trySampleQuestions")}</h2>
            </div>
            <p className="text-gray-600 mb-6 ml-[52px]">
              Test your knowledge with these {examData.examName}-style practice questions. Select an answer to reveal the rationale.
            </p>
            <div className="space-y-4">
              {examData.sampleQuestions.map((q, i) => (
                <SampleQuestion key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-8 text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">Ready to Start Your {examData.examName} Prep?</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Access hundreds of {examData.examName} practice questions, timed mock exams, detailed rationales, and performance analytics on NurseNest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink
                href="/mock-exams"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#BFA6F6] text-white rounded-lg font-semibold hover:bg-[#a88de8] transition-colors"
                data-testid="link-start-exam"
              >
                Start Practice Exam
                <ArrowRight className="w-4 h-4" />
              </LocaleLink>
              <LocaleLink
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2E3A59] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                data-testid="link-view-plans"
              >
                View Plans
              </LocaleLink>
            </div>
          </section>

          <section data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examLanding.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="space-y-3">
              {examData.faqItems.map((f, i) => (
                <FAQItem key={i} question={f.question} answer={f.answer} index={i} />
              ))}
            </div>
          </section>

          <section data-testid="section-internal-links">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-4">{t("pages.examLanding.exploreMoreExamPrep")}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SEO_EXAM_PAGES.filter(p => p.slug !== examData.slug).map(page => (
                <LocaleLink
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                  data-testid={`link-exam-${page.slug}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{page.examName}</p>
                      <p className="text-xs text-gray-500">
                        {page.region === "CA" ? "Canada" : page.region === "US" ? "United States" : "US and Canada"}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                  </div>
                </LocaleLink>
              ))}

              <LocaleLink
                href="/lessons"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                data-testid="link-study-guides"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{t("pages.examLanding.studyGuides")}</p>
                    <p className="text-xs text-gray-500">{t("pages.examLanding.browseAllLessons")}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                </div>
              </LocaleLink>

              <LocaleLink
                href="/flashcards"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                data-testid="link-flashcards"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{t("pages.examLanding.flashcards")}</p>
                    <p className="text-xs text-gray-500">{t("pages.examLanding.reviewKeyConcepts")}</p>
                  </div>
                  <Layers className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                </div>
              </LocaleLink>

              <LocaleLink
                href="/medication-mastery"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                data-testid="link-pharmacology"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{t("pages.examLanding.pharmacology")}</p>
                    <p className="text-xs text-gray-500">{t("pages.examLanding.medicationMastery")}</p>
                  </div>
                  <Target className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                </div>
              </LocaleLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
