import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  ChevronRight, ArrowRight, BookOpen, Brain, FileText, Pill,
  CheckCircle2, AlertTriangle, Stethoscope, ShieldAlert, GraduationCap,
  Lock, Sparkles, Target, Lightbulb, XCircle, ClipboardList, Loader2
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { RRT_PHARMACOLOGY_PREVIEWS } from "@/data/lessons/rrt-pharmacology-previews";
import type { PharmacologyTopicApiResponse } from "@/data/lessons/rrt-pharmacology-topics";

import { useI18n } from "@/lib/i18n";
export function RrtPharmacologyTopicPage() {
  const { t } = useI18n();
  const [, params] = useRoute("/allied-health/rrt/pharmacology/:slug");
  const slug = params?.slug;

  const preview = RRT_PHARMACOLOGY_PREVIEWS.find(t => t.slug === slug);

  if (!preview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.rrtPharmacologyTopic.topicNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.rrtPharmacologyTopic.thePharmacologyTopicYoureLooking")}</p>
        <Link href="/allied-health/rrt/pharmacology" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700" data-testid="link-back-pharmacology">
          Back to Pharmacology Hub
        </Link>
      </div>
    );
  }

  return <TopicDetailPage slug={slug!} preview={preview} />;
}

function TopicDetailPage({ slug, preview }: { slug: string; preview: typeof RRT_PHARMACOLOGY_PREVIEWS[number] }) {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, number | null>>({});
  const [topicData, setTopicData] = useState<PharmacologyTopicApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const otherTopics = RRT_PHARMACOLOGY_PREVIEWS.filter(t => t.slug !== slug).slice(0, 6);

  useEffect(() => {
    setLoading(true);
    setFetchError(false);
    setRevealedAnswers({});
    fetch(`/api/allied/rrt/pharmacology/topics/${slug}`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTopicData(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(true);
        setLoading(false);
      });
  }, [slug]);

  const isPremiumLocked = topicData?.isPremiumLocked ?? !preview.isFree;

  return (
    <>
      <AlliedSEO
        title={preview.seo.title}
        description={preview.seo.description}
        keywords={preview.seo.keywords}
        canonicalPath={`/allied-health/rrt/pharmacology/${slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: preview.title,
          description: preview.seo.description,
          author: { "@type": "Organization", name: "NurseNest Allied" },
          publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          mainEntityOfPage: `https://www.nursenest.ca/allied-health/rrt/pharmacology/${slug}`,
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "RRT Exam Prep", item: "https://www.nursenest.ca/allied-health/rrt" },
              { "@type": "ListItem", position: 3, name: "Pharmacology", item: "https://www.nursenest.ca/allied-health/rrt/pharmacology" },
              { "@type": "ListItem", position: 4, name: preview.shortTitle, item: `https://www.nursenest.ca/allied-health/rrt/pharmacology/${slug}` },
            ],
          },
        ]}
      />

      <div data-testid={`rrt-pharmacology-topic-${slug}`}>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white py-14 sm:py-18">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap" aria-label={t("allied.rrtPharmacologyTopic.breadcrumb")} data-testid="breadcrumb-nav">
              <Link href="/allied-health" className="hover:text-teal-600" data-testid="breadcrumb-home">{t("allied.rrtPharmacologyTopic.alliedHealth")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/rrt" className="hover:text-teal-600" data-testid="breadcrumb-rrt">RRT</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/rrt/pharmacology" className="hover:text-teal-600" data-testid="breadcrumb-pharmacology">{t("allied.rrtPharmacologyTopic.pharmacology")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-blue-700 font-medium">{preview.shortTitle}</span>
            </nav>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  <Pill className="w-3 h-3" /> {preview.category}
                </span>
                {preview.isFree ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Sparkles className="w-3 h-3" /> Free
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-topic-title">
                {preview.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-overview">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Overview
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed" data-testid="text-overview">
                  {topicData?.overview ?? preview.overview}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-high-yield">
                  <Target className="w-5 h-5 text-red-500" />
                  High-Yield Exam Facts
                </h2>
                <div className="space-y-2">
                  {(topicData?.highYieldFacts ?? preview.highYieldFacts).map((fact, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-xs font-bold text-red-600 mt-0.5 bg-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-800 leading-relaxed">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12" data-testid="loading-content">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="ml-3 text-sm text-gray-500">{t("allied.rrtPharmacologyTopic.loadingContent")}</span>
                </div>
              ) : fetchError ? (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center" data-testid="fetch-error">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.rrtPharmacologyTopic.unableToLoadContent")}</h3>
                  <p className="text-gray-600 mb-4">{t("allied.rrtPharmacologyTopic.weCouldntLoadTheFull")}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                    data-testid="button-retry"
                  >
                    Retry
                  </button>
                </div>
              ) : isPremiumLocked ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 text-center" data-testid="premium-gate">
                  <Lock className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allied.rrtPharmacologyTopic.premiumContent")}</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Unlock the full topic guide including indications, contraindications, side effects, key medications, clinical pearls, and practice questions.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors" data-testid="button-unlock-premium">
                      Unlock All Topics <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 hover:bg-blue-50 transition-colors" data-testid="button-back-hub">
                      Browse Free Topics
                    </Link>
                  </div>
                </div>
              ) : topicData ? (
                <>
                  {topicData.indications && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-indications">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Indications
                      </h2>
                      <ul className="space-y-2">
                        {topicData.indications.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topicData.contraindications && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-contraindications">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Contraindications
                      </h2>
                      <ul className="space-y-2">
                        {topicData.contraindications.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <XCircle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topicData.sideEffects && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-side-effects">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Side Effects
                      </h2>
                      <ul className="space-y-2">
                        {topicData.sideEffects.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topicData.keyMedications && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-key-medications">
                        <Pill className="w-5 h-5 text-blue-600" />
                        Key Medications
                      </h2>
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full" data-testid="table-medications">
                            <thead>
                              <tr className="bg-blue-50 border-b border-blue-100">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-800">{t("allied.rrtPharmacologyTopic.medication")}</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-800">{t("allied.rrtPharmacologyTopic.dose")}</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-800 hidden md:table-cell">{t("allied.rrtPharmacologyTopic.route")}</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-blue-800 hidden lg:table-cell">{t("allied.rrtPharmacologyTopic.purpose")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {topicData.keyMedications.map((med, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{med.dose}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{med.route}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{med.purpose}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {topicData.clinicalReassessment && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-clinical-reassessment">
                        <ClipboardList className="w-5 h-5 text-teal-600" />
                        Clinical Reassessment
                      </h2>
                      <ul className="space-y-2">
                        {topicData.clinicalReassessment.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Stethoscope className="w-4 h-4 mt-0.5 text-teal-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topicData.examWritersFocus && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-exam-focus">
                        <Target className="w-5 h-5 text-purple-600" />
                        What Exam Writers Test
                      </h2>
                      <div className="space-y-2">
                        {topicData.examWritersFocus.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <Target className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {topicData.commonMistakes && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-common-mistakes">
                        <ShieldAlert className="w-5 h-5 text-orange-500" />
                        Common Student Mistakes
                      </h2>
                      <div className="space-y-2">
                        {topicData.commonMistakes.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                            <ShieldAlert className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {topicData.clinicalPearls && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid="heading-clinical-pearls">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Clinical Pearls
                      </h2>
                      <div className="space-y-2">
                        {topicData.clinicalPearls.map((pearl, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                            <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{pearl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {topicData.quiz && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-quiz">
                        <Brain className="w-5 h-5 text-blue-600" />
                        Practice Questions
                      </h2>
                      <div className="space-y-4">
                        {topicData.quiz.map((q, qi) => (
                          <div key={qi} className="bg-white rounded-2xl border border-gray-100 p-5" data-testid={`practice-question-${qi}`}>
                            <p className="text-sm font-medium text-gray-900 mb-3">Q{qi + 1}: {q.question}</p>
                            <div className="space-y-2 mb-3">
                              {q.options.map((opt, oi) => {
                                const isRevealed = revealedAnswers[qi] !== undefined;
                                const isCorrect = oi === q.correctIndex;
                                const isSelected = revealedAnswers[qi] === oi;
                                return (
                                  <button
                                    key={oi}
                                    onClick={() => {
                                      if (!isRevealed) setRevealedAnswers(prev => ({ ...prev, [qi]: oi }));
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${
                                      isRevealed
                                        ? isCorrect
                                          ? "bg-green-50 border-green-300 text-green-800"
                                          : isSelected
                                            ? "bg-red-50 border-red-300 text-red-800"
                                            : "bg-gray-50 border-gray-100 text-gray-500"
                                        : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 cursor-pointer"
                                    }`}
                                    data-testid={`question-${qi}-option-${oi}`}
                                  >
                                    <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                                    {opt}
                                    {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />}
                                  </button>
                                );
                              })}
                            </div>
                            {revealedAnswers[qi] !== undefined && (
                              <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100" data-testid={`rationale-${qi}`}>
                                <p className="text-xs font-semibold text-blue-800 mb-1">{t("allied.rrtPharmacologyTopic.rationale")}</p>
                                <p className="text-sm text-blue-900 leading-relaxed">{q.rationale}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t("allied.rrtPharmacologyTopic.studyThisTopic")}</h3>
                  <div className="space-y-3">
                    <Link href="/allied-health/qbank?career=rrt" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-qbank">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.rrtPharmacologyTopic.rrtQuestionBank")}</p>
                        <p className="text-xs text-gray-500">{t("allied.rrtPharmacologyTopic.targetedPracticeQuestions")}</p>
                      </div>
                    </Link>
                    <Link href="/allied-health/rrt/flashcards" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-flashcards">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.rrtPharmacologyTopic.rrtFlashcards")}</p>
                        <p className="text-xs text-gray-500">{t("allied.rrtPharmacologyTopic.spacedRepetitionReview")}</p>
                      </div>
                    </Link>
                    <Link href="/allied-health/rrt/mock-exams" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-mock-exams">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.rrtPharmacologyTopic.rrtMockExams")}</p>
                        <p className="text-xs text-gray-500">{t("allied.rrtPharmacologyTopic.fulllengthPractice")}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t("allied.rrtPharmacologyTopic.morePharmacologyTopics")}</h3>
                  <div className="space-y-2">
                    {otherTopics.map(t => (
                      <Link
                        key={t.slug}
                        href={`/allied-health/rrt/pharmacology/${t.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        data-testid={`sidebar-topic-${t.slug}`}
                      >
                        <Pill className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700 font-medium">{t.shortTitle}</span>
                        {!t.isFree && <Lock className="w-3 h-3 text-gray-300 ml-auto" />}
                      </Link>
                    ))}
                    <Link
                      href="/allied-health/rrt/pharmacology"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-medium hover:text-blue-700"
                      data-testid="sidebar-view-all"
                    >
                      View All Topics <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{t("allied.rrtPharmacologyTopic.quickLinks")}</h3>
                  <div className="space-y-2">
                    <Link href="/allied-health/rrt" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="sidebar-link-rrt-hub">
                      <GraduationCap className="w-4 h-4" /> RRT Exam Prep Hub
                    </Link>
                    <Link href="/allied-health/rrt/pharmacology" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="sidebar-link-pharmacology">
                      <Pill className="w-4 h-4" /> All Pharmacology Topics
                    </Link>
                    <Link href="/allied-health/rrt/study-plan" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="sidebar-link-study-plan">
                      <GraduationCap className="w-4 h-4" /> RRT Study Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4" data-testid="text-bottom-cta">{t("allied.rrtPharmacologyTopic.continueYourPharmacologyReview")}</h2>
            <p className="text-blue-100 mb-8">{t("allied.rrtPharmacologyTopic.exploreMoreRespiratoryMedicationTopics")}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all" data-testid="button-cta-all-topics">
                <Pill className="w-4 h-4" /> All Pharmacology Topics
              </Link>
              <Link href="/allied-health/qbank?career=rrt" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/30 text-white rounded-xl text-sm font-semibold hover:bg-blue-500/40 border border-blue-400/30 transition-all" data-testid="button-cta-qbank">
                <Brain className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
