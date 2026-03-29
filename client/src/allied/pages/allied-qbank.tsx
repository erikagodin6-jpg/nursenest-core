import { useState, useEffect } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Link, useSearch } from "wouter";
import { CAREER_CONFIGS, type CareerConfig, getCanonicalRoute } from "@shared/careers";
import { BookOpen, Filter, ChevronRight, CheckCircle2, XCircle, Clock, Zap, ChevronLeft, Lock, RotateCcw, Flag, Bookmark, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCareerQuestionPool, prefetchCareerQuestionPool } from "@/data/career-questions";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const ALLIED_CAREER_MAP: Record<string, CareerConfig> = {
  rrt: CAREER_CONFIGS.rrt,
  paramedic: CAREER_CONFIGS.paramedic,
  "pharmacy-tech": CAREER_CONFIGS.pharmacyTech,
  mlt: CAREER_CONFIGS.mlt,
  imaging: CAREER_CONFIGS.imaging,
  "occupational-therapy": CAREER_CONFIGS.occupationalTherapy,
  "physical-therapy": CAREER_CONFIGS.physicalTherapy,
};

export default function AlliedQBankPage() {
  const { t } = useI18n();
  const searchString = useSearch();
  const careerSlug = new URLSearchParams(searchString).get("career") || "";
  const career = ALLIED_CAREER_MAP[careerSlug];
  const { user } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [mode, setMode] = useState<"tutor" | "exam">("tutor");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [rapidDrill, setRapidDrill] = useState(false);
  const [drillTimer, setDrillTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const [poolLoading, setPoolLoading] = useState(false);

  const FREE_LIMIT = 5;
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  const getStorageKey = (slug: string) => `allied_qbank_used_${slug}`;
  const [freeUsed, setFreeUsed] = useState(() => {
    if (isPro || !career) return 0;
    try { return parseInt(localStorage.getItem(getStorageKey(career.slug)) || "0", 10); } catch { return 0; }
  });

  useEffect(() => {
    if (!career) return;
    let cancelled = false;
    setPoolLoading(true);
    (async () => {
      try {
        await prefetchCareerQuestionPool(career.id, { limit: 2000 });
        if (cancelled) return;
        const pool = getCareerQuestionPool(career.id) || [];
        let filtered = pool || [];
        if (difficulty) filtered = filtered.filter((q: any) => q.difficulty === difficulty);
        if (topic) filtered = filtered.filter((q: any) => q.category === topic);
        const limit = isPro ? filtered.length : Math.min(FREE_LIMIT - freeUsed, filtered.length);
        setQuestions(filtered.slice(0, Math.max(0, limit)));
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setAnswered(false);
        setScore({ correct: 0, total: 0 });
      } catch {
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setPoolLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [career?.id, difficulty, topic, isPro, freeUsed]);

  useEffect(() => {
    if (!rapidDrill) return;
    const interval = setInterval(() => setDrillTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [rapidDrill]);

  if (!career) {
    return (
      <>
        <AlliedSEO
          title={t("allied.alliedQbank.alliedHealthTestBank")}
          description={t("allied.alliedQbank.browseAlliedHealthQuestionBanks")}
          canonicalPath="/qbank"
        />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedQbank.careerNotFound")}</h1><Link href="/careers" className="text-teal-600 mt-4 inline-block">{t("allied.alliedQbank.browseCareers")}</Link></div>
      </>
    );
  }

  if (poolLoading && questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("allied.alliedQbank.loading") || "Loading question bank..."}</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  const handleAnswer = (optIdx: number) => {
    if (answered) return;
    setSelectedAnswer(optIdx);
    if (mode === "tutor") {
      setAnswered(true);
      const isCorrect = optIdx === (current.correctIndex ?? current.correctAnswer);
      setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
      setStreak(isCorrect ? streak + 1 : 0);
      if (!isPro && career) {
        const newUsed = freeUsed + 1;
        setFreeUsed(newUsed);
        try { localStorage.setItem(getStorageKey(career.slug), String(newUsed)); } catch {}
      }
    }
  };

  const handleNext = () => {
    if (mode === "exam" && !answered) {
      setAnswered(true);
      const isCorrect = selectedAnswer === (current.correctIndex ?? current.correctAnswer);
      setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const startRapidDrill = () => {
    setRapidDrill(true);
    setCategoryQuizActive(false);
    setDrillTimer(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    const pool = getCareerQuestionPool(career.id) || [];
    const shuffled = fisherYatesShuffle([...pool]).slice(0, 10);
    setQuestions(shuffled);
  };

  const [categoryQuizActive, setCategoryQuizActive] = useState(false);

  const startQuick10 = () => {
    setRapidDrill(true);
    setCategoryQuizActive(false);
    setDrillTimer(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    const pool = getCareerQuestionPool(career.id) || [];
    const shuffled = fisherYatesShuffle([...pool]).slice(0, 10);
    setQuestions(shuffled);
  };

  const startCategoryQuiz = (category: string) => {
    setRapidDrill(true);
    setCategoryQuizActive(true);
    setDrillTimer(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    const pool = getCareerQuestionPool(career.id) || [];
    const categoryQs = pool.filter((q: any) => q.category === category);
    const shuffled = fisherYatesShuffle([...categoryQs]).slice(0, 10);
    setQuestions(shuffled);
  };

  return (
    <>
    <AlliedSEO
      title={`${career.name} Test Bank - Practice Questions with Rationales`}
      description={`Practice ${career.name} certification questions with 600+ word rationales. Adaptive difficulty, domain-level tracking, and weak-area targeting for ${career.examNames[0]} exam prep.`}
      keywords={`${career.name} practice questions, ${career.name} question bank, ${career.examNames[0]} questions, ${career.name} exam prep, healthcare certification questions`}
      canonicalPath={`/qbank?career=${career.slug}`}
    />
    <div className="max-w-5xl mx-auto px-4 py-8" data-testid="allied-qbank-page">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.alliedQbank.testBank")}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-qbank-title">{career.shortName} Test Bank</h1>
          <p className="text-gray-500 text-sm mt-1">{questions.length} questions available {!isPro && `(${FREE_LIMIT} free)`}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setMode(mode === "tutor" ? "exam" : "tutor")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "tutor" ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"}`} data-testid="button-toggle-mode">
            {mode === "tutor" ? "Tutor Mode" : "Exam Mode"}
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1" data-testid="button-filters">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
          <button onClick={startQuick10} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1" data-testid="button-quick-10">
            <Zap className="w-3.5 h-3.5" /> Quick 10
          </button>
          <button onClick={startRapidDrill} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1" data-testid="button-rapid-drill">
            <Zap className="w-3.5 h-3.5" /> Rapid Drill
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6 space-y-4" data-testid="qbank-filters">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.alliedQbank.difficulty")}</label>
              <select value={difficulty || ""} onChange={e => setDifficulty(e.target.value ? Number(e.target.value) : null)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-difficulty">
                <option value="">{t("allied.alliedQbank.all")}</option>
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>Level {d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.alliedQbank.topic")}</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-topic">
                <option value="">{t("allied.alliedQbank.allTopics")}</option>
                {career.domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button onClick={() => { setDifficulty(null); setTopic(""); }} className="self-end px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" data-testid="button-clear-filters">
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">{t("allied.alliedQbank.categoryQuiz10Questions")}</label>
            <div className="flex flex-wrap gap-2">
              {career.domains.map(d => (
                <button key={d} onClick={() => startCategoryQuiz(d)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-colors" data-testid={`button-category-quiz-${d}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isPro && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 mb-6" data-testid="free-usage-bar">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {freeUsed >= FREE_LIMIT ? "Free limit reached" : `${freeUsed} of ${FREE_LIMIT} free questions used`}
              </span>
            </div>
            <span className="text-xs font-medium text-amber-600">{Math.round((freeUsed / FREE_LIMIT) * 100)}%</span>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full transition-all ${freeUsed >= FREE_LIMIT ? "bg-red-500" : freeUsed >= FREE_LIMIT * 0.8 ? "bg-amber-500" : "bg-teal-500"}`}
              style={{ width: `${Math.min((freeUsed / FREE_LIMIT) * 100, 100)}%` }}
            />
          </div>
          {freeUsed >= FREE_LIMIT ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-sm text-amber-800 flex-1">{t("allied.alliedQbank.5FreeQuestionsAvailableUpgrade")}</p>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 whitespace-nowrap" data-testid="button-upgrade-cap">
                <Lock className="w-4 h-4" /> Unlock Full QBank
              </Link>
            </div>
          ) : freeUsed >= FREE_LIMIT * 0.8 ? (
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-700">Only {FREE_LIMIT - freeUsed} free questions remaining</p>
              <Link href="/allied-health/pricing" className="text-xs font-medium text-teal-600 hover:text-teal-700" data-testid="link-upgrade-warning">
                Upgrade to Pro →
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {!isPro && freeUsed >= FREE_LIMIT && (
        <div className="bg-white rounded-2xl border-2 border-teal-200 p-8 sm:p-12 text-center mb-6" data-testid="free-cap-block">
          <Lock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allied.alliedQbank.youveReachedYourFreeLimit")}</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            Upgrade to Pro for unlimited questions with detailed 600+ word rationales, adaptive CAT simulation, weak area targeting, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200" data-testid="button-upgrade-full">
              <Zap className="w-4 h-4" /> Upgrade to Pro — $29/mo
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-100" data-testid="button-upgrade-annual">
              Or $239/year (Save 31%)
            </Link>
          </div>
        </div>
      )}

      {rapidDrill && (
        <div className="bg-teal-50 rounded-xl border border-teal-100 px-4 py-3 mb-6 flex items-center justify-between" data-testid="rapid-drill-bar">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-teal-700">{t("allied.alliedQbank.rapidDrill")}</span>
            <span className="flex items-center gap-1 text-gray-600"><Clock className="w-3.5 h-3.5" /> {Math.floor(drillTimer / 60)}:{(drillTimer % 60).toString().padStart(2, "0")}</span>
            <span className="text-gray-600">Streak: {streak}</span>
          </div>
          <div className="text-sm font-medium text-teal-700">{score.correct}/{score.total}</div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500" data-testid="text-progress">Question {currentIndex + 1} of {questions.length}</span>
        <div className="flex items-center gap-2">
          {score.total > 0 && (
            <span className="text-sm font-medium" data-testid="text-score">
              Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {current ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="question-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{current.category}</span>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-medium">Difficulty {current.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setBookmarked(b => { const n = new Set(b); n.has(currentIndex) ? n.delete(currentIndex) : n.add(currentIndex); return n; })} className={`p-1.5 rounded-lg transition-colors ${bookmarked.has(currentIndex) ? "text-yellow-500" : "text-gray-300 hover:text-gray-400"}`} data-testid="button-bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
              <button onClick={() => setFlagged(f => { const n = new Set(f); n.has(currentIndex) ? n.delete(currentIndex) : n.add(currentIndex); return n; })} className={`p-1.5 rounded-lg transition-colors ${flagged.has(currentIndex) ? "text-red-500" : "text-gray-300 hover:text-gray-400"}`} data-testid="button-flag">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-900 font-medium mb-6 leading-relaxed" data-testid="text-question-stem">{current.stem}</p>

          <div className="space-y-3">
            {current.options.map((opt: string, idx: number) => {
              const isCorrect = idx === (current.correctIndex ?? current.correctAnswer);
              const isSelected = selectedAnswer === idx;
              let borderClass = "border-gray-200 hover:border-teal-300";
              let bgClass = "bg-white hover:bg-teal-50/30";

              if (answered && mode === "tutor") {
                if (isCorrect) { borderClass = "border-green-300"; bgClass = "bg-green-50"; }
                else if (isSelected && !isCorrect) { borderClass = "border-red-300"; bgClass = "bg-red-50"; }
              } else if (isSelected) {
                borderClass = "border-teal-400"; bgClass = "bg-teal-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered && mode === "tutor"}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-start gap-3`}
                  data-testid={`option-${idx}`}
                >
                  <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm text-gray-700">{opt}</span>
                  {answered && mode === "tutor" && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />}
                  {answered && mode === "tutor" && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>

          {answered && mode === "tutor" && current.rationale && (
            <div className="mt-6 bg-teal-50 rounded-xl p-5 border border-teal-100" data-testid="rationale">
              <h4 className="font-semibold text-teal-800 mb-2">{t("allied.alliedQbank.rationale")}</h4>
              <p className="text-sm text-teal-900 leading-relaxed">{current.rationale}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed" data-testid="button-prev">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button onClick={handleNext} className="flex items-center gap-1 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors" data-testid="button-next">
              {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("allied.alliedQbank.noQuestionsAvailable")}</h3>
          <p className="text-gray-500 text-sm mb-4">{t("allied.alliedQbank.tryAdjustingYourFiltersOr")}</p>
          {!isPro && (
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-upgrade">
              <Lock className="w-4 h-4" /> Unlock Full QBank
            </Link>
          )}
        </div>
      )}
    </div>
    </>
  );
}
