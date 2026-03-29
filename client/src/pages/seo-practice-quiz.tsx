import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  CheckCircle2, XCircle, Lock, BookOpen, ArrowRight, RotateCcw,
  Target, Brain, Lightbulb, ChevronRight, Bookmark, Trophy, Star,
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

interface RelatedPage {
  slug: string;
  title: string;
  topic: string;
  question_count: number;
  difficulty: string;
}

interface FlashcardPreview {
  id: string;
  front: string;
  back: string;
  rationale?: string;
}

interface PageData {
  page: {
    slug: string;
    title: string;
    metaDescription: string;
    h1: string;
    introText: string;
    topic: string;
    subtopic?: string;
    bodySystem?: string;
    careerType: string;
    examType?: string;
    difficulty: string;
    keywords: string[];
    structuredData: any;
  };
  questions: QuizQuestion[];
  relatedPages: RelatedPage[];
  flashcards: FlashcardPreview[];
  freeLimit: number | null;
  totalQuestions: number;
}

function DifficultyBadge({ level }: { level: number }) {
  const { t } = useI18n();
  const colors = level <= 2 ? "bg-green-100 text-green-700" : level <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const label = level <= 2 ? "Easy" : level <= 3 ? "Medium" : "Hard";
  return <Badge className={colors} data-testid={`badge-difficulty-${level}`}>{label}</Badge>;
}

export default function SeoPracticeQuiz() {
  const [, params] = useRoute("/quiz/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [showFlashcard, setShowFlashcard] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/seo-quiz/page/${slug}`)
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
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
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
          <p className="text-gray-500 mt-4">{t("pages.seoPracticeQuiz.loadingPracticeQuestions")}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.page) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t("pages.seoPracticeQuiz.practiceQuizNotFound")}</h1>
          <p className="text-gray-600 mt-2">{t("pages.seoPracticeQuiz.thisPracticeQuizPageDoesnt")}</p>
          <LocaleLink href="/practice-questions">
            <Button className="mt-4" data-testid="link-back-practice">{t("pages.seoPracticeQuiz.browsePracticeQuestions")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const { page, questions, relatedPages, flashcards, freeLimit } = data;
  const currentQ = questions[currentQuestion];
  const scorePercent = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SEO
        title={page.title}
        description={page.metaDescription}
        keywords={page.keywords?.join(", ")}
        canonicalPath={`/quiz/${page.slug}`}
        structuredData={page.structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <BreadcrumbNav
          items={[
            { label: "Practice Questions", href: "/practice-questions" },
            { label: page.topic, href: `/quiz/${page.slug}` },
          ]}
        />

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3" data-testid="text-quiz-h1">
            {page.h1}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed" data-testid="text-quiz-intro">
            {page.introText}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {page.examType && (
              <Badge variant="secondary" data-testid="badge-exam-type">{page.examType.toUpperCase()}</Badge>
            )}
            {page.bodySystem && (
              <Badge variant="outline" data-testid="badge-body-system">{page.bodySystem}</Badge>
            )}
            <Badge variant="outline" data-testid="badge-question-count">
              <Target className="w-3 h-3 mr-1" />
              {data.totalQuestions} Questions
            </Badge>
          </div>
        </header>

        {!quizComplete && currentQ ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500" data-testid="text-question-progress">
                Question {currentQuestion + 1} of {questions.length}
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
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {currentQ.locked ? (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-6 sm:p-8 text-center">
                  <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("pages.seoPracticeQuiz.unlockMoreQuestions")}</h3>
                  <p className="text-gray-600 mb-4">
                    You've reached the free question limit. Upgrade to access all {data.totalQuestions} practice questions with detailed explanations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <LocaleLink href="/pricing">
                      <Button data-testid="button-unlock-full">
                        <Star className="w-4 h-4 mr-2" />
                        Unlock Full Test Bank
                      </Button>
                    </LocaleLink>
                    <LocaleLink href="/trial">
                      <Button variant="outline" data-testid="button-start-trial">
                        Start Free Practice
                      </Button>
                    </LocaleLink>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg" data-testid="card-question">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <DifficultyBadge level={currentQ.difficulty || 3} />
                    {currentQ.questionType && (
                      <Badge variant="outline" className="text-xs">{currentQ.questionType}</Badge>
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
                        <h4 className="font-semibold text-blue-900">{t("pages.seoPracticeQuiz.explanation")}</h4>
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed">{currentQ.rationale}</p>
                      {currentQ.clinicalPearl && (
                        <div className="mt-3 p-3 bg-white/60 rounded border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1">{t("pages.seoPracticeQuiz.clinicalPearl")}</p>
                          <p className="text-sm text-blue-800">{currentQ.clinicalPearl}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {showResult && (
                    <div className="mt-4 flex justify-end">
                      <Button onClick={nextQuestion} data-testid="button-next-question">
                        {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        ) : quizComplete ? (
          <section className="mb-8">
            <Card className="shadow-lg border-primary/20" data-testid="card-quiz-results">
              <CardContent className="p-6 sm:p-8 text-center">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.seoPracticeQuiz.quizComplete")}</h2>
                <p className="text-4xl font-bold text-primary mb-2" data-testid="text-final-score">
                  {score}/{answeredCount}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  {scorePercent >= 80 ? "Excellent work!" : scorePercent >= 60 ? "Good effort! Keep practicing." : "Keep studying — you'll improve!"}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{score}</div>
                    <div className="text-xs text-gray-500">{t("pages.seoPracticeQuiz.correct")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{answeredCount - score}</div>
                    <div className="text-xs text-gray-500">{t("pages.seoPracticeQuiz.incorrect")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{scorePercent}%</div>
                    <div className="text-xs text-gray-500">{t("pages.seoPracticeQuiz.score")}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetQuiz} variant="outline" data-testid="button-retry-quiz">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <LocaleLink href="/free-practice">
                    <Button data-testid="button-full-bank">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Full Test Bank
                    </Button>
                  </LocaleLink>
                </div>

                {freeLimit !== null && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t("pages.seoPracticeQuiz.wantMorePractice")}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Unlock thousands of questions with adaptive learning, detailed analytics, and personalized study plans.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <LocaleLink href="/pricing">
                        <Button size="sm" data-testid="button-unlock-upgrade">{t("pages.seoPracticeQuiz.unlockFullTestBank")}</Button>
                      </LocaleLink>
                      <LocaleLink href="/mock-exams">
                        <Button size="sm" variant="outline" data-testid="button-try-adaptive">{t("pages.seoPracticeQuiz.tryAdaptiveExam")}</Button>
                      </LocaleLink>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        ) : null}

        {flashcards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Related Flashcards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {flashcards.map((fc, idx) => (
                <Card
                  key={fc.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowFlashcard(showFlashcard === idx ? null : idx)}
                  data-testid={`card-flashcard-${idx}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bookmark className="w-4 h-4 text-primary" />
                      <span className="text-xs text-gray-500">{t("pages.seoPracticeQuiz.clickToFlip")}</span>
                    </div>
                    {showFlashcard === idx ? (
                      <p className="text-sm text-gray-700 font-medium">{fc.back}</p>
                    ) : (
                      <p className="text-sm text-gray-900">{fc.front}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {relatedPages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Related Practice Quizzes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPages.map((rp) => (
                <LocaleLink key={rp.slug} href={`/quiz/${rp.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-related-${rp.slug}`}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 text-sm mb-2">{rp.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Target className="w-3 h-3" />
                        <span>{rp.question_count} questions</span>
                        {rp.difficulty && <Badge variant="outline" className="text-xs">{rp.difficulty}</Badge>}
                      </div>
                      <div className="flex items-center text-primary text-xs mt-2 font-medium">
                        Start Practice <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl border border-primary/10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.seoPracticeQuiz.readyForMore")}</h2>
            <p className="text-gray-600 mb-4 max-w-lg mx-auto">
              Access our complete library of practice questions, adaptive exams, flashcards, and personalized study plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink href="/start-free">
                <Button size="lg" data-testid="button-cta-start-free">
                  Start Free Practice
                </Button>
              </LocaleLink>
              <LocaleLink href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-cta-pricing">
                  View Study Plans
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
