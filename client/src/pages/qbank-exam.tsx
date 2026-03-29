import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ExamSessionGuard } from "@/components/exam-session-guard";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ProtectedContent } from "@/components/protected-content";
import { useLocation } from "wouter";
import { createCheckpointManager, clearCheckpointServer } from "@/lib/session-checkpoint";
import { getPracticalNurseExamName, type Region } from "@shared/constants";
import { trackEvent } from "@/lib/analytics";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  BarChart3,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import {
  AnswerOption,
  PremiumBadge,
} from "@/components/premium-study";

function getAuthHeaders(): Record<string, string> {

  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      return { "x-username": username, "x-password": password };
    }
  } catch {}
  return {};
}

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  rationale: string;
  category: string;
  difficulty: string;
  examType: string;
  country: string;
  topic: string;
};

type UserAnswer = {
  questionId: string;
  selected: string | null;
  correct: boolean;
  flagged: boolean;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QBankExamPage() {
  const { user } = useAuth();
  const { language } = useI18n();
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<"setup" | "exam" | "results">("setup");
  const [translationMap, setTranslationMap] = useState<Record<string, Record<string, string>>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Map<string, { key: string; text: string }[]>>(new Map());
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingCheckpoint, setPendingCheckpoint] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(25);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterExam, setFilterExam] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("exam") || "";
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkpointRef = useRef<ReturnType<typeof createCheckpointManager> | null>(null);
  const qbankStateRef = useRef({ answers, currentIdx, timer });
  qbankStateRef.current = { answers, currentIdx, timer };

  const qbankSessionId = useMemo(() => {
    if (questions.length === 0) return "";
    return `qbank-${questions.map(q => q.id).sort().slice(0, 3).join("-")}`;
  }, [questions]);

  /** Domestic PN bank is server-scoped to profile region; exam picker misled users into thinking they could switch RN/PN pools. */
  const domesticLearnerNonAdmin =
    user?.tier !== "admin" && (user?.region === "US" || user?.region === "CA");

  useEffect(() => {
    if (domesticLearnerNonAdmin) setFilterExam("");
  }, [domesticLearnerNonAdmin]);

  useEffect(() => {
    if (phase !== "setup" || !user?.id) return;
    const headers: Record<string, string> = {};
    try {
      const creds = localStorage.getItem("nursenest-credentials");
      if (creds) {
        const { username, password } = JSON.parse(creds);
        headers["x-username"] = username;
        headers["x-password"] = password;
      }
    } catch {}
    fetch(`/api/session-checkpoint/restore?sessionType=qbank-exam`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.found) return;
        const cp = data.checkpoint;
        const inner = cp.checkpointData?.checkpointData || cp.checkpointData || {};
        if (inner.answers && Object.keys(inner.answers).length > 0) {
          setPendingCheckpoint({ ...inner, sessionId: cp.sessionId });
        }
      })
      .catch(() => {});
  }, [phase, user?.id]);

  useEffect(() => {
    if (phase !== "exam" || !qbankSessionId) return;
    const mgr = createCheckpointManager("qbank-exam", qbankSessionId);
    checkpointRef.current = mgr;
    mgr.startAutoSave(() => {
      const { answers: a, currentIdx: idx, timer: t } = qbankStateRef.current;
      const answersObj: Record<string, any> = {};
      a.forEach((v, k) => { answersObj[k] = v; });
      return { currentIndex: idx, answers: answersObj, timeSpent: t };
    });
    return () => { mgr.stopAutoSave(); };
  }, [phase, questions.length]);

  const startExam = async () => {
    setLoading(true);
    setError("");
    if (pendingCheckpoint?.sessionId) {
      clearCheckpointServer("qbank-exam", pendingCheckpoint.sessionId).catch(() => {});
    }
    setPendingCheckpoint(null);
    try {
      const params = new URLSearchParams({ count: String(questionCount) });
      if (filterCategory) params.set("category", filterCategory);
      if (filterDifficulty) params.set("difficulty", filterDifficulty);
      if (filterExam) params.set("exam", filterExam);
      const resp = await fetch(`/api/question-bank/exam?${params}`, {
        headers: getAuthHeaders(),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to load questions");
      }
      const data = await resp.json();
      if (data.length === 0) throw new Error("No questions available for your region. Please contact admin.");
      const shuffled = shuffleArray(data);
      setQuestions(shuffled);
      const optionsMap = new Map<string, { key: string; text: string }[]>();
      for (const q of shuffled) {
        const opts = shuffleArray([
          { key: "A", text: q.optionA },
          { key: "B", text: q.optionB },
          { key: "C", text: q.optionC },
          { key: "D", text: q.optionD },
        ]);
        optionsMap.set(q.id, opts);
      }
      setShuffledOptions(optionsMap);
      const ansMap = new Map<string, UserAnswer>();
      shuffled.forEach((q) => ansMap.set(q.id, { questionId: q.id, selected: null, correct: false, flagged: false }));
      setAnswers(ansMap);
      setCurrentIdx(0);
      setTimer(0);
      setPhase("exam");
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (e: any) {
      console.error("[QBankExam] startExam failed:", { message: e.message, category: filterCategory, difficulty: filterDifficulty, count: questionCount });
      const msg = e.message || "Failed to load questions";
      if (msg.includes("No questions") || msg.includes("question bank")) {
        setError("No questions available for your selected filters. Try a different category or difficulty.");
      } else if (msg.includes("Upgrade required") || msg.includes("403") || msg.includes("subscription")) {
        setError("This feature requires a paid subscription. Please upgrade your plan.");
      } else if (msg.includes("Authentication") || msg.includes("401") || msg.includes("log in")) {
        setError("Please log in to start an exam.");
      } else if (msg.includes("Unable to create") || msg.includes("database") || msg.includes("SCHEMA_DRIFT")) {
        setError("Unable to start exam session — please retry in a moment. If the issue persists, contact support.");
      } else {
        setError(msg);
      }
    }
    setLoading(false);
  };

  const questionIdSignature = useMemo(() => questions.map(q => q.id).join(","), [questions]);

  useEffect(() => {
    if (language === "en" || questions.length === 0) {
      setTranslationMap({});
      return;
    }
    const questionIds = questions.map(q => q.id);
    fetch("/api/exam-questions/translated-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ questionIds, lang: language }),
    })
      .then(r => {
        if (!r.ok) throw new Error("Translation fetch failed");
        return r.json();
      })
      .then(data => {
        if (data.translations) setTranslationMap(data.translations);
      })
      .catch(() => { setTranslationMap({}); });
  }, [language, questionIdSignature]);

  const getTranslatedQ = useCallback((q: Question): Question => {
    if (language === "en" || !translationMap[q.id]) return q;
    const t = translationMap[q.id];
    const translated = { ...q };
    if (t.stem) translated.question = t.stem;
    if (t.rationale) translated.rationale = t.rationale;
    if (t.options) {
      try {
        const parsedOptions = JSON.parse(t.options);
        if (Array.isArray(parsedOptions)) {
          const optTexts = parsedOptions.map((o: any) =>
            typeof o === "object" ? (o.text || String(o)) : String(o)
          );
          if (optTexts.length >= 4) {
            translated.optionA = optTexts[0];
            translated.optionB = optTexts[1];
            translated.optionC = optTexts[2];
            translated.optionD = optTexts[3];
          }
        }
      } catch {}
    }
    if (t.clinicalPearl) (translated as any).clinicalPearl = t.clinicalPearl;
    if (t.examStrategy) (translated as any).examStrategy = t.examStrategy;
    if (t.memoryHook) (translated as any).memoryHook = t.memoryHook;
    if (t.scenario) (translated as any).scenario = t.scenario;
    if (t.correctAnswerExplanation) (translated as any).correctAnswerExplanation = t.correctAnswerExplanation;
    if (t.clinicalReasoning) (translated as any).clinicalReasoning = t.clinicalReasoning;
    if (t.keyTakeaway) (translated as any).keyTakeaway = t.keyTakeaway;
    if (t.mnemonic) (translated as any).mnemonic = t.mnemonic;
    if (t.distractorRationales) {
      try {
        (translated as any).distractorRationales = JSON.parse(t.distractorRationales);
      } catch {}
    }
    if (t.incorrectAnswerRationale) {
      try {
        (translated as any).incorrectAnswerRationale = JSON.parse(t.incorrectAnswerRationale);
      } catch {}
    }
    return translated;
  }, [language, translationMap]);

  const selectAnswer = (questionId: string, key: string) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      const existing = next.get(questionId)!;
      next.set(questionId, { ...existing, selected: key, correct: key === questions.find((q) => q.id === questionId)?.correctAnswer });
      return next;
    });
  };

  const toggleFlag = (questionId: string) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      const existing = next.get(questionId)!;
      next.set(questionId, { ...existing, flagged: !existing.flagged });
      return next;
    });
  };

  const submitExam = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    checkpointRef.current?.clear().catch(() => {});
    const answersArr = Array.from(answers.values());
    const correctCount = answersArr.filter((a) => a.correct).length;
    const categoryBreakdown: Record<string, { total: number; correct: number }> = {};
    const difficultyBreakdown: Record<string, { total: number; correct: number }> = {};
    for (const q of questions) {
      const ans = answers.get(q.id);
      if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = { total: 0, correct: 0 };
      categoryBreakdown[q.category].total++;
      if (ans?.correct) categoryBreakdown[q.category].correct++;
      if (!difficultyBreakdown[q.difficulty]) difficultyBreakdown[q.difficulty] = { total: 0, correct: 0 };
      difficultyBreakdown[q.difficulty].total++;
      if (ans?.correct) difficultyBreakdown[q.difficulty].correct++;
    }
    try {
      const res = await fetch("/api/question-bank/results", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          mode: "exam",
          examType: questions[0]?.examType || "",
          country: questions[0]?.country || "",
          totalQuestions: questions.length,
          correctCount,
          timeSpent: timer,
          answers: answersArr.map((a) => ({ questionId: a.questionId, selected: a.selected, correct: a.correct })),
          categoryBreakdown,
          difficultyBreakdown,
        }),
      });
      if (res.ok) {
        trackEvent("questions_completed", { totalQuestions: questions.length, correctCount });
      }
    } catch {}
    setPhase("results");
  }, [answers, questions, timer, user]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t("pages.qbankExam.loginRequired")}</h2>
          <p className="text-gray-500 mb-4">{t("pages.qbankExam.pleaseLogInToAccess")}</p>
          <Button onClick={() => setLocation("/login")} className="rounded-xl" data-testid="button-go-login">{t("pages.qbankExam.goToLogin")}</Button>
        </div>
      </div>
    );
  }

  const rawCurrentQ = questions[currentIdx];
  const currentQ = rawCurrentQ ? getTranslatedQ(rawCurrentQ) : undefined;
  const currentAnswer = currentQ ? answers.get(currentQ.id) : undefined;
  const answeredCount = Array.from(answers.values()).filter((a) => a.selected !== null).length;
  const correctCount = Array.from(answers.values()).filter((a) => a.correct).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-warmwhite">
      <ExamSessionGuard isActive={phase === "exam"} mode="standard" onSubmitAndExit={submitExam} />
      <Navigation />
      <div className="mx-auto px-4 py-8 max-w-[820px]">
        {phase === "setup" && (
          <Card className="premium-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5" data-testid="text-exam-setup-title">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                Exam Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-gray-500 text-sm leading-relaxed">
                Simulate a timed exam with randomized questions and shuffled answer choices. Your region determines which exam bank you see
                ({getPracticalNurseExamName((user.region as Region) || "US")}).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("pages.qbankExam.numberOfQuestions")}</label>
                  <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-sm" data-testid="select-question-count">
                    <option value={10}>{t("pages.qbankExam.10Questions")}</option>
                    <option value={25}>{t("pages.qbankExam.25Questions")}</option>
                    <option value={50}>{t("pages.qbankExam.50Questions")}</option>
                    <option value={75}>{t("pages.qbankExam.75Questions")}</option>
                    <option value={100}>{t("pages.qbankExam.100Questions")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("pages.qbankExam.examCountry")}</label>
                  {domesticLearnerNonAdmin ? (
                    <p
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-sm text-gray-700"
                      data-testid="text-exam-bank-region-locked"
                    >
                      {user?.region === "CA"
                        ? `${t("pages.qbankExam.rexpnCanada")} (${t("pages.qbankExam.northAmerica")})`
                        : `${t("pages.qbankExam.nclexpnUs")} (${t("pages.qbankExam.northAmerica")})`}
                    </p>
                  ) : (
                    <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-sm" data-testid="select-exam-type">
                      <option value="">{t("pages.qbankExam.allExamsDefaultRegion")}</option>
                      <optgroup label={t("pages.qbankExam.northAmerica")}>
                        <option value="NCLEX-RN">{t("pages.qbankExam.nclexrnUscanada")}</option>
                        <option value="REx-PN">{t("pages.qbankExam.rexpnCanada")}</option>
                        <option value="NCLEX-PN">{t("pages.qbankExam.nclexpnUs")}</option>
                      </optgroup>
                      <optgroup label={t("pages.qbankExam.international")}>
                        <option value="NMC-CBT">{t("pages.qbankExam.nmcCbtUnitedKingdom")}</option>
                        <option value="AHPRA-RN">{t("pages.qbankExam.ahpraRnAustralia")}</option>
                        <option value="GULF-NURSING">{t("pages.qbankExam.gulfNursingDhahaadmoh")}</option>
                      </optgroup>
                    </select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("pages.qbankExam.categoryOptional")}</label>
                  <Input value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} placeholder="e.g. Pharmacology" className="rounded-xl border-gray-200" data-testid="input-exam-category" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">{t("pages.qbankExam.difficultyOptional")}</label>
                  <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-sm" data-testid="select-exam-difficulty">
                    <option value="">{t("pages.qbankExam.all")}</option>
                    <option value="easy">{t("pages.qbankExam.easy")}</option>
                    <option value="moderate">{t("pages.qbankExam.moderate")}</option>
                    <option value="hard">{t("pages.qbankExam.hard")}</option>
                    <option value="very_hard">{t("pages.qbankExam.veryHard")}</option>
                  </select>
                </div>
              </div>
              {pendingCheckpoint && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2" data-testid="checkpoint-resume-prompt">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Previous Session Detected</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You had an in-progress exam with {Object.keys(pendingCheckpoint.answers || {}).length} questions answered
                    ({formatTime(pendingCheckpoint.timeSpent || 0)} elapsed). Starting a new exam will replace this session.
                  </p>
                  <Button size="sm" variant="ghost" className="rounded-xl text-xs text-amber-700" onClick={() => setPendingCheckpoint(null)} data-testid="button-dismiss-checkpoint">
                    Dismiss
                  </Button>
                </div>
              )}
              {error && <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 rounded-xl p-3" data-testid="text-exam-error"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
              <Button onClick={startExam} disabled={loading} className="w-full rounded-xl py-5 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm shadow-primary/20" data-testid="button-start-exam">
                {loading ? "Loading..." : "Start Exam"}
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "exam" && currentQ && (
          <div className="max-w-[820px] mx-auto">
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 px-4 py-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700" data-testid="text-question-progress">
                    {currentIdx + 1} / {questions.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg" data-testid="text-timer">
                    <Clock className="h-3.5 w-3.5" />{formatTime(timer)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{answeredCount} answered</span>
                  <Button size="sm" variant={currentAnswer?.flagged ? "destructive" : "outline"} onClick={() => toggleFlag(currentQ.id)} className="rounded-xl text-xs h-8" data-testid="button-flag">
                    <Flag className="h-3 w-3 mr-1" />{currentAnswer?.flagged ? "Flagged" : "Flag"}
                  </Button>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <Card className="premium-card border-0 shadow-md rounded-2xl mb-5 animate-fade-in-up overflow-hidden">
              <CardContent className="px-6 sm:px-8 py-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <PremiumBadge variant="system">{currentQ.category}</PremiumBadge>
                  <PremiumBadge variant="difficulty">{currentQ.difficulty}</PremiumBadge>
                </div>
                <p className="text-xl font-semibold mb-6 text-gray-900 leading-[1.6]" data-testid="text-current-question">{currentQ.question}</p>
                <div className="space-y-2.5">
                  {(shuffledOptions.get(currentQ.id) || []).map((opt, idx) => {
                    const optTextMap: Record<string, string> = { A: currentQ.optionA, B: currentQ.optionB, C: currentQ.optionC, D: currentQ.optionD };
                    const displayText = optTextMap[opt.key] || opt.text;
                    return (
                      <AnswerOption
                        key={opt.key}
                        index={idx}
                        text={displayText}
                        isSelected={currentAnswer?.selected === opt.key}
                        onClick={() => selectAnswer(currentQ.id, opt.key)}
                        data-testid={`button-option-${opt.key}`}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))} disabled={currentIdx === 0} className="rounded-xl border-slate-200" data-testid="button-prev">
                <ArrowLeft className="h-4 w-4 mr-1" />Previous
              </Button>
              {currentIdx === questions.length - 1 ? (
                <Button onClick={submitExam} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2" data-testid="button-submit-exam">
                  <CheckCircle2 className="h-4 w-4" />Submit Exam
                </Button>
              ) : (
                <Button onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm" data-testid="button-next">
                  Next<ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {questions.map((q, i) => {
                const a = answers.get(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-8 h-8 text-xs rounded-lg font-medium border transition-all duration-150 ${
                      i === currentIdx ? "ring-2 ring-primary ring-offset-1" : ""
                    } ${a?.selected ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "bg-white border-slate-200 text-slate-500"} ${
                      a?.flagged ? "border-red-400" : ""
                    }`}
                    data-testid={`button-nav-${i}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "results" && (
          <div className="max-w-[820px] mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900" data-testid="text-results-title">{t("pages.qbankExam.examResults")}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className={`text-3xl font-black ${scorePercent >= 70 ? "text-emerald-600" : "text-red-500"}`} data-testid="text-score">{scorePercent}%</div>
                    <div className="text-xs text-slate-500 mt-1">{t("pages.qbankExam.score")}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-black text-primary" data-testid="text-correct-count">{correctCount}/{questions.length}</div>
                    <div className="text-xs text-slate-500 mt-1">{t("pages.qbankExam.correct")}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-black text-slate-600" data-testid="text-time-spent">{formatTime(timer)}</div>
                    <div className="text-xs text-slate-500 mt-1">{t("pages.qbankExam.time")}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className={`text-3xl font-black ${scorePercent >= 70 ? "text-emerald-600" : "text-red-500"}`} data-testid="text-pass-fail">
                      {scorePercent >= 70 ? "PASS" : "FAIL"}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{t("pages.qbankExam.status")}</div>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => { setPhase("setup"); setQuestions([]); setAnswers(new Map()); }} className="rounded-xl gap-2 bg-primary hover:bg-primary/90 shadow-sm" data-testid="button-new-exam">
                    <RotateCcw className="h-4 w-4" />New Exam
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => {
                const tq = getTranslatedQ(q);
                const a = answers.get(q.id);
                return (
                  <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden" data-testid={`card-result-${i}`}>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${a?.correct ? "bg-emerald-500" : "bg-red-400"}`}>
                          {a?.correct ? <CheckCircle2 className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
                        </div>
                        <p className="font-semibold text-sm text-slate-900 leading-relaxed">{tq.question}</p>
                      </div>

                      <div className="space-y-1.5 mb-4 ml-10">
                        {[
                          { key: "A", text: tq.optionA },
                          { key: "B", text: tq.optionB },
                          { key: "C", text: tq.optionC },
                          { key: "D", text: tq.optionD },
                        ].map((opt) => {
                          const isCorrect = opt.key === q.correctAnswer;
                          const isWrongPick = opt.key === a?.selected && !a?.correct;
                          return (
                            <div
                              key={opt.key}
                              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                                isCorrect ? "bg-emerald-50 text-emerald-800 font-semibold" : isWrongPick ? "bg-red-50 text-red-600 line-through" : "text-slate-600"
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold shrink-0 ${
                                isCorrect ? "border-emerald-400 bg-emerald-500 text-white" : isWrongPick ? "border-red-300 bg-red-400 text-white" : "border-slate-200 text-slate-400"
                              }`}>{opt.key}</span>
                              {opt.text}
                            </div>
                          );
                        })}
                      </div>

                      <ProtectedContent className="ml-10 bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t("pages.qbankExam.rationale")}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{tq.rationale}</p>
                      </ProtectedContent>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
