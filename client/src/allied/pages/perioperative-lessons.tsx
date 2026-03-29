import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { BookOpen, ChevronRight, Search, ArrowLeft, AlertTriangle, Lightbulb, CheckCircle, XCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface PerioperativeLessonSummary {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  orderIndex: number;
  status: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

interface PerioperativeLessonDetail {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  content: string;
  orderIndex: number;
  clinicalReasoning: string | null;
  commonMistakes: string[] | null;
  examTrapWarning: string | null;
  checkpointQuestions: QuizQuestion[] | null;
  status: string;
}

const MODULE_LABELS: Record<string, string> = {
  "perioperative-preoperative-patient-assessment": "Preoperative Patient Assessment",
  "perioperative-intraoperative-care": "Intraoperative Care",
  "perioperative-postoperative-care": "Postoperative Patient Care",
  "perioperative-sterilization-disinfection": "Sterilization & Disinfection",
  "perioperative-equipment-supplies": "Equipment & Supplies",
  "perioperative-emergency-situations": "Emergency Situations",
  "perioperative-infection-prevention": "Infection Prevention",
  "perioperative-patient-safety": "Patient & Staff Safety",
  "perioperative-professional-accountability": "Professional Accountability",
  "perioperative-management-personnel": "Management of Personnel",
};

function LessonDetail({ slug }: { slug: string }) {
  const { t } = useI18n();
  const [lesson, setLesson] = useState<PerioperativeLessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`/api/perioperative/lessons/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setLesson(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-lesson-not-found">{t("allied.perioperativeLessons.lessonNotFound")}</h1>
        <Link href="/perioperative/lessons" className="text-teal-600 hover:underline" data-testid="link-back-lessons">{t("allied.perioperativeLessons.backToLessons")}</Link>
      </div>
    );
  }

  const domainLabel = MODULE_LABELS[lesson.moduleId] || lesson.moduleId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/perioperative" className="hover:text-teal-600" data-testid="link-breadcrumb-home">{t("allied.perioperativeLessons.perioperative")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/perioperative/lessons" className="hover:text-teal-600" data-testid="link-breadcrumb-lessons">{t("allied.perioperativeLessons.lessons")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium truncate max-w-[200px]">{lesson.title}</span>
      </div>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium mb-3" data-testid="text-lesson-domain">{domainLabel}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-lesson-title">{lesson.title}</h1>
      </div>

      <div className="prose prose-gray max-w-none mb-8" data-testid="text-lesson-content">
        {lesson.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{line.replace("## ", "")}</h2>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-gray-800 mt-4">{line.replace(/\*\*/g, "")}</p>;
          if (line.startsWith("- **")) {
            const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
            if (match) return <div key={i} className="flex items-start gap-2 ml-4 my-1"><span className="text-teal-500 mt-1">&#8226;</span><span className="text-sm"><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</span></div>;
          }
          if (line.startsWith("- ")) return <div key={i} className="flex items-start gap-2 ml-4 my-1"><span className="text-teal-500 mt-1">&#8226;</span><span className="text-sm text-gray-700">{line.replace("- ", "")}</span></div>;
          if (line.match(/^\d+\.\s/)) return <p key={i} className="ml-4 my-1 text-sm text-gray-700">{line}</p>;
          if (line.trim() === "") return <div key={i} className="h-2" />;
          return <p key={i} className="text-sm text-gray-700 my-1">{line}</p>;
        })}
      </div>

      {lesson.clinicalReasoning && (
        <div className="bg-teal-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t("allied.perioperativeLessons.clinicalReasoning")}</h2>
          </div>
          <p className="text-sm text-gray-700" data-testid="text-clinical-reasoning">{lesson.clinicalReasoning}</p>
        </div>
      )}

      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t("allied.perioperativeLessons.commonMistakes")}</h2>
          </div>
          <ul className="space-y-2">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span data-testid={`text-mistake-${i}`}>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.examTrapWarning && (
        <div className="bg-red-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t("allied.perioperativeLessons.examTrapWarning")}</h2>
          </div>
          <p className="text-sm text-gray-700" data-testid="text-exam-trap">{lesson.examTrapWarning}</p>
        </div>
      )}

      {lesson.checkpointQuestions && lesson.checkpointQuestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.perioperativeLessons.checkpointQuiz")}</h2>
          {lesson.checkpointQuestions.map((q, qi) => (
            <div key={qi} className="mb-6 last:mb-0" data-testid={`quiz-question-${qi}`}>
              <p className="font-medium text-gray-900 mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2 mb-3">
                {q.options.map((opt, oi) => {
                  const selected = quizAnswers[qi] === oi;
                  const revealed = quizRevealed[qi];
                  const isCorrect = oi === q.correctIndex;
                  let className = "p-3 rounded-lg text-sm cursor-pointer border transition-colors ";
                  if (revealed && isCorrect) className += "bg-green-50 border-green-300 text-green-800";
                  else if (revealed && selected && !isCorrect) className += "bg-red-50 border-red-300 text-red-800";
                  else if (selected) className += "bg-teal-50 border-teal-300 text-teal-800";
                  else className += "bg-gray-50 border-gray-200 hover:bg-gray-100";

                  return (
                    <div
                      key={oi}
                      className={className}
                      onClick={() => { if (!revealed) setQuizAnswers(prev => ({ ...prev, [qi]: oi })); }}
                      data-testid={`quiz-option-${qi}-${oi}`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                      {revealed && isCorrect && <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />}
                      {revealed && selected && !isCorrect && <XCircle className="w-4 h-4 inline ml-2 text-red-600" />}
                    </div>
                  );
                })}
              </div>
              {quizAnswers[qi] !== undefined && !quizRevealed[qi] && (
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                  onClick={() => setQuizRevealed(prev => ({ ...prev, [qi]: true }))}
                  data-testid={`button-check-${qi}`}
                >
                  Check Answer
                </button>
              )}
              {quizRevealed[qi] && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-700" data-testid={`text-rationale-${qi}`}>
                  <strong>{t("allied.perioperativeLessons.rationale")}</strong> {q.rationale}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/perioperative/lessons" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700" data-testid="link-back-to-lessons">
          <ArrowLeft className="w-4 h-4" />
          Back to All Lessons
        </Link>
      </div>
    </div>
  );
}

function LessonsList() {
  const [lessons, setLessons] = useState<PerioperativeLessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  useEffect(() => {
    fetch("/api/perioperative/lessons")
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(data => { setLessons(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const modules = [...new Set(lessons.map(l => l.moduleId))];
  const filtered = lessons.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchModule = !selectedModule || l.moduleId === selectedModule;
    return matchSearch && matchModule;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/perioperative" className="hover:text-teal-600" data-testid="link-breadcrumb-home">{t("allied.perioperativeLessons.perioperative2")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.perioperativeLessons.lessons2")}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-page-title">{t("allied.perioperativeLessons.perioperativeNursingLessons")}</h1>
        <p className="text-gray-600">{t("allied.perioperativeLessons.comprehensiveLessonsCoveringAll10")}</p>
        <p className="text-sm text-gray-500 mt-1">{lessons.length} lessons available</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("allied.perioperativeLessons.searchLessons")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            data-testid="input-search"
          />
        </div>
        <select
          value={selectedModule}
          onChange={e => setSelectedModule(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
          data-testid="select-domain"
        >
          <option value="">{t("allied.perioperativeLessons.allDomains")}</option>
          {modules.map(m => (
            <option key={m} value={m}>{MODULE_LABELS[m] || m}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>{t("allied.perioperativeLessons.noLessonsFoundMatchingYour")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/perioperative/lessons/${lesson.slug}`}
              className="block p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
              data-testid={`link-lesson-${lesson.slug}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">{MODULE_LABELS[lesson.moduleId] || lesson.moduleId}</span>
                    <span className="text-xs text-gray-400">#{i + 1}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 truncate" data-testid={`text-lesson-title-${lesson.slug}`}>{lesson.title}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PerioperativeLessonsPage() {
  const params = useParams();
  const slug = params?.slug;

  if (slug) {
    return <LessonDetail slug={slug} />;
  }

  return <LessonsList />;
}
