import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, useNewGradEntitlements } from "./premium-cta";
import { INTERVIEW_QUESTION_BANK, type InterviewQuestion } from "@/data/newgrad/premium-toolkit";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, ArrowRight, Clock, CheckCircle2, XCircle,
  Play, Pause, RotateCcw, Lock, Star, Award, Target,
  MessageSquare, Timer, BarChart3, Sparkles, ChevronDown
} from "lucide-react";

type ExamState = "setup" | "in-progress" | "review";

interface UserAnswer {
  questionIndex: number;
  userResponse: string;
  selfScore: number | null;
  timeSpent: number;
  flagged: boolean;
}

const EXAM_SIZES = [
  { label: "Quick Practice", count: 10, time: 20 },
  { label: "Standard Mock", count: 25, time: 50 },
  { label: "Full Mock Interview", count: 50, time: 90 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds: number): string {

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MockInterviewPage() {
  const { hasToolkitAccess, hasFullAccess } = useNewGradEntitlements();
  const hasAccess = hasToolkitAccess || hasFullAccess;

  const [examState, setExamState] = useState<ExamState>("setup");
  const [selectedSize, setSelectedSize] = useState(1);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const startExam = useCallback(() => {
    if (!hasAccess) return;
    const size = EXAM_SIZES[selectedSize];
    const pool = INTERVIEW_QUESTION_BANK;
    const shuffled = shuffleArray(pool).slice(0, Math.min(size.count, pool.length));
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeRemaining(size.time * 60);
    setIsPaused(false);
    setUserInput("");
    setShowAnswer(false);
    setExamState("in-progress");
    questionStartRef.current = Date.now();
  }, [hasAccess, selectedSize]);

  useEffect(() => {
    if (examState !== "in-progress" || isPaused) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setExamState("review");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [examState, isPaused]);

  const submitAnswer = (score: number) => {
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    const newAnswer: UserAnswer = {
      questionIndex: currentIndex,
      userResponse: userInput,
      selfScore: score,
      timeSpent: elapsed,
      flagged: false,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 >= questions.length) {
      setExamState("review");
    } else {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setShowAnswer(false);
      questionStartRef.current = Date.now();
    }
  };

  const skipQuestion = () => {
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    const newAnswer: UserAnswer = {
      questionIndex: currentIndex,
      userResponse: "",
      selfScore: 0,
      timeSpent: elapsed,
      flagged: true,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 >= questions.length) {
      setExamState("review");
    } else {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setShowAnswer(false);
      questionStartRef.current = Date.now();
    }
  };

  const avgScore = answers.length > 0
    ? (answers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / answers.length).toFixed(1)
    : "0";
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const answeredCount = answers.filter((a) => a.selfScore && a.selfScore > 0).length;
  const skippedCount = answers.filter((a) => !a.selfScore || a.selfScore === 0).length;

  return (
    <div data-testid="newgrad-mock-interview-page">
      <Navigation />
      <SEO
        title={t("pages.newgrad.mockInterviewPage.mockInterviewPracticeTimedNursing")}
        description={`Practice with timed mock nursing interviews. ${INTERVIEW_QUESTION_BANK.length}+ randomized questions with self-scoring, answer review, and performance tracking.`}
        keywords="mock nursing interview, timed interview practice, nursing interview simulation, new grad nurse interview test, interview scoring"
        canonicalPath="/newgrad/mock-interview"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
          { name: "Mock Interview", url: "https://www.nursenest.ca/newgrad/mock-interview" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newgrad.mockInterviewPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("pages.newgrad.mockInterviewPage.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-violet-700 font-medium">{t("pages.newgrad.mockInterviewPage.mockInterview")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-violet-100 text-violet-700">
            <Timer className="w-4 h-4" /> Timed Mock Interview
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            Mock Interview Practice
          </h1>
          <p className="text-lg text-gray-600 mb-6" data-testid="text-subtitle">
            Simulate a real nursing interview under timed conditions. Practice with randomized questions, self-score your responses, and review expert sample answers after completion.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-violet-100 p-3 text-center" data-testid="stat-questions">
              <div className="text-xl font-bold text-violet-700">{INTERVIEW_QUESTION_BANK.length}+</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.questionPool")}</div>
            </div>
            <div className="bg-white rounded-xl border border-violet-100 p-3 text-center" data-testid="stat-modes">
              <div className="text-xl font-bold text-violet-700">3</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.examModes")}</div>
            </div>
            <div className="bg-white rounded-xl border border-violet-100 p-3 text-center" data-testid="stat-scoring">
              <div className="text-xl font-bold text-violet-700">{t("pages.newgrad.mockInterviewPage.5point")}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.selfscoring")}</div>
            </div>
          </div>
        </div>
      </section>

      {!hasAccess ? (
        <section className="py-16" data-testid="section-paywall">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newgrad.mockInterviewPage.mockInterviewsAreAPremium")}</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Timed mock interviews with scoring and review are available with the New Grad Toolkit. Free users can preview individual questions on the Interview Question Bank page.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {EXAM_SIZES.map((size, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center opacity-60" data-testid={`preview-exam-size-${i}`}>
                  <Lock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">{size.label}</h3>
                  <p className="text-sm text-gray-500">{size.count} questions · {size.time} min</p>
                </div>
              ))}
            </div>
            <PremiumUpgradeCTA
              requiredEntitlement="toolkit"
              context={`Unlock timed mock interviews with ${INTERVIEW_QUESTION_BANK.length}+ randomized questions, self-scoring, detailed answer review, and performance analytics. Practice under realistic interview conditions.`}
            />
          </div>
        </section>
      ) : examState === "setup" ? (
        <section className="py-16" data-testid="section-setup">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.newgrad.mockInterviewPage.chooseYourMockInterview")}</h2>
            <div className="space-y-4 mb-8">
              {EXAM_SIZES.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(i)}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                    selectedSize === i
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 bg-white hover:border-violet-200"
                  }`}
                  data-testid={`button-exam-size-${i}`}
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{size.label}</h3>
                    <p className="text-sm text-gray-500">{size.count} randomized questions · {size.time} minutes</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedSize === i ? "border-violet-500 bg-violet-500" : "border-gray-300"
                  }`}>
                    {selectedSize === i && <CheckCircle2 className="w-full h-full text-white" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="bg-violet-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t("pages.newgrad.mockInterviewPage.howItWorks")}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">1</span> {t("pages.newgrad.mockInterviewPage.questionsAreRandomlySelectedFrom")}</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">2</span> {t("pages.newgrad.mockInterviewPage.typeYourAnswerAsYou")}</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">3</span> {t("pages.newgrad.mockInterviewPage.revealTheExpertSampleAnswer")}</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">4</span> {t("pages.newgrad.mockInterviewPage.reviewAllQuestionsAndScores")}</li>
              </ul>
            </div>
            <button
              onClick={startExam}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
              data-testid="button-start-exam"
            >
              <Play className="w-5 h-5" /> Start Mock Interview
            </button>
          </div>
        </section>
      ) : examState === "in-progress" ? (
        <section className="py-8" data-testid="section-exam">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-gray-500 hover:text-gray-700"
                  data-testid="button-pause"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-medium ${
                  timeRemaining < 300 ? "bg-red-100 text-red-700" : "bg-violet-100 text-violet-700"
                }`} data-testid="text-timer">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            {isPaused ? (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-8 text-center">
                <Pause className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.newgrad.mockInterviewPage.interviewPaused")}</h3>
                <p className="text-sm text-gray-600 mb-4">{t("pages.newgrad.mockInterviewPage.takeAMomentIfYou")}</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700"
                  data-testid="button-resume"
                >
                  Resume Interview
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium">
                    {questions[currentIndex]?.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    questions[currentIndex]?.difficulty === "beginner" ? "bg-green-50 text-green-600" :
                    questions[currentIndex]?.difficulty === "intermediate" ? "bg-yellow-50 text-yellow-600" :
                    "bg-red-50 text-red-600"
                  }`}>
                    {questions[currentIndex]?.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="text-current-question">
                  {questions[currentIndex]?.question}
                </h3>

                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t("pages.newgrad.mockInterviewPage.typeYourAnswerHereAs")}
                  className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                  data-testid="input-answer"
                />

                {!showAnswer ? (
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="flex-1 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                      data-testid="button-show-answer"
                    >
                      Show Expert Answer & Score
                    </button>
                    <button
                      onClick={skipQuestion}
                      className="px-4 py-2.5 text-gray-500 hover:text-gray-700 font-medium text-sm"
                      data-testid="button-skip"
                    >
                      Skip
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
                        <Star className="w-4 h-4" /> Expert Sample Answer
                      </h4>
                      <p className="text-sm text-green-700 leading-relaxed whitespace-pre-line">
                        {questions[currentIndex]?.sampleAnswer}
                      </p>
                      {questions[currentIndex]?.tips && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs font-semibold text-green-700 mb-1">{t("pages.newgrad.mockInterviewPage.tips")}</p>
                          <ul className="space-y-0.5">
                            {questions[currentIndex].tips.map((tip, j) => (
                              <li key={j} className="text-xs text-green-600 flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">{t("pages.newgrad.mockInterviewPage.rateYourAnswer15")}</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => submitAnswer(score)}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50 font-semibold text-gray-700 transition-all"
                            data-testid={`button-score-${score}`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                        <span>{t("pages.newgrad.mockInterviewPage.needsWork")}</span>
                        <span>{t("pages.newgrad.mockInterviewPage.excellent")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="py-16" data-testid="section-review">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Award className="w-12 h-12 text-violet-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newgrad.mockInterviewPage.mockInterviewComplete")}</h2>
              <p className="text-gray-600">{t("pages.newgrad.mockInterviewPage.reviewYourPerformanceAndCompare")}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="review-avg-score">
                <div className="text-2xl font-bold text-violet-700">{avgScore}/5</div>
                <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.avgScore")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="review-answered">
                <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.answered")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="review-skipped">
                <div className="text-2xl font-bold text-orange-600">{skippedCount}</div>
                <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.skipped")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="review-time">
                <div className="text-2xl font-bold text-blue-600">{formatTime(totalTime)}</div>
                <div className="text-xs text-gray-500">{t("pages.newgrad.mockInterviewPage.totalTime")}</div>
              </div>
            </div>

            <div className="flex gap-3 mb-8 justify-center">
              <button
                onClick={() => { setExamState("setup"); setAnswers([]); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700"
                data-testid="button-new-exam"
              >
                <RotateCcw className="w-4 h-4" /> New Mock Interview
              </button>
              <Link
                href="/newgrad/interview"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-semibold border border-violet-200 hover:bg-violet-50"
                data-testid="button-question-bank"
              >
                Question Bank <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.newgrad.mockInterviewPage.answerReview")}</h3>
            <div className="space-y-3">
              {answers.map((answer, i) => {
                const q = questions[answer.questionIndex];
                if (!q) return null;
                const isExpanded = expandedReview === i;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`review-question-${i}`}>
                    <button
                      onClick={() => setExpandedReview(isExpanded ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                          (answer.selfScore || 0) >= 4 ? "bg-green-100 text-green-700" :
                          (answer.selfScore || 0) >= 2 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {answer.selfScore || "—"}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium mr-2">{q.category}</span>
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">{q.question}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-3">
                        {answer.userResponse && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 mb-1">{t("pages.newgrad.mockInterviewPage.yourAnswer")}</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{answer.userResponse}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-semibold text-green-600 mb-1">{t("pages.newgrad.mockInterviewPage.expertSampleAnswer")}</h4>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">{q.sampleAnswer}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Time: {formatTime(answer.timeSpent)}</span>
                          <span>Score: {answer.selfScore}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-gradient-to-r from-violet-50 to-purple-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.newgrad.mockInterviewPage.morePracticeTools")}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50 border border-violet-200" data-testid="link-interview-bank">
              Interview Question Bank
            </Link>
            <Link href="/newgrad/scenarios" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50 border border-violet-200" data-testid="link-scenarios">
              Workplace Scenarios
            </Link>
            <Link href="/newgrad/simulation-sets" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50 border border-violet-200" data-testid="link-simulations">
              Simulation Sets
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700" data-testid="link-hub">
              Career Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
