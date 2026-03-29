import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useLocation } from "wouter";
import { FileText, ChevronRight, ArrowRight, Clock, Flag, CheckCircle2, XCircle, ChevronLeft, AlertTriangle, BarChart3, BookOpen } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
function ExamList() {
  const { t } = useI18n();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pharmtech/exams").then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then(data => { setExams(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechExams.pharmacyTechnicianPracticeExamsTimed")}
        description={t("allied.pharmtechExams.takeTimedPharmacyTechnicianPractice")}
        canonicalPath="/allied-health/pharmacy-technician/exams"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-exams-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechExams.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechExams.practiceExams")}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-exams-title">{t("allied.pharmtechExams.practiceExams2")}</h1>
        <p className="text-gray-500 text-sm mb-8">{t("allied.pharmtechExams.fulllengthPracticeExamsWithTimed")}</p>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all" data-testid={`card-exam-${exam.slug}`}>
                <FileText className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{exam.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.timeLimitMinutes} min</span>
                  <span>{(exam.questionIds || []).length} questions</span>
                  <span>Pass: {exam.passingScore}%</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/allied-health/pharmacy-technician/exams/${exam.slug}?mode=timed`} className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors" data-testid={`button-start-timed-${exam.slug}`}>
                    Timed Mode
                  </Link>
                  <Link href={`/allied-health/pharmacy-technician/exams/${exam.slug}?mode=tutor`} className="flex-1 text-center px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors" data-testid={`button-start-tutor-${exam.slug}`}>
                    Tutor Mode
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ExamTaker() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const searchString = window.location.search;
  const mode = new URLSearchParams(searchString).get("mode") || "timed";

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<"loading" | "taking" | "submitted" | "review">("loading");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pharmtech/exams/${slug}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then(data => {
      setExam(data);
      setQuestions(data.questions || []);
      setTimeLeft((data.timeLimitMinutes || 60) * 60);
      setStatus("taking");
      fetch("/api/pharmtech/exam-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: data.id, mode, totalQuestions: (data.questions || []).length }),
      }).then(r => r.json()).then(a => setAttemptId(a.id)).catch(() => {});
    }).catch(() => { setStatus("error"); });
  }, [slug]);

  useEffect(() => {
    if (status !== "taking" || mode !== "timed") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, mode]);

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correctIndex) score++; });
    setStatus("submitted");
    if (attemptId) {
      fetch(`/api/pharmtech/exam-attempts/${attemptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, flagged: Array.from(flagged), score, status: "completed", timeSpentSeconds: exam ? (exam.timeLimitMinutes * 60) - timeLeft : 0 }),
      }).catch(() => {});
    }
  }, [answers, questions, attemptId, timeLeft, exam, flagged]);

  if (status === "loading") return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!exam) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.pharmtechExams.examNotFound")}</h1></div>;

  const currentQ = questions[currentIndex];
  const totalAnswered = Object.keys(answers).length;
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const percent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percent >= (exam.passingScore || 70);

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.pharmtechExams.examNotFound2")}</h1>
        <p className="text-gray-500 mb-6">{t("allied.pharmtechExams.thisExamCouldNotBe")}</p>
        <Link href="/allied-health/pharmacy-technician/exams" className="text-green-600 font-medium hover:underline">{t("allied.pharmtechExams.backToExams")}</Link>
      </div>
    );
  }

  if (status === "submitted") {
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = { correct: 0, total: 0 };
      categoryBreakdown[q.category].total++;
      if (answers[i] === q.correctIndex) categoryBreakdown[q.category].correct++;
    });

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="exam-results">
        <AlliedSEO title={`${exam.title} Results`} description={t("allied.pharmtechExams.yourExamResults")} canonicalPath={`/allied-health/pharmacy-technician/exams/${slug}`} />
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("allied.pharmtechExams.examResults")}</h1>
        <div className={`rounded-2xl p-8 text-center mb-8 ${passed ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className={`text-5xl font-bold mb-2 ${passed ? "text-green-700" : "text-red-700"}`} data-testid="text-score">{percent}%</div>
          <div className={`text-lg font-medium ${passed ? "text-green-600" : "text-red-600"}`}>{passed ? "PASSED" : "NEEDS IMPROVEMENT"}</div>
          <div className="text-sm text-gray-500 mt-2">{score} of {questions.length} correct · Pass mark: {exam.passingScore}%</div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.pharmtechExams.categoryBreakdown")}</h2>
        <div className="space-y-3 mb-8">
          {Object.entries(categoryBreakdown).map(([cat, data]) => {
            const catPercent = Math.round((data.correct / data.total) * 100);
            return (
              <div key={cat} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`category-${cat}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{cat}</span>
                  <span className={`text-sm font-medium ${catPercent >= 70 ? "text-green-600" : "text-red-600"}`}>{catPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${catPercent >= 70 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${catPercent}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{data.correct}/{data.total} correct</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStatus("review")} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-review">
            Review Answers
          </button>
          {attemptId && (
            <Link href={`/allied-health/pharmacy-technician/review/${attemptId}`} className="flex-1 text-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200 hover:bg-blue-100" data-testid="button-full-review">
              Full Review
            </Link>
          )}
          <Link href="/allied-health/pharmacy-technician/exams" className="flex-1 text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-back-exams">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  if (status === "review") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="exam-review">
        <AlliedSEO title={`${exam.title} Review`} description={t("allied.pharmtechExams.reviewYourExamAnswers")} canonicalPath={`/allied-health/pharmacy-technician/exams/${slug}`} />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("allied.pharmtechExams.reviewAnswers")}</h1>
          <button onClick={() => setStatus("submitted")} className="text-sm text-green-600 font-medium hover:underline" data-testid="button-back-results">{t("allied.pharmtechExams.backToResults")}</button>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={i} className={`bg-white rounded-2xl border-2 p-6 ${isCorrect ? "border-green-200" : "border-red-200"}`} data-testid={`review-question-${i}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-500">Q{i + 1}</span>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{q.category}</span>
                </div>
                <p className="text-gray-900 font-medium mb-4">{q.stem}</p>
                <div className="space-y-2 mb-4">
                  {(q.options || []).map((opt: string, j: number) => (
                    <div key={j} className={`px-4 py-2 rounded-xl text-sm ${j === q.correctIndex ? "bg-green-50 border border-green-200 text-green-800" : j === userAnswer && !isCorrect ? "bg-red-50 border border-red-200 text-red-800" : "bg-gray-50 text-gray-600"}`}>
                      {String.fromCharCode(65 + j)}) {opt}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">{t("allied.pharmtechExams.rationale")}</h4>
                  <p className="text-sm text-blue-900">{q.rationale}</p>
                </div>
                {!isCorrect && q.lessonSlug && (
                  <Link href={`/allied-health/pharmacy-technician/lessons/${q.lessonSlug}`} className="inline-flex items-center gap-1 mt-3 text-sm text-green-600 font-medium hover:underline" data-testid={`link-lesson-${q.lessonSlug}`}>
                    <BookOpen className="w-3.5 h-3.5" /> Study this topic →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <AlliedSEO title={`${exam.title} - Taking Exam`} description={t("allied.pharmtechExams.takingPharmacyTechnicianPracticeExam")} canonicalPath={`/allied-health/pharmacy-technician/exams/${slug}`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4" data-testid="exam-taking">
        <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 px-4 py-3 sticky top-16 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-900">{exam.title}</span>
            <span className="text-sm text-gray-500">Q{currentIndex + 1}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-4">
            {mode === "timed" && (
              <span className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 300 ? "text-red-600 font-bold" : "text-gray-600"}`} data-testid="text-timer">
                <Clock className="w-4 h-4" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            )}
            <button onClick={() => setShowNav(!showNav)} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200" data-testid="button-navigator">
              <BarChart3 className="w-3.5 h-3.5 inline mr-1" /> Navigator
            </button>
            <button onClick={() => setShowSubmitModal(true)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700" data-testid="button-submit-exam">
              Submit
            </button>
          </div>
        </div>

        {showNav && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4" data-testid="question-navigator">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigator ({totalAnswered}/{questions.length} answered)</h3>
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setShowNav(false); }}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    i === currentIndex ? "bg-green-600 text-white" :
                    flagged.has(i) ? "bg-amber-100 text-amber-700 border border-amber-300" :
                    answers[i] !== undefined ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  data-testid={`nav-question-${i}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="submit-modal">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechExams.submitExam")}</h3>
              <p className="text-sm text-gray-500 mb-4">
                You've answered {totalAnswered} of {questions.length} questions.
                {totalAnswered < questions.length && <span className="text-amber-600 font-medium"> {questions.length - totalAnswered} unanswered questions will be marked incorrect.</span>}
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowSubmitModal(false); handleSubmit(); }} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-confirm-submit">
                  Submit Exam
                </button>
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-submit">
                  Continue Exam
                </button>
              </div>
            </div>
          </div>
        )}

        {currentQ && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="exam-question-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{currentQ.category}</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">Difficulty {currentQ.difficulty}</span>
              </div>
              <button
                onClick={() => setFlagged(f => { const n = new Set(f); n.has(currentIndex) ? n.delete(currentIndex) : n.add(currentIndex); return n; })}
                className={`p-1.5 rounded-lg transition-colors ${flagged.has(currentIndex) ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-gray-400"}`}
                data-testid="button-flag-question"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-900 font-medium mb-6 leading-relaxed" data-testid="text-exam-stem">{currentQ.stem}</p>

            <div className="space-y-3">
              {(currentQ.options || []).map((opt: string, idx: number) => {
                const isSelected = answers[currentIndex] === idx;
                const isTutorRevealed = mode === "tutor" && revealed.has(currentIndex);
                const isCorrect = idx === currentQ.correctIndex;

                let borderClass = "border-gray-200 hover:border-green-300";
                let bgClass = "bg-white hover:bg-green-50/30";

                if (isTutorRevealed) {
                  if (isCorrect) { borderClass = "border-green-300"; bgClass = "bg-green-50"; }
                  else if (isSelected && !isCorrect) { borderClass = "border-red-300"; bgClass = "bg-red-50"; }
                } else if (isSelected) {
                  borderClass = "border-green-400"; bgClass = "bg-green-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isTutorRevealed) return;
                      setAnswers({ ...answers, [currentIndex]: idx });
                      if (mode === "tutor") setRevealed(r => new Set(r).add(currentIndex));
                    }}
                    disabled={isTutorRevealed}
                    className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-start gap-3`}
                    data-testid={`exam-option-${idx}`}
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-gray-700">{opt}</span>
                    {isTutorRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />}
                    {isTutorRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {mode === "tutor" && revealed.has(currentIndex) && currentQ.rationale && (
              <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100" data-testid="tutor-rationale">
                <h4 className="font-semibold text-blue-800 mb-2">{t("allied.pharmtechExams.rationale2")}</h4>
                <p className="text-sm text-blue-900 leading-relaxed">{currentQ.rationale}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => { setCurrentIndex(i => Math.max(0, i - 1)); }} disabled={currentIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30" data-testid="button-prev-question">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              {currentIndex < questions.length - 1 ? (
                <button onClick={() => setCurrentIndex(i => i + 1)} className="flex items-center gap-1 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-next-question">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-1 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-finish-exam">
                  Finish Exam
                </button>
              )}
            </div>
          </div>
        )}

        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
          <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
    </>
  );
}

export default function PharmtechExamsPage() {
  const params = useParams<{ slug: string }>();
  if (params.slug) return <ExamTaker />;
  return <ExamList />;
}
