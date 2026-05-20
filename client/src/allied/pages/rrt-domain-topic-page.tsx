import { useState, useMemo } from "react";
import { Link, useRoute } from "wouter";
import {
  Wind, Shield, Droplets, Syringe, Zap, Heart, Moon,
  Gauge, Baby, Monitor, Settings, ShieldAlert, Beaker,
  ChevronRight, ArrowRight, BookOpen, Brain, Lock,
  CheckCircle2, GraduationCap, Star, XCircle, ChevronDown
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { useAuth } from "@/lib/auth";
import { getRrtDomainBySlug, RRT_DOMAIN_CONFIGS } from "@/data/rrt-domain-seo-data";
import { rrtDomainQuestions } from "@/data/career-questions/rrt-domain-questions";
import { rrtDomainQuestionsBatch2 } from "@/data/career-questions/rrt-domain-questions-batch2";
import { rrtDomainQuestionsBatch3 } from "@/data/career-questions/rrt-domain-questions-batch3";
import { rrtDomainQuestionsBatch4 } from "@/data/career-questions/rrt-domain-questions-batch4";
import { rrtDomainQuestionsBatch5 } from "@/data/career-questions/rrt-domain-questions-batch5";
import { rrtDomainQuestionsBatch6 } from "@/data/career-questions/rrt-domain-questions-batch6";
import { rrtDomainQuestionsBatch7 } from "@/data/career-questions/rrt-domain-questions-batch7";
import { rrtDomainQuestionsBatch8 } from "@/data/career-questions/rrt-domain-questions-batch8";
import type { CareerQuestion } from "@/data/career-questions/rrt-questions";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, LucideIcon> = {
  Wind, Shield, Droplets, Syringe, Zap, Heart, Moon,
  Gauge, Baby, Monitor, Settings, ShieldAlert, Beaker
};

const FREE_PREVIEW_COUNT = 5;

const ALL_DOMAIN_QUESTIONS: CareerQuestion[] = [
  ...rrtDomainQuestions,
  ...rrtDomainQuestionsBatch2,
  ...rrtDomainQuestionsBatch3,
  ...rrtDomainQuestionsBatch4,
  ...rrtDomainQuestionsBatch5,
  ...rrtDomainQuestionsBatch6,
  ...rrtDomainQuestionsBatch7,
  ...rrtDomainQuestionsBatch8,
];

function getQuestionsForDomain(domainName: string): CareerQuestion[] {

  return ALL_DOMAIN_QUESTIONS.filter(q => q.category === domainName);
}

export function RrtDomainTopicPage() {
  const [, params] = useRoute("/allied-health/rrt/domain/:slug");
  const slug = params?.slug || "";
  const config = getRrtDomainBySlug(slug);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="domain-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.rrtDomainTopicPage.domainNotFound")}</h1>
          <Link href="/allied-health/rrt" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700" data-testid="link-back-rrt">
            Back to RRT Hub
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[config.icon] || BookOpen;
  const questions = useMemo(() => getQuestionsForDomain(config.domain), [config.domain]);
  const freeQuestions = questions.slice(0, FREE_PREVIEW_COUNT);
  const premiumQuestions = questions.slice(FREE_PREVIEW_COUNT);

  return (
    <div data-testid={`rrt-domain-${slug}`}>
      <AlliedSEO
        title={config.seoTitle}
        description={config.metaDescription}
        keywords={config.keywords}
        canonicalPath={`/allied-health/rrt/domain/${slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: config.title,
          description: config.metaDescription,
          mainEntityOfPage: `https://www.nursenest.ca/allied-health/rrt/domain/${slug}`,
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          about: { "@type": "MedicalSpecialty", name: "Respiratory Therapy" },
          educationalLevel: "Professional Certification",
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "RRT Exam Prep", item: "https://www.nursenest.ca/allied-health/rrt" },
              { "@type": "ListItem", position: 3, name: config.domain, item: `https://www.nursenest.ca/allied-health/rrt/domain/${slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: config.faqs.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <section className={`relative overflow-hidden bg-gradient-to-br ${config.color.bg} via-white to-white py-16 sm:py-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("allied.rrtDomainTopicPage.breadcrumb")} data-testid="breadcrumb-nav">
            <Link href="/allied-health" className="hover:text-teal-600" data-testid="breadcrumb-home">{t("allied.rrtDomainTopicPage.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/rrt" className="hover:text-teal-600" data-testid="breadcrumb-rrt">{t("allied.rrtDomainTopicPage.rrtExamPrep")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${config.color.text} font-medium`}>{config.domain}</span>
          </nav>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${config.color.bg} ${config.color.text} rounded-full text-sm font-medium mb-4`} data-testid="badge-domain">
              <Icon className="w-4 h-4" />
              {config.domain}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-domain-title">
              {config.domain}<br />
              <span className={config.color.text}>{t("allied.rrtDomainTopicPage.practiceQuestionsStudyGuide")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-domain-subtitle">
              {config.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{questions.length} Practice Questions</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{t("allied.rrtDomainTopicPage.nbrcTmcCseAligned")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Exam Weight: {config.examWeight}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{config.subtopics.length} Subtopics</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#free-preview" className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.color.gradient} text-white rounded-xl text-sm font-semibold shadow-lg transition-all hover:opacity-90`} data-testid="button-try-free">
                <BookOpen className="w-4 h-4" /> Try Free Questions
              </a>
              <Link href="/allied-health/qbank?career=rrt" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-all" data-testid="button-full-qbank">
                <Brain className="w-4 h-4" /> Full RRT Question Bank
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EducationalContentSection config={config} Icon={Icon} />

      <section id="free-preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-free-preview-heading">
            Free Practice Questions
          </h2>
        </div>
        <p className="text-gray-500 mb-8">
          Try {Math.min(FREE_PREVIEW_COUNT, questions.length)} {config.domain} questions free — no account required.
        </p>
        <div className="space-y-6">
          {freeQuestions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} isFree={true} />
          ))}
        </div>
      </section>

      <MidPageCTA config={config} questionCount={questions.length} />

      {premiumQuestions.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-premium-heading">
              Premium {config.domain} Questions
            </h2>
          </div>
          <p className="text-gray-500 mb-8">
            Unlock {premiumQuestions.length} more questions with detailed rationales and exam tips.
          </p>
          <div className="space-y-6 relative">
            {premiumQuestions.slice(0, 3).map((q, i) => (
              <QuestionCard key={q.id} question={q} index={FREE_PREVIEW_COUNT + i} isFree={false} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white flex items-end justify-center pb-8 pointer-events-none">
              <div className="pointer-events-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  {premiumQuestions.length} More Questions Available
                </div>
                <p className="text-gray-600 text-sm mb-4">Unlock all {config.domain} questions with NurseNest Allied Pro</p>
                <Link
                  href="/allied-health/pricing"
                  className={`inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r ${config.color.gradient} text-white rounded-xl text-base font-semibold shadow-lg transition-all hover:opacity-90`}
                  data-testid="button-unlock-premium"
                >
                  Unlock All Questions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <SubtopicsSection config={config} />

      <RelatedDomainsSection slug={slug} config={config} />

      <FAQSection config={config} />

      <EndPageCTA config={config} />
    </div>
  );
}

function QuestionCard({ question, index, isFree }: { question: CareerQuestion; index: number; isFree: boolean }) {
  const { user } = useAuth();
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";
  const canInteract = isFree || isPro;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (optIdx: number) => {
    if (!canInteract || answered) return;
    setSelectedAnswer(optIdx);
    setAnswered(true);
  };

  const isCorrect = answered && selectedAnswer === question.correctIndex;

  return (
    <div className={`bg-white rounded-2xl border ${answered ? (isCorrect ? "border-green-200" : "border-red-200") : "border-gray-200"} p-6 transition-all`} data-testid={`question-card-${question.id}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">Question {index + 1}</span>
        <div className="flex items-center gap-2">
          {question.questionType && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded">{question.questionType}</span>
          )}
          <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded">
            Difficulty: {"★".repeat(question.difficulty)}{"☆".repeat(5 - question.difficulty)}
          </span>
          {!isFree && !isPro && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-600 rounded flex items-center gap-1">
              <Lock className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
      </div>
      <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed" data-testid={`text-stem-${question.id}`}>{question.stem}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((opt, oi) => {
          let optClass = "bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer";
          if (!canInteract) optClass = "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed blur-[2px]";
          if (answered && oi === question.correctIndex) optClass = "bg-green-50 border-green-300";
          if (answered && oi === selectedAnswer && oi !== question.correctIndex) optClass = "bg-red-50 border-red-300";
          if (!answered && selectedAnswer === oi) optClass = "bg-blue-50 border-blue-300";

          return (
            <button
              key={oi}
              onClick={() => handleSelect(oi)}
              disabled={!canInteract || answered}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${optClass}`}
              data-testid={`option-${question.id}-${oi}`}
            >
              <span className="font-medium text-gray-500 flex-shrink-0 mt-0.5">{String.fromCharCode(65 + oi)}.</span>
              <span className="text-gray-800">{opt}</span>
              {answered && oi === question.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5 ml-auto" />}
              {answered && oi === selectedAnswer && oi !== question.correctIndex && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 ml-auto" />}
            </button>
          );
        })}
      </div>

      {answered && canInteract && (
        <div className={`mt-4 p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`} data-testid={`rationale-${question.id}`}>
          <p className="text-sm font-semibold mb-2 text-gray-900">
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"} — Rationale:
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.rationale}</p>
          {question.examTip && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">{t("allied.rrtDomainTopicPage.examTip")}</p>
              <p className="text-xs text-blue-600">{question.examTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EducationalContentSection({ config, Icon }: { config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never; Icon: LucideIcon }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-educational-content">
        {config.domain} — Key Concepts for the RRT Exam
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" /> Key Definitions
          </h3>
          <ul className="space-y-3">
            {config.educationalContent.definitions.map((d, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" /> Key Formulas
          </h3>
          <ul className="space-y-3">
            {config.educationalContent.keyFormulas.map((f, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-indigo-500 font-mono font-bold flex-shrink-0">ƒ</span>
                <span className="font-mono text-xs bg-indigo-50 px-2 py-1 rounded">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-500" /> Normal Values
          </h3>
          <ul className="space-y-3">
            {config.educationalContent.normalValues.map((v, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" /> Clinical Decision Steps
          </h3>
          <ol className="space-y-3">
            {config.educationalContent.clinicalDecisionSteps.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function MidPageCTA({ config, questionCount }: { config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never; questionCount: number }) {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-gradient-to-br ${config.color.gradient} rounded-2xl p-8 sm:p-10 text-white text-center`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3" data-testid="text-mid-cta">
            Ready for More {config.domain} Questions?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Access all {questionCount} {config.domain} questions plus 500+ questions across all 13 RRT exam domains with NurseNest Allied Pro.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl text-base font-semibold hover:bg-gray-50 transition-colors" data-testid="button-mid-cta-pricing">
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/qbank?career=rrt" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white rounded-xl text-base font-semibold hover:bg-white/30 transition-colors border border-white/30" data-testid="button-mid-cta-qbank">
              Try Question Bank
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubtopicsSection({ config }: { config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never }) {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center" data-testid="text-subtopics-heading">
          {config.domain} Subtopics Covered
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-2xl mx-auto">
          Our {config.domain} question bank covers all subtopics tested on the NBRC TMC and CSE exams.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.subtopics.map((topic, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${config.color.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-bold ${config.color.text}`}>{i + 1}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedDomainsSection({ slug, config }: { slug: string; config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never }) {
  const related = config.relatedDomains
    .map((s: string) => RRT_DOMAIN_CONFIGS.find((d: any) => d.slug === s))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="text-related-heading">{t("allied.rrtDomainTopicPage.relatedRrtExamDomains")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((r: any) => {
          const RIcon = ICON_MAP[r.icon] || BookOpen;
          return (
            <Link
              key={r.slug}
              href={`/allied-health/rrt/domain/${r.slug}`}
              className={`group flex items-center gap-3 p-4 bg-white rounded-xl border ${r.color.border} hover:shadow-md transition-all`}
              data-testid={`link-related-${r.slug}`}
            >
              <div className={`w-10 h-10 rounded-lg ${r.color.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <RIcon className={`w-5 h-5 ${r.color.text}`} />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{r.domain}</span>
                <span className="block text-xs text-gray-400">{r.examWeight} exam weight</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection({ config }: { config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never }) {
  return (
    <section className="py-12 bg-white" data-testid="domain-faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-faq-heading">
          Frequently Asked Questions — {config.domain}
        </h2>
        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <details key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group" data-testid={`faq-item-${i}`}>
              <summary className="px-6 py-4 cursor-pointer text-base font-medium text-gray-900 hover:text-blue-700 transition-colors list-none flex items-center justify-between">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function EndPageCTA({ config }: { config: ReturnType<typeof getRrtDomainBySlug> extends infer T ? NonNullable<T> : never }) {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className={`bg-gradient-to-br ${config.color.gradient} rounded-2xl p-8 sm:p-12 text-white`}>
          <h2 className="text-2xl font-bold mb-3" data-testid="text-end-cta">
            Master {config.domain} for the NBRC Exam
          </h2>
          <p className="text-white/80 mb-6">
            Unlock all practice questions across 13 RRT exam domains, detailed rationales, and clinical exam tips with NurseNest Allied Pro.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl text-base font-semibold hover:bg-gray-50 transition-colors" data-testid="button-end-cta-pricing">
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/rrt" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white rounded-xl text-base font-semibold hover:bg-white/30 transition-colors border border-white/30" data-testid="button-back-to-rrt">
              Back to RRT Hub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RrtDomainTopicPage;
