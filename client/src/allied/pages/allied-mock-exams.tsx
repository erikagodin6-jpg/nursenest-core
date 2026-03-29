import { useEffect, useState } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { useParams, Link, useLocation } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute } from "@shared/careers";
import { FileText, Clock, BarChart3, ChevronRight, Play, Lock, CheckCircle2, Target, AlertTriangle, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCareerQuestionPool, prefetchCareerQuestionPool } from "@/data/career-questions";
import { AlliedSEO } from "@/allied/allied-seo";
import { ComingSoonFallback } from "@/allied/components/coming-soon-fallback";

import { useI18n } from "@/lib/i18n";
const EXAM_TYPES = [
  { id: "mini", name: "Mini Mock", questions: 25, time: 30, free: true, desc: "Quick 25-question practice exam", careers: null },
  { id: "standard", name: "Standard Exam", questions: 75, time: 90, free: false, desc: "Full-length timed exam weighted to blueprint", careers: null },
  { id: "comprehensive", name: "Comprehensive", questions: 150, time: 180, free: false, desc: "Marathon exam covering all domains", careers: null },
  { id: "mock2", name: "Mock Exam 2", questions: 90, time: 110, free: false, desc: "Full-length 90-question exam with adaptive difficulty", careers: null },
  { id: "mock3", name: "Mock Exam 3", questions: 90, time: 110, free: false, desc: "Fresh 90-question set for repeated practice", careers: null },
  { id: "calculations", name: "Calculations Mastery", questions: 40, time: 60, free: false, desc: "Focused on dosage calculations and pharmacy math", careers: ["pharmacyTech"] as string[] },
  { id: "safety-law", name: "Safety & Law", questions: 50, time: 60, free: false, desc: "Patient safety, regulations, and controlled substances", careers: ["pharmacyTech"] as string[] },
  { id: "pharmacology-focus", name: "Pharmacology Focus", questions: 60, time: 75, free: false, desc: "Drug classes, interactions, and top 200 drugs", careers: ["pharmacyTech"] as string[] },
  { id: "sterile-compounding", name: "Sterile & Compounding", questions: 40, time: 50, free: false, desc: "USP 795/797/800 and compounding techniques", careers: ["pharmacyTech"] as string[] },
  { id: "rapid-review", name: "Rapid Review", questions: 50, time: 45, free: false, desc: "Fast-paced review across all domains", careers: null },
  { id: "ota-adl-interventions", name: "ADL & Interventions", questions: 60, time: 75, free: false, desc: "Focused on ADL training, adaptive equipment, and OT intervention strategies", careers: ["occupationalTherapyAssistant"] as string[] },
  { id: "ota-neuro-peds", name: "Neuro & Pediatric OT", questions: 50, time: 60, free: false, desc: "Neurological rehabilitation, pediatric milestones, and developmental interventions", careers: ["occupationalTherapyAssistant"] as string[] },
  { id: "ota-clinical-reasoning", name: "Clinical Reasoning", questions: 50, time: 65, free: false, desc: "Complex clinical scenarios testing OTA decision-making and professional ethics", careers: ["occupationalTherapyAssistant"] as string[] },
  { id: "pta-musculoskeletal", name: "Musculoskeletal Focus", questions: 60, time: 75, free: false, desc: "Orthopedic conditions, therapeutic exercises, and rehabilitation protocols", careers: ["physiotherapyAssistant"] as string[] },
  { id: "pta-neuro-rehab", name: "Neuro Rehabilitation", questions: 50, time: 60, free: false, desc: "Neurological conditions, motor recovery, and balance/gait interventions", careers: ["physiotherapyAssistant"] as string[] },
  { id: "pta-modalities-safety", name: "Modalities & Safety", questions: 50, time: 60, free: false, desc: "Physical agents, therapeutic modalities, patient safety, and infection control", careers: ["physiotherapyAssistant"] as string[] },
];

export default function AlliedMockExamsPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [freeMocksUsed, setFreeMocksUsed] = useState(0);

  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";
  const FREE_MOCK_LIMIT = 1;

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedMockExams.careerNotFound")}</h1></div>;
  }

  const [questionPool, setQuestionPool] = useState<any[]>([]);
  const [poolLoading, setPoolLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPoolLoading(true);
      try {
        await prefetchCareerQuestionPool(career.id, { limit: 2000 });
        if (cancelled) return;
        setQuestionPool(getCareerQuestionPool(career.id) || []);
      } finally {
        if (!cancelled) setPoolLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [career.id]);

  if (poolLoading && questionPool.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("allied.alliedMockExams.loading") || "Loading question bank..."}</p>
      </div>
    );
  }

  if (!poolLoading && questionPool.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16" data-testid="mock-exams-page">
        <AlliedSEO
          title={`${career.name} Mock Exams`}
          description={`Mock exams for ${career.name} are being developed.`}
          keywords={`${career.name} mock exam`}
          canonicalPath={`/career/${params.careerSlug}/mock-exams`}
        />
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-teal-700 font-medium">{t("allied.alliedMockExams.mockExams")}</span>
        </div>
        <ComingSoonFallback
          title={`${career.shortName} Mock Exams — In Development`}
          description={`Blueprint-weighted mock exams for ${career.shortName} certification are being developed by our team of certified professionals.`}
          careerSlug={career.slug}
        />
      </div>
    );
  }

  const mockExamSeo = (
    <AlliedSEO
      title={`${career.name} Mock Exams - Full-Length Practice Tests`}
      description={`Take full-length ${career.name} mock exams with adaptive CAT simulation. Blueprint-weighted, timed practice with detailed domain-level performance analytics for ${career.examNames[0]} certification.`}
      keywords={`${career.name} mock exam, ${career.name} practice test, ${career.examNames[0]} mock exam, ${career.name} timed exam, ${career.name} CAT simulation`}
      canonicalPath={`/career/${params.careerSlug}/mock-exams`}
    />
  );

  const CATEGORY_FOCUSED_EXAMS: Record<string, string[]> = {
    "calculations": ["Dosage Calculations"],
    "safety-law": ["Patient Safety", "Regulations/Law"],
    "pharmacology-focus": ["Pharmacology", "Drug Interactions", "Drug Classifications"],
    "sterile-compounding": ["Sterile Products", "Compounding"],
    "ota-adl-interventions": ["Assistive Devices", "Patient Mobility", "Rehabilitation Principles", "Therapeutic Exercises"],
    "ota-neuro-peds": ["Neurological", "Neurological Rehabilitation", "Pediatric Rehabilitation"],
    "ota-clinical-reasoning": ["Clinical Case Scenarios", "Professional Ethics", "Rehabilitation Planning"],
    "pta-musculoskeletal": ["Musculoskeletal", "Orthopedic Rehabilitation", "Therapeutic Exercises"],
    "pta-neuro-rehab": ["Neurological", "Neurological Rehabilitation", "Patient Mobility", "Rehabilitation Principles"],
    "pta-modalities-safety": ["Patient Safety", "Infection Prevention", "Therapeutic Exercises", "Anatomy & Physiology"],
  };

  const startExam = (examId: string) => {
    const examType = EXAM_TYPES.find(e => e.id === examId);
    if (!examType) return;
    if (!examType.free && !isPro) return;
    if (examType.free && !isPro && freeMocksUsed >= FREE_MOCK_LIMIT) return;

    const pool = getCareerQuestionPool(career.id) || [];
    const focusCategories = CATEGORY_FOCUSED_EXAMS[examId];
    const selected: any[] = [];

    if (focusCategories) {
      const focusPool = fisherYatesShuffle(pool.filter((q: any) => focusCategories.includes(q.category)));
      selected.push(...focusPool.slice(0, examType.questions));
      if (selected.length < examType.questions) {
        const remaining = fisherYatesShuffle(pool.filter((q: any) => !selected.includes(q)));
        while (selected.length < examType.questions && remaining.length > 0) {
          selected.push(remaining.pop()!);
        }
      }
    } else {
      const domains = career.domains;
      const questionsPerDomain = Math.ceil(examType.questions / domains.length);

      for (const domain of domains) {
        const domainQs = pool.filter((q: any) => q.category === domain);
        const shuffled = fisherYatesShuffle(domainQs);
        selected.push(...shuffled.slice(0, questionsPerDomain));
      }

      const remaining = fisherYatesShuffle(pool.filter((q: any) => !selected.includes(q)));
      while (selected.length < examType.questions && remaining.length > 0) {
        selected.push(remaining.pop()!);
      }
    }

    setQuestions(selected.slice(0, examType.questions));
    setTimeLeft(examType.time * 60);
    setExamStarted(true);
    setSelectedExam(examId);
    setAnswers({});
    setCurrentIdx(0);
    setFinished(false);
    setDifficulty(3);
    setConsecutiveCorrect(0);
  };

  const handleAnswer = (optIdx: number) => {
    setAnswers(a => ({ ...a, [currentIdx]: optIdx }));
    const isCorrect = optIdx === (questions[currentIdx]?.correctIndex ?? questions[currentIdx]?.correctAnswer);
    if (isCorrect) {
      const newStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(newStreak);
      if (newStreak >= 3 && difficulty < 5) setDifficulty(d => d + 1);
    } else {
      setConsecutiveCorrect(0);
      if (difficulty > 1) setDifficulty(d => d - 1);
    }
  };

  const finishExam = () => {
    setFinished(true);
    if (!isPro) {
      setFreeMocksUsed(u => u + 1);
    }
  };

  if (finished) {
    const correct = Object.entries(answers).filter(([idx, ans]) => (questions[Number(idx)]?.correctIndex ?? questions[Number(idx)]?.correctAnswer) === ans).length;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const domainScores: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!domainScores[q.category]) domainScores[q.category] = { correct: 0, total: 0 };
      domainScores[q.category].total++;
      if (answers[i] === (q.correctIndex ?? q.correctAnswer)) domainScores[q.category].correct++;
    });

    return (
      <div className="max-w-3xl mx-auto px-4 py-12" data-testid="exam-results">
        {mockExamSeo}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.alliedMockExams.examComplete")}</h1>
        <p className="text-gray-600 text-center mb-8">{career.shortName} Mock Exam Results</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-8">
          <div className="text-5xl font-bold mb-2" style={{ color: pct >= 70 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626" }} data-testid="text-score-pct">{pct}%</div>
          <p className="text-gray-600">{correct} of {total} correct</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: pct >= 70 ? "#d1fae5" : pct >= 50 ? "#fef3c7" : "#fee2e2", color: pct >= 70 ? "#065f46" : pct >= 50 ? "#92400e" : "#991b1b" }} data-testid="text-readiness">
            <Target className="w-4 h-4" />
            {pct >= 70 ? "Exam Ready" : pct >= 50 ? "Nearly Ready" : "More Study Needed"}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t("allied.alliedMockExams.performanceByDomain")}</h3>
          <div className="space-y-3">
            {Object.entries(domainScores).map(([domain, s]) => {
              const dpct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={domain} data-testid={`domain-score-${domain}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{domain}</span>
                    <span className="font-medium">{s.correct}/{s.total} ({dpct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${dpct}%`, backgroundColor: dpct >= 70 ? "#059669" : dpct >= 50 ? "#d97706" : "#dc2626" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => { setExamStarted(false); setFinished(false); }} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-new-exam">{t("allied.alliedMockExams.takeAnotherExam")}</button>
          <Link href={`/qbank?career=${career.slug}`} className="px-6 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-50" data-testid="button-go-qbank">{t("allied.alliedMockExams.practiceMoreQuestions")}</Link>
        </div>
      </div>
    );
  }

  if (examStarted && questions.length > 0) {
    const current = questions[currentIdx];
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6" data-testid="exam-session">
        {mockExamSeo}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Q {currentIdx + 1}/{questions.length}</span>
            <span className="flex items-center gap-1 text-gray-600"><Clock className="w-3.5 h-3.5" /> {mins}:{secs.toString().padStart(2, "0")}</span>
            <span className="text-gray-500">Difficulty: {difficulty}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPaused(!paused)} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200" data-testid="button-pause">{paused ? "Resume" : "Pause"}</button>
            <button onClick={finishExam} className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100" data-testid="button-finish">{t("allied.alliedMockExams.finish")}</button>
          </div>
        </div>

        {!paused && current && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{current.category}</span>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs">Lvl {current.difficulty}</span>
            </div>
            <p className="text-gray-900 font-medium mb-6">{current.stem}</p>
            <div className="space-y-3">
              {current.options.map((opt: string, idx: number) => (
                <button key={idx} onClick={() => handleAnswer(idx)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-start gap-3 ${answers[currentIdx] === idx ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`} data-testid={`exam-option-${idx}`}>
                  <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-sm text-gray-700">{opt}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-30" data-testid="button-exam-prev">{t("allied.alliedMockExams.previous")}</button>
              <button onClick={() => { if (currentIdx < questions.length - 1) setCurrentIdx(i => i + 1); else finishExam(); }} className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-exam-next">
                {currentIdx === questions.length - 1 ? "Submit Exam" : "Next"}
              </button>
            </div>
          </div>
        )}
        {paused && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">{t("allied.alliedMockExams.examPaused")}</h3>
            <p className="text-gray-500 text-sm mt-2">{t("allied.alliedMockExams.clickResumeToContinue")}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mock-exams-page">
      {mockExamSeo}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.alliedMockExams.mockExams2")}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-mock-title">{career.shortName} Mock Exams</h1>
      <p className="text-gray-600 mb-8">{t("allied.alliedMockExams.blueprintweightedPracticeExamsWithAdaptive")}</p>

      {!isPro && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 mb-6" data-testid="free-mock-usage-bar">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {freeMocksUsed >= FREE_MOCK_LIMIT ? "Free mock exam used" : `${freeMocksUsed} of ${FREE_MOCK_LIMIT} free mock used`}
              </span>
            </div>
            <span className="text-xs font-medium text-amber-600">{Math.round((freeMocksUsed / FREE_MOCK_LIMIT) * 100)}%</span>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full transition-all ${freeMocksUsed >= FREE_MOCK_LIMIT ? "bg-red-500" : "bg-teal-500"}`}
              style={{ width: `${Math.min((freeMocksUsed / FREE_MOCK_LIMIT) * 100, 100)}%` }}
            />
          </div>
          {freeMocksUsed >= FREE_MOCK_LIMIT ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-sm text-amber-800 flex-1">{t("allied.alliedMockExams.youveUsedYourFreeMock")}</p>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 whitespace-nowrap" data-testid="button-upgrade-mock-cap">
                <Lock className="w-4 h-4" /> Unlock All Mock Exams
              </Link>
            </div>
          ) : (
            <p className="text-xs text-amber-700">You have {FREE_MOCK_LIMIT - freeMocksUsed} free mini mock exam available</p>
          )}
        </div>
      )}

      {!isPro && freeMocksUsed >= FREE_MOCK_LIMIT && (
        <div className="bg-white rounded-2xl border-2 border-teal-200 p-8 sm:p-12 text-center mb-6" data-testid="free-mock-cap-block">
          <Lock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allied.alliedMockExams.freeMockExamUsed")}</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            Upgrade to Pro for unlimited mock exams including Standard (75 Qs) and Comprehensive (150 Qs) with adaptive CAT-style difficulty.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200" data-testid="button-upgrade-mock-full">
              <Zap className="w-4 h-4" /> Upgrade to Pro — $29/mo
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-100" data-testid="button-upgrade-mock-annual">
              Or $239/year (Save 31%)
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EXAM_TYPES.filter(exam => exam.careers === null || exam.careers.includes(career.id)).map(exam => (
          <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all" data-testid={`exam-card-${exam.id}`}>
            <FileText className="w-8 h-8 text-teal-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{exam.desc}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-5">
              <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> {exam.questions} Qs</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.time} min</span>
            </div>
            {exam.free && !isPro && freeMocksUsed >= FREE_MOCK_LIMIT ? (
              <Link href="/allied-health/pricing" className="w-full px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-amber-200" data-testid={`button-used-${exam.id}`}>
                <Lock className="w-4 h-4" /> Free Mock Used — Upgrade
              </Link>
            ) : exam.free || isPro ? (
              <button onClick={() => startExam(exam.id)} className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2" data-testid={`button-start-${exam.id}`}>
                <Play className="w-4 h-4" /> Start Exam
              </button>
            ) : (
              <Link href="/allied-health/pricing" className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2" data-testid={`button-locked-${exam.id}`}>
                <Lock className="w-4 h-4" /> Upgrade to PRO
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
