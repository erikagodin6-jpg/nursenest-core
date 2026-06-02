import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, ChevronDown, ChevronUp, ArrowRight, Tag, AlertCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
export default function ApplyNestInterviewPrep() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/applynest/interview-questions"],
    queryFn: async () => {
      const res = await fetch("/api/applynest/interview-questions");
      return res.json();
    },
  });

  const allCategories = Array.from(new Set((questions || []).map((q: any) => q.category)));
  const categories = [{ key: "all", label: "All Questions" }, ...allCategories.map((c: string) => ({ key: c, label: c }))];

  const filtered = activeCategory === "all"
    ? (questions || [])
    : (questions || []).filter((q: any) => q.category === activeCategory);

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 dark:from-rose-800 dark:to-rose-900 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Link href="/applynest" className="inline-flex items-center gap-1 text-rose-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to ApplyNest
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" data-testid="text-interview-title">
            Healthcare Interview Prep
          </h1>
          <p className="text-rose-100 text-lg max-w-3xl" data-testid="text-interview-subtitle">
            Common healthcare interview questions with sample answers, expert tips, and behavioral question strategies for all healthcare professions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-8" data-testid="section-interview-tips">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t("pages.applynestInterviewPrep.interviewPreparationTips")}</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                <li>Use the <strong>{t("pages.applynestInterviewPrep.starMethod")}</strong> {t("pages.applynestInterviewPrep.situationTaskActionResultFor")}</li>
                <li>{t("pages.applynestInterviewPrep.researchTheFacilityAndUnit")}</li>
                <li>{t("pages.applynestInterviewPrep.prepare34ThoughtfulQuestionsTo")}</li>
                <li>{t("pages.applynestInterviewPrep.practiceYourAnswersOutLoud")}</li>
                <li>{t("pages.applynestInterviewPrep.dressProfessionallyAndArrive1015")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8" data-testid="filter-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              data-testid={`button-category-${cat.key}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" data-testid="text-question-count">
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{t("pages.applynestInterviewPrep.loadingInterviewQuestions")}</div>
        ) : (
          <div className="space-y-4" data-testid="list-questions">
            {filtered.map((q: any) => {
              const isExpanded = expandedId === q.id;
              return (
                <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden" data-testid={`card-question-${q.id}`}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    data-testid={`button-expand-${q.id}`}
                  >
                    <MessageSquare className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">{q.question}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[q.difficulty] || difficultyColors.medium}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {q.category}
                        </span>
                        {q.profession && (
                          <span className="text-xs text-teal-600 dark:text-teal-400">{q.profession}</span>
                        )}
                        <span className="text-xs text-gray-400">{q.questionType}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t("pages.applynestInterviewPrep.sampleAnswer")}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" data-testid={`text-answer-${q.id}`}>
                          {q.sampleAnswer}
                        </p>
                      </div>
                      {q.tips && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-700 dark:text-blue-300" data-testid={`text-tips-${q.id}`}>
                            <strong>{t("pages.applynestInterviewPrep.tip")}</strong> {q.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.applynestInterviewPrep.relatedResources")}</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/applynest/resume-templates" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-resume-from-interview">
              Resume Templates <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest/job-search-guide" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-job-search-from-interview">
              Job Search Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline">
              Career Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
