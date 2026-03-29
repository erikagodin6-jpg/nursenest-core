import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnswerOption } from "@/components/premium-study";
import { cn } from "@/lib/utils";
import { canAccessFeature } from "@/lib/entitlements";
import { canonicalDisplayName } from "@/lib/canonical-display";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, Brain, Zap, Target, BarChart3, Clock,
  ChevronRight, CheckCircle2, XCircle,
  Lightbulb, Trophy, Flag,
  Sparkles, Layers, RefreshCw, TrendingUp, AlertTriangle,
  Timer, ArrowLeft, Play, Flame,
  ThumbsUp, ThumbsDown, HelpCircle, Star,
  Filter, X, Crown, Lock, Settings2, Eye
} from "lucide-react";

type Confidence = "confident" | "unsure" | "guess";
type SessionType = "recommended" | "weakAreas" | "dueForReview" | "flagged" | "rapidReview" | "mixedAdaptive" | "preExamBoost";

interface AdaptiveCard {
  id: string;
  front: string;
  back: string;
  category: string;
  tier: string;
  difficulty: number;
  questionType: string;
  options: any[];
  correctAnswer: any;
  rationaleCorrect: string;
  distractorRationales: any;
  clinicalTakeaway: string;
  examPearl: string;
  rationaleMedia: any[];
  lessonLinks: any[];
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  blueprintCategory: string;
  masteryState?: string;
  flagged?: boolean;
}

interface MasteryProfile {
  topic: string;
  subtopic: string | null;
  blueprintCategory: string | null;
  totalAttempts: number;
  correctCount: number;
  avgConfidence: number;
  masteryLevel: number;
  lastReviewedAt: string | null;
  nextDueAt: string | null;
}

interface DashboardData {
  totalCardsStudied: number;
  totalCorrect: number;
  overallAccuracy: number;
  masteryByTopic: MasteryProfile[];
  weakAreas: MasteryProfile[];
  cardsDueForReview: number;
  recentAccuracy: number;
  confidenceTrend: { date: string; avgConfidence: number }[];
  studyTimeTotal: number;
  flaggedCount: number;
  masteredCount: number;
  streakDays: number;
  bestTopic?: string | null;
  weakestTopic?: string | null;
  recommendedSessionType?: string;
  lessonRemediation?: { topic: string; missCount: number; lessonLinks: any[] }[];
  masteryDistribution?: { state: string; count: number }[];
}

const SESSION_TYPES: { id: SessionType; label: string; desc: string; icon: any; color: string; slug: string; analyticsMode: string }[] = [
  { id: "recommended", label: "Recommended", desc: "Mix of weak, due, and high-yield content", icon: Sparkles, color: "bg-rose-50 text-rose-700 border-rose-200", slug: "recommended", analyticsMode: "recommended" },
  { id: "weakAreas", label: "Weak Areas Only", desc: "Focus on your weakest topics", icon: Target, color: "bg-red-50 text-red-700 border-red-200", slug: "weak-areas", analyticsMode: "weak" },
  { id: "dueForReview", label: "Due for Review", desc: "Spaced repetition scheduled cards", icon: Clock, color: "bg-violet-50 text-violet-700 border-violet-200", slug: "due-review", analyticsMode: "due" },
  { id: "flagged", label: "Flagged Cards", desc: "Cards you've flagged for later", icon: Flag, color: "bg-amber-50 text-amber-700 border-amber-200", slug: "flagged", analyticsMode: "flagged" },
  { id: "rapidReview", label: "Rapid Review", desc: "Quick-fire across all topics", icon: Zap, color: "bg-cyan-50 text-cyan-700 border-cyan-200", slug: "rapid", analyticsMode: "rapid" },
  { id: "mixedAdaptive", label: "Mixed Adaptive", desc: "Balanced mix adjusted to your performance", icon: Brain, color: "bg-blue-50 text-blue-700 border-blue-200", slug: "mixed", analyticsMode: "mixed" },
  { id: "preExamBoost", label: "Pre-Exam Boost", desc: "High-yield focus for exam prep", icon: Flame, color: "bg-orange-50 text-orange-700 border-orange-200", slug: "pre-exam", analyticsMode: "boost" },
];

function trackStudyModeSelected(mode: string) {
  const { t } = useI18n();
  try {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "study_mode_selected", { mode });
    }
  } catch {}
}

const PRESETS = [
  { label: "High-Yield NCLEX Review", filters: { difficulty: 4 }, mode: "preExamBoost" as SessionType },
  { label: "RPN Safety & Prioritization", filters: { topic: "Delegation" }, mode: "recommended" as SessionType },
  { label: "Pharmacology Rapid Review", filters: { topic: "Pharmacology" }, mode: "rapidReview" as SessionType },
  { label: "My Weak Areas", filters: {}, mode: "weakAreas" as SessionType },
];

const MASTERY_STATE_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-gray-100 text-gray-600" },
  learning: { label: "Learning", color: "bg-blue-100 text-blue-700" },
  improving: { label: "Improving", color: "bg-amber-100 text-amber-700" },
  nearlyMastered: { label: "Nearly Mastered", color: "bg-violet-100 text-violet-700" },
  mastered: { label: "Mastered", color: "bg-emerald-100 text-emerald-700" },
};

function ConfidenceSelector({ onSelect, selected }: { onSelect: (c: Confidence) => void; selected?: Confidence }) {
  const options: { value: Confidence; label: string; sublabel: string; icon: any; color: string }[] = [
    { value: "confident", label: "Confident", sublabel: "I knew this well", icon: ThumbsUp, color: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100" },
    { value: "unsure", label: "Somewhat unsure", sublabel: "Partial recall", icon: HelpCircle, color: "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100" },
    { value: "guess", label: "Guess", sublabel: "I wasn't sure at all", icon: ThumbsDown, color: "bg-red-50 text-red-700 border-red-300 hover:bg-red-100" },
  ];
  return (
    <div className="space-y-2" data-testid="confidence-selector">
      <p className="text-xs font-semibold text-gray-600 text-center">{t("components.adaptiveStudy.howSureWereYou")}</p>
      <div className="flex items-center gap-2 justify-center">
        {options.map(opt => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all min-w-[80px]",
                selected === opt.value ? opt.color + " ring-2 ring-offset-1 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
              data-testid={`button-confidence-${opt.value}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PostAnswerControls({ card, userId, onStudyAgain, isPremium }: {
  card: AdaptiveCard; userId: string; onStudyAgain: () => void; isPremium: boolean;
}) {
  const [flaggedState, setFlaggedState] = useState(card.flagged || false);
  const [masteredState, setMasteredState] = useState(card.masteryState === "mastered");

  const handleFlag = async () => {
    const newState = !flaggedState;
    setFlaggedState(newState);
    if (isPremium) {
      try { await fetch("/api/adaptive/flag-card", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: card.id, flagged: newState }) }); } catch {}
    }
  };

  const handleMarkMastered = async () => {
    const newState = !masteredState;
    setMasteredState(newState);
    if (isPremium) {
      try { await fetch("/api/adaptive/mark-mastered", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: card.id, mastered: newState }) }); } catch {}
    }
  };

  const handleStudyAgainSoon = async () => {
    if (isPremium) {
      try { await fetch("/api/adaptive/study-again-soon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: card.id }) }); } catch {}
    }
    onStudyAgain();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3" data-testid="post-answer-controls">
      <button onClick={handleFlag} className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all", flaggedState ? "bg-rose-50 text-rose-600 border-rose-200" : "text-gray-400 border-gray-200 hover:bg-gray-50")} data-testid="button-flag-card">
        <Flag className="w-3.5 h-3.5" /> {flaggedState ? "Flagged" : "Flag"}
      </button>
      <button onClick={handleMarkMastered} className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all", masteredState ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "text-gray-400 border-gray-200 hover:bg-gray-50")} data-testid="button-mark-mastered">
        <Trophy className="w-3.5 h-3.5" /> {masteredState ? "Mastered" : "Mark Mastered"}
      </button>
      <button onClick={handleStudyAgainSoon} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-gray-400 border-gray-200 hover:bg-gray-50 transition-all" data-testid="button-study-again">
        <RefreshCw className="w-3.5 h-3.5" /> Study Again Soon
      </button>
      {card.lessonLinks && card.lessonLinks.length > 0 && (
        <a href={card.lessonLinks[0]?.lessonUrl || "#"} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-blue-500 border-blue-200 hover:bg-blue-50 transition-all" data-testid="button-review-lesson">
          <BookOpen className="w-3.5 h-3.5" /> Review Lesson
        </a>
      )}
    </div>
  );
}

function MasteryBar({ level, size = "md" }: { level: number; size?: "sm" | "md" }) {
  const pct = Math.round(level * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2")}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function PremiumGate({ children, isPremium, feature }: { children: React.ReactNode; isPremium: boolean; feature: string }) {
  if (isPremium) return <>{children}</>;
  return (
    <div className="relative" data-testid="premium-gate">
      <div className="blur-[2px] pointer-events-none opacity-60">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
        <Lock className="w-8 h-8 text-rose-400 mb-2" />
        <p className="text-sm font-semibold text-gray-700 mb-1">{t("components.adaptiveStudy.premiumFeature")}</p>
        <p className="text-xs text-gray-500 text-center max-w-[200px] mb-3">{feature}</p>
        <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600 transition" data-testid="button-upgrade-cta">
          <Crown className="w-3.5 h-3.5" /> Upgrade Now
        </a>
      </div>
    </div>
  );
}

export function AdaptiveStudyHub({ userId, userTier, onBack, initialMode }: { userId: string; userTier: string; onBack: () => void; initialMode?: string }) {
  const [, setLocation] = useLocation();
  const isPremium = canAccessFeature(userTier, "adaptive_engine");
  const [view, setView] = useState<"modes" | "study" | "report" | "dashboard" | "admin">("modes");
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>("recommended");
  const [loadingMode, setLoadingMode] = useState<SessionType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialModeProcessed, setInitialModeProcessed] = useState(false);
  const [cards, setCards] = useState<AdaptiveCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [confidence, setConfidence] = useState<Confidence | undefined>(undefined);
  const [sessionResults, setSessionResults] = useState<{ cardId: string; correct: boolean; confidence: Confidence; timeSpent: number }[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [cardStartTime, setCardStartTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [studyAgainMessage, setStudyAgainMessage] = useState(false);

  const [filters, setFilters] = useState<{
    topic?: string; bodySystem?: string; difficulty?: number;
    blueprintCategory?: string; questionType?: string; missedOnly?: boolean;
  }>({});

  const currentCard = cards[cardIndex];
  const isAdmin = userTier === "admin";

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await fetch(`/api/adaptive/dashboard/${userId}`);
      if (res.ok) setDashboard(await res.json());
    } catch {} finally { setDashboardLoading(false); }
  }, [userId]);

  const startStudySession = useCallback(async (sessionType: SessionType, customFilters?: typeof filters) => {
    if (!isPremium && sessionType !== "recommended" && sessionType !== "rapidReview") {
      return;
    }
    const stInfo = SESSION_TYPES.find(s => s.id === sessionType);
    if (stInfo) trackStudyModeSelected(stInfo.analyticsMode);
    setLoading(true);
    setLoadingMode(sessionType);
    setErrorMessage(null);
    try {
      let sid: string | null = null;
      if (isPremium) {
        try {
          const sRes = await fetch("/api/adaptive/session/start", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionType, tier: userTier }),
          });
          if (sRes.ok) { const d = await sRes.json(); sid = d.sessionId; }
        } catch {}
      }
      setSessionId(sid);

      const params = new URLSearchParams({ tier: userTier, mode: sessionType, limit: isPremium ? "20" : "5" });
      const f = customFilters || filters;
      if (f.topic) params.set("topic", f.topic);
      if (f.bodySystem) params.set("bodySystem", f.bodySystem);
      if (f.difficulty) params.set("difficulty", String(f.difficulty));
      if (f.blueprintCategory) params.set("blueprintCategory", f.blueprintCategory);
      if (f.questionType) params.set("questionType", f.questionType);
      if (f.missedOnly) params.set("missedOnly", "true");

      const res = await fetch(`/api/adaptive/next-cards/${userId}?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          setCards(data.cards);
          setCardIndex(0);
          setSelectedOption(null);
          setShowRationale(false);
          setConfidence(undefined);
          setSessionResults([]);
          setSessionStartTime(Date.now());
          setCardStartTime(Date.now());
          setSelectedSessionType(sessionType);
          setView("study");
        } else {
          setErrorMessage("No cards available for this study mode. Try different filters or study more topics first.");
        }
      } else {
        setErrorMessage("Could not load study cards. Please try again.");
      }
    } catch {
      setErrorMessage("Something went wrong loading your study session. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMode(null);
    }
  }, [userId, userTier, filters, isPremium]);

  useEffect(() => {
    if (initialMode && !initialModeProcessed && !loading) {
      setInitialModeProcessed(true);
      const validMode = SESSION_TYPES.find(s => s.id === initialMode);
      if (validMode) {
        const isLocked = !isPremium && validMode.id !== "recommended" && validMode.id !== "rapidReview";
        if (!isLocked) {
          startStudySession(validMode.id);
        }
      }
    }
  }, [initialMode, initialModeProcessed, loading, isPremium, startStudySession]);

  const recordResponse = useCallback(async (cardId: string, isCorrect: boolean, conf: Confidence, timeSpent: number) => {
    if (!isPremium) return;
    try {
      await fetch("/api/adaptive/record-response", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, isCorrect, confidence: conf, selectedOption, timeSpent, studyMode: selectedSessionType, sessionId }),
      });
    } catch {}
  }, [selectedOption, selectedSessionType, sessionId, isPremium]);

  const completeSession = useCallback(async (finalResults: typeof sessionResults) => {
    if (!isPremium || !sessionId) return;
    const correctCount = finalResults.filter(r => r.correct).length;
    const totalTime = Math.round((Date.now() - sessionStartTime) / 1000);
    const topics = [...new Set(cards.map(c => c.topic).filter(Boolean))];
    try {
      await fetch("/api/adaptive/session/complete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          accuracy: finalResults.length > 0 ? correctCount / finalResults.length : 0,
          topics, duration: totalTime,
          cardsReviewed: finalResults.length,
          weakCards: finalResults.filter(r => !r.correct).length,
          masteryChanges: [],
        }),
      });
    } catch {}
  }, [sessionId, sessionStartTime, cards, isPremium]);

  const handleOptionClick = (idx: number) => {
    if (showRationale) return;
    setSelectedOption(idx);
    const autoRevealTypes: SessionType[] = ["recommended", "weakAreas", "dueForReview", "flagged", "rapidReview"];
    if (autoRevealTypes.includes(selectedSessionType)) {
      setShowRationale(true);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setShowRationale(true);
  };

  const handleNext = async () => {
    if (!currentCard || !confidence) return;
    const isCorrect = selectedOption !== null && isCorrectAnswer(currentCard, selectedOption);
    const timeSpent = Math.round((Date.now() - cardStartTime) / 1000);
    const newResult = { cardId: currentCard.id, correct: isCorrect, confidence, timeSpent };
    const updatedResults = [...sessionResults, newResult];
    setSessionResults(updatedResults);
    await recordResponse(currentCard.id, isCorrect, confidence, timeSpent);
    if (cardIndex + 1 >= cards.length) {
      await completeSession(updatedResults);
      setView("report");
    } else {
      setCardIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowRationale(false);
      setConfidence(undefined);
      setCardStartTime(Date.now());
      setStudyAgainMessage(false);
    }
  };

  const handleRapidNext = async (isCorrect: boolean) => {
    if (!currentCard) return;
    const conf = confidence || "unsure";
    const timeSpent = Math.round((Date.now() - cardStartTime) / 1000);
    const newResult = { cardId: currentCard.id, correct: isCorrect, confidence: conf, timeSpent };
    const updatedResults = [...sessionResults, newResult];
    setSessionResults(updatedResults);
    await recordResponse(currentCard.id, isCorrect, conf, timeSpent);
    if (cardIndex + 1 >= cards.length) {
      await completeSession(updatedResults);
      setView("report");
    } else {
      setCardIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowRationale(false);
      setConfidence(undefined);
      setCardStartTime(Date.now());
      setStudyAgainMessage(false);
    }
  };

  const getCorrectIndex = (card: AdaptiveCard): number => {
    if (!card.correctAnswer && card.correctAnswer !== 0) return 0;
    return Array.isArray(card.correctAnswer) ? card.correctAnswer[0] : card.correctAnswer;
  };

  const isCorrectAnswer = (card: AdaptiveCard, selectedIdx: number): boolean => {
    if (!card.correctAnswer && card.correctAnswer !== 0) return selectedIdx === 0;
    if (Array.isArray(card.correctAnswer)) return card.correctAnswer.includes(selectedIdx);
    return selectedIdx === card.correctAnswer;
  };

  const getOptionText = (opt: any): string => {
    if (typeof opt === "string") return opt;
    return opt?.text || opt?.label || String(opt);
  };

  const getDistractorRationale = (card: AdaptiveCard, optIdx: number): string => {
    if (!card.distractorRationales) return "This option is not the best choice for this clinical scenario.";
    const dr = card.distractorRationales;
    if (Array.isArray(dr)) return dr[optIdx] || "Not the best choice.";
    const optText = getOptionText(card.options?.[optIdx]);
    return dr[optText] || dr[String(optIdx)] || "Not the best choice for this scenario.";
  };

  if (view === "dashboard") {
    return <DashboardView userId={userId} dashboard={dashboard} loading={dashboardLoading} onRefresh={fetchDashboard} onBack={() => { setView("modes"); setLocation("/study"); }} onStartSession={(s) => { const info = SESSION_TYPES.find(st => st.id === s); if (info) setLocation(`/study/${info.slug}`); startStudySession(s); }} isPremium={isPremium} />;
  }

  if (view === "admin" && isAdmin) {
    return <AdminAdaptiveControls onBack={() => { setView("modes"); setLocation("/study"); }} />;
  }

  if (view === "report") {
    const correctCount = sessionResults.filter(r => r.correct).length;
    const totalCount = sessionResults.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const totalTime = Math.round((Date.now() - sessionStartTime) / 1000);

    return (
      <div className="min-h-screen bg-warmwhite" data-testid="section-adaptive-report">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" data-testid="text-report-title">{t("components.adaptiveStudy.sessionComplete")}</h1>
            <p className="text-gray-500 text-sm">{SESSION_TYPES.find(m => m.id === selectedSessionType)?.label} Session</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Card className="border-0 shadow-md rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.accuracy")}</p>
              <p className="text-3xl font-black text-rose-500" data-testid="text-report-accuracy">{accuracy}%</p>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.correct")}</p>
              <p className="text-3xl font-black text-emerald-500" data-testid="text-report-correct">{correctCount}</p>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.total")}</p>
              <p className="text-3xl font-black text-gray-800" data-testid="text-report-total">{totalCount}</p>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.time")}</p>
              <p className="text-3xl font-black text-blue-500">{Math.floor(totalTime / 60)}m</p>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("components.adaptiveStudy.confidenceBreakdown")}</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["confident", "unsure", "guess"] as Confidence[]).map(c => {
                const count = sessionResults.filter(r => r.confidence === c).length;
                return (
                  <div key={c} className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="text-lg font-bold text-gray-800">{count}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium capitalize">{c}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {!isPremium && (
            <div className="bg-gradient-to-r from-rose-50 to-violet-50 rounded-2xl border border-rose-200 p-5 mb-6 text-center">
              <Crown className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700 mb-1">{t("components.adaptiveStudy.unlockFullAdaptiveEngine")}</p>
              <p className="text-xs text-gray-500 mb-3">{t("components.adaptiveStudy.saveMasteryProgressGetSpaced")}</p>
              <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600" data-testid="button-report-upgrade">
                <Crown className="w-3.5 h-3.5" /> Upgrade to Premium
              </a>
            </div>
          )}

          <div className="space-y-3">
            <Button className="w-full h-12 rounded-xl text-base font-bold bg-rose-500 hover:bg-rose-600 text-white" onClick={() => startStudySession(selectedSessionType)} data-testid="button-new-session">
              <Play className="w-4 h-4 mr-2" /> New Session
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl text-base font-bold" onClick={() => { setView("dashboard"); fetchDashboard(); }} data-testid="button-view-dashboard">
              <BarChart3 className="w-4 h-4 mr-2" /> View Dashboard
            </Button>
            <Button variant="ghost" className="w-full h-12 rounded-xl text-base" onClick={() => { setView("modes"); setLocation("/study"); }} data-testid="button-back-modes">
              Back to Study Modes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "study" && currentCard) {
    const correctIdx = getCorrectIndex(currentCard);
    const isCorrect = selectedOption !== null && isCorrectAnswer(currentCard, selectedOption);
    const progress = ((cardIndex + 1) / cards.length) * 100;
    const modeInfo = SESSION_TYPES.find(m => m.id === selectedSessionType);
    const isRapidMode = selectedSessionType === "rapidReview";
    const submitModeTypes: SessionType[] = ["mixedAdaptive", "preExamBoost"];
    const isTestMode = submitModeTypes.includes(selectedSessionType);
    const masteryInfo = currentCard.masteryState ? MASTERY_STATE_LABELS[currentCard.masteryState] : null;

    return (
      <div className="min-h-screen bg-warmwhite" data-testid="section-adaptive-study">
        <div className={cn("mx-auto px-4 py-4 sm:py-6", showRationale && !isRapidMode ? "max-w-[1200px]" : "max-w-[820px]")}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-[10px] font-semibold rounded-lg border px-2 py-0.5", modeInfo?.color)} data-testid="badge-study-mode">
                {modeInfo?.label}
              </Badge>
              {currentCard.category && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] font-medium rounded-lg px-2 py-0.5" data-testid="badge-topic">
                  {currentCard.category || currentCard.topic}
                </Badge>
              )}
              {currentCard.difficulty && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] font-medium rounded-lg px-2 py-0.5">
                  {["", "Easy", "Medium", "Hard", "Expert", "Master"][currentCard.difficulty] || `Lvl ${currentCard.difficulty}`}
                </Badge>
              )}
              {masteryInfo && (
                <Badge className={cn("text-[10px] font-medium rounded-lg px-2 py-0.5", masteryInfo.color)} data-testid="badge-mastery-state">
                  {masteryInfo.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{cardIndex + 1}</span>/<span>{cards.length}</span>
            </div>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full mb-5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {isRapidMode ? (
            <div className="space-y-4">
              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 leading-relaxed" data-testid="text-rapid-question">{currentCard.front}</h2>
                  {showRationale ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] font-semibold text-emerald-700 uppercase">{t("components.adaptiveStudy.answer")}</span>
                        </div>
                        <p className="text-sm text-gray-700">{currentCard.options ? getOptionText(currentCard.options[correctIdx]) : currentCard.back}</p>
                      </div>
                      {currentCard.rationaleCorrect && <p className="text-xs text-gray-500 leading-relaxed">{currentCard.rationaleCorrect}</p>}
                      <ConfidenceSelector selected={confidence} onSelect={setConfidence} />
                      <PostAnswerControls card={currentCard} userId={userId} onStudyAgain={() => setStudyAgainMessage(true)} isPremium={isPremium} />
                      {studyAgainMessage && <p className="text-xs text-emerald-600 font-medium text-center">{t("components.adaptiveStudy.thisCardWillAppearAgain")}</p>}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleRapidNext(false)} data-testid="button-rapid-incorrect">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Got it Wrong
                        </Button>
                        <Button size="sm" className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleRapidNext(true)} data-testid="button-rapid-correct">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Got it Right
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentCard.options?.map((opt: any, idx: number) => (
                        <button key={idx} onClick={() => handleOptionClick(idx)} className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-sm flex items-center gap-2" data-testid={`button-rapid-option-${idx}`}>
                          <span className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center text-[10px] font-semibold text-gray-500 shrink-0">{String.fromCharCode(65 + idx)}</span>
                          {getOptionText(opt)}
                        </button>
                      ))}
                      {!currentCard.options?.length && (
                        <Button onClick={() => setShowRationale(true)} className="w-full rounded-lg" data-testid="button-rapid-reveal">{t("components.adaptiveStudy.revealAnswer")}</Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : showRationale ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300" data-testid="section-review-layout">
              <div className="flex flex-col gap-3">
                <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 leading-relaxed" data-testid="text-question-stem">{currentCard.front}</h2>
                    <div className="space-y-2">
                      {currentCard.options?.map((opt: any, idx: number) => {
                        const optIsCorrect = isCorrectAnswer(currentCard, idx);
                        return (
                          <AnswerOption key={idx} index={idx} text={getOptionText(opt)} isSelected={selectedOption === idx} isCorrect={optIsCorrect} isWrong={selectedOption === idx && !optIsCorrect} isRevealed={true} disabled={true} onClick={() => {}}
                            iconEl={optIsCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : selectedOption === idx && !optIsCorrect ? <XCircle className="h-5 w-5 text-red-500 shrink-0" /> : undefined}
                            data-testid={`option-review-${idx}`} />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-3">
                <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                  <div className="px-5 pt-4 pb-2 flex items-center gap-2 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center"><BookOpen className="w-3 h-3 text-rose-500" /></div>
                    <h3 className="text-xs font-semibold text-rose-600 tracking-wide">{t("components.adaptiveStudy.rationaleReview")}</h3>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className={cn("rounded-lg border p-3", isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100")}>
                      <div className="flex items-center gap-2 mb-1">
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={cn("text-[10px] font-semibold uppercase", isCorrect ? "text-emerald-700" : "text-amber-700")}>{isCorrect ? "Correct!" : "Incorrect"}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{currentCard.options ? getOptionText(currentCard.options[correctIdx]) : ""}</p>
                    </div>
                    {currentCard.rationaleCorrect && (
                      <div className="bg-white rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center gap-2 mb-1"><Lightbulb className="w-3.5 h-3.5 text-amber-500" /><span className="text-[10px] font-semibold text-gray-500 uppercase">{t("components.adaptiveStudy.whyThisIsCorrect")}</span></div>
                        <p className="text-sm text-gray-600 leading-relaxed">{currentCard.rationaleCorrect}</p>
                      </div>
                    )}
                    {currentCard.options && currentCard.options.length > 1 && (
                      <div className="bg-white rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center gap-2 mb-2"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span className="text-[10px] font-semibold text-gray-500 uppercase">{t("components.adaptiveStudy.whyOtherOptionsAreIncorrect")}</span></div>
                        <div className="space-y-2">
                          {currentCard.options.map((opt: any, idx: number) => {
                            if (isCorrectAnswer(currentCard, idx)) return null;
                            return (
                              <div key={idx} className="flex gap-2 pl-1">
                                <span className="text-[10px] font-bold text-rose-300 bg-rose-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">{String.fromCharCode(65 + idx)}</span>
                                <div>
                                  <p className="text-xs font-medium text-gray-600">{getOptionText(opt)}</p>
                                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{getDistractorRationale(currentCard, idx)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {currentCard.clinicalTakeaway && (
                      <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-3">
                        <div className="flex items-center gap-2 mb-1"><BookOpen className="w-3 h-3 text-blue-600" /><span className="text-[10px] font-semibold text-blue-600 uppercase">{t("components.adaptiveStudy.clinicalTakeaway")}</span></div>
                        <p className="text-xs text-gray-600 leading-relaxed">{currentCard.clinicalTakeaway}</p>
                      </div>
                    )}
                    {currentCard.examPearl && (
                      <div className="bg-gradient-to-r from-amber-50/70 to-rose-50/50 rounded-lg border border-amber-100 p-3">
                        <div className="flex items-center gap-2 mb-1"><Sparkles className="w-3 h-3 text-amber-600" /><span className="text-[10px] font-semibold text-amber-700 uppercase">{t("components.adaptiveStudy.examPearl")}</span></div>
                        <p className="text-xs text-amber-700 leading-relaxed">{currentCard.examPearl}</p>
                      </div>
                    )}
                    {!isCorrect && currentCard.lessonLinks && currentCard.lessonLinks.length > 0 && (
                      <div className="bg-rose-50/50 rounded-lg border-2 border-rose-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-[10px] font-semibold text-rose-600 uppercase">{t("components.adaptiveStudy.reviewRecommended")}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{t("components.adaptiveStudy.considerReviewingTheRelatedLesson")}</p>
                        {currentCard.lessonLinks.map((link: any, i: number) => (
                          <a key={i} href={link.lessonUrl} className="flex items-center gap-2 text-xs text-rose-600 hover:text-rose-800 hover:underline font-medium" data-testid={`link-remediation-${i}`}>
                            <ChevronRight className="w-3 h-3" /> {canonicalDisplayName(link.lessonTitle || "Related Lesson")}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" data-testid="card-question">
              <CardContent className="p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-5 leading-relaxed" data-testid="text-question-stem">{currentCard.front}</h2>
                <div className="space-y-2">
                  {currentCard.options?.map((opt: any, idx: number) => (
                    <AnswerOption key={idx} index={idx} text={getOptionText(opt)} isSelected={selectedOption === idx} isRevealed={false} disabled={false} onClick={() => handleOptionClick(idx)} data-testid={`button-option-${idx}`} />
                  ))}
                </div>
                {isTestMode && selectedOption !== null && !showRationale && (
                  <Button className="w-full mt-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white h-11" onClick={handleSubmit} data-testid="button-submit-answer">{t("components.adaptiveStudy.submitAnswer")}</Button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="pt-3 space-y-3">
            {showRationale && (
              <>
                <ConfidenceSelector selected={confidence} onSelect={setConfidence} />
                <PostAnswerControls card={currentCard} userId={userId} onStudyAgain={() => setStudyAgainMessage(true)} isPremium={isPremium} />
                {studyAgainMessage && <p className="text-xs text-emerald-600 font-medium text-center">{t("components.adaptiveStudy.thisCardWillAppearAgain2")}</p>}
              </>
            )}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => { setView("modes"); setLocation("/study"); }} className="text-gray-400 hover:text-gray-600 text-xs" data-testid="button-exit-study">{t("components.adaptiveStudy.exitSession")}</Button>
              {showRationale && (
                <Button size="sm" disabled={!confidence} onClick={handleNext} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs h-8 px-4 shadow-sm disabled:opacity-50" data-testid="button-next-card">
                  {cardIndex < cards.length - 1 ? "Next" : "Finish"} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite" data-testid="section-adaptive-hub">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-600 -ml-2 mb-1" data-testid="button-back-flashcards">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-adaptive-title">
              <Brain className="w-6 h-6 text-rose-500" /> Adaptive Study Engine
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t("components.adaptiveStudy.personalizedStudyPoweredByYour")}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setView("admin")} className="rounded-lg text-xs gap-1.5" data-testid="button-admin-controls">
                <Settings2 className="w-3.5 h-3.5" /> Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => { setView("dashboard"); fetchDashboard(); }} className="rounded-lg text-xs gap-1.5" data-testid="button-open-dashboard">
              <BarChart3 className="w-3.5 h-3.5" /> Dashboard
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2" data-testid="text-error-message">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {errorMessage}
            <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {SESSION_TYPES.map(st => {
            const Icon = st.icon;
            const isLocked = !isPremium && st.id !== "recommended" && st.id !== "rapidReview";
            const isLoadingThis = loadingMode === st.id;
            return (
              <button
                key={st.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (isLocked) return;
                  setLocation(`/study/${st.slug}`);
                  startStudySession(st.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isLocked) {
                      setLocation(`/study/${st.slug}`);
                      startStudySession(st.id);
                    }
                  }
                }}
                disabled={loading || isLocked}
                className={cn(
                  "text-left p-4 rounded-2xl border-2 transition-all duration-200 group relative cursor-pointer",
                  isLocked
                    ? "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
                    : "bg-white border-gray-100 hover:border-rose-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                )}
                data-testid={`button-session-${st.id}`}
              >
                {isLocked && (
                  <div className="absolute top-2 right-2"><Lock className="w-4 h-4 text-gray-400" /></div>
                )}
                {isLoadingThis && (
                  <div className="absolute top-2 right-2">
                    <RefreshCw className="w-4 h-4 text-rose-400 animate-spin" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", st.color.split(" ")[0])}>
                    <Icon className={cn("w-5 h-5", st.color.split(" ")[1])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">{st.label}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{st.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400 transition-colors shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Quick Start Presets
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => { setFilters(preset.filters); startStudySession(preset.mode, preset.filters); }}
                className="rounded-lg text-xs font-medium" data-testid={`button-preset-${i}`}>
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Filter className="w-4 h-4 text-gray-400" /> {t("components.adaptiveStudy.advancedFilters")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">{t("components.adaptiveStudy.topic")}</label>
                <select value={filters.topic || ""} onChange={e => setFilters(f => ({ ...f, topic: e.target.value || undefined }))} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" data-testid="select-filter-topic">
                  <option value="">{t("components.adaptiveStudy.allTopics")}</option>
                  {["Cardiovascular", "Respiratory", "Neurological", "GI", "Renal", "Endocrine", "Hematology", "Pediatrics", "Maternal", "Neonatal", "Oncology", "Pharmacology", "Mental Health", "Infection Control", "Procedures", "Fundamentals", "Delegation", "Skin", "Musculoskeletal"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">{t("components.adaptiveStudy.difficulty")}</label>
                <select value={filters.difficulty || ""} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value ? parseInt(e.target.value) : undefined }))} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" data-testid="select-filter-difficulty">
                  <option value="">{t("components.adaptiveStudy.anyDifficulty")}</option>
                  <option value="1">{t("components.adaptiveStudy.easy")}</option><option value="2">{t("components.adaptiveStudy.medium")}</option><option value="3">{t("components.adaptiveStudy.hard")}</option><option value="4">{t("components.adaptiveStudy.expert")}</option><option value="5">{t("components.adaptiveStudy.master")}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">{t("components.adaptiveStudy.type")}</label>
                <select value={filters.questionType || ""} onChange={e => setFilters(f => ({ ...f, questionType: e.target.value || undefined }))} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" data-testid="select-filter-type">
                  <option value="">{t("components.adaptiveStudy.allTypes")}</option><option value="mcq">{t("components.adaptiveStudy.multipleChoice")}</option><option value="sata">{t("components.adaptiveStudy.selectAllThatApply")}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={!!filters.missedOnly} onChange={e => setFilters(f => ({ ...f, missedOnly: e.target.checked || undefined }))} className="rounded border-gray-300" data-testid="checkbox-missed-only" />
                Missed cards only
              </label>
              {Object.values(filters).some(v => v !== undefined) && (
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-6" onClick={() => setFilters({})}><X className="w-3 h-3 mr-1" /> {t("components.adaptiveStudy.clearFilters")}</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {!isPremium && (
          <div className="bg-gradient-to-r from-rose-50 to-violet-50 rounded-2xl border border-rose-200 p-6 text-center">
            <Crown className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">{t("components.adaptiveStudy.unlockTheFullAdaptiveEngine")}</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{t("components.adaptiveStudy.getUnlimitedCardsSavedMastery")}</p>
            <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition" data-testid="button-hub-upgrade">
              <Crown className="w-4 h-4" /> Upgrade to Premium
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardView({ userId, dashboard, loading, onRefresh, onBack, onStartSession, isPremium }: {
  userId: string; dashboard: DashboardData | null; loading: boolean; onRefresh: () => void; onBack: () => void; onStartSession: (s: SessionType) => void; isPremium: boolean;
}) {
  useEffect(() => { if (!dashboard) onRefresh(); }, []);

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen bg-warmwhite flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">{t("components.adaptiveStudy.loadingYourPerformanceData")}</p>
        </div>
      </div>
    );
  }

  const recommendedType = (dashboard.recommendedSessionType as SessionType) || "recommended";

  return (
    <div className="min-h-screen bg-warmwhite" data-testid="section-dashboard">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-600 -ml-2 mb-1" data-testid="button-dashboard-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-dashboard-title">
              <BarChart3 className="w-6 h-6 text-rose-500" /> Adaptive Analytics Dashboard
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="rounded-lg text-xs gap-1"><RefreshCw className="w-3.5 h-3.5" /> {t("components.adaptiveStudy.refresh")}</Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.overallMastery")}</p>
            <p className="text-2xl font-black text-rose-500" data-testid="stat-overall-mastery">{dashboard.overallAccuracy}%</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.dueForReview")}</p>
            <p className="text-2xl font-black text-amber-500" data-testid="stat-due-review">{dashboard.cardsDueForReview}</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.flagged")}</p>
            <p className="text-2xl font-black text-orange-500" data-testid="stat-flagged">{dashboard.flaggedCount}</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.mastered")}</p>
            <p className="text-2xl font-black text-emerald-500" data-testid="stat-mastered">{dashboard.masteredCount}</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.totalStudied")}</p>
            <p className="text-2xl font-black text-gray-800" data-testid="stat-total-studied">{dashboard.totalCardsStudied}</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.7dayAccuracy")}</p>
            <p className="text-2xl font-black text-blue-500" data-testid="stat-recent-accuracy">{dashboard.recentAccuracy}%</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.streak")}</p>
            <p className="text-2xl font-black text-violet-500" data-testid="stat-streak">{dashboard.streakDays} day{dashboard.streakDays !== 1 ? "s" : ""}</p>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.bestTopic")}</p>
            <p className="text-sm font-bold text-emerald-600 truncate" data-testid="stat-best-topic">{dashboard.bestTopic || "—"}</p>
          </Card>
        </div>

        {dashboard.weakestTopic && (
          <Card className="border-0 shadow-md rounded-2xl p-4 mb-6 bg-gradient-to-r from-rose-50 to-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">{t("components.adaptiveStudy.recommendedNextSession")}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {SESSION_TYPES.find(s => s.id === recommendedType)?.label || "Recommended"} — focus on <span className="text-rose-600">{dashboard.weakestTopic}</span>
                </p>
              </div>
              <Button size="sm" className="rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs gap-1" onClick={() => onStartSession(recommendedType)} data-testid="button-recommended-session">
                <Play className="w-3 h-3" /> Start
              </Button>
            </div>
          </Card>
        )}

        {dashboard.masteryDistribution && dashboard.masteryDistribution.length > 0 && (
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4 text-violet-500" /> {t("components.adaptiveStudy.masteryDistribution")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="flex gap-2">
                {["new", "learning", "improving", "nearlyMastered", "mastered"].map(state => {
                  const info = MASTERY_STATE_LABELS[state];
                  const count = dashboard.masteryDistribution?.find(d => d.state === state)?.count || 0;
                  return (
                    <div key={state} className={cn("flex-1 text-center p-2 rounded-lg", info.color)}>
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-[9px] font-medium uppercase">{info.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {dashboard.weakAreas.length > 0 && (
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Weak Areas
                <Button size="sm" variant="outline" className="ml-auto rounded-lg text-xs gap-1" onClick={() => onStartSession("weakAreas")} data-testid="button-study-weak">
                  <Play className="w-3 h-3" /> Study Weak Areas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                {dashboard.weakAreas.slice(0, 5).map((area, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate">{area.topic}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{area.correctCount}/{area.totalAttempts} correct</span>
                      </div>
                      <MasteryBar level={area.masteryLevel} size="sm" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-10 text-right">{Math.round(area.masteryLevel * 100)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {dashboard.lessonRemediation && dashboard.lessonRemediation.length > 0 && (
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6 border-l-4 border-l-rose-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-rose-500" /> {t("components.adaptiveStudy.lessonRemediationRecommended")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-xs text-gray-500 mb-3">{t("components.adaptiveStudy.youveMissed3QuestionsIn")}</p>
              <div className="space-y-2">
                {dashboard.lessonRemediation.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{item.topic}</p>
                      <p className="text-[10px] text-gray-500">{item.missCount} recent misses</p>
                    </div>
                    {item.lessonLinks && Array.isArray(item.lessonLinks) && item.lessonLinks.flat().filter(Boolean).length > 0 && (
                      <a href={(() => { const flat = item.lessonLinks.flat().filter(Boolean); const link = flat[0]; return typeof link === 'string' ? link : link?.lessonUrl || '#'; })()} className="text-xs text-rose-600 font-medium hover:underline" data-testid={`link-dashboard-remediation-${i}`}>
                        <BookOpen className="w-3 h-3 inline mr-1" /> Review Lesson
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {dashboard.masteryByTopic.length > 0 && (
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> {t("components.adaptiveStudy.masteryByTopic")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                {dashboard.masteryByTopic.map((profile, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate">{profile.topic}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{profile.correctCount}/{profile.totalAttempts}</span>
                      </div>
                      <MasteryBar level={profile.masteryLevel} />
                    </div>
                    <span className={cn("text-xs font-semibold w-10 text-right", profile.masteryLevel >= 0.8 ? "text-emerald-600" : profile.masteryLevel >= 0.5 ? "text-amber-600" : "text-red-600")}>
                      {Math.round(profile.masteryLevel * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {dashboard.confidenceTrend.length > 0 && (
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> {t("components.adaptiveStudy.confidenceTrend30Days")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="flex items-end gap-1 h-20">
                {dashboard.confidenceTrend.map((point, i) => (
                  <div key={i} className="flex-1 bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-colors" style={{ height: `${Math.round(point.avgConfidence * 100)}%` }}
                    title={`${new Date(point.date).toLocaleDateString()}: ${Math.round(point.avgConfidence * 100)}%`} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-gray-400">{t("components.adaptiveStudy.30DaysAgo")}</span>
                <span className="text-[9px] text-gray-400">{t("components.adaptiveStudy.today")}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {dashboard.totalCardsStudied === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t("components.adaptiveStudy.noStudyDataYet")}</h3>
            <p className="text-sm text-gray-400 mb-6">{t("components.adaptiveStudy.startAStudySessionTo")}</p>
            <Button className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white" onClick={() => onStartSession("recommended")} data-testid="button-start-first-session">
              <Play className="w-4 h-4 mr-2" /> Start Learning
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAdaptiveControls({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"config" | "analytics">("config");

  useEffect(() => {
    Promise.all([
      fetch("/api/adaptive/admin/config").then(r => r.ok ? r.json() : null),
      fetch("/api/adaptive/admin/analytics").then(r => r.ok ? r.json() : null),
    ]).then(([c, a]) => { setConfig(c); setAnalytics(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/adaptive/admin/config", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config),
      });
      if (res.ok) { const updated = await res.json(); setConfig(updated); }
    } catch {} finally { setSaving(false); }
  };

  const updateField = (key: string, value: number) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmwhite flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite" data-testid="section-admin-adaptive">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-600 -ml-2 mb-1" data-testid="button-admin-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-rose-500" /> Adaptive Engine Controls
            </h1>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={tab === "config" ? "default" : "outline"} size="sm" onClick={() => setTab("config")} className="rounded-lg text-xs" data-testid="tab-config">
            <Settings2 className="w-3.5 h-3.5 mr-1" /> Configuration
          </Button>
          <Button variant={tab === "analytics" ? "default" : "outline"} size="sm" onClick={() => setTab("analytics")} className="rounded-lg text-xs" data-testid="tab-analytics">
            <Eye className="w-3.5 h-3.5 mr-1" /> Analytics
          </Button>
        </div>

        {tab === "config" && config && (
          <div className="space-y-4">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t("components.adaptiveStudy.priorityScoringWeights")}</CardTitle></CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "weakTopicWeight", label: "Weak Topic", min: 0, max: 10 },
                    { key: "incorrectHistoryWeight", label: "Incorrect History", min: 0, max: 10 },
                    { key: "lowConfidenceWeight", label: "Low Confidence", min: 0, max: 10 },
                    { key: "flaggedWeight", label: "Flagged", min: 0, max: 10 },
                    { key: "notSeenWeight", label: "Not Seen", min: 0, max: 10 },
                    { key: "masteredPenalty", label: "Mastered Penalty", min: -10, max: 0 },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">{field.label}</label>
                      <input type="number" value={config[field.key] ?? 0} onChange={e => updateField(field.key, parseFloat(e.target.value) || 0)}
                        min={field.min} max={field.max} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5" data-testid={`input-${field.key}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t("components.adaptiveStudy.spacedRepetitionIntervalsDays")}</CardTitle></CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: "intervalIncorrect", label: "Incorrect" },
                    { key: "intervalUnsure", label: "Unsure" },
                    { key: "intervalConfident", label: "Confident" },
                    { key: "intervalMastered", label: "Mastered" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">{field.label}</label>
                      <input type="number" value={config[field.key] ?? 0} onChange={e => updateField(field.key, parseFloat(e.target.value) || 0)}
                        min={0} max={90} step={0.5} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5" data-testid={`input-${field.key}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t("components.adaptiveStudy.masteryWeakAreaThresholds")}</CardTitle></CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "weakTopicThreshold", label: "Weak Topic (<)" },
                    { key: "weakSubtopicThreshold", label: "Weak Subtopic (<)" },
                    { key: "masteryThresholdImproving", label: "Improving (>=)" },
                    { key: "masteryThresholdNearlyMastered", label: "Nearly Mastered (>=)" },
                    { key: "masteryThresholdMastered", label: "Mastered (>=)" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">{field.label}</label>
                      <input type="number" value={config[field.key] ?? 0} onChange={e => updateField(field.key, parseFloat(e.target.value) || 0)}
                        min={0} max={1} step={0.05} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5" data-testid={`input-${field.key}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveConfig} disabled={saving} className="w-full rounded-xl bg-rose-500 hover:bg-rose-600 text-white h-11" data-testid="button-save-config">
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        )}

        {tab === "analytics" && analytics && (
          <div className="space-y-4">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t("components.adaptiveStudy.mostMissedCards")}</CardTitle></CardHeader>
              <CardContent className="pt-1">
                {analytics.mostMissedCards?.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.mostMissedCards.slice(0, 10).map((card: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{card.front}</p>
                          <p className="text-[10px] text-gray-500">{card.topic} | {card.tier}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700 text-[10px] shrink-0 ml-2">{card.missCount} misses</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">{t("components.adaptiveStudy.noDataAvailable")}</p>}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Flag className="w-4 h-4 text-amber-500" /> {t("components.adaptiveStudy.mostFlaggedCards")}</CardTitle></CardHeader>
              <CardContent className="pt-1">
                {analytics.mostFlaggedCards?.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.mostFlaggedCards.slice(0, 10).map((card: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{card.front}</p>
                          <p className="text-[10px] text-gray-500">{card.topic} | {card.tier}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 text-[10px] shrink-0 ml-2">{card.flagCount} flags</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">{t("components.adaptiveStudy.noDataAvailable2")}</p>}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-500" /> {t("components.adaptiveStudy.mostDifficultSubtopicsByTier")}</CardTitle></CardHeader>
              <CardContent className="pt-1">
                {analytics.difficultSubtopicsByTier?.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.difficultSubtopicsByTier.slice(0, 10).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-violet-50/50 border border-violet-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{item.subtopic}</p>
                          <p className="text-[10px] text-gray-500">Tier: {item.tier} | {item.attemptCount} attempts</p>
                        </div>
                        <Badge className="bg-violet-100 text-violet-700 text-[10px] shrink-0 ml-2">{item.accuracy}% accuracy</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">{t("components.adaptiveStudy.noDataAvailable3")}</p>}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> {t("components.adaptiveStudy.weakAreaPatternsGlobal")}</CardTitle></CardHeader>
              <CardContent className="pt-1">
                {analytics.weakAreaPatterns?.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.weakAreaPatterns.slice(0, 10).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{item.topic}</p>
                          <p className="text-[10px] text-gray-500">Tier: {item.tier} | {item.userCount} users affected</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700 text-[10px] shrink-0 ml-2">{Math.round(item.avgMastery * 100)}% avg mastery</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">{t("components.adaptiveStudy.noDataAvailable4")}</p>}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
