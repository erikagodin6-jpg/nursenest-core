import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { ExamSessionGuard } from "@/components/exam-session-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock, Flag, ChevronRight, CheckCircle2, Send,
  Shield, Stethoscope, Award, Lock, Sparkles, BarChart3,
  BookOpen, TrendingUp, AlertTriangle, ArrowRight, Brain
} from "lucide-react";
import {
  initCAT, selectNextItem, updateAbility,
  getReadinessScore, getWeakAreas, getDifficultyDistribution,
  type CATState
} from "@/lib/cat-engine";
import type { PooledQuestion } from "@/lib/question-pool";

import { useI18n } from "@/lib/i18n";
const DEMO_QUESTION_COUNT = 25;
const LAVENDER = "#9d82dd";
const WARM_WHITE = "#fdfcfa";

interface DemoQuestion {
  id: string;
  stem: string;
  options: string[];
  bodySystem: string;
  topic?: string;
  subtopic?: string;
  difficulty?: number;
  questionType?: string;
  scenario?: string;
}

function toPooledQuestion(q: DemoQuestion): PooledQuestion {
  const { t } = useI18n();
  return {
    id: q.id,
    lessonId: "demo",
    bodySystem: q.bodySystem || "General",
    tier: "rn",
    question: q.stem,
    options: q.options,
    correct: -1,
    rationale: "",
    source: "quiz",
    topic: q.topic,
    subtopic: q.subtopic,
    difficulty: q.difficulty ?? undefined,
    questionType: q.questionType,
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function gtagEvent(eventName: string, params: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

function ScoreRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? "#10b981" : percentage >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
}

type Phase = "landing" | "exam" | "report";

export default function FreeDemoExam() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("landing");
  const [allQuestions, setAllQuestions] = useState<DemoQuestion[]>([]);
  const [administeredQuestions, setAdministeredQuestions] = useState<DemoQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, { selected: number; correct: number; isCorrect: boolean }>>({});
  const [catState, setCatState] = useState<CATState>(initCAT());
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (phase === "exam" && !examFinished) {
      timerRef.current = setInterval(() => {
        setTimeSpent((t) => t + 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, examFinished]);

  const startExam = async () => {
    setLoading(true);
    gtagEvent("demo_exam_start", { event_category: "demo_funnel" });
    try {
      const res = await fetch("/api/demo-exam/questions");
      if (!res.ok) throw new Error("Failed to load questions");
      const data = await res.json();
      const questions: DemoQuestion[] = data.questions || [];
      if (questions.length < DEMO_QUESTION_COUNT) throw new Error("Not enough questions available for the demo exam. Please try again later.");

      setAllQuestions(questions);
      const freshCat = initCAT();
      const pooled = questions.map(toPooledQuestion);
      const first = selectNextItem(freshCat, pooled);
      if (first) {
        const matching = questions.find(q => q.id === first.id)!;
        setAdministeredQuestions([matching]);
        setCurrentQ(0);
      }
      setCatState(freshCat);
      setPhase("exam");
    } catch {
      alert("Unable to load demo exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = useCallback(async () => {
    if (selectedOption === null || submittingAnswer) return;
    const question = administeredQuestions[currentQ];
    if (!question) return;

    setSubmittingAnswer(true);
    try {
      const res = await fetch("/api/demo-exam/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, selectedOption }),
      });
      if (!res.ok) throw new Error("Failed to check answer");
      const data = await res.json();
      const isCorrect = data.correct;
      const correctAnswer = data.correctAnswer;

      setAnswers(prev => ({
        ...prev,
        [question.id]: { selected: selectedOption, correct: correctAnswer, isCorrect },
      }));

      const pooled = toPooledQuestion(question);
      (pooled as any).correct = correctAnswer;
      const newState = updateAbility(catState, pooled, isCorrect);
      setCatState(newState);

      const answeredCount = Object.keys(answers).length + 1;

      if (answeredCount >= DEMO_QUESTION_COUNT) {
        setExamFinished(true);
        clearInterval(timerRef.current);
        gtagEvent("demo_exam_complete", {
          event_category: "demo_funnel",
          score: getReadinessScore(newState).score,
          questions_answered: answeredCount,
        });
        setTimeout(() => setPhase("report"), 500);
      } else {
        const administeredIds = new Set(newState.responses.map(r => r.itemId));
        const remaining = allQuestions
          .filter(q => !administeredIds.has(q.id))
          .map(toPooledQuestion);
        const nextItem = selectNextItem(newState, remaining);
        if (nextItem) {
          const matching = allQuestions.find(q => q.id === nextItem.id)!;
          setAdministeredQuestions(prev => [...prev, matching]);
          setCurrentQ(prev => prev + 1);
          setSelectedOption(null);
        } else {
          setExamFinished(true);
          clearInterval(timerRef.current);
          setPhase("report");
        }
      }
    } catch {
      alert("Error checking answer. Please try again.");
    } finally {
      setSubmittingAnswer(false);
    }
  }, [selectedOption, submittingAnswer, administeredQuestions, currentQ, catState, answers, allQuestions]);

  if (phase === "landing") {
    return <LandingPage onStart={startExam} loading={loading} />;
  }

  if (phase === "report") {
    return <ReportPage catState={catState} answers={answers} timeSpent={timeSpent} questionsAnswered={Object.keys(answers).length} />;
  }

  const handleExamSubmitAndExit = useCallback(() => {
    setExamFinished(true);
    clearInterval(timerRef.current);
    setPhase("report");
  }, []);

  const question = administeredQuestions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / DEMO_QUESTION_COUNT) * 100;

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif] text-gray-900 select-none" style={{ backgroundColor: WARM_WHITE }}>
      <ExamSessionGuard isActive={phase === "exam" && !examFinished} mode="cat" onSubmitAndExit={handleExamSubmitAndExit} />
      <div className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-sm" data-testid="demo-exam-top-bar">
        <div className="w-full h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progressPercent}%`, backgroundColor: LAVENDER }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" style={{ color: LAVENDER }} />
              <span className="text-sm font-bold" style={{ color: LAVENDER }}>NurseNest</span>
            </div>
            <span className="text-xs text-gray-400">{t("pages.freeDemoExam.freeDemoExam")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700" data-testid="text-demo-progress">
              Question {answeredCount + 1} of {DEMO_QUESTION_COUNT}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono font-semibold">{formatTime(timeSpent)}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28">
        {question && (
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide" data-testid="text-body-system">
                {question.bodySystem}
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed" data-testid="text-demo-question">
                {question.stem}
              </h2>
            </div>

            <div className="space-y-2" role="radiogroup" aria-label={t("pages.freeDemoExam.answerOptions")}>
              {question.options.map((rawOption, idx) => {
                const option = typeof rawOption === "object" && rawOption !== null
                  ? (rawOption as any).text || (rawOption as any).label || JSON.stringify(rawOption)
                  : String(rawOption);
                const isSelected = selectedOption === idx;
                const letterLabel = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!answers[question.id]) setSelectedOption(idx);
                    }}
                    disabled={!!answers[question.id]}
                    role="radio"
                    aria-checked={isSelected}
                    className={`w-full text-left px-5 py-4 transition-all flex items-start gap-3.5 rounded-xl border-2 ${
                      isSelected
                        ? "border-purple-300 bg-purple-50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                    } ${answers[question.id] ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    data-testid={`button-demo-option-${idx}`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                        isSelected ? "text-white" : "bg-gray-100 text-gray-500"
                      }`}
                      style={isSelected ? { backgroundColor: LAVENDER } : undefined}
                    >
                      {letterLabel}
                    </span>
                    <span className={`text-sm leading-relaxed pt-1 ${isSelected ? "text-purple-800 font-medium" : "text-gray-600"}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {question && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg" data-testid="demo-exam-bottom-bar">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {answeredCount} of {DEMO_QUESTION_COUNT} answered
            </div>
            <Button
              onClick={submitAnswer}
              disabled={selectedOption === null || submittingAnswer}
              className="gap-1.5 text-white font-semibold rounded-xl px-6"
              style={{ backgroundColor: LAVENDER }}
              data-testid="button-demo-next"
            >
              {submittingAnswer ? "Checking..." : answeredCount + 1 >= DEMO_QUESTION_COUNT ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function LandingPage({ onStart, loading }: { onStart: () => void; loading: boolean }) {
  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]" style={{ backgroundColor: WARM_WHITE }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Stethoscope className="w-6 h-6" style={{ color: LAVENDER }} />
            <span className="text-lg font-bold" style={{ color: LAVENDER }}>NurseNest</span>
          </div>
        </div>

        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border" style={{ backgroundColor: `${LAVENDER}10`, borderColor: `${LAVENDER}30`, color: LAVENDER }}>
            <Shield className="w-4 h-4" /> No login required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight" data-testid="text-demo-title">
            Try a Free Adaptive<br />NCLEX Exam
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed" data-testid="text-demo-description">
            Experience our CAT (Computer Adaptive Testing) engine with 25 real NCLEX-RN style questions.
            Get your personalized readiness score and discover your strengths and weaknesses.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          {[
            { icon: Brain, title: "Adaptive Difficulty", desc: "Questions adapt to your ability level in real-time" },
            { icon: BarChart3, title: "Readiness Report", desc: "Get a detailed breakdown by clinical topic" },
            { icon: Award, title: "Instant Results", desc: "Know your NCLEX readiness in under 30 minutes" },
          ].map((item, i) => (
            <Card key={i} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: "16px" }}>
              <CardContent className="p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${LAVENDER}15` }}>
                  <item.icon className="w-6 h-6" style={{ color: LAVENDER }} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onStart}
            disabled={loading}
            size="lg"
            className="rounded-full px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: LAVENDER }}
            data-testid="button-start-demo"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Start Demo Exam <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-4">{t("pages.freeDemoExam.25QuestionsMiddot15Minutes")}</p>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-gray-400">
            Questions sourced from the NurseNest NCLEX-RN question bank &middot; nursenest.ca
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportPage({
  catState,
  answers,
  timeSpent,
  questionsAnswered,
}: {
  catState: CATState;
  answers: Record<string, { selected: number; correct: number; isCorrect: boolean }>;
  timeSpent: number;
  questionsAnswered: number;
}) {
  const [, navigate] = useLocation();
  const readiness = getReadinessScore(catState);
  const weakAreas = getWeakAreas(catState);
  const diffDist = getDifficultyDistribution(catState);

  const topicStats: Record<string, { correct: number; total: number }> = {};
  for (const r of catState.responses) {
    const system = r.bodySystem || "General";
    if (!topicStats[system]) topicStats[system] = { correct: 0, total: 0 };
    topicStats[system].total++;
    if (r.isCorrect) topicStats[system].correct++;
  }

  const topicBreakdown = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const totalCorrect = catState.responses.filter(r => r.isCorrect).length;
  const overallPct = Math.round((totalCorrect / questionsAnswered) * 100);

  const strengths = topicBreakdown.filter(t => t.percentage >= 70 && t.total >= 2);
  const weaknesses = topicBreakdown.filter(t => t.percentage < 60 && t.total >= 2);

  const trackUpgradeClick = (tier: string) => {
    gtagEvent("demo_upgrade_click", {
      event_category: "demo_funnel",
      tier,
      readiness_score: readiness.score,
    });
  };

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]" style={{ backgroundColor: WARM_WHITE }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Stethoscope className="w-5 h-5" style={{ color: LAVENDER }} />
          <span className="text-base font-bold" style={{ color: LAVENDER }}>NurseNest</span>
          <span className="text-xs text-gray-400 ml-2">{t("pages.freeDemoExam.demoExamReport")}</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-demo-report-title">
            Your NCLEX Readiness Report
          </h1>
          <p className="text-gray-500">Based on your {questionsAnswered}-question adaptive exam</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <Card className="border-gray-100 shadow-md" style={{ borderRadius: "20px" }}>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <ScoreRing percentage={readiness.score} />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{t("pages.freeDemoExam.readinessScore")}</p>
                <p className={`text-lg font-bold ${
                  readiness.level === "Above Passing Standard" ? "text-emerald-600" :
                  readiness.level === "Near Passing Standard" ? "text-amber-600" : "text-red-600"
                }`} data-testid="text-readiness-level">
                  {readiness.level}
                </p>
                <p className="text-sm text-gray-500 mt-2 max-w-xs">{readiness.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-md" style={{ borderRadius: "20px" }}>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-800">{t("pages.freeDemoExam.examSummary")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-demo-score">{totalCorrect}/{questionsAnswered}</p>
                  <p className="text-xs text-gray-500">{t("pages.freeDemoExam.correct")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900">{overallPct}%</p>
                  <p className="text-xs text-gray-500">{t("pages.freeDemoExam.accuracy")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(timeSpent / 60)}m</p>
                  <p className="text-xs text-gray-500">{t("pages.freeDemoExam.timeSpent")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-difficulty-mix">
                    {diffDist ? `${diffDist.hard}/${diffDist.moderate}/${diffDist.easy}` : "-"}
                  </p>
                  <p className="text-xs text-gray-500">{t("pages.freeDemoExam.hardmedeasy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-100 shadow-md mb-8" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: LAVENDER }} />
              Performance by Topic
            </h3>
            <div className="space-y-3">
              {topicBreakdown.map((t) => (
                <div key={t.topic} data-testid={`topic-bar-${t.topic}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{t.topic}</span>
                    <span className={`text-sm font-semibold ${
                      t.percentage >= 80 ? "text-emerald-600" :
                      t.percentage >= 60 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {t.correct}/{t.total} ({t.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${t.percentage}%`,
                        backgroundColor: t.percentage >= 80 ? "#10b981" : t.percentage >= 60 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {(strengths.length > 0 || weaknesses.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {strengths.length > 0 && (
              <Card className="border-emerald-100 shadow-sm" style={{ borderRadius: "16px" }}>
                <CardContent className="p-5">
                  <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {strengths.map(s => (
                      <li key={s.topic} className="text-sm text-gray-700 flex items-center justify-between">
                        <span>{s.topic}</span>
                        <span className="font-semibold text-emerald-600">{s.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {weaknesses.length > 0 && (
              <Card className="border-red-100 shadow-sm" style={{ borderRadius: "16px" }}>
                <CardContent className="p-5">
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Needs Improvement
                  </h4>
                  <ul className="space-y-2">
                    {weaknesses.map(w => (
                      <li key={w.topic} className="text-sm text-gray-700 flex items-center justify-between">
                        <span>{w.topic}</span>
                        <span className="font-semibold text-red-600">{w.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="space-y-4 mb-10">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-6">{t("pages.freeDemoExam.unlockYourFullPotential")}</h3>

          {[
            { title: "Full Readiness Analysis", desc: "Comprehensive probability-based pass prediction with confidence intervals and trend analysis across all NCLEX domains.", icon: BarChart3 },
            { title: "Detailed Study Plan", desc: "AI-generated personalized study schedule targeting your weak areas with spaced repetition and priority ranking.", icon: BookOpen },
            { title: "Full Test Bank Access", desc: "Thousands of NCLEX-RN, NCLEX-PN, and NP exam questions with detailed rationales, clinical pearls, and exam strategies.", icon: Brain },
          ].map((item, i) => (
            <div key={i} className="relative" data-testid={`locked-preview-${i}`}>
              <Card className="border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: "16px" }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${LAVENDER}15` }}>
                      <item.icon className="w-5 h-5" style={{ color: LAVENDER }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div className="space-y-2 blur-[3px] select-none pointer-events-none" aria-hidden="true">
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                        <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Card className="border-amber-200 shadow-md mb-10" style={{ borderRadius: "20px", backgroundColor: "#fffbf0" }}>
          <CardContent className="p-6 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-base font-semibold text-gray-800" data-testid="text-marketing-message">
              Students who score below 65% have a high risk of failing the NCLEX. Start studying now.
            </p>
            <p className="text-sm text-gray-500">
              NurseNest students improve their scores by an average of 23% within the first two weeks of focused study.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden" style={{ borderRadius: "24px", background: `linear-gradient(135deg, ${LAVENDER}08, ${LAVENDER}15)` }}>
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-cta-heading">
                Unlock the full platform
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Start studying today with adaptive exams, AI study plans, and thousands of practice questions.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { tier: "RN", label: "NCLEX-RN", price: "$19.99/mo", href: "/pricing" },
                { tier: "RPN", label: "REx-PN / NCLEX-PN", price: "$19.99/mo", href: "/pricing" },
                { tier: "NP", label: "NP Certification", price: "$19.99/mo", href: "/pricing" },
              ].map((plan) => (
                <button
                  key={plan.tier}
                  onClick={() => {
                    trackUpgradeClick(plan.tier.toLowerCase());
                    navigate(plan.href);
                  }}
                  className="p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md transition-all text-left group"
                  data-testid={`button-upgrade-${plan.tier.toLowerCase()}`}
                >
                  <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700">{plan.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.price}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: LAVENDER }}>
                    Get Started <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => {
                trackUpgradeClick("all");
                navigate("/pricing");
              }}
              size="lg"
              className="rounded-full px-10 py-5 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: LAVENDER }}
              data-testid="button-unlock-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Unlock Full Platform — Start Studying Today
            </Button>

            <p className="text-xs text-gray-400">{t("pages.freeDemoExam.cancelAnytimeMiddot7dayMoneyback")}</p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            data-testid="button-retake-demo"
          >
            Retake Demo Exam
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            nursenest.ca &middot; Adaptive NCLEX exam preparation
          </p>
        </div>
      </div>
    </div>
  );
}
