import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BookOpen, ChevronRight, Filter, CheckCircle2, XCircle, ChevronLeft, Lock, RotateCcw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = [
  "Pharmacology", "Dosage Calculations", "Compounding", "Drug Interactions",
  "Regulations/Law", "Sterile Products", "Inventory Management", "Patient Safety",
  "Drug Classifications", "Prescription Processing",
];

export default function PharmtechPracticePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const FREE_LIMIT = 10;
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  useEffect(() => {
    let url = "/api/pharmtech/questions";
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", String(difficulty));
    if (params.toString()) url += `?${params.toString()}`;
    setLoading(true);
    fetch(url).then(r => { if (!r.ok) throw new Error("Failed to load"); return r.json(); }).then(data => {
      setQuestions(Array.isArray(data) ? data : []);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setScore({ correct: 0, total: 0 });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, difficulty, isPro]);

  const current = questions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const isCorrect = idx === current.correctIndex;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechPractice.pharmacyTechnicianPracticeQuestionsPtcb")}
        description={t("allied.pharmtechPractice.practicePharmacyTechnicianCertificationQuestio")}
        keywords="pharmacy technician practice questions, PTCB practice questions, pharmacy tech exam questions, ExCPT practice test"
        canonicalPath="/allied-health/pharmacy-technician/practice-questions"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-practice-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechPractice.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechPractice.practiceQuestions")}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-practice-title">{t("allied.pharmtechPractice.practiceQuestions2")}</h1>
            <p className="text-gray-500 text-sm mt-1">{questions.length} questions {!isPro && `(${FREE_LIMIT} free preview)`}</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-testid="button-toggle-filters">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-4" data-testid="practice-filters">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.pharmtechPractice.category")}</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-practice-category">
                <option value="">{t("allied.pharmtechPractice.allCategories")}</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.pharmtechPractice.difficulty")}</label>
              <select value={difficulty || ""} onChange={e => setDifficulty(e.target.value ? Number(e.target.value) : null)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" data-testid="select-practice-difficulty">
                <option value="">{t("allied.pharmtechPractice.all")}</option>
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>Level {d}</option>)}
              </select>
            </div>
            <button onClick={() => { setCategory(""); setDifficulty(null); }} className="self-end px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" data-testid="button-clear-practice-filters">
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        )}

        {score.total > 0 && (
          <div className="bg-green-50 rounded-xl border border-green-100 px-4 py-3 mb-6 flex items-center justify-between" data-testid="practice-score-bar">
            <span className="text-sm text-green-800 font-medium">Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)</span>
            <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : current ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="practice-question-card">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{current.category}</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">Difficulty {current.difficulty}</span>
            </div>

            <p className="text-gray-900 font-medium mb-6 leading-relaxed" data-testid="text-practice-stem">{current.stem}</p>

            <div className="space-y-3">
              {(current.options || []).map((opt: string, idx: number) => {
                const isCorrect = idx === current.correctIndex;
                const isSelected = selectedAnswer === idx;
                let borderClass = "border-gray-200 hover:border-green-300";
                let bgClass = "bg-white hover:bg-green-50/30";
                if (answered) {
                  if (isCorrect) { borderClass = "border-green-300"; bgClass = "bg-green-50"; }
                  else if (isSelected && !isCorrect) { borderClass = "border-red-300"; bgClass = "bg-red-50"; }
                } else if (isSelected) {
                  borderClass = "border-green-400"; bgClass = "bg-green-50";
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-start gap-3`} data-testid={`practice-option-${idx}`}>
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{String.fromCharCode(65 + idx)}</span>
                    <span className="text-sm text-gray-700">{opt}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {answered && current.rationale && (
              <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100" data-testid="practice-rationale">
                <h4 className="font-semibold text-blue-800 mb-2">{t("allied.pharmtechPractice.rationale")}</h4>
                <p className="text-sm text-blue-900 leading-relaxed">{current.rationale}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => { if (currentIndex > 0) { setCurrentIndex(i => i - 1); setSelectedAnswer(null); setAnswered(false); } }} disabled={currentIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-30" data-testid="button-prev-practice">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={handleNext} disabled={currentIndex >= questions.length - 1} className="flex items-center gap-1 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50" data-testid="button-next-practice">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("allied.pharmtechPractice.noQuestionsFound")}</h3>
            <p className="text-gray-500 text-sm">{t("allied.pharmtechPractice.tryAdjustingYourFilters")}</p>
          </div>
        )}

        {!isPro && questions.length >= FREE_LIMIT && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 text-center mt-8" data-testid="upgrade-block">
            <Lock className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechPractice.unlockAllPracticeQuestions")}</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">{t("allied.pharmtechPractice.upgradeToAlliedProFor")}</p>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200" data-testid="button-upgrade-practice">
              <Lock className="w-4 h-4" /> Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
