import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  CheckCircle2, XCircle, BookOpen, ArrowRight, RotateCcw,
  Target, Lightbulb, ChevronRight, Trophy, Star,
  ChevronDown, ChevronUp, ExternalLink, GraduationCap,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  stem: string;
  options: { text: string; label: string }[];
  correctAnswer: string[];
  rationale?: string;
  topic: string;
  bodySystem: string;
  difficulty: number;
  questionType: string;
  clinicalPearl?: string;
  locked: boolean;
}

interface PageData {
  page: {
    slug: string;
    title: string;
    metaDescription: string;
    h1: string;
    introText: string;
    examNames: string[];
    routePrefix: string;
    keywords: string[];
    structuredData: any;
  };
  questions: QuizQuestion[];
  totalQuestions: number;
  freeLimit: number;
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  otherProfessions: { slug: string; title: string }[];
}

function DifficultyBadge({ level }: { level: number }) {
  const { t } = useI18n();
  const colors = level <= 2 ? "bg-green-100 text-green-700" : level <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const label = level <= 2 ? "Easy" : level <= 3 ? "Medium" : "Hard";
  return <Badge className={colors} data-testid={`badge-difficulty-${level}`}>{label}</Badge>;
}

function FAQSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section className="mb-8" data-testid="section-faqs">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              data-testid={`button-faq-${i}`}
            >
              <span className="font-medium text-sm text-gray-900 pr-4">{faq.q}</span>
              {open === i ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProfessionPracticeQuestionsPage({ slug }: { slug: string }) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/profession-practice-questions/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAnswer = useCallback(
    (optionLabel: string) => {
      if (showResult || !data) return;
      setSelectedAnswer(optionLabel);
      setShowResult(true);
      const question = data.questions[currentQuestion];
      const isCorrect = question.correctAnswer?.includes(optionLabel);
      if (isCorrect) setScore((s) => s + 1);
      setAnsweredCount((c) => c + 1);
      setAnswers((prev) => ({ ...prev, [currentQuestion]: { selected: optionLabel, correct: !!isCorrect } }));
    },
    [showResult, data, currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (!data) return;
    const nextIdx = currentQuestion + 1;
    if (nextIdx < data.questions.length && !data.questions[nextIdx].locked) {
      setCurrentQuestion(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  }, [data, currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredCount(0);
    setQuizComplete(false);
    setAnswers({});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4" data-testid="text-loading">{t("pages.professionPracticeQuestions.loadingPracticeQuestions")}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.page) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t("pages.professionPracticeQuestions.practiceQuestionsNotFound")}</h1>
          <p className="text-gray-600 mt-2">{t("pages.professionPracticeQuestions.thisPracticeQuestionsPageDoesnt")}</p>
          <LocaleLink href="/">
            <Button className="mt-4" data-testid="link-back-home">{t("pages.professionPracticeQuestions.goHome")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const { page, questions, totalQuestions, freeLimit, faqs, relatedLinks, otherProfessions } = data;
  const currentQ = questions[currentQuestion];
  const scorePercent = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;
  const freeQuestions = questions.filter((q) => !q.locked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SEO
        title={page.title}
        description={page.metaDescription}
        keywords={page.keywords?.join(", ")}
        canonicalPath={`/${page.slug}`}
        structuredData={page.structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <BreadcrumbNav
          items={[
            { label: "Practice Questions", href: "/practice-questions" },
            { label: page.h1 },
          ]}
        />

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-h1">
            {page.h1}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed" data-testid="text-page-intro">
            {page.introText}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {page.examNames?.map((exam) => (
              <Badge key={exam} variant="secondary" data-testid={`badge-exam-${exam.toLowerCase().replace(/\s+/g, "-")}`}>
                {exam}
              </Badge>
            ))}
            <Badge variant="outline" data-testid="badge-total-questions">
              <Target className="w-3 h-3 mr-1" />
              {totalQuestions > 0 ? `${totalQuestions} Questions Available` : "Practice Questions"}
            </Badge>
          </div>
        </header>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl" data-testid="section-free-info">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">{t("pages.professionPracticeQuestions.freePracticeMode")}</h3>
              <p className="text-sm text-blue-700 mt-1">
                Try {freeQuestions.length} free questions below with instant feedback and detailed explanations.
                {totalQuestions > freeQuestions.length && (
                  <> Upgrade to access all {totalQuestions} questions in the full question bank.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {!quizComplete && currentQ && !currentQ.locked ? (
          <section className="mb-8" data-testid="section-quiz">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500" data-testid="text-question-progress">
                Question {currentQuestion + 1} of {freeQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Score: {score}/{answeredCount}</span>
                {answeredCount > 0 && (
                  <Badge className={scorePercent >= 70 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                    {scorePercent}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / freeQuestions.length) * 100}%` }}
              />
            </div>

            <Card className="shadow-lg" data-testid="card-question">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <DifficultyBadge level={currentQ.difficulty || 3} />
                    {currentQ.topic && (
                      <Badge variant="outline" className="text-xs" data-testid="badge-topic">{currentQ.topic}</Badge>
                    )}
                  </div>

                  <p className="text-base sm:text-lg font-medium text-gray-900 mb-6 leading-relaxed" data-testid="text-question-stem">
                    {currentQ.stem}
                  </p>

                  <div className="space-y-3">
                    {(currentQ.options || []).map((option: any, idx: number) => {
                      const label = option.label || String.fromCharCode(65 + idx);
                      const text = option.text || option;
                      const isSelected = selectedAnswer === label;
                      const isCorrect = currentQ.correctAnswer?.includes(label);

                      let optionClass = "border-gray-200 hover:border-primary hover:bg-purple-50 cursor-pointer";
                      if (showResult) {
                        if (isCorrect) optionClass = "border-green-500 bg-green-50";
                        else if (isSelected && !isCorrect) optionClass = "border-red-500 bg-red-50";
                        else optionClass = "border-gray-200 opacity-60";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(label)}
                          disabled={showResult}
                          className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${optionClass}`}
                          data-testid={`button-option-${label}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                              {label}
                            </span>
                            <span className="text-sm sm:text-base text-gray-800">{text}</span>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-auto" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-auto" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showResult && currentQ.rationale && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-testid="text-rationale">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <h4 className="font-semibold text-blue-900">{t("pages.professionPracticeQuestions.explanation")}</h4>
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed">{currentQ.rationale}</p>
                      {currentQ.clinicalPearl && (
                        <div className="mt-3 p-3 bg-white/60 rounded border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1">{t("pages.professionPracticeQuestions.clinicalPearl")}</p>
                          <p className="text-sm text-blue-800">{currentQ.clinicalPearl}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {showResult && (
                    <div className="mt-4 flex justify-end">
                      <Button onClick={nextQuestion} data-testid="button-next-question">
                        {currentQuestion < freeQuestions.length - 1 ? "Next Question" : "See Results"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
          </section>
        ) : quizComplete ? (
          <section className="mb-8" data-testid="section-results">
            <Card className="shadow-lg border-primary/20" data-testid="card-quiz-results">
              <CardContent className="p-6 sm:p-8 text-center">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.professionPracticeQuestions.practiceComplete")}</h2>
                <p className="text-4xl font-bold text-primary mb-2" data-testid="text-final-score">
                  {score}/{answeredCount}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  {scorePercent >= 80 ? "Excellent work!" : scorePercent >= 60 ? "Good effort! Keep practicing." : "Keep studying — you'll improve!"}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{score}</div>
                    <div className="text-xs text-gray-500">{t("pages.professionPracticeQuestions.correct")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{answeredCount - score}</div>
                    <div className="text-xs text-gray-500">{t("pages.professionPracticeQuestions.incorrect")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{scorePercent}%</div>
                    <div className="text-xs text-gray-500">{t("pages.professionPracticeQuestions.score")}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetQuiz} variant="outline" data-testid="button-retry-quiz">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <LocaleLink href={`/allied-health${page.routePrefix}/test-bank`}>
                    <Button data-testid="button-full-bank">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Full Test Bank
                    </Button>
                  </LocaleLink>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-1">{t("pages.professionPracticeQuestions.wantMorePractice")}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Access {totalQuestions > 0 ? `all ${totalQuestions}` : "thousands of"} questions with adaptive learning, detailed analytics, and personalized study plans.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <LocaleLink href={`${page.routePrefix}/pricing`}>
                      <Button size="sm" data-testid="button-upgrade-full">{t("pages.professionPracticeQuestions.unlockFullAccess")}</Button>
                    </LocaleLink>
                    <LocaleLink href={`/allied-health${page.routePrefix}/mock-exams`}>
                      <Button size="sm" variant="outline" data-testid="button-try-mock">{t("pages.professionPracticeQuestions.tryMockExams")}</Button>
                    </LocaleLink>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : null}

        {relatedLinks.length > 0 && (
          <section className="mb-8" data-testid="section-related-links">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Study Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedLinks.map((link) => (
                <LocaleLink key={link.href} href={link.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-link-${link.href.replace(/\//g, "-").slice(1)}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        {faqs.length > 0 && <FAQSection faqs={faqs} />}

        <section className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl border border-primary/10" data-testid="section-cta">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.professionPracticeQuestions.readyForFullExamPrep")}</h2>
            <p className="text-gray-600 mb-4 max-w-lg mx-auto">
              Access our complete library of practice questions, adaptive mock exams, flashcards, and personalized study plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink href={`${page.routePrefix}/pricing`}>
                <Button size="lg" data-testid="button-cta-pricing">
                  <Star className="w-4 h-4 mr-2" />
                  View Study Plans
                </Button>
              </LocaleLink>
              <LocaleLink href={`/allied-health${page.routePrefix}/test-bank`}>
                <Button size="lg" variant="outline" data-testid="button-cta-qbank">
                  Browse Test Bank
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>

        {otherProfessions.length > 0 && (
          <section className="mb-8" data-testid="section-other-professions">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Practice Questions for Other Professions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherProfessions.map((prof) => (
                <LocaleLink key={prof.slug} href={`/${prof.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-profession-${prof.slug}`}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{prof.title}</h3>
                      <div className="flex items-center text-primary text-xs font-medium">
                        Start Practice <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function ParamedicPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="paramedic-practice-questions" />;
}

export function RrtPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="rrt-practice-questions" />;
}

export function MltPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="mlt-practice-questions" />;
}

export function ImagingPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="imaging-practice-questions" />;
}

export function SocialWorkPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="social-work-practice-questions" />;
}

export function PsychotherapyPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="psychotherapy-practice-questions" />;
}

export function AddictionsPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="addictions-practice-questions" />;
}

export function OccupationalTherapyPracticeQuestions() {
  return <ProfessionPracticeQuestionsPage slug="occupational-therapy-practice-questions" />;
}
