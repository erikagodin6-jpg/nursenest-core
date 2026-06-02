import { useState, useEffect, useMemo } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Link } from "wouter";
import { BookOpen, Filter, ChevronRight, CheckCircle2, XCircle, ChevronLeft, Lock, RotateCcw, Zap, AlertTriangle, Beaker, Lightbulb, Shield, GraduationCap, Stethoscope, ListChecks, Trophy, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { rrtPharmacologyQuestions } from "@/data/career-questions/rrt-pharmacology-questions";
import type { CareerQuestion } from "@/data/career-questions/rrt-questions";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const PHARMACOLOGY_CATEGORIES = [
  "Route of Administration",
  "Device Selection",
  "Side Effect Recognition",
  "Contraindications",
  "Physician-Order Clarification",
  "Reassessment After Treatment",
  "Pediatric Respiratory Pharmacology",
  "Neonatal Concepts",
  "Ventilated Patient Medication Delivery",
  "Bronchodilator Response Interpretation",
  "Fluid Overload/Diuretic Monitoring",
  "Emergency Medication Recognition",
];

const FREE_LIMIT = 5;
const STORAGE_KEY = "rrt_pharm_qbank_used";

type AppMode = "landing" | "practice" | "exam";
type ExamPhase = "answering" | "results" | "review" | "retake";

interface ExamAnswer {
  questionIndex: number;
  selected: number | null;
  correct: boolean;
}

export default function RrtPharmacologyQBank() {
  const { t } = useI18n();
  const { user } = useAuth();
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  const [appMode, setAppMode] = useState<AppMode>("landing");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [questions, setQuestions] = useState<CareerQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});

  const [examPhase, setExamPhase] = useState<ExamPhase>("answering");
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  const [freeUsed, setFreeUsed] = useState(() => {
    if (isPro) return 0;
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10); } catch { return 0; }
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rrtPharmacologyQuestions.forEach(q => {
      const cat = q.pharmacologyCategory || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  const loadQuestions = (mode: AppMode, category?: string, difficulty?: number | null) => {
    let pool = [...rrtPharmacologyQuestions];
    if (category) pool = pool.filter(q => q.pharmacologyCategory === category);
    if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
    const shuffled = fisherYatesShuffle(pool);
    const limit = isPro ? shuffled.length : Math.min(FREE_LIMIT - freeUsed, shuffled.length);
    setQuestions(shuffled.slice(0, Math.max(0, limit)));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setPracticeScore({ correct: 0, total: 0 });
    setPracticeAnswers({});
    setExamAnswers([]);
    setExamPhase("answering");
    setReviewIndex(0);
    setAppMode(mode);
  };

  const startPractice = () => loadQuestions("practice", categoryFilter, difficultyFilter);
  const startExam = () => loadQuestions("exam", categoryFilter, difficultyFilter);

  const trackFreeUse = () => {
    if (!isPro) {
      const newUsed = freeUsed + 1;
      setFreeUsed(newUsed);
      try { localStorage.setItem(STORAGE_KEY, String(newUsed)); } catch {}
    }
  };

  const handlePracticeAnswer = (optIdx: number) => {
    if (answered) return;
    if (practiceAnswers[currentIndex] !== undefined) return;
    setSelectedAnswer(optIdx);
    setAnswered(true);
    setPracticeAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
    const isCorrect = optIdx === questions[currentIndex].correctIndex;
    setPracticeScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    trackFreeUse();
  };

  const handleExamAnswer = (optIdx: number) => {
    if (examPhase !== "answering") return;
    setSelectedAnswer(optIdx);
  };

  const handleExamNext = () => {
    const current = questions[currentIndex];
    const isCorrect = selectedAnswer === current.correctIndex;
    const newAnswers = [...examAnswers];
    const existing = newAnswers.findIndex(a => a.questionIndex === currentIndex);
    const entry: ExamAnswer = { questionIndex: currentIndex, selected: selectedAnswer, correct: isCorrect };
    if (existing >= 0) newAnswers[existing] = entry;
    else newAnswers.push(entry);
    setExamAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      const nextAnswer = newAnswers.find(a => a.questionIndex === currentIndex + 1);
      setSelectedAnswer(nextAnswer?.selected ?? null);
    }
  };

  const handleExamSubmit = () => {
    const finalAnswers = [...examAnswers];
    const existing = finalAnswers.findIndex(a => a.questionIndex === currentIndex);
    const current = questions[currentIndex];
    const isCorrect = selectedAnswer === current.correctIndex;
    const entry: ExamAnswer = { questionIndex: currentIndex, selected: selectedAnswer, correct: isCorrect };
    if (existing >= 0) finalAnswers[existing] = entry;
    else finalAnswers.push(entry);
    setExamAnswers(finalAnswers);
    setExamPhase("results");
    if (!isPro) {
      const answeredCount = finalAnswers.length;
      const newUsed = freeUsed + answeredCount;
      setFreeUsed(newUsed);
      try { localStorage.setItem(STORAGE_KEY, String(newUsed)); } catch {}
    }
  };

  const handlePracticeNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextAns = practiceAnswers[nextIdx];
      if (nextAns !== undefined) {
        setSelectedAnswer(nextAns);
        setAnswered(true);
      } else {
        setSelectedAnswer(null);
        setAnswered(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (appMode === "practice") {
        const prevAns = practiceAnswers[prevIdx];
        if (prevAns !== undefined) {
          setSelectedAnswer(prevAns);
          setAnswered(true);
        } else {
          setSelectedAnswer(null);
          setAnswered(false);
        }
      } else if (appMode === "exam" && examPhase === "answering") {
        const prevAnswer = examAnswers.find(a => a.questionIndex === prevIdx);
        setSelectedAnswer(prevAnswer?.selected ?? null);
      }
    }
  };

  const incorrectQuestions = useMemo(() => {
    return examAnswers.filter(a => !a.correct).map(a => questions[a.questionIndex]).filter(Boolean);
  }, [examAnswers, questions]);

  const startReviewIncorrect = () => {
    setExamPhase("review");
    setReviewIndex(0);
  };

  const startRetakeMissed = () => {
    const missed = incorrectQuestions;
    if (missed.length === 0) return;
    setQuestions(fisherYatesShuffle([...missed]));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setExamAnswers([]);
    setExamPhase("answering");
  };

  const backToLanding = () => {
    setAppMode("landing");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setPracticeScore({ correct: 0, total: 0 });
    setPracticeAnswers({});
    setExamAnswers([]);
    setExamPhase("answering");
  };

  const current = questions[currentIndex];
  const examCorrectCount = examAnswers.filter(a => a.correct).length;
  const examTotalAnswered = examAnswers.length;

  if (appMode === "landing") {
    return (
      <>
        <AlliedSEO
          title={t("allied.rrtPharmacologyQbank.rrtPharmacologyQuestionBank155")}
          description={t("allied.rrtPharmacologyQbank.masterRespiratoryPharmacologyWith155")}
          keywords="RRT pharmacology questions, respiratory therapy pharmacology, TMC exam pharmacology, bronchodilator questions, respiratory medication exam prep"
          canonicalPath="/allied-health/rrt/pharmacology-qbank"
        />
        <div className="max-w-5xl mx-auto px-4 py-8" data-testid="pharm-qbank-landing">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/allied-health/rrt" className="hover:text-teal-600">RRT</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium">{t("allied.rrtPharmacologyQbank.pharmacologyQbank")}</span>
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Beaker className="w-4 h-4" />
              {rrtPharmacologyQuestions.length} Original TMC-Style Questions
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharm-title">
              RRT Pharmacology Question Bank
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Master respiratory pharmacology with structured rationales including distractor explanations,
              clinical concepts, exam tips, and safety pearls across 12 high-yield categories.
            </p>
          </div>

          {!isPro && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 mb-8" data-testid="free-usage-bar">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">
                    {freeUsed >= FREE_LIMIT ? "Free limit reached" : `${freeUsed} of ${FREE_LIMIT} free questions used`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full transition-all ${freeUsed >= FREE_LIMIT ? "bg-red-500" : "bg-teal-500"}`} style={{ width: `${Math.min((freeUsed / FREE_LIMIT) * 100, 100)}%` }} />
              </div>
              {freeUsed >= FREE_LIMIT && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <p className="text-sm text-amber-800 flex-1">Upgrade to unlock all {rrtPharmacologyQuestions.length} pharmacology questions.</p>
                  <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200" data-testid="button-upgrade-cap">
                    <Lock className="w-4 h-4" /> Unlock Full QBank
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{t("allied.rrtPharmacologyQbank.practiceMode")}</h3>
                  <p className="text-xs text-gray-500">{t("allied.rrtPharmacologyQbank.instantFeedbackWithStructuredRationales")}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.immediateAnswerReveal")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.whyCorrectWhyEachWrong")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.clinicalConceptExamTip")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.safetyPearlForEveryQuestion")}</li>
              </ul>
              <button onClick={startPractice} disabled={!isPro && freeUsed >= FREE_LIMIT} className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-testid="button-start-practice">
                Start Practice Mode
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-orange-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{t("allied.rrtPharmacologyQbank.examMode")}</h3>
                  <p className="text-xs text-gray-500">{t("allied.rrtPharmacologyQbank.simulateRealExamConditions")}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.answersHiddenUntilSubmission")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.finalScoreWithBreakdown")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.reviewIncorrectAnswers")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" /> {t("allied.rrtPharmacologyQbank.retakeMissedQuestionsOnly")}</li>
              </ul>
              <button onClick={startExam} disabled={!isPro && freeUsed >= FREE_LIMIT} className="w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-testid="button-start-exam">
                Start Exam Mode
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors" data-testid="button-toggle-filters">
              <Filter className="w-4 h-4" /> {showFilters ? "Hide Filters" : "Filter by Category or Difficulty"}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-8 space-y-4" data-testid="pharm-filters">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.rrtPharmacologyQbank.category")}</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-category">
                    <option value="">All Categories ({rrtPharmacologyQuestions.length})</option>
                    {PHARMACOLOGY_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c} ({categoryCounts[c] || 0})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.rrtPharmacologyQbank.difficulty")}</label>
                  <select value={difficultyFilter || ""} onChange={e => setDifficultyFilter(e.target.value ? Number(e.target.value) : null)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-difficulty">
                    <option value="">{t("allied.rrtPharmacologyQbank.allLevels")}</option>
                    {[2, 3, 4, 5].map(d => <option key={d} value={d}>Level {d}</option>)}
                  </select>
                </div>
                <button onClick={() => { setCategoryFilter(""); setDifficultyFilter(null); }} className="self-end px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" data-testid="button-clear-filters">
                  <RotateCcw className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categories ({PHARMACOLOGY_CATEGORIES.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PHARMACOLOGY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setShowFilters(true); }}
                  className="text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
                  data-testid={`category-card-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 group-hover:text-teal-700">{cat}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full group-hover:bg-teal-100 group-hover:text-teal-700">{categoryCounts[cat] || 0}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (appMode === "exam" && examPhase === "results") {
    const percent = examTotalAnswered > 0 ? Math.round((examCorrectCount / questions.length) * 100) : 0;
    const passed = percent >= 70;
    return (
      <div className="max-w-3xl mx-auto px-4 py-8" data-testid="exam-results">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? "bg-green-100" : "bg-red-100"}`}>
            {passed ? <Trophy className="w-10 h-10 text-green-600" /> : <XCircle className="w-10 h-10 text-red-500" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-exam-result-title">
            {passed ? "Exam Passed!" : "Keep Studying"}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored {examCorrectCount} out of {questions.length} ({percent}%)
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-700" data-testid="text-correct-count">{examCorrectCount}</div>
              <div className="text-xs text-green-600">{t("allied.rrtPharmacologyQbank.correct")}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-700" data-testid="text-incorrect-count">{questions.length - examCorrectCount}</div>
              <div className="text-xs text-red-600">{t("allied.rrtPharmacologyQbank.incorrect")}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-700" data-testid="text-percent-score">{percent}%</div>
              <div className="text-xs text-blue-600">{t("allied.rrtPharmacologyQbank.score")}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {incorrectQuestions.length > 0 && (
              <>
                <button onClick={startReviewIncorrect} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700" data-testid="button-review-incorrect">
                  <ListChecks className="w-4 h-4" /> Review Incorrect ({incorrectQuestions.length})
                </button>
                <button onClick={startRetakeMissed} className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700" data-testid="button-retake-missed">
                  <RefreshCw className="w-4 h-4" /> Retake Missed Only
                </button>
              </>
            )}
            <button onClick={backToLanding} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200" data-testid="button-back-landing">
              Back to QBank
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appMode === "exam" && examPhase === "review") {
    const reviewQ = incorrectQuestions[reviewIndex];
    const reviewAnswer = examAnswers.find(a => questions[a.questionIndex]?.id === reviewQ?.id);
    if (!reviewQ) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">{t("allied.rrtPharmacologyQbank.noIncorrectQuestionsToReview")}</p>
          <button onClick={backToLanding} className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700">{t("allied.rrtPharmacologyQbank.backToQbank")}</button>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="exam-review">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Review Incorrect — {reviewIndex + 1} of {incorrectQuestions.length}</h2>
          <button onClick={() => setExamPhase("results")} className="text-sm text-gray-500 hover:text-gray-700" data-testid="button-back-results">{t("allied.rrtPharmacologyQbank.backToResults")}</button>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${((reviewIndex + 1) / incorrectQuestions.length) * 100}%` }} />
        </div>
        <QuestionCard question={reviewQ} selectedAnswer={reviewAnswer?.selected ?? null} answered={true} mode="review" onAnswer={() => {}} />
        <StructuredRationale question={reviewQ} selectedAnswer={reviewAnswer?.selected ?? null} />
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setReviewIndex(i => Math.max(0, i - 1))} disabled={reviewIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30" data-testid="button-review-prev">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {reviewIndex < incorrectQuestions.length - 1 ? (
            <button onClick={() => setReviewIndex(i => i + 1)} className="flex items-center gap-1 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-review-next">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setExamPhase("results")} className="flex items-center gap-1 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-review-done">
              Done <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("allied.rrtPharmacologyQbank.noQuestionsAvailable")}</h3>
        <p className="text-gray-500 text-sm mb-4">{t("allied.rrtPharmacologyQbank.tryAdjustingYourFiltersOr")}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={backToLanding} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-back">{t("allied.rrtPharmacologyQbank.backToQbank2")}</button>
          {!isPro && (
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-upgrade">
              <Lock className="w-4 h-4" /> Unlock Full QBank
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="pharm-qbank-session">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={backToLanding} className="hover:text-teal-600">{t("allied.rrtPharmacologyQbank.pharmacologyQbank2")}</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{appMode === "practice" ? "Practice Mode" : "Exam Mode"}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {appMode === "practice" ? "Practice Mode" : "Exam Mode"}
          </h1>
          <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          {appMode === "practice" && practiceScore.total > 0 && (
            <span className="text-sm font-medium text-gray-700" data-testid="text-practice-score">
              Score: {practiceScore.correct}/{practiceScore.total} ({Math.round((practiceScore.correct / practiceScore.total) * 100)}%)
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${appMode === "practice" ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"}`}>
            {appMode === "practice" ? "Practice" : "Exam"}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      <QuestionCard
        question={current}
        selectedAnswer={selectedAnswer}
        answered={appMode === "practice" ? answered : false}
        mode={appMode}
        onAnswer={appMode === "practice" ? handlePracticeAnswer : handleExamAnswer}
      />

      {appMode === "practice" && answered && (
        <StructuredRationale question={current} selectedAnswer={selectedAnswer} />
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed" data-testid="button-prev">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <div className="flex gap-2">
          {appMode === "practice" ? (
            currentIndex === questions.length - 1 ? (
              <button onClick={backToLanding} className="flex items-center gap-1 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-finish">
                Finish <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handlePracticeNext} disabled={!answered} className="flex items-center gap-1 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed" data-testid="button-next">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <>
              {currentIndex === questions.length - 1 ? (
                <button onClick={handleExamSubmit} className="flex items-center gap-1 px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700" data-testid="button-submit-exam">
                  Submit Exam <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleExamNext} disabled={selectedAnswer === null} className="flex items-center gap-1 px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed" data-testid="button-next">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, selectedAnswer, answered, mode, onAnswer }: {
  question: CareerQuestion;
  selectedAnswer: number | null;
  answered: boolean;
  mode: string;
  onAnswer: (idx: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="question-card">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {question.pharmacologyCategory && (
          <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-medium">{question.pharmacologyCategory}</span>
        )}
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Difficulty {question.difficulty}</span>
      </div>

      <p className="text-gray-900 font-medium mb-6 leading-relaxed" data-testid="text-question-stem">{question.stem}</p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.correctIndex;
          const isSelected = selectedAnswer === idx;
          let borderClass = "border-gray-200 hover:border-teal-300";
          let bgClass = "bg-white hover:bg-teal-50/30";

          if (answered && (mode === "practice" || mode === "review")) {
            if (isCorrect) { borderClass = "border-green-300"; bgClass = "bg-green-50"; }
            else if (isSelected && !isCorrect) { borderClass = "border-red-300"; bgClass = "bg-red-50"; }
            else { borderClass = "border-gray-200"; bgClass = "bg-white"; }
          } else if (isSelected) {
            borderClass = "border-teal-400"; bgClass = "bg-teal-50";
          }

          return (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-start gap-3`}
              data-testid={`option-${idx}`}
            >
              <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm text-gray-700 flex-1">{opt}</span>
              {answered && (mode === "practice" || mode === "review") && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />}
              {answered && (mode === "practice" || mode === "review") && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StructuredRationale({ question, selectedAnswer }: { question: CareerQuestion; selectedAnswer: number | null }) {
  return (
    <div className="mt-6 space-y-4" data-testid="structured-rationale">
      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-green-800 text-sm">{t("allied.rrtPharmacologyQbank.whyCorrect")}</h4>
        </div>
        <p className="text-sm text-green-900 leading-relaxed">{question.rationale}</p>
      </div>

      {question.distractorExplanations && question.distractorExplanations.length > 0 && (
        <div className="bg-red-50 rounded-xl p-5 border border-red-100">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-600" />
            <h4 className="font-semibold text-red-800 text-sm">{t("allied.rrtPharmacologyQbank.whyOtherOptionsAreWrong")}</h4>
          </div>
          <div className="space-y-2">
            {question.distractorExplanations.map((exp, idx) => {
              const optionIdx = idx >= question.correctIndex ? idx + 1 : idx;
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-red-600 bg-red-100 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optionIdx)}
                  </span>
                  <p className="text-sm text-red-900 leading-relaxed">{exp}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {question.clinicalConcept && (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-blue-800 text-sm">{t("allied.rrtPharmacologyQbank.clinicalConcept")}</h4>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{question.clinicalConcept}</p>
        </div>
      )}

      {question.examTip && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h4 className="font-semibold text-amber-800 text-sm">{t("allied.rrtPharmacologyQbank.examTip")}</h4>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">{question.examTip}</p>
        </div>
      )}

      {question.safetyPearl && (
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-purple-800 text-sm">{t("allied.rrtPharmacologyQbank.safetyPearl")}</h4>
          </div>
          <p className="text-sm text-purple-900 leading-relaxed">{question.safetyPearl}</p>
        </div>
      )}
    </div>
  );
}
