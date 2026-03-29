import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { Breadcrumbs } from "@/allied/components/paramedic-seo-components";
import { FinalCTASection, RegionSelector, RegionNotesCallout } from "./components";
import { useParamedicRegion } from "@/allied/contexts/paramedic-region-context";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, CheckCircle2, XCircle, ArrowRight, BookOpen,
  Target, ChevronDown, ChevronUp, Lock, FileText
} from "lucide-react";

interface SampleQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
  regionScope: string;
}

interface RelatedTopic {
  topicSlug: string;
  topic: string;
  questionCount: number;
}

interface TopicData {
  topicSlug: string;
  topic: string;
  category: string;
  categorySlug: string;
  totalQuestions: number;
  sampleQuestions: SampleQuestion[];
  relatedTopics: RelatedTopic[];
  difficulties: number[];
}

function DifficultyBadge({ level }: { level: number }) {
  const { t } = useI18n();
  const config = level <= 2
    ? { label: "Foundational", color: "bg-green-100 text-green-700" }
    : level <= 3
    ? { label: "Intermediate", color: "bg-yellow-100 text-yellow-700" }
    : { label: "Advanced", color: "bg-red-100 text-red-700" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`} data-testid={`badge-difficulty-${level}`}>
      {config.label}
    </span>
  );
}

function QuestionCard({ question, index, isLocked }: { question: SampleQuestion; index: number; isLocked: boolean }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden" data-testid={`question-card-locked-${index}`}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">{t("allied.paramedicParamedicQuestionSeo.signUpForFreeTo")}</p>
            <Link href="/diagnostic?career=paramedic" className="inline-flex items-center gap-1 text-teal-600 text-sm font-semibold mt-2 hover:text-teal-700" data-testid="link-unlock-questions">
              Start Free <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="blur-sm">
          <p className="text-sm text-gray-700 mb-4">{t("allied.paramedicParamedicQuestionSeo.questionPreviewIsLocked")}</p>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === question.correctIndex;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`question-card-${index}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question {index + 1}</span>
        <DifficultyBadge level={question.difficulty} />
      </div>
      <p className="text-sm text-gray-800 font-medium mb-4 leading-relaxed" data-testid={`question-stem-${index}`}>
        {question.stem}
      </p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, oi) => {
          const isSelected = selectedOption === oi;
          const isAnswer = oi === question.correctIndex;
          let borderColor = "border-gray-200 hover:border-teal-300";
          let bgColor = "bg-white";
          if (showAnswer && isAnswer) {
            borderColor = "border-green-400";
            bgColor = "bg-green-50";
          } else if (showAnswer && isSelected && !isCorrect) {
            borderColor = "border-red-400";
            bgColor = "bg-red-50";
          } else if (isSelected && !showAnswer) {
            borderColor = "border-teal-400";
            bgColor = "bg-teal-50";
          }

          return (
            <button
              key={oi}
              onClick={() => {
                if (!showAnswer) {
                  setSelectedOption(oi);
                  setShowAnswer(true);
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-lg border ${borderColor} ${bgColor} transition-all text-sm flex items-center gap-3`}
              disabled={showAnswer}
              data-testid={`option-${index}-${oi}`}
            >
              <span className="font-semibold text-gray-400 w-5">{String.fromCharCode(65 + oi)}.</span>
              <span className="flex-1">{opt}</span>
              {showAnswer && isAnswer && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
              {showAnswer && isSelected && !isCorrect && oi === selectedOption && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mt-4" data-testid={`rationale-${index}`}>
          <h4 className="text-sm font-semibold text-teal-800 mb-2">{t("allied.paramedicParamedicQuestionSeo.rationale")}</h4>
          <p className="text-sm text-teal-900 leading-relaxed">{question.rationale}</p>
        </div>
      )}

      {!showAnswer && selectedOption === null && (
        <p className="text-xs text-gray-400 mt-2">{t("allied.paramedicParamedicQuestionSeo.clickAnAnswerToReveal")}</p>
      )}
    </div>
  );
}

export default function ParamedicQuestionSeoPage() {
  const params = useParams<{ topicSlug: string }>();
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { region, isCanada } = useParamedicRegion();

  useEffect(() => {
    if (!params.topicSlug) return;
    setLoading(true);
    fetch(`/api/paramedic/question-topics/${params.topicSlug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.topicSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicQuestionSeo.topicNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.paramedicParamedicQuestionSeo.theParamedicQuestionTopicYoure")}</p>
        <Link href="/allied-health/paramedic/questions" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-topics">
          Browse All Topics
        </Link>
      </div>
    );
  }

  const regionFilteredQuestions = useMemo(() => {
    return data.sampleQuestions.filter(q =>
      q.regionScope === "BOTH" || q.regionScope === region
    );
  }, [data.sampleQuestions, region]);

  const topicTitle = data.topic.charAt(0).toUpperCase() + data.topic.slice(1);
  const freeQuestions = regionFilteredQuestions.slice(0, 5);
  const lockedQuestions = regionFilteredQuestions.slice(5);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: "Practice Questions", href: "/allied-health/paramedic/questions" },
    { label: topicTitle, href: `/allied-health/paramedic/questions/${data.topicSlug}` },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: `https://www.nursenest.ca/allied-health${b.href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${topicTitle} — Paramedic Practice Questions`,
      description: `Practice ${data.totalQuestions} paramedic exam questions on ${topicTitle}. Covers ${data.category} with detailed clinical rationales. Free sample questions included.`,
      publisher: { "@type": "Organization", name: "NurseNest" },
      about: { "@type": "Thing", name: topicTitle },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How many ${topicTitle} questions are available?`,
          acceptedAnswer: { "@type": "Answer", text: `We have ${data.totalQuestions} practice questions specifically on ${topicTitle}, part of our ${data.category} category. Each question includes detailed clinical rationales.` },
        },
        {
          "@type": "Question",
          name: `What difficulty levels are covered?`,
          acceptedAnswer: { "@type": "Answer", text: `Questions range from foundational (level 1-2) to advanced (level 4-5), covering all difficulty levels tested on paramedic certification exams.` },
        },
      ],
    },
  ];

  return (
    <div data-testid="paramedic-question-seo-page">
      <AlliedSEO
        title={`${topicTitle} — Paramedic Practice Questions | NurseNest`}
        description={`Practice ${data.totalQuestions} paramedic exam questions on ${topicTitle}. Part of ${data.category} with 600+ word clinical rationales. Free sample questions and full question bank access.`}
        keywords={`${data.topic} paramedic questions, ${data.topic} practice test, ${data.category} exam questions, paramedic ${data.topic}, NREMT ${data.topic}`}
        canonicalPath={`/allied-health/paramedic/questions/${data.topicSlug}`}
        structuredData={structuredData[0]}
        additionalStructuredData={structuredData.slice(1)}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50 border-b border-gray-100 py-10 px-4" data-testid="section-topic-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href={`/allied-health/paramedic/questions`} className="text-xs text-teal-600 hover:text-teal-700 font-medium" data-testid="link-category-breadcrumb">
              {data.category}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize" data-testid="text-topic-title">
            {topicTitle} — Practice Questions
          </h1>
          <p className="text-lg text-gray-600 mb-4" data-testid="text-topic-description">
            Test your knowledge of {data.topic} with {data.totalQuestions} paramedic exam-style questions.
            Each question includes a detailed clinical rationale explaining the correct answer and why other options are incorrect.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600" data-testid="badge-question-count">
              <Target className="w-3.5 h-3.5 inline mr-1" />
              {data.totalQuestions} Questions
            </span>
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600" data-testid="badge-category">
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              {data.category}
            </span>
            {data.difficulties.length > 0 && (
              <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                Levels {Math.min(...data.difficulties)}-{Math.max(...data.difficulties)}
              </span>
            )}
          </div>
          <RegionSelector />
        </div>
      </section>

      <section className="py-8 sm:py-12" data-testid="section-topic-overview">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-teal-800 mb-2">About {topicTitle}</h2>
            <p className="text-sm text-teal-900 leading-relaxed">
              {topicTitle} is a key topic within {data.category} on paramedic certification exams including NREMT, COPR (PCP/ACP), and provincial licensing.
              This topic tests your ability to assess, manage, and make clinical decisions related to {data.topic} in prehospital settings.
              Questions range from foundational knowledge to advanced clinical scenarios requiring critical thinking.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-12" data-testid="section-sample-questions">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6" data-testid="text-sample-questions-title">
            Sample Questions — {topicTitle}
          </h2>
          <div className="space-y-6">
            {freeQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} isLocked={false} />
            ))}
            {lockedQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={freeQuestions.length + i} isLocked={true} />
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-8 border border-purple-100 text-center" data-testid="cta-full-access">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access All {data.totalQuestions} Questions on {topicTitle}</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
              Get full access to every question with detailed clinical rationales, adaptive difficulty, and progress tracking.
            </p>
            <Link href="/diagnostic?career=paramedic" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-access-full-bank">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {data.relatedTopics.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white" data-testid="section-related-topics">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Topics in {data.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedTopics.map(rt => (
                <Link
                  key={rt.topicSlug}
                  href={`/allied-health/paramedic/questions/${rt.topicSlug}`}
                  className="group flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all"
                  data-testid={`link-related-${rt.topicSlug}`}
                >
                  <Target className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors capitalize">{rt.topic}</h3>
                    <p className="text-xs text-gray-400">{rt.questionCount} questions</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 border-t border-gray-100" data-testid="section-internal-links">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("allied.paramedicParamedicQuestionSeo.moreParamedicStudyResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/allied-health/paramedic/lessons" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-lessons">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("allied.paramedicParamedicQuestionSeo.lessons")}</h3>
                <p className="text-xs text-gray-500">{t("allied.paramedicParamedicQuestionSeo.indepthClinicalGuides")}</p>
              </div>
            </Link>
            <Link href="/allied-health/paramedic/exams" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-exams">
              <FileText className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("allied.paramedicParamedicQuestionSeo.practiceExams")}</h3>
                <p className="text-xs text-gray-500">{t("allied.paramedicParamedicQuestionSeo.blueprintweightedMocks")}</p>
              </div>
            </Link>
            <Link href="/allied-health/paramedic/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-all-topics">
              <Target className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("allied.paramedicParamedicQuestionSeo.allTopics")}</h3>
                <p className="text-xs text-gray-500">{t("allied.paramedicParamedicQuestionSeo.browseByClinicalTopic")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FinalCTASection
        title={`Master ${topicTitle} for Your Paramedic Exam`}
        subtitle="Start with a free diagnostic to see where you stand, then follow your personalized study plan."
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View All Topics", href: "/allied-health/paramedic/questions" }}
      />
    </div>
  );
}
