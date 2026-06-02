import { useState, useMemo, useEffect, useCallback } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  FileText, ArrowLeft, Clock, Play, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Flag, BarChart3, AlertTriangle
} from "lucide-react";

const EXAM_MAP: Record<string, { exam: string }> = {
  canada: { exam: "CAMRT" },
  usa: { exam: "ARRT" },
};

const CATEGORIES = [
  "Radiographic Positioning",
  "Radiation Physics",
  "Radiation Safety",
  "Image Production",
  "Patient Care",
  "Equipment Operation",
];

export default function ImagingPracticeExamPage() {
  const { t } = useI18n();
  const [, params] = useRoute("/medical-imaging/:country/practice-exams");
  const country = params?.country || "canada";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const { user } = useAuth();

  const [phase, setPhase] = useState<"setup" | "exam" | "review">("setup");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(CATEGORIES));
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "1" | "2" | "3">("all");
  const [questionCount, setQuestionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/questions", country, "published"],
    queryFn: () => fetch(`/api/imaging/questions?country=${country}&status=published`).then(r => r.json()),
  });

  const matchingCount = useMemo(() => {
    return allQuestions.filter((q: any) => {
      const catMatch = selectedCategories.has(q.category || q.topic);
      const diffMatch = selectedDifficulty === "all" || String(q.difficulty) === selectedDifficulty;
      return catMatch && diffMatch;
    }).length;
  }, [allQuestions, selectedCategories, selectedDifficulty]);

  const canStart = matchingCount > 0 && !!user;

  const toggleCategory = (t: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  useEffect(() => {
    if (phase !== "exam" || timeRemaining <= 0) return;
    const t = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setPhase("review");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, timeRemaining]);

  const startExam = useCallback(() => {
    const pool = allQuestions.filter((q: any) => {
      const catMatch = selectedCategories.has(q.category || q.topic);
      const diffMatch = selectedDifficulty === "all" || String(q.difficulty) === selectedDifficulty;
      return catMatch && diffMatch;
    });
    const shuffled = fisherYatesShuffle([...pool]);
    const selected = shuffled.slice(0, Math.min(questionCount, pool.length));
    setExamQuestions(selected);
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeRemaining(timeLimit * 60);
    setPhase("exam");
  }, [allQuestions, selectedCategories, selectedDifficulty, questionCount, timeLimit]);

  const getOptions = (q: any) => [
    { label: "A", text: q.optionA },
    { label: "B", text: q.optionB },
    { label: "C", text: q.optionC },
    { label: "D", text: q.optionD },
  ];

  if (phase === "review") {
    const results = examQuestions.map((q, i) => ({
      question: q,
      userAnswer: answers[i] || null,
      isCorrect: answers[i] === q.correctAnswer,
    }));
    const correct = results.filter(r => r.isCorrect).length;
    const score = Math.round((correct / examQuestions.length) * 100);

    const catBreakdown: Record<string, { correct: number; total: number }> = {};
    results.forEach(r => {
      const cat = r.question.category || r.question.topic || "Other";
      if (!catBreakdown[cat]) catBreakdown[cat] = { correct: 0, total: 0 };
      catBreakdown[cat].total++;
      if (r.isCorrect) catBreakdown[cat].correct++;
    });

    return (
      <div data-testid="imaging-practice-exam-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BreadcrumbNav items={[
            { name: "Home", url: "https://www.nursenest.ca/" },
            { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
            { name: country === "canada" ? "Canada" : "USA", url: `https://www.nursenest.ca/medical-imaging/${country}` },
            { name: "Practice Exams", url: `https://www.nursenest.ca/medical-imaging/${country}/practice-exams` },
          ]} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="exam-review">
          <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
          </Link>

          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${score >= 70 ? "bg-green-100" : "bg-red-100"}`}>
              <span className={`text-2xl font-bold ${score >= 70 ? "text-green-700" : "text-red-700"}`}>{score}%</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-score">{t("pages.imagingPracticeExam.examComplete")}</h2>
            <p className="text-gray-500">{correct} of {examQuestions.length} correct</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Category Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(catBreakdown).map(([cat, data]) => {
                const pct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={cat} data-testid={`breakdown-${cat}`}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat}</span>
                      <span className="text-gray-500">{data.correct}/{data.total} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 70 ? "bg-green-500" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t("pages.imagingPracticeExam.questionReview")}</h3>
            {results.map((r, i) => {
              const options = getOptions(r.question);
              const userLabel = r.userAnswer || "-";
              const correctLabel = r.question.correctAnswer;
              return (
                <div key={i} className={`bg-white border rounded-xl p-4 ${r.isCorrect ? "border-green-200" : "border-red-200"}`} data-testid={`review-question-${i}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {r.isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm text-gray-900">{r.question.question}</p>
                  </div>
                  {!r.isCorrect && (
                    <div className="ml-7 text-xs">
                      <p className="text-red-600">Your answer: {userLabel}. {options.find(o => o.label === userLabel)?.text}</p>
                      <p className="text-green-700">Correct: {correctLabel}. {options.find(o => o.label === correctLabel)?.text}</p>
                    </div>
                  )}
                  {r.question.rationale && (
                    <p className="ml-7 text-xs text-gray-500 mt-1 italic">{r.question.rationale}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => setPhase("setup")} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700" data-testid="button-retake">
              Start New Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "exam") {
    const q = examQuestions[currentQ];
    const options = q ? getOptions(q) : [];
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;

    return (
      <div data-testid="imaging-practice-exam-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="exam-in-progress">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              Question {currentQ + 1} of {examQuestions.length}
            </div>
            <div className={`flex items-center gap-1 text-sm font-mono ${timeRemaining < 300 ? "text-red-600" : "text-gray-600"}`}>
              <Clock className="w-4 h-4" />
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / examQuestions.length) * 100}%` }} />
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{q?.category || q?.topic}</span>
              <button
                onClick={() => setFlagged(prev => { const n = new Set(prev); if (n.has(currentQ)) n.delete(currentQ); else n.add(currentQ); return n; })}
                className={`p-1.5 rounded ${flagged.has(currentQ) ? "text-amber-600 bg-amber-50" : "text-gray-400 hover:text-amber-500"}`}
                data-testid="button-flag"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-900 mb-6" data-testid="text-question-stem">{q?.question}</p>

            <div className="space-y-2">
              {options.map((opt, i) => {
                const isSelected = answers[currentQ] === opt.label;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: opt.label }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                      isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-gray-200 hover:border-indigo-200 text-gray-700"
                    }`}
                    data-testid={`option-${i}`}
                  >
                    <span className="font-medium mr-2">{opt.label}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
              disabled={currentQ === 0}
              className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              data-testid="button-prev-question"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {currentQ < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(prev => prev + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                data-testid="button-next-question"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setPhase("review")}
                className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700"
                data-testid="button-submit-exam"
              >
                Submit Exam
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {examQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${
                  i === currentQ ? "bg-indigo-600 text-white" :
                  answers[i] ? "bg-green-100 text-green-700" :
                  flagged.has(i) ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-500"
                }`}
                data-testid={`nav-question-${i}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="imaging-practice-exam-page">
      <SEO
        title={`${examInfo.exam} Practice Exams | NurseNest`}
        description={`Timed practice exams for ${examInfo.exam} radiography certification.`}
        canonicalPath={`/medical-imaging/${country}/practice-exams`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: country === "canada" ? "Canada" : "USA", url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Practice Exams", url: `https://www.nursenest.ca/medical-imaging/${country}/practice-exams` },
        ]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="exam-setup">
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-practice-title">
              {examInfo.exam} Practice Exam
            </h1>
            <p className="text-sm text-gray-500">{t("pages.imagingPracticeExam.configureYourPracticeExam")}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t("pages.imagingPracticeExam.categories")}</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(t => (
              <button
                key={t}
                onClick={() => toggleCategory(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategories.has(t) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                data-testid={`topic-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t("pages.imagingPracticeExam.difficulty")}</h3>
          <div className="flex flex-wrap gap-2">
            {([["all", "All Levels"], ["1", "Easy"], ["2", "Medium"], ["3", "Hard"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSelectedDifficulty(val)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === val ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                data-testid={`difficulty-${val}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{t("pages.imagingPracticeExam.questions")}</h3>
            <select
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              data-testid="select-question-count"
            >
              <option value={25}>{t("pages.imagingPracticeExam.25Questions")}</option>
              <option value={50}>{t("pages.imagingPracticeExam.50Questions")}</option>
              <option value={75}>{t("pages.imagingPracticeExam.75Questions")}</option>
              <option value={100}>{t("pages.imagingPracticeExam.100Questions")}</option>
            </select>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{t("pages.imagingPracticeExam.timeLimit")}</h3>
            <select
              value={timeLimit}
              onChange={e => setTimeLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              data-testid="select-time-limit"
            >
              <option value={30}>{t("pages.imagingPracticeExam.30Minutes")}</option>
              <option value={60}>{t("pages.imagingPracticeExam.60Minutes")}</option>
              <option value={90}>{t("pages.imagingPracticeExam.90Minutes")}</option>
              <option value={120}>{t("pages.imagingPracticeExam.120Minutes")}</option>
            </select>
          </div>
        </div>

        <div className={`rounded-xl p-4 mb-6 ${matchingCount === 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
          <div className="flex items-center gap-2">
            {matchingCount === 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700" data-testid="text-no-questions">{t("pages.imagingPracticeExam.noQuestionsMatchYourCurrent")}</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700" data-testid="text-question-pool">{matchingCount} questions available</p>
              </>
            )}
          </div>
        </div>

        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-700">
              <Link href="/login" className="underline font-medium">{t("pages.imagingPracticeExam.signIn")}</Link> to start a practice exam and track your progress.
            </p>
          </div>
        )}

        <button
          onClick={startExam}
          disabled={!canStart}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          data-testid="button-start-exam"
        >
          <Play className="w-4 h-4" /> Start Practice Exam
        </button>
      </div>
    </div>
  );
}
