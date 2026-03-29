import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DifferentiatorCTA, TrustBadges } from "@/components/competitive-differentiation";
import { RelatedResources } from "@/components/related-resources";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { getExamQuestions, type PooledQuestion } from "@/lib/question-pool";
import { fetchFilterOptions, type FilterOptions } from "@/lib/qbank-api";
import { CheckCircle2, XCircle, Filter, RotateCcw, ChevronLeft, ChevronRight, Trophy, Target, Lock, Crown, BookOpen, Clock, GraduationCap, PenLine, BarChart3, Sparkles } from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { canAccessTier } from "@/lib/access";
import { ExplanationPanel, type ExplanationData } from "@/components/explanation-panel";
import { useLocation } from "wouter";
import { getTierConfig, getAllowedExamTiers } from "@shared/tier-config";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { InlineConfidenceRating } from "@/components/study-momentum";
import { SocialProofBar } from "@/components/conversion-funnel";
import { QuestionComments } from "@/components/question-comments";
import { ExamReportButton } from "@/components/exam-error-boundary";
import { useI18n } from "@/lib/i18n";
import { useEntitlement } from "@/hooks/use-entitlement";
import { FeatureLockedPreview } from "@/components/feature-locked-preview";
import {
  AnswerOption,
  ResultHeader,
  PremiumBadge,
  StudyProgressBar,
} from "@/components/premium-study";

const FREE_PREVIEW_COUNT = 3;

type QBankMode = "study" | "exam" | "learning";

interface ExamSessionState {
  questions: PooledQuestion[];
  shuffledOptions: { options: string[]; correctIndex: number }[];
  answers: Record<number, number>;
  currentIndex: number;
  timeRemaining: number;
  timerActive: boolean;
  submitted: boolean;
}

function optText(opt: any): string {
  if (typeof opt === "string") return opt;
  if (typeof opt === "object" && opt !== null && typeof opt.text === "string") return opt.text;
  return String(opt ?? "");
}

function shuffleWithMapping(options: string[], correctIndex: number): { options: string[]; correctIndex: number } {
  const indexed = options.map((opt, i) => ({ opt, origIdx: i }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const newCorrectIdx = indexed.findIndex(item => item.origIdx === correctIndex);
  return { options: indexed.map(item => item.opt), correctIndex: newCorrectIdx };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const DIFFICULTY_LABELS: Record<number, string> = { 1: "Easy", 2: "Easy", 3: "Moderate", 4: "Hard", 5: "Expert" };

export default function QuestionBank() {
  const { user, effectiveTier, isLoading: authLoading, isTester } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { hasAccess: hasQbankAccess } = useEntitlement("feature", "qbank");

  const [usageStatus, setUsageStatus] = useState<{
    isPremium: boolean;
    dailyUsed: number;
    dailyLimit: number;
    dailyRemaining: number;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login?redirect=/test-bank");
      return;
    }
  }, [user, authLoading, setLocation]);

  const refreshUsageStatus = useCallback(() => {
    if (!user) return;
    const token = localStorage.getItem("nursenest-user-token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch("/api/qbank/usage-status", { headers })
      .then(r => r.json())
      .then(data => setUsageStatus(data))
      .catch(() => {});
  }, [user]);

  const trackFreeUsage = useCallback(() => {
    if (!user || hasQbankAccess) return;
    const token = localStorage.getItem("nursenest-user-token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch("/api/qbank/usage-increment", { method: "POST", headers })
      .then(r => r.json())
      .then(() => refreshUsageStatus())
      .catch(() => {});
  }, [user, hasQbankAccess, refreshUsageStatus]);

  useEffect(() => {
    refreshUsageStatus();
  }, [refreshUsageStatus]);
  const allowedQBankTiers = getAllowedExamTiers(effectiveTier || "free");
  const defaultTierFilter = allowedQBankTiers.length === 1 ? allowedQBankTiers[0] : (allowedQBankTiers.length > 0 ? allowedQBankTiers[0] : "all");
  const [tierFilter, setTierFilter] = useState<string>(defaultTierFilter);
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [examFilter, setExamFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const [mode, setMode] = useState<QBankMode>("study");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [allQuestions, setAllQuestions] = useState<PooledQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  const [examSession, setExamSession] = useState<ExamSessionState | null>(null);
  const [examQuestionCount, setExamQuestionCount] = useState<number>(25);
  const [examTimerMinutes, setExamTimerMinutes] = useState<number>(45);
  const examTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const userCanAccessTier = (questionTier: string) => {
    if (!questionTier || questionTier === "free") return true;
    if (!user || !effectiveTier || effectiveTier === "free") {
      if (user?.testerAccess) return canAccessTier(effectiveTier, questionTier, user.testerAccess, user.testerExpiry);
      return false;
    }
    if (effectiveTier === "admin") return true;
    return canAccessTier(effectiveTier, questionTier, user?.testerAccess, user?.testerExpiry);
  };

  useEffect(() => {
    let tier = tierFilter;
    if (tier === "all") {
      tier = allowedQBankTiers.length > 0 ? allowedQBankTiers[0] : (effectiveTier || "rpn");
    }
    if (allowedQBankTiers.length > 0 && !allowedQBankTiers.includes(tier)) {
      tier = allowedQBankTiers[0];
      setTierFilter(tier);
      return;
    }

    fetchFilterOptions(tier).then(setFilterOptions).catch(() => {});

    const filters: Record<string, string> = {};
    if (examFilter !== "all") filters.exam = examFilter;
    if (difficultyFilter !== "all") filters.difficulty = difficultyFilter;
    if (topicFilter !== "all") filters.topic = topicFilter;

    setLoadingQuestions(true);
    getExamQuestions(
      tier,
      50,
      systemFilter !== "all" ? [systemFilter] : undefined,
      Object.keys(filters).length > 0 ? filters : undefined
    ).then((questions) => {
      setAllQuestions(questions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setRevealed(false);
      setLoadingQuestions(false);
    }).catch(() => setLoadingQuestions(false));
  }, [tierFilter, effectiveTier, systemFilter, examFilter, difficultyFilter, topicFilter]);

  const isTierLocked = tierFilter !== "all" && !userCanAccessTier(tierFilter);
  const isDailyLimitReached = usageStatus && !usageStatus.isPremium && usageStatus.dailyRemaining <= 0;
  const accessibleQuestions = useMemo(() => {
    if (isTierLocked) return [];
    return allQuestions;
  }, [allQuestions, isTierLocked]);

  const bodySystems = useMemo(() => {
    if (filterOptions?.categories) return filterOptions.categories;
    const systems = new Set(allQuestions.map(q => q.bodySystem));
    return Array.from(systems).sort();
  }, [allQuestions, filterOptions]);

  const question = mode === "exam" && examSession ? examSession.questions[examSession.currentIndex] : accessibleQuestions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (mode === "exam" && examSession) {
      if (examSession.submitted) return;
      setExamSession(prev => prev ? {
        ...prev,
        answers: { ...prev.answers, [prev.currentIndex]: idx },
      } : null);
      return;
    }
    if (revealed) return;
    setSelectedAnswer(idx);
    if (mode === "learning") {
      setRevealed(true);
      setStats(prev => ({
        correct: prev.correct + (idx === question?.correct ? 1 : 0),
        total: prev.total + 1,
      }));
      trackFreeUsage();
    }
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setRevealed(true);
    setStats(prev => ({
      correct: prev.correct + (selectedAnswer === question?.correct ? 1 : 0),
      total: prev.total + 1,
    }));
    trackFreeUsage();
  };

  const handleNext = () => {
    if (currentIndex < accessibleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedAnswer(null);
    setRevealed(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(accessibleQuestions.length - 1);
    }
    setSelectedAnswer(null);
    setRevealed(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setRevealed(false);
    setStats({ correct: 0, total: 0 });
  };

  const startExamSession = useCallback(() => {
    if (accessibleQuestions.length === 0) return;
    const count = Math.min(examQuestionCount, accessibleQuestions.length);
    const shuffledQuestions = shuffleArray(accessibleQuestions).slice(0, count);
    const shuffledOpts = shuffledQuestions.map(q => shuffleWithMapping(q.options, q.correct));
    setExamSession({
      questions: shuffledQuestions,
      shuffledOptions: shuffledOpts,
      answers: {},
      currentIndex: 0,
      timeRemaining: examTimerMinutes * 60,
      timerActive: true,
      submitted: false,
    });
  }, [accessibleQuestions, examQuestionCount, examTimerMinutes]);

  useEffect(() => {
    if (!examSession || !examSession.timerActive || examSession.submitted) return;
    examTimerRef.current = setInterval(() => {
      setExamSession(prev => {
        if (!prev || prev.submitted) return prev;
        if (prev.timeRemaining <= 1) {
          clearInterval(examTimerRef.current);
          return { ...prev, timeRemaining: 0, timerActive: false, submitted: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(examTimerRef.current);
  }, [examSession?.timerActive, examSession?.submitted]);

  const submitExam = () => {
    if (!examSession) return;
    clearInterval(examTimerRef.current);
    setExamSession(prev => prev ? { ...prev, submitted: true, timerActive: false } : null);
  };

  const exitExam = () => {
    clearInterval(examTimerRef.current);
    setExamSession(null);
  };

  const examReport = useMemo(() => {
    if (!examSession?.submitted) return null;
    const { questions, shuffledOptions, answers } = examSession;
    let correct = 0;
    const systemScores: Record<string, { correct: number; total: number }> = {};
    const diffScores: Record<string, { correct: number; total: number }> = {};
    const review: { question: PooledQuestion; userAnswer: number; correctAnswer: number; isCorrect: boolean; shuffled: { options: string[]; correctIndex: number } }[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const so = shuffledOptions[i];
      const userAns = answers[i] ?? -1;
      const isCorrect = userAns === so.correctIndex;
      if (isCorrect) correct++;

      const sys = q.bodySystem || "General";
      if (!systemScores[sys]) systemScores[sys] = { correct: 0, total: 0 };
      systemScores[sys].total++;
      if (isCorrect) systemScores[sys].correct++;

      const diffLabel = DIFFICULTY_LABELS[q.difficulty || 3] || "Moderate";
      if (!diffScores[diffLabel]) diffScores[diffLabel] = { correct: 0, total: 0 };
      diffScores[diffLabel].total++;
      if (isCorrect) diffScores[diffLabel].correct++;

      review.push({ question: q, userAnswer: userAns, correctAnswer: so.correctIndex, isCorrect, shuffled: so });
    }

    return {
      score: correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      systemBreakdown: Object.entries(systemScores)
        .map(([system, s]) => ({ system, ...s, percentage: Math.round((s.correct / s.total) * 100) }))
        .sort((a, b) => a.percentage - b.percentage),
      difficultyBreakdown: Object.entries(diffScores)
        .map(([level, s]) => ({ level, ...s, percentage: Math.round((s.correct / s.total) * 100) })),
      review,
    };
  }, [examSession?.submitted]);

  const isStudyOrLearning = mode === "study" || mode === "learning";
  const isCorrect = isStudyOrLearning ? selectedAnswer === question?.correct : false;
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const qbTierConfig = getTierConfig(effectiveTier);
  const qbTitle = (effectiveTier && effectiveTier !== "free" && effectiveTier !== "admin")
    ? qbTierConfig.testBankLabel
    : "Test Bank";

  if (authLoading || !user) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-warmwhite flex items-center justify-center">
          <div className="text-center text-gray-500">{t("pages.questionBank.loading")}</div>
        </main>
      </>
    );
  }

  if (mode === "exam" && examSession?.submitted && examReport) {
    return (
      <>
        <SEO title={`${qbTitle} - Exam Results`} description={t("pages.questionBank.viewYourPracticeExamResults")} canonicalPath="/test-bank" />
        <Navigation />
        <main className="min-h-screen bg-warmwhite">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BreadcrumbNav />
            <div className="text-center mb-10 animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-4 text-gray-900" data-testid="text-exam-results-title">{t("qbank.practiceExamResults")}</h1>
              <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 ${examReport.percentage >= 70 ? "bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200/60" : "bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200/60"}`}>
                <Trophy className={`h-7 w-7 ${examReport.percentage >= 70 ? "text-emerald-600" : "text-amber-600"}`} />
                <span className={`text-4xl font-black ${examReport.percentage >= 70 ? "text-emerald-700" : "text-amber-700"}`} data-testid="text-exam-score">
                  {examReport.percentage}%
                </span>
                <span className="text-gray-500 text-sm font-medium">({examReport.score}/{examReport.total})</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <Card className="premium-card border-0 shadow-md" data-testid="card-system-breakdown">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> {t("qbank.byBodySystem")}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {examReport.systemBreakdown.map(s => (
                    <div key={s.system} className="flex items-center justify-between text-sm gap-3">
                      <span className="text-gray-700 truncate flex-1">{s.system}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${s.percentage >= 70 ? "bg-emerald-500" : s.percentage >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${s.percentage}%` }} />
                        </div>
                        <span className="text-gray-500 w-16 text-right tabular-nums text-xs">{s.correct}/{s.total} ({s.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="premium-card border-0 shadow-md" data-testid="card-difficulty-breakdown">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> {t("qbank.byDifficulty")}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {examReport.difficultyBreakdown.map(d => (
                    <div key={d.level} className="flex items-center justify-between text-sm gap-3">
                      <span className="text-gray-700">{d.level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${d.percentage >= 70 ? "bg-emerald-500" : d.percentage >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${d.percentage}%` }} />
                        </div>
                        <span className="text-gray-500 w-16 text-right tabular-nums text-xs">{d.correct}/{d.total} ({d.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="premium-card border-0 shadow-md mb-8" data-testid="card-exam-review">
              <CardHeader><CardTitle className="text-base">{t("qbank.questionReview")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {examReport.review.map((r, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${r.isCorrect ? "border-emerald-200/60 bg-emerald-50/30" : "border-red-200/60 bg-red-50/30"}`} data-testid={`review-item-${i}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-sm font-bold text-gray-400 tabular-nums shrink-0">Q{i + 1}.</span>
                      <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 ${r.isCorrect ? "bg-emerald-500" : "bg-red-400"}`}>
                        {r.isCorrect ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <XCircle className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className="text-sm text-gray-800 leading-relaxed">{r.question.question}</span>
                    </div>
                    <div className="ml-10 space-y-1.5">
                      {r.shuffled.options.map((opt, oi) => (
                        <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${
                          oi === r.correctAnswer ? "bg-emerald-100/80 text-emerald-800 font-medium" :
                          oi === r.userAnswer && !r.isCorrect ? "bg-red-100/80 text-red-700" : "text-gray-600"
                        }`}>
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed italic">{r.question.rationale}</p>
                      <QuestionComments questionId={r.question.id || `qb-review-${i}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => { exitExam(); startExamSession(); }} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm gap-2 px-6" data-testid="button-retake-exam">
                <RotateCcw className="h-4 w-4" /> {t("qbank.retakeExam")}
              </Button>
              <Button variant="outline" onClick={exitExam} className="rounded-xl border-gray-200 px-6" data-testid="button-back-to-study">{t("qbank.backToTestBank")}</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (mode === "exam" && examSession && !examSession.submitted) {
    const eq = examSession.questions[examSession.currentIndex];
    const so = examSession.shuffledOptions[examSession.currentIndex];
    const userAnswer = examSession.answers[examSession.currentIndex];
    const answeredCount = Object.keys(examSession.answers).length;
    const progressPct = (answeredCount / examSession.questions.length) * 100;

    return (
      <>
        <SEO title={`${qbTitle} - Practice Exam`} description={t("pages.questionBank.timedPracticeExamWithRandomized")} canonicalPath="/test-bank" />
        <div className="min-h-screen bg-warmwhite font-sans text-gray-900">
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm" data-testid="exam-mode-top-bar">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700" data-testid="text-exam-mode-progress">
                  Q {examSession.currentIndex + 1} of {examSession.questions.length}
                </span>
                <StudyProgressBar value={progressPct} variant="indigo" className="w-24" />
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold px-3 py-1 rounded-lg ${examSession.timeRemaining < 300 ? "text-red-600 bg-red-50" : "text-gray-700 bg-gray-50"}`} data-testid="text-exam-timer">
                  <Clock className="h-4 w-4" />
                  {formatTime(examSession.timeRemaining)}
                </div>
                <PremiumBadge variant="default" data-testid="badge-answered-count">{answeredCount}/{examSession.questions.length} {t("qbank.answered")}</PremiumBadge>
                <Button size="sm" onClick={submitExam} className="rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-sm" data-testid="button-submit-exam">{t("qbank.submitExam")}</Button>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
            {eq && (
              <Card className="premium-card border-0 shadow-lg bg-white animate-fade-in-up" data-testid="card-exam-question">
                <CardHeader className="pb-3 px-6 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <PremiumBadge variant="system">{eq.bodySystem}</PremiumBadge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed text-gray-900" data-testid="text-exam-q-text">{eq.question}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-3 mb-6">
                    {so.options.map((opt, idx) => (
                      <AnswerOption
                        key={idx}
                        index={idx}
                        text={optText(opt)}
                        isSelected={idx === userAnswer}
                        onClick={() => handleAnswer(idx)}
                        data-testid={`button-exam-option-${idx}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setExamSession(prev => prev ? { ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) } : null)}
                      disabled={examSession.currentIndex === 0}
                      className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                      data-testid="button-exam-prev"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> {t("qbank.previous")}
                    </Button>
                    {examSession.currentIndex < examSession.questions.length - 1 ? (
                      <Button
                        onClick={() => setExamSession(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null)}
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm"
                        data-testid="button-exam-next"
                      >
                        {t("qbank.next")} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={submitExam} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" data-testid="button-exam-finish">
                        {t("qbank.finishSubmit")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${qbTitle} - Practice Questions`}
        description={t("pages.questionBank.practiceThousandsOfNursingQuestions")}
        canonicalPath="/test-bank"
        keywords="nursing test bank, practice questions, NCLEX prep, nursing exam questions, RPN questions, RN questions, NP questions"
      />

      <Navigation />

      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 pb-16 max-w-4xl">
          <BreadcrumbNav />
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight" data-testid="text-qb-title">
              {qbTitle}
            </h1>
            <p className="text-gray-500 text-sm">
              {t("qbank.practiceQuestions", { count: String(accessibleQuestions.length.toLocaleString()) })}
            </p>
          </div>

          {usageStatus && !usageStatus.isPremium && (
            <div className={`mb-6 p-4 rounded-xl border text-center ${isDailyLimitReached ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`} data-testid="qbank-usage-banner">
              <div className="flex items-center justify-center gap-2 text-sm font-medium mb-1">
                <span className={isDailyLimitReached ? "text-amber-700" : "text-blue-700"}>
                  {isDailyLimitReached
                    ? "Daily question limit reached"
                    : `${usageStatus.dailyRemaining} of ${usageStatus.dailyLimit} free questions remaining today`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${isDailyLimitReached ? "bg-amber-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(100, (usageStatus.dailyUsed / usageStatus.dailyLimit) * 100)}%` }}
                />
              </div>
              {isDailyLimitReached && (
                <Button
                  size="sm"
                  className="mt-2 rounded-full px-6"
                  onClick={() => setLocation("/pricing")}
                  data-testid="button-upgrade-qbank"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Upgrade for Unlimited Access
                </Button>
              )}
            </div>
          )}

          {isDailyLimitReached && (
            <FeatureLockedPreview feature="qbank">
              <div />
            </FeatureLockedPreview>
          )}

          {!isDailyLimitReached && (<>
          <div className="flex items-center justify-center gap-2 mb-6" data-testid="mode-selector">
            <div className="inline-flex bg-gray-100/80 rounded-2xl p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setMode("study"); setExamSession(null); }}
                className={`rounded-xl gap-1.5 px-5 transition-all duration-200 ${mode === "study" ? "bg-white text-gray-900 shadow-sm font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                data-testid="button-mode-study"
              >
                <BookOpen className="h-4 w-4" /> {t("qbank.studyMode")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setMode("learning"); setExamSession(null); }}
                className={`rounded-xl gap-1.5 px-5 transition-all duration-200 ${mode === "learning" ? "bg-emerald-50 text-emerald-700 shadow-sm font-semibold border border-emerald-200/60" : "text-gray-500 hover:text-gray-700"}`}
                data-testid="button-mode-learning"
              >
                <Sparkles className="h-4 w-4" /> Learning Mode
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode("exam")}
                className={`rounded-xl gap-1.5 px-5 transition-all duration-200 ${mode === "exam" ? "bg-white text-gray-900 shadow-sm font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                data-testid="button-mode-exam"
              >
                <PenLine className="h-4 w-4" /> {t("qbank.examMode")}
              </Button>
            </div>
          </div>

          {mode === "exam" && !examSession && (
            <Card className="premium-card border-0 shadow-md mb-6" data-testid="card-exam-config">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  {t("qbank.configureExam")}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("qbank.numberOfQuestions")}</label>
                    <Select value={String(examQuestionCount)} onValueChange={(v) => setExamQuestionCount(Number(v))}>
                      <SelectTrigger className="border-gray-200/80 rounded-xl h-11" data-testid="select-exam-count">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">{t("pages.questionBank.10Questions")}</SelectItem>
                        <SelectItem value="25">{t("pages.questionBank.25Questions")}</SelectItem>
                        <SelectItem value="50">{t("pages.questionBank.50Questions")}</SelectItem>
                        <SelectItem value="75">{t("pages.questionBank.75Questions")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("qbank.timeLimit")}</label>
                    <Select value={String(examTimerMinutes)} onValueChange={(v) => setExamTimerMinutes(Number(v))}>
                      <SelectTrigger className="border-gray-200/80 rounded-xl h-11" data-testid="select-exam-time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">{t("pages.questionBank.15Minutes")}</SelectItem>
                        <SelectItem value="30">{t("pages.questionBank.30Minutes")}</SelectItem>
                        <SelectItem value="45">{t("pages.questionBank.45Minutes")}</SelectItem>
                        <SelectItem value="60">{t("pages.questionBank.60Minutes")}</SelectItem>
                        <SelectItem value="90">{t("pages.questionBank.90Minutes")}</SelectItem>
                        <SelectItem value="120">{t("pages.questionBank.120Minutes")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-5 space-y-1 bg-gray-50/80 rounded-xl p-3">
                  <p>{t("qbank.examDesc1")}</p>
                  <p>{t("qbank.examDesc2")}</p>
                </div>
                <Button
                  onClick={startExamSession}
                  disabled={accessibleQuestions.length === 0 || loadingQuestions}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold shadow-sm shadow-primary/20 transition-all duration-200"
                  data-testid="button-start-exam"
                >
                  <PenLine className="h-4 w-4 mr-2" /> {t("qbank.startPracticeExam", { count: String(Math.min(examQuestionCount, accessibleQuestions.length)), time: String(examTimerMinutes) })}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/70 rounded-2xl p-3.5 border border-gray-200/50 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              {allowedQBankTiers.length !== 1 && (
              <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); setExamFilter("all"); setDifficultyFilter("all"); setTopicFilter("all"); setSystemFilter("all"); }}>
                <SelectTrigger className="w-[140px] border-gray-200 bg-white" data-testid="select-tier">
                  <SelectValue placeholder={t("pages.questionBank.tier")} />
                </SelectTrigger>
                <SelectContent>
                  {allowedQBankTiers.length === 0 && <SelectItem value="all">{t("qbank.allTiers")}</SelectItem>}
                  {allowedQBankTiers.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier === "rpn" ? "RPN/LVN" : tier.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              )}

              <Select value={systemFilter} onValueChange={(v) => { setSystemFilter(v); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}>
                <SelectTrigger className="w-[160px] border-gray-200 bg-white" data-testid="select-system">
                  <SelectValue placeholder={t("pages.questionBank.bodySystem")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("qbank.allSystems")}</SelectItem>
                  {bodySystems.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filterOptions?.exams && filterOptions.exams.length > 1 && (
                <Select value={examFilter} onValueChange={(v) => { setExamFilter(v); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}>
                  <SelectTrigger className="w-[140px] border-gray-200 bg-white" data-testid="select-exam-type">
                    <SelectValue placeholder={t("pages.questionBank.exam")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("qbank.allExams")}</SelectItem>
                    {filterOptions.exams.map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={difficultyFilter} onValueChange={(v) => { setDifficultyFilter(v); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}>
                <SelectTrigger className="w-[130px] border-gray-200 bg-white" data-testid="select-difficulty">
                  <SelectValue placeholder={t("pages.questionBank.difficulty")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("qbank.allLevels")}</SelectItem>
                  <SelectItem value="easy">{t("qbank.easy")}</SelectItem>
                  <SelectItem value="moderate">{t("qbank.moderate")}</SelectItem>
                  <SelectItem value="hard">{t("qbank.hard")}</SelectItem>
                </SelectContent>
              </Select>

              {filterOptions?.topics && filterOptions.topics.length > 0 && (
                <Select value={topicFilter} onValueChange={(v) => { setTopicFilter(v); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}>
                  <SelectTrigger className="w-[160px] border-gray-200 bg-white" data-testid="select-topic">
                    <SelectValue placeholder={t("pages.questionBank.topic")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("qbank.allTopics")}</SelectItem>
                    {filterOptions.topics.slice(0, 50).map(topic => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="ml-auto flex items-center gap-4">
              {stats.total > 0 && isStudyOrLearning && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span data-testid="text-accuracy">{accuracy}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span data-testid="text-score">{stats.correct}/{stats.total}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500 hover:text-gray-700" data-testid="button-reset">
                    <RotateCcw className="h-3 w-3 mr-1" /> {t("qbank.reset")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isTierLocked && (
            <Card className="premium-card border-0 shadow-md bg-gradient-to-br from-primary/5 to-violet-50/30 mb-6" data-testid="card-qb-paywall">
              <CardContent className="p-8 sm:p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" data-testid="text-qb-locked">
                  {t("qbank.requiresSubscription", { tier: tierFilter === "rpn" ? "RPN/LVN" : tierFilter === "rn" ? "RN" : "NP" })}
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  {t("qbank.requiresSubscriptionDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {!user ? (
                    <Button onClick={() => setLocation("/start-free")} className="rounded-xl gap-2 px-6 shadow-sm" data-testid="button-qb-signup">
                      {t("qbank.startFreeNoCreditCard")}
                    </Button>
                  ) : null}
                  <Button onClick={() => setLocation("/pricing")} variant={user ? "default" : "outline"} className="rounded-xl gap-2 px-6" data-testid="button-qb-upgrade">
                    <Crown className="w-4 h-4" /> {t("qbank.viewPlans")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(!user || effectiveTier === "free") && tierFilter === "all" && accessibleQuestions.length < allQuestions.length && (
            <Card className="rounded-2xl border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/30 mb-6" data-testid="card-qb-preview-notice">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">
                    {t("qbank.showingPreview", { shown: String(accessibleQuestions.length), total: String(allQuestions.length.toLocaleString()) })}
                  </p>
                </div>
                <Button size="sm" onClick={() => setLocation(user ? "/pricing" : "/start-free")} className="rounded-xl shrink-0 shadow-sm" data-testid="button-qb-unlock">
                  {t("qbank.unlockAll")}
                </Button>
              </CardContent>
            </Card>
          )}

          {isStudyOrLearning && (
            <>
              {loadingQuestions ? (
                <Card className="premium-card border-0 shadow-md bg-white">
                  <CardHeader className="pb-3 px-6 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="skeleton-block h-6 w-16" />
                      <div className="skeleton-block h-6 w-24" />
                    </div>
                    <div className="skeleton-block h-2 w-full mb-4 rounded-full" />
                    <div className="space-y-2">
                      <div className="skeleton-text w-full" />
                      <div className="skeleton-text w-4/5" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton-block h-14 w-full" />
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <div className="skeleton-block h-10 flex-1" />
                      <div className="skeleton-block h-10 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ) : accessibleQuestions.length === 0 ? (
                <Card className="premium-card border-0 shadow-md bg-white">
                  <CardContent className="empty-state">
                    <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-7 h-7 text-primary/40" />
                    </div>
                    <p className="empty-state-title" data-testid="text-no-questions">{isTierLocked ? t("qbank.noQuestionsSubscribe") : t("qbank.noQuestionsFilter")}</p>
                    <p className="empty-state-description">{isTierLocked ? t("qbank.noQuestionsSubscribeDesc") : t("qbank.noQuestionsFilterDesc")}</p>
                  </CardContent>
                </Card>
              ) : question ? (
                <>
                  <Card className="premium-card border-0 shadow-lg bg-white mb-4 animate-fade-in-up" data-testid="card-question">
                    <CardHeader className="pb-3 px-6 sm:px-8 pt-6 sm:pt-8">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <PremiumBadge variant="tier" data-testid="badge-q-tier">
                            {question.tier === "rpn" ? "RPN/LVN" : question.tier === "rn" ? "RN" : "NP"}
                          </PremiumBadge>
                          <PremiumBadge variant="system" data-testid="badge-q-system">{question.bodySystem}</PremiumBadge>
                          {question.exam && (
                            <PremiumBadge variant="exam" data-testid="badge-q-exam">{question.exam}</PremiumBadge>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400 tabular-nums" data-testid="text-progress">
                          {currentIndex + 1} / {accessibleQuestions.length}
                        </span>
                      </div>
                      <StudyProgressBar value={((currentIndex + 1) / accessibleQuestions.length) * 100} variant="primary" className="mb-5" />
                      <CardTitle className="text-lg leading-[1.65] text-gray-900" data-testid="text-q-text">
                        {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <div className="space-y-3 mb-6">
                        {question.options.map((opt, idx) => (
                          <AnswerOption
                            key={idx}
                            index={idx}
                            text={optText(opt)}
                            isSelected={idx === selectedAnswer}
                            isCorrect={revealed && idx === question.correct}
                            isWrong={revealed && idx === selectedAnswer && !isCorrect}
                            isRevealed={revealed}
                            disabled={revealed}
                            onClick={() => handleAnswer(idx)}
                            iconEl={
                              revealed && idx === question.correct
                                ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                : revealed && idx === selectedAnswer && !isCorrect
                                  ? <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                                  : undefined
                            }
                            data-testid={`button-qb-option-${idx}`}
                          />
                        ))}
                      </div>

                      {!revealed ? (
                        <Button
                          onClick={handleCheck}
                          disabled={selectedAnswer === null}
                          className="w-full rounded-xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all duration-200 active:scale-[0.98]"
                          size="lg"
                          data-testid="button-qb-check"
                        >
                          {t("qbank.checkAnswer")}
                        </Button>
                      ) : (
                        <>
                          <ResultHeader
                            isCorrect={isCorrect}
                            correctText={`Correct Answer: ${String.fromCharCode(65 + question.correct)}. ${optText(question.options[question.correct])}`}
                            data-testid="section-result-header"
                          />

                          {revealed && question.difficulty && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap mb-3">
                              <PremiumBadge variant="difficulty">{t("qbank.difficulty")}: {DIFFICULTY_LABELS[question.difficulty] || question.difficulty}</PremiumBadge>
                              {question.frameworkUsed && <PremiumBadge>{t("qbank.framework")}: {question.frameworkUsed}</PremiumBadge>}
                              {question.questionType && <PremiumBadge>{t("qbank.type")}: {question.questionType}</PremiumBadge>}
                            </div>
                          )}

                          <ExplanationPanel
                            data={{
                              rationale: question.rationale,
                              correctAnswerIndex: question.correct,
                              correctAnswerText: optText(question.options[question.correct]),
                              options: question.options,
                              distractorRationales: question.distractorRationales,
                              clinicalPearl: question.clinicalPearl,
                              examStrategy: question.examStrategy,
                              memoryHook: question.memoryHook,
                              frameworkUsed: question.frameworkUsed,
                              clinicalTrap: question.clinicalTrap,
                              scenario: question.scenario,
                              topic: question.topic,
                              subtopic: question.subtopic,
                              bodySystem: question.bodySystem,
                              questionType: question.questionType,
                            }}
                            isLearningMode={mode === "learning"}
                          />

                          {user && question && selectedAnswer !== null && (
                            <InlineConfidenceRating
                              questionId={`qb-${question.tier}-${currentIndex}`}
                              wasCorrect={isCorrect}
                              topic={question.bodySystem}
                              bodySystem={question.bodySystem}
                            />
                          )}

                          {question && (
                            <>
                              <QuestionComments questionId={question.id || `qb-${question.tier}-${currentIndex}`} />
                              <div className="flex justify-end mt-1">
                                <ExamReportButton examType="question-bank" tier={question.tier} questionId={String(question.id)} />
                              </div>
                            </>
                          )}

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={handlePrev} className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50" data-testid="button-prev">
                              <ChevronLeft className="h-4 w-4 mr-1" /> {t("qbank.previous")}
                            </Button>
                            <Button onClick={handleNext} className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm" data-testid="button-next">
                              {t("qbank.nextQuestion")} <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {!revealed && (
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={handlePrev} className="text-gray-400 hover:text-gray-700 rounded-xl" data-testid="button-nav-prev">
                        <ChevronLeft className="h-4 w-4 mr-1" /> {t("qbank.previous")}
                      </Button>
                      <Button variant="ghost" onClick={handleNext} className="text-gray-400 hover:text-gray-700 rounded-xl" data-testid="button-nav-next">
                        {t("qbank.skip")} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : null}
            </>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100" data-testid="section-related-tools">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{t("qbank.relatedStudyTools")}</p>
            <div className="flex flex-wrap gap-2">
              <LocaleLink href="/lessons" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-lessons">{t("qbank.clinicalLessons")}</LocaleLink>
              <LocaleLink href="/flashcards" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-flashcards">{t("qbank.flashcards")}</LocaleLink>
              <LocaleLink href="/mock-exams" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-mock-exams">{t("qbank.mockExams")}</LocaleLink>
              <LocaleLink href="/anatomy" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-anatomy">{t("qbank.anatomyExplorer")}</LocaleLink>
              <LocaleLink href="/med-math" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-med-math">{t("qbank.medMath")}</LocaleLink>
              <LocaleLink href="/clinical-clarity" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all text-xs font-medium text-gray-600 hover:text-gray-800" data-testid="link-related-clinical-clarity">{t("qbank.clinicalClarity")}</LocaleLink>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-8 space-y-1">
            <p>{t("qbank.disclaimerIndependent")}</p>
            <p>{t("qbank.disclaimerNotAffiliated")}</p>
          </div>
          </>)}
        </div>
      </main>

      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <MedicalReviewBadge />
          <MedicalReferences lessonId="nursing-practice-questions" />
        </div>

        <MedicalReviewJsonLd
          title={t("pages.questionBank.nursingPracticeQuestionsTestBank")}
          slug="test-bank"
          description={t("pages.questionBank.evidencebasedNursingPracticeQuestionsWith")}
          pageUrl="https://www.nursenest.ca/test-bank"
        />

        <div className="mb-8" data-testid="qbank-social-proof">
          <SocialProofBar />
        </div>
        <RelatedResources
          resources={[
            { title: "Nursing Flashcards", href: "/flashcards", description: "Review key concepts with interactive flashcards organized by system and topic.", icon: "flashcard" },
            { title: "Nursing Lessons", href: "/lessons", description: "Study in-depth lessons covering pathophysiology, pharmacology, and clinical nursing.", icon: "lesson" },
            { title: "Clinical Simulators", href: "/clinical-simulators", description: "Practice clinical decision-making with realistic patient scenarios.", icon: "simulator" },
          ]}
          title={t("qbank.continueStudy")}
        />
      </div>

      <TrustBadges variant="compact" />
      <DifferentiatorCTA
        headline="Study Smarter with NurseNest"
        subtitle="Access thousands of nursing practice questions, adaptive mock exams, clinical lessons, and flashcards — all in one platform."
        primaryHref="/register"
        primaryLabel="Start Free"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
      <AdminEditButton pageName="question-bank" />
      <Footer />
    </>
  );
}
