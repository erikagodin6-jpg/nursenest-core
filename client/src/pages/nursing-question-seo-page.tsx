import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, CheckCircle2, XCircle, ArrowRight, BookOpen,
  Target, Lock, FileText, Stethoscope, GraduationCap
} from "lucide-react";

interface SampleQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
  questionType: string;
}

interface RelatedTopic {
  topicSlug: string;
  topic: string;
  questionCount: number;
}

interface TopicData {
  topicSlug: string;
  topic: string;
  bodySystem: string;
  bodySystemSlug: string;
  tier: string;
  tierLabel: string;
  examLabel: string;
  totalQuestions: number;
  sampleQuestions: SampleQuestion[];
  relatedTopics: RelatedTopic[];
  difficulties: number[];
}

interface IndexData {
  tier: string;
  tierLabel: string;
  examLabel: string;
  topics: { topicSlug: string; topic: string; bodySystem: string; questionCount: number; difficulties: number[] }[];
  bodySystems: { bodySystem: string; bodySystemSlug: string; topicCount: number; questionCount: number }[];
  totalQuestions: number;
  totalTopics: number;
}

const TIER_COLORS: Record<string, { primary: string; light: string; gradient: string }> = {
  rpn: { primary: "teal", light: "teal-50", gradient: "from-teal-50 via-white to-emerald-50" },
  rn: { primary: "blue", light: "blue-50", gradient: "from-blue-50 via-white to-indigo-50" },
  np: { primary: "purple", light: "purple-50", gradient: "from-purple-50 via-white to-violet-50" },
};

const TIER_CTA_PATHS: Record<string, string> = {
  rpn: "/practice-questions/rpn/cardiovascular",
  rn: "/practice-questions/rn/cardiovascular",
  np: "/practice-questions/np/cardiovascular",
};

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

function QuestionCard({ question, index, isLocked, tier }: { question: SampleQuestion; index: number; isLocked: boolean; tier: string }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden" data-testid={`question-card-locked-${index}`}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">{t("pages.nursingQuestionSeoPage.signUpForFreeTo")}</p>
            <Link href={`/start-free`} className="inline-flex items-center gap-1 text-teal-600 text-sm font-semibold mt-2 hover:text-teal-700" data-testid="link-unlock-questions">
              Start Free <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="blur-sm">
          <p className="text-sm text-gray-700 mb-4">{t("pages.nursingQuestionSeoPage.questionPreviewIsLocked")}</p>
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
          <h4 className="text-sm font-semibold text-teal-800 mb-2">{t("pages.nursingQuestionSeoPage.rationale")}</h4>
          <p className="text-sm text-teal-900 leading-relaxed">{question.rationale}</p>
        </div>
      )}

      {!showAnswer && selectedOption === null && (
        <p className="text-xs text-gray-400 mt-2">{t("pages.nursingQuestionSeoPage.clickAnAnswerToReveal")}</p>
      )}
    </div>
  );
}

export default function NursingQuestionSeoPage({ tier: propTier }: { tier?: string }) {
  const params = useParams<{ topicSlug: string }>();
  const tier = propTier || "rpn";
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.topicSlug) return;
    setLoading(true);
    fetch(`/api/nursing/question-topics/${tier}/${params.topicSlug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.topicSlug, tier]);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.nursingQuestionSeoPage.topicNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("pages.nursingQuestionSeoPage.theNursingQuestionTopicYoure")}</p>
        <Link href={`/${tier}/questions`} className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-topics">
          Browse All Topics
        </Link>
      </div>
    );
  }

  const topicTitle = data.topic.charAt(0).toUpperCase() + data.topic.slice(1);
  const freeQuestions = data.sampleQuestions.slice(0, 5);
  const lockedQuestions = data.sampleQuestions.slice(5);
  const colors = TIER_COLORS[tier] || TIER_COLORS.rpn;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: data.tierLabel, href: `/${tier}` },
    { label: "Practice Questions", href: `/${tier}/questions` },
    { label: topicTitle, href: `/${tier}/questions/${data.topicSlug}` },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: `https://www.nursenest.ca${b.href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${topicTitle} — ${data.tierLabel} Practice Questions`,
      description: `Practice ${data.totalQuestions} ${data.tierLabel} exam questions on ${topicTitle}. Covers ${data.bodySystem} with detailed clinical rationales.`,
      publisher: { "@type": "Organization", name: "NurseNest" },
      about: { "@type": "Thing", name: topicTitle },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How many ${topicTitle} questions are available for ${data.tierLabel}?`,
          acceptedAnswer: { "@type": "Answer", text: `We have ${data.totalQuestions} practice questions specifically on ${topicTitle} for ${data.tierLabel} students, part of our ${data.bodySystem} category. Each question includes detailed clinical rationales.` },
        },
        {
          "@type": "Question",
          name: `What difficulty levels are covered?`,
          acceptedAnswer: { "@type": "Answer", text: `Questions range from foundational (level 1-2) to advanced (level 4-5), covering all difficulty levels tested on ${data.examLabel} exams.` },
        },
      ],
    },
  ];

  return (
    <div data-testid="nursing-question-seo-page">
      <Helmet>
        <title>{`${topicTitle} — ${data.tierLabel} Practice Questions | NurseNest`}</title>
        <meta name="description" content={`Practice ${data.totalQuestions} ${data.tierLabel} exam questions on ${topicTitle}. Part of ${data.bodySystem} with detailed clinical rationales. Free sample questions and full question bank access.`} />
        <meta name="keywords" content={`${data.topic} nursing questions, ${data.topic} ${tier} practice test, ${data.bodySystem} exam questions, ${data.tierLabel} ${data.topic}, ${data.examLabel} ${data.topic}`} />
        <link rel="canonical" href={`https://www.nursenest.ca/${tier}/questions/${data.topicSlug}`} />
        {structuredData.map((sd, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(sd)}</script>
        ))}
      </Helmet>

      <nav className="bg-white border-b border-gray-100 py-3 px-4" data-testid="breadcrumbs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.href} className="hover:text-teal-600 transition-colors" data-testid={`breadcrumb-${i}`}>{b.label}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>

      <section className={`bg-gradient-to-br ${colors.gradient} border-b border-gray-100 py-10 px-4`} data-testid="section-topic-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href={`/${tier}/questions`} className="text-xs text-teal-600 hover:text-teal-700 font-medium" data-testid="link-body-system-breadcrumb">
              {data.bodySystem}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize" data-testid="text-topic-title">
            {topicTitle} — {data.tierLabel} Practice Questions
          </h1>
          <p className="text-lg text-gray-600 mb-4" data-testid="text-topic-description">
            Test your knowledge of {data.topic} with {data.totalQuestions} {data.tierLabel} exam-style questions.
            Each question includes a detailed clinical rationale explaining the correct answer and why other options are incorrect.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600" data-testid="badge-question-count">
              <Target className="w-3.5 h-3.5 inline mr-1" />
              {data.totalQuestions} Questions
            </span>
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600" data-testid="badge-body-system">
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              {data.bodySystem}
            </span>
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600" data-testid="badge-tier">
              <Stethoscope className="w-3.5 h-3.5 inline mr-1" />
              {data.tierLabel}
            </span>
            {data.difficulties.length > 0 && (
              <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                Levels {Math.min(...data.difficulties)}-{Math.max(...data.difficulties)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12" data-testid="section-topic-overview">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-teal-800 mb-2">About {topicTitle}</h2>
            <p className="text-sm text-teal-900 leading-relaxed">
              {topicTitle} is a key topic within {data.bodySystem} on {data.examLabel} exams.
              This topic tests your ability to assess, manage, and make clinical decisions related to {data.topic} in nursing practice.
              Questions range from foundational knowledge to advanced clinical scenarios requiring critical thinking and clinical judgment.
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
              <QuestionCard key={q.id} question={q} index={i} isLocked={false} tier={tier} />
            ))}
            {lockedQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={freeQuestions.length + i} isLocked={true} tier={tier} />
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-8 border border-purple-100 text-center" data-testid="cta-full-access">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access All {data.totalQuestions} Questions on {topicTitle}</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
              Get full access to every question with detailed clinical rationales, adaptive difficulty, and progress tracking.
            </p>
            <Link href="/start-free" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-access-full-bank">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {data.relatedTopics.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white" data-testid="section-related-topics">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Topics in {data.bodySystem}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedTopics.map(rt => (
                <Link
                  key={rt.topicSlug}
                  href={`/${tier}/questions/${rt.topicSlug}`}
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">More {data.tierLabel} Study Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/lessons" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-lessons">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingQuestionSeoPage.lessons")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingQuestionSeoPage.indepthClinicalGuides")}</p>
              </div>
            </Link>
            <Link href="/flashcards" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-flashcards">
              <FileText className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingQuestionSeoPage.flashcards")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingQuestionSeoPage.quickReviewCards")}</p>
              </div>
            </Link>
            <Link href={`/${tier}/questions`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-all-topics">
              <Target className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingQuestionSeoPage.allTopics")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingQuestionSeoPage.browseByClinicalTopic")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-gray-100" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Master {topicTitle} for Your {data.examLabel} Exam</h2>
          <p className="text-gray-600 mb-6">{t("pages.nursingQuestionSeoPage.startWithAFreeAccount")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/start-free" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-final-cta">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${tier}/questions`} className="text-teal-600 font-medium hover:text-teal-700 text-sm" data-testid="link-view-all-topics">
              View All Topics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function NursingQuestionsIndexPage({ tier: propTier }: { tier?: string }) {
  const tier = propTier || "rpn";
  const [data, setData] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSystem, setFilterSystem] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/nursing/question-topics/${tier}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tier]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.nursingQuestionSeoPage.questionsUnavailable")}</h1>
        <p className="text-gray-600 mb-4">{t("pages.nursingQuestionSeoPage.couldNotLoadQuestionTopics")}</p>
      </div>
    );
  }

  const colors = TIER_COLORS[tier] || TIER_COLORS.rpn;
  const filteredTopics = filterSystem
    ? data.topics.filter(t => t.bodySystem === filterSystem)
    : data.topics;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: data.tierLabel, href: `/${tier}` },
    { label: "Practice Questions", href: `/${tier}/questions` },
  ];

  return (
    <div data-testid="nursing-questions-index-page">
      <Helmet>
        <title>{`${data.tierLabel} Practice Questions by Topic | NurseNest`}</title>
        <meta name="description" content={`Browse ${data.totalTopics} ${data.tierLabel} practice question topics covering ${data.totalQuestions} questions across ${data.bodySystems.length} body systems. Free sample questions with clinical rationales.`} />
        <link rel="canonical" href={`https://www.nursenest.ca/${tier}/questions`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${data.tierLabel} Practice Question Topics`,
          description: `Browse ${data.totalTopics} clinical topics with ${data.totalQuestions} practice questions for ${data.tierLabel} exam prep.`,
          publisher: { "@type": "Organization", name: "NurseNest" },
        })}</script>
      </Helmet>

      <nav className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.href} className="hover:text-teal-600 transition-colors">{b.label}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>

      <section className={`bg-gradient-to-br ${colors.gradient} border-b border-gray-100 py-10 px-4`}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-index-title">
            {data.tierLabel} Practice Questions by Topic
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Browse {data.totalTopics} clinical topics covering {data.totalQuestions} {data.tierLabel} exam-style questions.
            Each topic includes free sample questions with detailed clinical rationales.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
              <Target className="w-3.5 h-3.5 inline mr-1" />
              {data.totalQuestions} Questions
            </span>
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              {data.bodySystems.length} Body Systems
            </span>
            <span className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
              <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
              {data.examLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilterSystem(null)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all ${!filterSystem ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}
              data-testid="filter-all"
            >
              All Topics
            </button>
            {data.bodySystems.map(bs => (
              <button
                key={bs.bodySystemSlug}
                onClick={() => setFilterSystem(bs.bodySystem)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${filterSystem === bs.bodySystem ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}
                data-testid={`filter-${bs.bodySystemSlug}`}
              >
                {bs.bodySystem} ({bs.questionCount})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(t => (
              <Link
                key={t.topicSlug}
                href={`/${tier}/questions/${t.topicSlug}`}
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all"
                data-testid={`topic-card-${t.topicSlug}`}
              >
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors capitalize mb-2">{t.topic}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{t.questionCount} questions</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{t.bodySystem}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>{t("pages.nursingQuestionSeoPage.noTopicsFoundForThis")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.nursingQuestionSeoPage.readyToStartPracticing")}</h2>
          <p className="text-gray-600 mb-6">Create a free account and access all {data.totalQuestions} {data.tierLabel} practice questions with detailed rationales.</p>
          <Link href="/start-free" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-index-cta">
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
