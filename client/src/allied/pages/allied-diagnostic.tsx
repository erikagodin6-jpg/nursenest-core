import { Link, useSearch } from "wouter";
import { CAREER_CONFIGS, type CareerConfig } from "@shared/careers";
import { useState, useCallback, useMemo } from "react";
import { getCareerQuestionPool, prefetchCareerQuestionPool } from "@/data/career-questions/career-question-pool";
import type { CareerQuestion } from "@/data/career-questions/rrt-questions";
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Lock, Mail,
  BarChart3, Target, TrendingUp, AlertTriangle, Crown, Clock,
  ChevronRight, Shield, Zap
} from "lucide-react";
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

const DIAGNOSTIC_COUNT = 15;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function selectDiagnosticQuestions(pool: CareerQuestion[]): CareerQuestion[] {
  const { t } = useI18n();
  if (pool.length <= DIAGNOSTIC_COUNT) return shuffleArray(pool);
  const categories = new Map<string, CareerQuestion[]>();
  pool.forEach(q => {
    const cat = q.category || "General";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(q);
  });
  const selected: CareerQuestion[] = [];
  const catKeys = Array.from(categories.keys());
  let idx = 0;
  while (selected.length < DIAGNOSTIC_COUNT && catKeys.length > 0) {
    const catKey = catKeys[idx % catKeys.length];
    const catPool = categories.get(catKey)!;
    if (catPool.length > 0) {
      const randIdx = Math.floor(Math.random() * catPool.length);
      selected.push(catPool.splice(randIdx, 1)[0]);
    }
    if (catPool.length === 0) {
      catKeys.splice(catKeys.indexOf(catKey), 1);
      if (catKeys.length === 0) break;
    }
    idx++;
  }
  while (selected.length < DIAGNOSTIC_COUNT && pool.length > selected.length) {
    const remaining = pool.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  return shuffleArray(selected);
}

type Phase = "intro" | "exam" | "preview" | "gated" | "results";

export default function AlliedDiagnostic() {
  const searchString = useSearch();
  const careerSlug = new URLSearchParams(searchString).get("career") || "";
  const career = ALLIED_CAREER_MAP[careerSlug];

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<CareerQuestion[]>([]);
  const [poolLoading, setPoolLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { t } = useI18n();

  const startDiagnostic = useCallback(async () => {
    if (poolLoading) return;
    setPoolLoading(true);
    try {
      await prefetchCareerQuestionPool(career?.id || careerSlug);
      const pool = getCareerQuestionPool(career?.id || careerSlug);
      if (!pool || pool.length === 0) {
        console.warn("[AlliedDiagnostic] Career question pool empty after prefetch");
        return;
      }
      const selected = selectDiagnosticQuestions(pool);
      setQuestions(selected);
      setCurrentIdx(0);
      setAnswers({});
      setSelectedOption(null);
      setShowFeedback(false);
      setStartTime(Date.now());
      setPhase("exam");
    } finally {
      setPoolLoading(false);
    }
  }, [career, careerSlug, poolLoading]);

  const handleSelectOption = (optIdx: number) => {
    if (showFeedback) return;
    setSelectedOption(optIdx);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: selectedOption }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setPhase("preview");
    }
  };

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    return correct;
  }, [answers, questions]);

  const domainBreakdown = useMemo(() => {
    const domains: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const cat = q.category || "General";
      if (!domains[cat]) domains[cat] = { correct: 0, total: 0 };
      domains[cat].total++;
      if (answers[i] === q.correctIndex) domains[cat].correct++;
    });
    return domains;
  }, [answers, questions]);

  const weakAreas = useMemo(() => {
    return Object.entries(domainBreakdown)
      .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.6)
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
      .map(([name]) => name);
  }, [domainBreakdown]);

  const strongAreas = useMemo(() => {
    return Object.entries(domainBreakdown)
      .filter(([, d]) => d.total > 0 && d.correct / d.total >= 0.6)
      .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))
      .map(([name]) => name);
  }, [domainBreakdown]);

  const readinessLevel = useMemo(() => {
    const pct = questions.length > 0 ? (score / questions.length) * 100 : 0;
    if (pct >= 80) return { label: "Strong", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (pct >= 60) return { label: "Developing", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { label: "Needs Focus", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  }, [score, questions.length]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setSubmittingEmail(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      await fetch("/api/allied/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          careerType: career?.id || careerSlug,
          score,
          totalQuestions: questions.length,
          domainBreakdown,
          weakAreas,
          strongAreas,
          timeSpent,
        }),
      });
      setEmailSubmitted(true);
      setPhase("results");
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setSubmittingEmail(false);
    }
  };

  if (!career) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlliedSEO
          title={t("allied.alliedDiagnostic.alliedHealthDiagnosticAssessment")}
          description={t("allied.alliedDiagnostic.takeAFreeDiagnosticAssessment")}
          canonicalPath="/diagnostic"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found">{t("allied.alliedDiagnostic.careerNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("allied.alliedDiagnostic.weDontHaveADiagnostic")}</p>
        <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-browse-careers">
          Browse Careers <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <AlliedSEO
          title={`${career.name} Diagnostic Assessment - Test Your Readiness`}
          description={`Take a free 15-question ${career.name} diagnostic assessment. Get your readiness score, identify weak areas, and receive a personalized study recommendation for ${career.examNames[0]} exam prep.`}
          keywords={`${career.name} diagnostic test, ${career.name} readiness assessment, ${career.examNames[0]} practice test, ${career.name} exam readiness`}
          canonicalPath={`/diagnostic?career=${career.slug}`}
        />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200" data-testid="badge-free-diagnostic">
              <Shield className="w-3.5 h-3.5" /> Free Diagnostic Assessment
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-diagnostic-title">
              {career.shortName} Readiness Check
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto" data-testid="text-diagnostic-subtitle">
              Discover your strengths and weak areas with a free {DIAGNOSTIC_COUNT}-question assessment mapped to the {career.examNames[0]} exam blueprint.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                <Target className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{DIAGNOSTIC_COUNT} Questions</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{t("allied.alliedDiagnostic.10Minutes")}</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{t("allied.alliedDiagnostic.instantResults")}</p>
            </div>
          </div>

          <button
            onClick={startDiagnostic}
            disabled={poolLoading}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all"
            data-testid="button-start-diagnostic"
          >
            {poolLoading ? "Loading questions..." : "Start Free Diagnostic"} <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-400">{t("allied.alliedDiagnostic.noAccountRequiredSeeYour")}</p>
        </div>
      </div>
    );
  }

  if (phase === "exam" && questions.length > 0) {
    const q = questions[currentIdx];
    const isCorrect = showFeedback && selectedOption === q.correctIndex;
    const progress = ((currentIdx + (showFeedback ? 1 : 0)) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-500" data-testid="text-question-counter">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-500" data-testid="text-domain-label">
            {q.category}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
          <p className="text-lg font-medium text-gray-900 leading-relaxed" data-testid="text-question-stem">
            {q.stem}
          </p>

          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              let optClass = "border-gray-200 hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer";
              if (selectedOption === oi && !showFeedback) {
                optClass = "border-teal-500 bg-teal-50 ring-2 ring-teal-200";
              }
              if (showFeedback) {
                if (oi === q.correctIndex) {
                  optClass = "border-green-500 bg-green-50";
                } else if (oi === selectedOption) {
                  optClass = "border-red-400 bg-red-50";
                } else {
                  optClass = "border-gray-100 opacity-60";
                }
              }
              return (
                <button
                  key={oi}
                  onClick={() => handleSelectOption(oi)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${optClass}`}
                  data-testid={`option-${oi}`}
                >
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${showFeedback && oi === q.correctIndex ? 'bg-green-500 text-white border-green-500' : showFeedback && oi === selectedOption ? 'bg-red-400 text-white border-red-400' : selectedOption === oi ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 text-gray-500'}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="text-sm text-gray-800">{opt}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} data-testid="feedback-panel">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-semibold text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-gray-700">{q.rationale}</p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            {!showFeedback ? (
              <button
                onClick={handleConfirm}
                disabled={selectedOption === null}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                data-testid="button-confirm-answer"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all"
                data-testid="button-next-question"
              >
                {currentIdx < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "preview") {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-preview-title">
            Your {career.shortName} Readiness Preview
          </h2>
          <p className="text-gray-600">{t("allied.alliedDiagnostic.heresAQuickSnapshotEnter")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("allied.alliedDiagnostic.overallScore")}</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-score">{score}/{questions.length}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${readinessLevel.bg} ${readinessLevel.border} border`}>
              <p className={`text-sm font-bold ${readinessLevel.color}`} data-testid="text-readiness">{readinessLevel.label}</p>
              <p className="text-xs text-gray-500">{pct}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" /> Domain Breakdown
            </h3>
            {Object.entries(domainBreakdown).map(([domain, data]) => {
              const domPct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={domain} className="space-y-1" data-testid={`domain-${domain}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{domain}</span>
                    <span className="font-medium text-gray-900">{data.correct}/{data.total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${domPct >= 60 ? 'bg-green-500' : domPct >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                      style={{ width: `${domPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Weak Areas Identified
              </h4>
              <ul className="space-y-1">
                {weakAreas.map(area => (
                  <li key={area} className="text-sm text-amber-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">{t("allied.alliedDiagnostic.fullResultsLocked")}</p>
              <p className="text-xs text-gray-500">{t("allied.alliedDiagnostic.enterYourEmailToUnlock")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6" data-testid="email-gate">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{t("allied.alliedDiagnostic.unlockYourFullResults")}</h3>
          <p className="text-sm text-gray-500 mb-4">{t("allied.alliedDiagnostic.getYourDetailedBreakdownStudy")}</p>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("allied.alliedDiagnostic.enterYourEmail")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                  data-testid="input-email"
                />
              </div>
              <button
                type="submit"
                disabled={submittingEmail}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-all whitespace-nowrap"
                data-testid="button-unlock-results"
              >
                {submittingEmail ? "Unlocking..." : "Unlock Results"}
              </button>
            </div>
            {emailError && <p className="text-xs text-red-500" data-testid="text-email-error">{emailError}</p>}
            <p className="text-xs text-gray-400">{t("allied.alliedDiagnostic.wellSendYourResultsAnd")}</p>
          </form>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Results Unlocked
          </div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-results-title">
            Your {career.shortName} Diagnostic Report
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("allied.alliedDiagnostic.overallScore2")}</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-final-score">{score}/{questions.length}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${readinessLevel.bg} ${readinessLevel.border} border`}>
              <p className={`text-sm font-bold ${readinessLevel.color}`}>{readinessLevel.label}</p>
              <p className="text-xs text-gray-500">{pct}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" /> Detailed Domain Breakdown
            </h3>
            {Object.entries(domainBreakdown).map(([domain, data]) => {
              const domPct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={domain} className="space-y-1" data-testid={`result-domain-${domain}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{domain}</span>
                    <span className="font-medium text-gray-900">{data.correct}/{data.total} ({domPct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${domPct >= 60 ? 'bg-green-500' : domPct >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                      style={{ width: `${domPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {strongAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" /> Your Strengths
              </h4>
              <ul className="space-y-1">
                {strongAreas.map(area => (
                  <li key={area} className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Areas to Focus On
              </h4>
              <ul className="space-y-1">
                {weakAreas.map(area => (
                  <li key={area} className="text-sm text-amber-700 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> {area}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                Pro members get targeted drills for these weak areas with 600+ word rationales on every question.
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-500" /> Recommended Next Steps
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                Focus your study on {weakAreas.length > 0 ? weakAreas[0] : "all domains equally"}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                Practice with adaptive CAT-style mock exams to build test endurance
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                Review 600+ word rationales to deepen clinical reasoning
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white space-y-4" data-testid="upgrade-cta">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-300" />
            <div>
              <h3 className="text-lg font-bold">{t("allied.alliedDiagnostic.upgradeToAlliedPro")}</h3>
              <p className="text-teal-100 text-sm">Get unlimited access to the full {career.shortName} question bank</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-200" /> {t("allied.alliedDiagnostic.600WordRationalesOnEvery")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-200" /> {t("allied.alliedDiagnostic.adaptiveCatstyleMockExams")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-200" /> {t("allied.alliedDiagnostic.smartWeakareaTargeting")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-200" /> {t("allied.alliedDiagnostic.personalizedStudyPlan")}</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/allied-health/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-bold hover:bg-teal-50 transition-all"
              data-testid="link-upgrade-pricing"
            >
              View Pricing <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/qbank?career=${careerSlug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500/30 text-white rounded-xl text-sm font-medium hover:bg-teal-500/40 transition-all"
              data-testid="link-try-qbank"
            >
              Try Free Questions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
