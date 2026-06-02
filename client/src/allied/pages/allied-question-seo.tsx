import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, CheckCircle2, XCircle, ArrowRight, BookOpen,
  Target, Lock, FileText
} from "lucide-react";

interface ProfessionConfig {
  key: string;
  slug: string;
  label: string;
  shortLabel: string;
  examNames: string;
  diagnosticHref: string;
  questionsIndexHref: string;
  lessonsHref?: string;
  examsHref?: string;
  flashcardsHref?: string;
  heroGradient: string;
}

const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  rrt: {
    key: "rrt",
    slug: "rrt",
    label: "Respiratory Therapy",
    shortLabel: "RRT",
    examNames: "NBRC TMC/CSE and CSRT certification",
    diagnosticHref: "/diagnostic?career=rrt",
    questionsIndexHref: "/allied-health/rrt/questions",
    heroGradient: "from-blue-50 via-white to-teal-50",
  },
  mlt: {
    key: "mlt",
    slug: "mlt",
    label: "Medical Laboratory Technology",
    shortLabel: "MLT",
    examNames: "ASCP BOC and CSMLS CMLTO certification",
    diagnosticHref: "/diagnostic?career=mlt",
    questionsIndexHref: "/allied-health/mlt/questions",
    lessonsHref: "/allied-health/mlt/usa/lessons",
    examsHref: "/allied-health/mlt/exams",
    flashcardsHref: "/allied-health/mlt/usa/flashcards",
    heroGradient: "from-indigo-50 via-white to-teal-50",
  },
  imaging: {
    key: "imaging",
    slug: "imaging",
    label: "Medical Imaging",
    shortLabel: "Imaging",
    examNames: "ARRT and CAMRT radiography certification",
    diagnosticHref: "/diagnostic?career=imaging",
    questionsIndexHref: "/allied-health/imaging/questions",
    lessonsHref: "/medical-imaging",
    flashcardsHref: "/medical-imaging/canada/flashcards",
    heroGradient: "from-violet-50 via-white to-teal-50",
  },
  occupationalTherapy: {
    key: "occupationalTherapy",
    slug: "occupational-therapy",
    label: "Occupational Therapy Assistant",
    shortLabel: "OTA",
    examNames: "NBCOT COTA certification",
    diagnosticHref: "/diagnostic?career=occupationalTherapy",
    questionsIndexHref: "/allied-health/occupational-therapy/questions",
    heroGradient: "from-emerald-50 via-white to-green-50",
  },
  physicalTherapy: {
    key: "physicalTherapy",
    slug: "physical-therapy",
    label: "Physical Therapy Assistant",
    shortLabel: "PTA",
    examNames: "NPTE-PTA and FSBPT certification",
    diagnosticHref: "/diagnostic?career=physicalTherapy",
    questionsIndexHref: "/allied-health/physical-therapy/questions",
    heroGradient: "from-sky-50 via-white to-cyan-50",
  },
  surgicalTechnologist: {
    key: "surgicalTechnologist",
    slug: "surgical-technologist",
    label: "Surgical Technologist",
    shortLabel: "CST",
    examNames: "NBSTSA CST certification",
    diagnosticHref: "/diagnostic?career=surgicalTechnologist",
    questionsIndexHref: "/allied-health/surgical-technologist/questions",
    heroGradient: "from-red-50 via-white to-rose-50",
  },
  healthInfoMgmt: {
    key: "healthInfoMgmt",
    slug: "health-info-mgmt",
    label: "Health Information Management",
    shortLabel: "HIM",
    examNames: "RHIT, RHIA, and AHIMA certification",
    diagnosticHref: "/diagnostic?career=healthInfoMgmt",
    questionsIndexHref: "/allied-health/health-info-mgmt/questions",
    heroGradient: "from-violet-50 via-white to-purple-50",
  },
  diagnosticSonography: {
    key: "diagnosticSonography",
    slug: "diagnostic-sonography",
    label: "Diagnostic Sonography",
    shortLabel: "RDMS",
    examNames: "ARDMS SPI and RDMS certification",
    diagnosticHref: "/diagnostic?career=diagnosticSonography",
    questionsIndexHref: "/allied-health/diagnostic-sonography/questions",
    heroGradient: "from-cyan-50 via-white to-blue-50",
  },
  cardiacSonographer: {
    key: "cardiacSonographer",
    slug: "cardiac-sonographer",
    label: "Cardiac Sonography",
    shortLabel: "RDCS",
    examNames: "ARDMS RDCS and CCI RCS certification",
    diagnosticHref: "/diagnostic?career=cardiacSonographer",
    questionsIndexHref: "/allied-health/cardiac-sonographer/questions",
    heroGradient: "from-pink-50 via-white to-rose-50",
  },
};

interface SampleQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
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
  profession: string;
  professionLabel: string;
  examNames: string;
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

function QuestionCard({ question, index, isLocked, profession }: { question: SampleQuestion; index: number; isLocked: boolean; profession: ProfessionConfig }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden" data-testid={`question-card-locked-${index}`}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">{t("allied.alliedQuestionSeo.signUpForFreeTo")}</p>
            <Link href={profession.diagnosticHref} className="inline-flex items-center gap-1 text-teal-600 text-sm font-semibold mt-2 hover:text-teal-700" data-testid="link-unlock-questions">
              Start Free <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="blur-sm">
          <p className="text-sm text-gray-700 mb-4">{t("allied.alliedQuestionSeo.questionPreviewIsLocked")}</p>
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
          <h4 className="text-sm font-semibold text-teal-800 mb-2">{t("allied.alliedQuestionSeo.rationale")}</h4>
          <p className="text-sm text-teal-900 leading-relaxed">{question.rationale}</p>
        </div>
      )}

      {!showAnswer && selectedOption === null && (
        <p className="text-xs text-gray-400 mt-2">{t("allied.alliedQuestionSeo.clickAnAnswerToReveal")}</p>
      )}
    </div>
  );
}

export default function AlliedQuestionSeoPage({ professionKey }: { professionKey: string }) {
  const params = useParams<{ topicSlug: string }>();
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profession = PROFESSION_CONFIGS[professionKey];

  useEffect(() => {
    if (!params.topicSlug || !profession) return;
    setLoading(true);
    fetch(`/api/${profession.key}/question-topics/${params.topicSlug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.topicSlug, profession?.key]);

  if (!profession) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedQuestionSeo.professionNotFound")}</h1>
        <p className="text-gray-600">{t("allied.alliedQuestionSeo.theRequestedProfessionDoesNot")}</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedQuestionSeo.topicNotFound")}</h1>
        <p className="text-gray-600 mb-4">The {profession.label} question topic you're looking for doesn't exist.</p>
        <Link href={profession.questionsIndexHref} className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-topics">
          Browse All Topics
        </Link>
      </div>
    );
  }

  const topicTitle = data.topic.charAt(0).toUpperCase() + data.topic.slice(1);
  const freeQuestions = data.sampleQuestions.slice(0, 5);
  const lockedQuestions = data.sampleQuestions.slice(5);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: profession.shortLabel, href: `/allied-health/${profession.slug}` },
    { label: "Practice Questions", href: profession.questionsIndexHref },
    { label: topicTitle, href: `/allied-health/${profession.slug}/questions/${data.topicSlug}` },
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
      "@type": "LearningResource",
      name: `${topicTitle} — ${profession.shortLabel} Practice Questions`,
      description: `Practice ${data.totalQuestions} ${profession.label} exam questions on ${topicTitle}. Covers ${data.category} with detailed rationales.`,
      learningResourceType: "Quiz",
      educationalLevel: "Professional",
      provider: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca/allied-health" },
      about: { "@type": "Thing", name: topicTitle },
      url: `https://www.nursenest.ca/allied-health/${profession.slug}/questions/${data.topicSlug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How many ${topicTitle} questions are available?`,
          acceptedAnswer: { "@type": "Answer", text: `We have ${data.totalQuestions} practice questions specifically on ${topicTitle}, part of our ${data.category} category. Each question includes detailed rationales.` },
        },
        {
          "@type": "Question",
          name: `What difficulty levels are covered?`,
          acceptedAnswer: { "@type": "Answer", text: `Questions range from foundational (level 1-2) to advanced (level 4-5), covering all difficulty levels tested on ${profession.examNames} exams.` },
        },
      ],
    },
  ];

  return (
    <div data-testid={`${profession.key}-question-seo-page`}>
      <AlliedSEO
        title={`${topicTitle} — ${profession.shortLabel} Practice Questions | NurseNest`}
        description={`Practice ${data.totalQuestions} ${profession.label} exam questions on ${topicTitle}. Part of ${data.category} with detailed rationales. Free sample questions and full question bank access.`}
        keywords={`${data.topic} ${profession.shortLabel} questions, ${data.topic} practice test, ${data.category} exam questions, ${profession.shortLabel} ${data.topic}`}
        canonicalPath={`/allied-health/${profession.slug}/questions/${data.topicSlug}`}
        structuredData={structuredData[0]}
        additionalStructuredData={structuredData.slice(1)}
      />

      <nav className="max-w-4xl mx-auto px-4 py-3" aria-label={t("allied.alliedQuestionSeo.breadcrumb")} data-testid="breadcrumbs">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
          {breadcrumbs.map((b, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.href} className="hover:text-teal-600 transition-colors">{b.label}</Link>
              ) : (
                <span className="text-gray-700 font-medium">{b.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <section className={`bg-gradient-to-br ${profession.heroGradient} border-b border-gray-100 py-10 px-4`} data-testid="section-topic-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href={profession.questionsIndexHref} className="text-xs text-teal-600 hover:text-teal-700 font-medium" data-testid="link-category-breadcrumb">
              {data.category}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize" data-testid="text-topic-title">
            {topicTitle} — Practice Questions
          </h1>
          <p className="text-lg text-gray-600 mb-4" data-testid="text-topic-description">
            Test your knowledge of {data.topic} with {data.totalQuestions} {profession.label} exam-style questions.
            Each question includes a detailed rationale explaining the correct answer and why other options are incorrect.
          </p>
          <div className="flex flex-wrap gap-3">
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
        </div>
      </section>

      <section className="py-8 sm:py-12" data-testid="section-topic-overview">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-teal-800 mb-2">About {topicTitle}</h2>
            <p className="text-sm text-teal-900 leading-relaxed">
              {topicTitle} is a key topic within {data.category} on {profession.examNames} exams.
              This topic tests your ability to understand, apply, and analyze concepts related to {data.topic} in clinical and laboratory settings.
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
              <QuestionCard key={q.id} question={q} index={i} isLocked={false} profession={profession} />
            ))}
            {lockedQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={freeQuestions.length + i} isLocked={true} profession={profession} />
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-8 border border-purple-100 text-center" data-testid="cta-full-access">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access All {data.totalQuestions} Questions on {topicTitle}</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
              Get full access to every question with detailed rationales, adaptive difficulty, and progress tracking.
            </p>
            <Link href={profession.diagnosticHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-access-full-bank">
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
                  href={`/allied-health/${profession.slug}/questions/${rt.topicSlug}`}
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">More {profession.shortLabel} Study Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profession.lessonsHref && (
              <Link href={profession.lessonsHref} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-lessons">
                <BookOpen className="w-5 h-5 text-teal-500" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t("allied.alliedQuestionSeo.lessons")}</h3>
                  <p className="text-xs text-gray-500">{t("allied.alliedQuestionSeo.indepthStudyGuides")}</p>
                </div>
              </Link>
            )}
            {profession.examsHref && (
              <Link href={profession.examsHref} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-exams">
                <FileText className="w-5 h-5 text-teal-500" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t("allied.alliedQuestionSeo.practiceExams")}</h3>
                  <p className="text-xs text-gray-500">{t("allied.alliedQuestionSeo.timedMockExams")}</p>
                </div>
              </Link>
            )}
            {profession.flashcardsHref && (
              <Link href={profession.flashcardsHref} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-flashcards">
                <BookOpen className="w-5 h-5 text-teal-500" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t("allied.alliedQuestionSeo.flashcards")}</h3>
                  <p className="text-xs text-gray-500">{t("allied.alliedQuestionSeo.quickReviewCards")}</p>
                </div>
              </Link>
            )}
            <Link href={profession.questionsIndexHref} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-all-topics">
              <Target className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("allied.alliedQuestionSeo.allTopics")}</h3>
                <p className="text-xs text-gray-500">{t("allied.alliedQuestionSeo.browseByTopic")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Master {topicTitle} for Your {profession.shortLabel} Exam
          </h2>
          <p className="text-teal-100 mb-8 text-sm md:text-base">
            Start with a free diagnostic to see where you stand, then follow your personalized study plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={profession.diagnosticHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl text-base font-semibold hover:bg-teal-50 transition-all shadow-lg" data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={profession.questionsIndexHref} className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white rounded-xl text-base font-semibold hover:bg-white/10 transition-all" data-testid="button-cta-topics">
              View All Topics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
