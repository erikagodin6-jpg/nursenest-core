import { Link, useParams, useLocation, useSearch } from "wouter";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  CERTIFICATION_EXAM_CONFIGS,
  getCertQuestions,
  PRACTICE_MODES,
  type CertExamQuestion,
} from "@/data/certification-exam-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, ArrowLeft, Award, BookOpen, ChevronRight, ChevronLeft,
  Target, Clock, Lock, Crown, Check, Play, RotateCcw, Trophy,
  ClipboardList, BarChart3, Filter, GitBranch, Shuffle, Timer,
  CheckCircle2, XCircle
} from "lucide-react";

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; btnBg: string; btnHover: string }> = {
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", btnBg: "bg-pink-600", btnHover: "hover:bg-pink-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", btnBg: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", btnBg: "bg-violet-600", btnHover: "hover:bg-violet-700" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100", btnBg: "bg-rose-600", btnHover: "hover:bg-rose-700" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100", btnBg: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100", btnBg: "bg-indigo-600", btnHover: "hover:bg-indigo-700" },
};

type PracticeMode = "topic-practice" | "algorithm-scenarios" | "mixed-practice" | "full-mock-exam";

function isCorrectAnswer(question: CertExamQuestion, selected: number | number[]): boolean {

  const correct = question.correct;
  if (Array.isArray(correct)) {
    const sel = Array.isArray(selected) ? selected : [selected];
    return correct.length === sel.length && correct.every(c => sel.includes(c));
  }
  return (Array.isArray(selected) ? selected[0] : selected) === correct;
}

function isOptionCorrect(question: CertExamQuestion, optionIndex: number): boolean {
  const correct = question.correct;
  return Array.isArray(correct) ? correct.includes(optionIndex) : correct === optionIndex;
}

function isSataQuestion(question: CertExamQuestion): boolean {
  return question.questionType === "sata" && Array.isArray(question.correct);
}

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
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CertificationPractice() {
  const params = useParams<{ slug: string }>();
  const certSlug = params?.slug || "";
  const config = CERTIFICATION_EXAM_CONFIGS[certSlug];
  const { user, effectiveTier } = useAuth();
  const isPremium = user && effectiveTier && effectiveTier !== "free";
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const modeParam = searchParams.get("mode") as PracticeMode | null;

  const [practiceMode, setPracticeMode] = useState<PracticeMode>(modeParam || "mixed-practice");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const [examActive, setExamActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState<CertExamQuestion[]>([]);
  const [examAnswers, setExamAnswers] = useState<Record<number, number | number[]>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const colors = COLOR_MAP[config?.color || "blue"] || COLOR_MAP.blue;

  const questions = useMemo(() => {
    if (!config) return [];
    const opts: Parameters<typeof getCertQuestions>[1] = { limit: 100 };
    if (topicFilter !== "all") opts.topic = topicFilter;
    if (difficultyFilter !== "all") opts.difficulty = parseInt(difficultyFilter) as 1 | 2 | 3 | 4 | 5;

    if (practiceMode === "algorithm-scenarios") {
      opts.questionType = "algorithm-decision";
    }

    let qs = getCertQuestions(certSlug, opts);

    if (!isPremium) {
      qs = qs.filter(q => q.isFree);
    }

    if (practiceMode === "mixed-practice") {
      qs = shuffleArray(qs);
    }

    return qs;
  }, [certSlug, config, topicFilter, difficultyFilter, practiceMode, isPremium]);

  const startMockExam = useCallback((examId?: string) => {
    if (!config || !isPremium) return;
    const mockExam = examId ? config.mockExams.find(e => e.id === examId) : config.mockExams[0];
    if (!mockExam) return;

    const allQs = getCertQuestions(certSlug, { limit: mockExam.questionCount });
    const shuffled = shuffleArray(allQs).slice(0, mockExam.questionCount);
    setExamQuestions(shuffled);
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeRemaining(mockExam.timeMinutes * 60);
    setCurrentIndex(0);
    setExamActive(true);
  }, [config, certSlug]);

  useEffect(() => {
    if (!examActive || examSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [examActive, examSubmitted]);

  const currentQuestion = examActive ? examQuestions[currentIndex] : questions[currentIndex];
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  if (!config) {
    return (
      <div data-testid="page-cert-practice-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.certificationPractice.certificationNotFound")}</h1>
            <Link href="/certification-exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Back to Exam Prep Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (examActive && examSubmitted) {
    const examReport = examQuestions.map((q, i) => ({
      question: q,
      userAnswer: examAnswers[i] ?? -1,
      isCorrect: examAnswers[i] !== undefined ? isCorrectAnswer(q, examAnswers[i]) : false,
    }));
    const score = examReport.filter(r => r.isCorrect).length;
    const pct = Math.round((score / examQuestions.length) * 100);

    const topicScores: Record<string, { correct: number; total: number }> = {};
    examReport.forEach(r => {
      const t = r.question.topic;
      if (!topicScores[t]) topicScores[t] = { correct: 0, total: 0 };
      topicScores[t].total++;
      if (r.isCorrect) topicScores[t].correct++;
    });

    return (
      <div data-testid="page-cert-practice-results">
        <Navigation />
        <SEO title={`${config.name} Mock Exam Results`} description={`${config.name} certification mock exam results and performance breakdown.`} canonicalPath={`/certification-exam-prep/${certSlug}/practice`} />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-results-title">{config.name} Mock Exam Results</h1>
              <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 ${pct >= 70 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                <Trophy className={`h-7 w-7 ${pct >= 70 ? "text-emerald-600" : "text-amber-600"}`} />
                <span className={`text-4xl font-black ${pct >= 70 ? "text-emerald-700" : "text-amber-700"}`} data-testid="text-exam-score">{pct}%</span>
                <span className="text-gray-500 text-sm">({score}/{examQuestions.length})</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" data-testid="card-topic-breakdown">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" /> Performance by Topic
              </h2>
              <div className="space-y-3">
                {Object.entries(topicScores).map(([topic, s]) => {
                  const topicPct = Math.round((s.correct / s.total) * 100);
                  return (
                    <div key={topic} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-700 truncate flex-1">{topic}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${topicPct >= 70 ? "bg-emerald-500" : topicPct >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${topicPct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">{s.correct}/{s.total} ({topicPct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" data-testid="card-question-review">
              <h2 className="font-semibold text-gray-900 mb-4">{t("pages.certificationPractice.questionReview")}</h2>
              <div className="space-y-4">
                {examReport.map((r, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${r.isCorrect ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30"}`} data-testid={`review-item-${i}`}>
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-400">Q{i + 1}.</span>
                      {r.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                      <span className="text-sm text-gray-800">{r.question.question}</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-10 italic">{r.question.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => { setExamActive(false); setExamSubmitted(false); }} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200" data-testid="button-back-to-practice">
                <ArrowLeft className="w-4 h-4" /> Back to Practice
              </button>
              <button onClick={() => startMockExam()} className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors`} data-testid="button-retake-exam">
                <RotateCcw className="w-4 h-4" /> Retake Exam
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (examActive && !examSubmitted) {
    const eq = examQuestions[currentIndex];
    const answeredCount = Object.keys(examAnswers).length;
    const progressPct = (answeredCount / examQuestions.length) * 100;

    return (
      <div data-testid="page-cert-mock-exam">
        <SEO title={`${config.name} Mock Exam`} description={`Timed ${config.name} certification mock exam.`} canonicalPath={`/certification-exam-prep/${certSlug}/practice`} />
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm" data-testid="exam-top-bar">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Q {currentIndex + 1} / {examQuestions.length}</span>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold px-3 py-1 rounded-lg ${timeRemaining < 300 ? "text-red-600 bg-red-50" : "text-gray-700 bg-gray-50"}`} data-testid="text-exam-timer">
                  <Clock className="h-4 w-4" /> {formatTime(timeRemaining)}
                </div>
                <span className="text-xs text-gray-500">{answeredCount}/{examQuestions.length} answered</span>
                <button onClick={() => { clearInterval(timerRef.current); setExamSubmitted(true); }} className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600" data-testid="button-submit-exam">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-3xl mx-auto px-4 py-8">
            {eq && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm" data-testid="card-exam-question">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{eq.topic}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{eq.questionType.toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-800 mb-6 leading-relaxed font-medium" data-testid="text-exam-question">{eq.question}</p>
                <div className="space-y-2 mb-6">
                  {eq.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (isSataQuestion(eq)) {
                          setExamAnswers(prev => {
                            const current = Array.isArray(prev[currentIndex]) ? [...(prev[currentIndex] as number[])] : [];
                            const idx = current.indexOf(i);
                            if (idx >= 0) current.splice(idx, 1); else current.push(i);
                            return { ...prev, [currentIndex]: current };
                          });
                        } else {
                          setExamAnswers(prev => ({ ...prev, [currentIndex]: i }));
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                        (Array.isArray(examAnswers[currentIndex]) ? (examAnswers[currentIndex] as number[]).includes(i) : examAnswers[currentIndex] === i)
                          ? `${colors.bg} ${colors.border} ${colors.iconColor} font-medium` : "border-gray-100 hover:bg-gray-50 text-gray-700"
                      }`}
                      data-testid={`button-exam-option-${i}`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    data-testid="button-exam-prev"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))}
                    disabled={currentIndex === examQuestions.length - 1}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${colors.btnBg} text-white ${colors.btnHover} disabled:opacity-50`}
                    data-testid="button-exam-next"
                  >
                    Next <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid={`page-cert-practice-${certSlug}`}>
      <Navigation />
      <SEO
        title={`${config.name} Practice Questions | Certification Exam Prep | NurseNest`}
        description={`Practice ${config.name} certification questions with ${config.totalQuestions.toLocaleString()}+ questions across ${config.topicBanks.length} topics.`}
        canonicalPath={`/certification-exam-prep/${certSlug}/practice`}
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
          <Link href="/" className="hover:text-emerald-600">{t("pages.certificationPractice.home")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/certification-exam-prep" className="hover:text-emerald-600">{t("pages.certificationPractice.examPrep")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/certification-exam-prep/${certSlug}`} className="hover:text-emerald-600">{config.name}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-700 font-medium">{t("pages.certificationPractice.practice")}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-practice-title">{config.name} Practice</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">{t("pages.certificationPractice.accuracy")}</span>
            <span className={`font-bold ${accuracy >= 70 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-red-500"}`} data-testid="text-accuracy">{accuracy}%</span>
            <span className="text-gray-400">({stats.correct}/{stats.total})</span>
            <button onClick={() => { setStats({ correct: 0, total: 0 }); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }} className="text-gray-400 hover:text-gray-600" data-testid="button-reset-stats">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="panel-mode-select">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" /> Practice Mode
              </h3>
              <div className="space-y-2">
                {PRACTICE_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => { setPracticeMode(mode.id as PracticeMode); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      practiceMode === mode.id ? `${colors.bg} ${colors.iconColor} font-medium` : "hover:bg-gray-50 text-gray-600"
                    }`}
                    data-testid={`button-mode-${mode.id}`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="panel-topic-filter">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t("pages.certificationPractice.topic")}</h3>
              <select
                value={topicFilter}
                onChange={(e) => { setTopicFilter(e.target.value); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                data-testid="select-topic"
              >
                <option value="all">{t("pages.certificationPractice.allTopics")}</option>
                {config.topicBanks.map((bank) => (
                  <option key={bank.slug} value={bank.slug}>{bank.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="panel-difficulty-filter">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t("pages.certificationPractice.difficulty")}</h3>
              <select
                value={difficultyFilter}
                onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentIndex(0); setSelectedAnswer(null); setRevealed(false); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                data-testid="select-difficulty"
              >
                <option value="all">{t("pages.certificationPractice.allLevels")}</option>
                <option value="1">{t("pages.certificationPractice.easy")}</option>
                <option value="3">{t("pages.certificationPractice.moderate")}</option>
                <option value="5">{t("pages.certificationPractice.expert")}</option>
              </select>
            </div>

            {isPremium && practiceMode === "full-mock-exam" && (
              <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="panel-mock-exams">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t("pages.certificationPractice.mockExams")}</h3>
                <div className="space-y-2">
                  {config.mockExams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => startMockExam(exam.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:bg-emerald-50 text-gray-600 border border-gray-100`}
                      data-testid={`button-start-mock-${exam.id}`}
                    >
                      <div className="font-medium text-gray-800">{exam.title}</div>
                      <div className="text-gray-400 mt-0.5">{exam.questionCount}q · {exam.timeMinutes}min</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4 text-center" data-testid="panel-upgrade-cta">
                <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-3">Unlock all {config.totalQuestions.toLocaleString()}+ questions and mock exams</p>
                <Link href="/pricing" className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700" data-testid="button-sidebar-upgrade">
                  <Crown className="w-3 h-3" /> Upgrade
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {questions.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center" data-testid="empty-state">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{t("pages.certificationPractice.noQuestionsAvailable")}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {!isPremium ? "Upgrade to access the full question bank for this certification." : "Try adjusting your filters to see more questions."}
                </p>
                {!isPremium && (
                  <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700" data-testid="button-empty-upgrade">
                    <Crown className="w-4 h-4" /> Upgrade Now
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500" data-testid="text-question-count">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>

                {currentQuestion && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm" data-testid="card-practice-question">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.iconColor}`}>{currentQuestion.topic}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{currentQuestion.questionType.toUpperCase()}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Diff: {currentQuestion.difficulty}/5</span>
                    </div>

                    <p className="text-gray-800 mb-6 leading-relaxed font-medium" data-testid="text-question">{currentQuestion.question}</p>

                    <div className="space-y-2 mb-6">
                      {currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (revealed) return;
                            if (currentQuestion && isSataQuestion(currentQuestion)) {
                              setSelectedAnswer(prev => {
                                const current = Array.isArray(prev) ? [...prev] : [];
                                const idx = current.indexOf(i);
                                if (idx >= 0) current.splice(idx, 1); else current.push(i);
                                return current;
                              });
                            } else {
                              setSelectedAnswer(i);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                            revealed && isOptionCorrect(currentQuestion, i) ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium" :
                            revealed && (Array.isArray(selectedAnswer) ? selectedAnswer.includes(i) : i === selectedAnswer) && !isOptionCorrect(currentQuestion, i) ? "bg-red-50 border-red-200 text-red-700" :
                            (Array.isArray(selectedAnswer) ? selectedAnswer.includes(i) : i === selectedAnswer) ? `${colors.bg} ${colors.border} ${colors.iconColor}` :
                            "border-gray-100 hover:bg-gray-50 text-gray-700"
                          }`}
                          data-testid={`button-option-${i}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                            {revealed && isOptionCorrect(currentQuestion, i) && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
                            {revealed && (Array.isArray(selectedAnswer) ? selectedAnswer.includes(i) : i === selectedAnswer) && !isOptionCorrect(currentQuestion, i) && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {!revealed && selectedAnswer !== null && (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : true) && (
                      <button
                        onClick={() => {
                          setRevealed(true);
                          setStats(prev => ({
                            correct: prev.correct + (currentQuestion && isCorrectAnswer(currentQuestion, selectedAnswer as number | number[]) ? 1 : 0),
                            total: prev.total + 1,
                          }));
                        }}
                        className={`w-full py-3 rounded-lg font-medium ${colors.btnBg} text-white ${colors.btnHover} transition-colors`}
                        data-testid="button-check-answer"
                      >
                        Check Answer
                      </button>
                    )}

                    {revealed && (
                      <>
                        <div className={`p-4 rounded-lg mb-4 ${currentQuestion && selectedAnswer !== null && isCorrectAnswer(currentQuestion, selectedAnswer as number | number[]) ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`} data-testid="text-rationale">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>{currentQuestion && selectedAnswer !== null && isCorrectAnswer(currentQuestion, selectedAnswer as number | number[]) ? "Correct!" : "Incorrect."}</strong> {currentQuestion.rationale}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setSelectedAnswer(null); setRevealed(false); }}
                            disabled={currentIndex === 0}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            data-testid="button-prev"
                          >
                            <ChevronLeft className="w-4 h-4 inline mr-1" /> Previous
                          </button>
                          <button
                            onClick={() => {
                              if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
                              else setCurrentIndex(0);
                              setSelectedAnswer(null);
                              setRevealed(false);
                            }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${colors.btnBg} text-white ${colors.btnHover}`}
                            data-testid="button-next"
                          >
                            Next Question <ChevronRight className="w-4 h-4 inline ml-1" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
