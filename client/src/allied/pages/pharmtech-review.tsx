import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { CheckCircle2, XCircle, ChevronRight, BookOpen, Clock, BarChart3, AlertTriangle, ArrowLeft } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
export default function PharmtechReviewPage() {
  const { t } = useI18n();
  const { attemptId } = useParams<{ attemptId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    fetch(`/api/pharmtech/exam-attempts/${attemptId}/review`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to load review");
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="review-error">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.pharmtechReview.reviewUnavailable")}</h1>
        <p className="text-gray-500 mb-6">{error || "This exam review could not be loaded."}</p>
        <Link href="/allied-health/pharmacy-technician/exams" className="text-green-600 font-medium hover:underline">{t("allied.pharmtechReview.backToExams")}</Link>
      </div>
    );
  }

  const { attempt, exam, questions, lessonMap } = data;
  const answers: Record<number, number> = attempt.answers || {};
  const score = attempt.score || 0;
  const totalQuestions = questions.length;
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percent >= (exam.passingScore || 70);

  const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q: any, i: number) => {
    if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = { correct: 0, total: 0 };
    categoryBreakdown[q.category].total++;
    if (answers[i] === q.correctIndex) categoryBreakdown[q.category].correct++;
  });

  const WEAK_THRESHOLD = 70;
  const getPercent = (d: { correct: number; total: number }) => Math.round((d.correct / d.total) * 100);
  const weakCategories = Object.entries(categoryBreakdown)
    .filter(([, d]) => getPercent(d) < WEAK_THRESHOLD)
    .map(([cat]) => cat);

  const recommendedLessons: { slug: string; title: string; category: string }[] = [];
  const seenSlugs = new Set<string>();
  questions.forEach((q: any, i: number) => {
    if (answers[i] !== q.correctIndex && q.lessonSlug && lessonMap[q.lessonSlug] && !seenSlugs.has(q.lessonSlug)) {
      seenSlugs.add(q.lessonSlug);
      recommendedLessons.push({ slug: q.lessonSlug, ...lessonMap[q.lessonSlug] });
    }
  });

  const timeStr = attempt.timeSpentSeconds
    ? `${Math.floor(attempt.timeSpentSeconds / 60)}m ${attempt.timeSpentSeconds % 60}s`
    : null;

  return (
    <>
      <AlliedSEO
        title={`${exam.title} - Exam Review`}
        description={t("allied.pharmtechReview.reviewYourPharmacyTechnicianExam")}
        canonicalPath={`/allied-health/pharmacy-technician/review/${attemptId}`}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-review-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechReview.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/allied-health/pharmacy-technician/exams" className="hover:text-teal-600">{t("allied.pharmtechReview.practiceExams")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechReview.review")}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-review-title">{exam.title} — Review</h1>
          <Link href="/allied-health/pharmacy-technician/exams" className="flex items-center gap-1 text-sm text-green-600 font-medium hover:underline" data-testid="link-back-exams">
            <ArrowLeft className="w-4 h-4" /> Back to Exams
          </Link>
        </div>

        <div className={`rounded-2xl p-6 mb-8 ${passed ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`} data-testid="review-score-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className={`text-4xl font-bold ${passed ? "text-green-700" : "text-red-700"}`} data-testid="text-review-score">{percent}%</div>
              <div className={`text-sm font-medium ${passed ? "text-green-600" : "text-red-600"}`}>{passed ? "PASSED" : "NEEDS IMPROVEMENT"}</div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span>{score}/{totalQuestions} correct</span>
              </div>
              {timeStr && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{timeStr}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span>Mode: {attempt.mode}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Pass mark: {exam.passingScore}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.pharmtechReview.categoryBreakdown")}</h2>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown).map(([cat, d]) => {
                const catPercent = Math.round((d.correct / d.total) * 100);
                return (
                  <div key={cat} className="bg-white rounded-xl border border-gray-100 p-3" data-testid={`review-category-${cat}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-900">{cat}</span>
                      <span className={`text-sm font-medium ${catPercent >= 70 ? "text-green-600" : "text-red-600"}`}>{catPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${catPercent >= 70 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${catPercent}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{d.correct}/{d.total} correct</div>
                  </div>
                );
              })}
            </div>
          </div>

          {recommendedLessons.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.pharmtechReview.recommendedStudy")}</h2>
              <div className="space-y-2">
                {recommendedLessons.map(lesson => (
                  <Link
                    key={lesson.slug}
                    href={`/allied-health/pharmacy-technician/lessons/${lesson.slug}`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-green-200 hover:shadow-sm transition-all"
                    data-testid={`link-recommended-${lesson.slug}`}
                  >
                    <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{lesson.title}</div>
                      <div className="text-xs text-gray-400">{lesson.category}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.pharmtechReview.questionbyquestionReview")}</h2>
        <div className="space-y-5">
          {questions.map((q: any, i: number) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={i} className={`bg-white rounded-2xl border-2 p-5 sm:p-6 ${isCorrect ? "border-green-200" : "border-red-200"}`} data-testid={`review-question-${i}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-gray-500">Q{i + 1}</span>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{q.category}</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Difficulty {q.difficulty}</span>
                </div>

                <p className="text-gray-900 font-medium mb-4 leading-relaxed" data-testid={`text-question-stem-${i}`}>{q.stem}</p>

                <div className="space-y-2 mb-4">
                  {(q.options || []).map((opt: string, j: number) => {
                    let classes = "bg-gray-50 text-gray-600";
                    if (j === q.correctIndex) classes = "bg-green-50 border border-green-200 text-green-800";
                    else if (j === userAnswer && !isCorrect) classes = "bg-red-50 border border-red-200 text-red-800";
                    return (
                      <div key={j} className={`px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${classes}`} data-testid={`review-option-${i}-${j}`}>
                        <span className="font-bold">{String.fromCharCode(65 + j)})</span>
                        <span>{opt}</span>
                        {j === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                        {j === userAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">{t("allied.pharmtechReview.rationale")}</h4>
                  <p className="text-sm text-blue-900 leading-relaxed">{q.rationale}</p>
                </div>

                {!isCorrect && q.lessonSlug && lessonMap[q.lessonSlug] && (
                  <Link
                    href={`/allied-health/pharmacy-technician/lessons/${q.lessonSlug}`}
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-green-600 font-medium hover:underline"
                    data-testid={`link-lesson-review-${q.lessonSlug}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Study: {lessonMap[q.lessonSlug].title} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/allied-health/pharmacy-technician/exams" className="flex-1 text-center px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-back-to-exams">
            Back to Exams
          </Link>
          <Link href="/allied-health/pharmacy-technician/practice-questions" className="flex-1 text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-practice-more">
            Practice Questions
          </Link>
        </div>
      </div>
    </>
  );
}