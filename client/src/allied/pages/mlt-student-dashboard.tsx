import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { CAREER_CONFIGS } from "@shared/careers";
import { useRegion } from "@/allied/use-region";
import { AlliedSEO } from "@/allied/allied-seo";
import { useAuth } from "@/lib/auth";
import { mltStudyPlans, type MltStudyPlan } from "@/data/mlt-study-plans";
import { trackMltPageView, trackMltConversionEvent, trackMltUpgradePromptShown, trackMltUpgradeClick } from "@/allied/mlt-analytics";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Target, TrendingUp, Clock, Flame, Calendar, ChevronRight,
  BookOpen, Award, Globe, Shield, FileText, Brain, ArrowRight,
  CheckCircle2, AlertTriangle, RefreshCw, Microscope, FlaskConical,
  BookMarked, XCircle, RotateCcw, Zap, Lock, Play, Eye, Star,
  Layers, GraduationCap, ClipboardList, Activity, Bookmark, ChevronDown
} from "lucide-react";

const MLT_CONFIG = CAREER_CONFIGS.mlt;

const MLT_DISCIPLINES_DISPLAY = [
  { key: "clinical_chemistry", label: "Clinical Chemistry", color: "#3B82F6" },
  { key: "hematology", label: "Hematology", color: "#EF4444" },
  { key: "coagulation", label: "Hemostasis / Coagulation", color: "#F97316" },
  { key: "blood_banking", label: "Immunohematology / Blood Banking", color: "#DC2626" },
  { key: "microbiology", label: "Microbiology", color: "#22C55E" },
  { key: "urinalysis", label: "Urinalysis & Body Fluids", color: "#EAB308" },
  { key: "immunology", label: "Immunology / Serology", color: "#8B5CF6" },
  { key: "molecular", label: "Molecular Diagnostics", color: "#06B6D4" },
  { key: "parasitology", label: "Parasitology", color: "#84CC16" },
  { key: "mycology", label: "Mycology", color: "#10B981" },
  { key: "specimen_processing", label: "Phlebotomy & Specimen Collection", color: "#F43F5E" },
  { key: "lab_operations", label: "Laboratory Operations & QM", color: "#6366F1" },
];

type DashboardTab = "overview" | "canada" | "usa" | "exam" | "flashcards" | "lessons" | "performance" | "wrong-answers" | "study-plan";

const TAB_ROUTES: Record<string, DashboardTab> = {
  "/dashboard/mlt": "overview",
  "/dashboard/mlt/canada": "canada",
  "/dashboard/mlt/usa": "usa",
  "/dashboard/mlt/exam": "exam",
  "/dashboard/mlt/flashcards": "flashcards",
  "/dashboard/mlt/lessons": "lessons",
  "/dashboard/mlt/performance": "performance",
  "/dashboard/mlt/wrong-answers": "wrong-answers",
  "/dashboard/mlt/study-plan": "study-plan",
};

function getTabFromPath(): DashboardTab {

  const path = window.location.pathname;
  for (const [route, tab] of Object.entries(TAB_ROUTES)) {
    if (path === route || path.endsWith(route)) return tab;
  }
  if (path.includes("/dashboard/mlt")) {
    const suffix = path.split("/dashboard/mlt")[1]?.replace(/^\//, "") || "";
    for (const [route, tab] of Object.entries(TAB_ROUTES)) {
      if (route.endsWith(`/${suffix}`) && suffix) return tab;
    }
  }
  return "overview";
}

function getMockDomainData() {
  return MLT_DISCIPLINES_DISPLAY.map((d) => ({
    ...d,
    mastery: Math.round(25 + Math.random() * 65),
    questionsAttempted: Math.round(5 + Math.random() * 60),
    questionsCorrect: Math.round(3 + Math.random() * 40),
    lessonsCompleted: Math.round(Math.random() * 8),
    totalLessons: Math.round(5 + Math.random() * 10),
    flashcardsMastered: Math.round(Math.random() * 30),
    totalFlashcards: Math.round(15 + Math.random() * 35),
  }));
}

function getMockWrongAnswers() {
  return [
    { id: "wa1", discipline: "Hematology", stem: "A peripheral blood smear shows target cells, sickle cells, and Howell-Jolly bodies. Which condition is most consistent with these findings?", selectedAnswer: "B", correctAnswer: "C", tags: ["cell_morphology", "hemoglobinopathy"], reviewed: false, bookmarked: true, createdAt: "2026-03-08" },
    { id: "wa2", discipline: "Clinical Chemistry", stem: "A patient's serum shows elevated total bilirubin with a direct/conjugated fraction >50%. Which condition is most likely?", selectedAnswer: "A", correctAnswer: "D", tags: ["liver_function", "bilirubin"], reviewed: false, bookmarked: false, createdAt: "2026-03-07" },
    { id: "wa3", discipline: "Microbiology", stem: "A Gram stain of CSF shows gram-negative diplococci. What is the most likely organism?", selectedAnswer: "C", correctAnswer: "A", tags: ["gram_stain", "csf_analysis"], reviewed: true, bookmarked: false, createdAt: "2026-03-06" },
    { id: "wa4", discipline: "Blood Banking", stem: "An antibody panel shows reactivity with all cells except those that are Jk(a-). What antibody is most likely present?", selectedAnswer: "B", correctAnswer: "D", tags: ["antibody_panel", "kidd_system"], reviewed: false, bookmarked: true, createdAt: "2026-03-05" },
    { id: "wa5", discipline: "Urinalysis", stem: "Hexagonal crystals found in acidic urine are most likely:", selectedAnswer: "A", correctAnswer: "C", tags: ["crystals", "urine_sediment"], reviewed: false, bookmarked: false, createdAt: "2026-03-04" },
    { id: "wa6", discipline: "Coagulation", stem: "Which factor deficiency would cause prolongation of both PT and aPTT?", selectedAnswer: "B", correctAnswer: "A", tags: ["coagulation_cascade", "factor_deficiency"], reviewed: false, bookmarked: false, createdAt: "2026-03-03" },
  ];
}

function getMockStudyPlan() {
  return {
    title: "8-Week CSMLS MLT Exam Prep",
    currentWeek: 3,
    totalWeeks: 8,
    weeks: [
      { week: 1, topic: "Hematology Fundamentals", tasks: 12, completed: 12, status: "completed" as const },
      { week: 2, topic: "Clinical Chemistry & Urinalysis", tasks: 14, completed: 14, status: "completed" as const },
      { week: 3, topic: "Microbiology & Parasitology", tasks: 15, completed: 7, status: "in_progress" as const },
      { week: 4, topic: "Blood Banking & Immunology", tasks: 13, completed: 0, status: "upcoming" as const },
      { week: 5, topic: "Hemostasis & Molecular Diagnostics", tasks: 11, completed: 0, status: "upcoming" as const },
      { week: 6, topic: "Lab Operations & Quality Management", tasks: 10, completed: 0, status: "upcoming" as const },
      { week: 7, topic: "Full-Length Practice Exams", tasks: 8, completed: 0, status: "upcoming" as const },
      { week: 8, topic: "Weak Area Review & Final Prep", tasks: 12, completed: 0, status: "upcoming" as const },
    ],
    checkpoints: [
      { week: 2, name: "Foundations Check", score: 72, passed: true },
      { week: 4, name: "Midpoint Assessment", score: null, passed: false },
      { week: 6, name: "Advanced Assessment", score: null, passed: false },
      { week: 8, name: "Final Readiness", score: null, passed: false },
    ],
    resources: [
      { type: "lesson", title: "Gram Stain Interpretation", discipline: "Microbiology", link: "/allied-health/mlt/canada/lessons" },
      { type: "flashcard", title: "Coagulation Cascade Cards", discipline: "Coagulation", link: "/allied-health/mlt/canada/flashcards" },
      { type: "practice", title: "Microbiology Practice Quiz", discipline: "Microbiology", link: "/qbank?career=mlt" },
    ],
  };
}

function getMockRecentActivity() {
  return [
    { type: "lesson", title: "Gram Stain Fundamentals", discipline: "Microbiology", time: "2 hours ago", icon: BookOpen },
    { type: "flashcard", title: "Hematology Cell Identification", discipline: "Hematology", time: "5 hours ago", icon: Brain },
    { type: "quiz", title: "Clinical Chemistry Practice", discipline: "Clinical Chemistry", time: "1 day ago", icon: ClipboardList, score: 78 },
    { type: "exam", title: "Mini Mock Exam - Hematology", discipline: "Hematology", time: "2 days ago", icon: FileText, score: 65 },
    { type: "lesson", title: "Blood Group Antigens", discipline: "Blood Banking", time: "3 days ago", icon: BookOpen },
  ];
}

function DomainBadge({ accuracy }: { accuracy: number }) {
  if (accuracy >= 80) return <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700" data-testid="badge-strong">{t("allied.mltStudentDashboard.strong")}</span>;
  if (accuracy >= 70) return <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600" data-testid="badge-on-track">{t("allied.mltStudentDashboard.onTrack")}</span>;
  if (accuracy >= 50) return <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700" data-testid="badge-needs-work">{t("allied.mltStudentDashboard.needsWork")}</span>;
  return <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700" data-testid="badge-critical">{t("allied.mltStudentDashboard.critical")}</span>;
}

function LockedOverlay({ feature, onUpgrade }: { feature: string; onUpgrade: () => void }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10" data-testid={`locked-${feature}`}>
      <Lock className="w-8 h-8 text-gray-400 mb-2" />
      <p className="text-sm font-medium text-gray-700 mb-1">{t("allied.mltStudentDashboard.premiumFeature")}</p>
      <p className="text-xs text-gray-500 mb-3 text-center px-4">Upgrade to access {feature}</p>
      <button
        onClick={onUpgrade}
        className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
        data-testid={`button-upgrade-${feature}`}
      >
        Upgrade Now
      </button>
    </div>
  );
}

function RemediationRecommendationCard({ remediation, questionStem, onTrack }: {
  remediation: { bestLesson?: any; bestDeck?: any; relatedQuestions?: any[]; autoLinkScore?: number; manuallyCurated?: boolean } | null;
  questionStem?: string;
  onTrack?: (contentType: string, contentId: string, action: string) => void;
}) {
  if (!remediation) return null;
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 mt-3" data-testid="remediation-card">
      <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Review This Topic
        {remediation.manuallyCurated && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{t("allied.mltStudentDashboard.curated")}</span>}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {remediation.bestLesson && (
          <button
            onClick={() => onTrack?.("lesson", remediation.bestLesson.id, "review_lesson")}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-amber-100 hover:border-purple-200 transition-colors text-left"
            data-testid="remediation-review-lesson"
          >
            <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{remediation.bestLesson.title}</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.reviewLesson")}</div>
            </div>
          </button>
        )}
        {remediation.bestDeck && (
          <button
            onClick={() => onTrack?.("flashcard", remediation.bestDeck.id, "study_flashcards")}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-amber-100 hover:border-blue-200 transition-colors text-left"
            data-testid="remediation-study-flashcards"
          >
            <Brain className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{remediation.bestDeck.title}</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.studyFlashcards")}</div>
            </div>
          </button>
        )}
        {remediation.relatedQuestions && remediation.relatedQuestions.length > 0 && (
          <button
            onClick={() => onTrack?.("question", "retry", "retry_similar")}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-amber-100 hover:border-green-200 transition-colors text-left"
            data-testid="remediation-retry-similar"
          >
            <RotateCcw className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-800">{t("allied.mltStudentDashboard.retrySimilar")}</div>
              <div className="text-xs text-gray-500">{remediation.relatedQuestions.length} related questions</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

function DashboardRemediationPanels({ isFree }: { isFree: boolean }) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/mlt/remediation/dashboard/recommendations", { credentials: "include" });
        if (res.ok) {
          setRecommendations(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  const handleTrack = async (questionId: string, contentType: string, contentId: string, action: string) => {
    try {
      await fetch("/api/mlt/remediation/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId: questionId || "dashboard", contentType, contentId, action }),
      });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="remediation-panels">
      {recommendations.recommendedLesson && (
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="panel-recommended-lesson">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" /> Recommended Next Lesson
          </h3>
          <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{recommendations.recommendedLesson.title}</div>
              <div className="text-xs text-gray-500">{recommendations.recommendedLesson.discipline || "Targeted Review"}</div>
            </div>
            <button
              onClick={() => handleTrack("dashboard", "lesson", recommendations.recommendedLesson.id, "start_lesson")}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex-shrink-0"
              data-testid="button-start-recommended-lesson"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {recommendations.reviewFlashcards && recommendations.reviewFlashcards.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="panel-review-flashcards">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" /> Review These Flashcards
          </h3>
          <div className="space-y-2">
            {recommendations.reviewFlashcards.slice(0, 3).map((fc: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg">
                <Brain className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">{fc.title}</div>
                  <div className="text-xs text-gray-500">{fc.matchReasons?.includes("weak_area_targeted") ? "Weak area" : "General review"}</div>
                </div>
                <button
                  onClick={() => handleTrack("dashboard", "flashcard", fc.id, "study_cards")}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 flex-shrink-0"
                  data-testid={`button-study-deck-${i}`}
                >
                  Study
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.retryWeakTopics && recommendations.retryWeakTopics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="panel-retry-weak-topics">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" /> Retry Your Weakest Topics
          </h3>
          <div className="space-y-2">
            {recommendations.retryWeakTopics.slice(0, 4).map((topic: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{topic.topic}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-red-600">{topic.accuracy}%</span>
                  <Link
                    href={`/qbank?career=mlt&topics=${encodeURIComponent(topic.topic)}`}
                    className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                    data-testid={`button-retry-topic-${i}`}
                  >
                    Retry
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.basedOnLastExam && recommendations.basedOnLastExam.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="panel-based-on-last-exam">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Based on Your Last Exam
          </h3>
          <div className="space-y-2">
            {recommendations.basedOnLastExam.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-indigo-50 rounded-lg">
                {item.type === "lesson" ? <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" /> : <Brain className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.discipline}</div>
                </div>
                <button
                  onClick={() => handleTrack("dashboard", item.type, item.id, "exam_based_review")}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 flex-shrink-0"
                  data-testid={`button-exam-review-${i}`}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ domains, isFree, onUpgrade }: { domains: ReturnType<typeof getMockDomainData>; isFree: boolean; onUpgrade: () => void }) {
  const recentActivity = getMockRecentActivity();
  const weakDomains = domains.filter((d) => d.mastery < 50).sort((a, b) => a.mastery - b.mastery);
  const streak = 5;
  const timeStudied = 18.5;
  const overallAccuracy = 64;
  const readiness = 58;
  const examAttempts = 2;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" data-testid="overview-stats">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Target className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{readiness}%</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.readiness")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{streak}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.dayStreak")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{overallAccuracy}%</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.accuracy")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{timeStudied}h</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.studied")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <FileText className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{examAttempts}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.examsTaken")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{getMockWrongAnswers().length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.toReview")}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="continue-learning">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-500" /> Continue Learning
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/allied-health/mlt/canada/lessons" className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors" data-testid="link-continue-lessons">
            <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.gramStainInterpretation")}</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.microbiology60Complete")}</div>
            </div>
          </Link>
          <Link href="/allied-health/mlt/canada/flashcards" className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" data-testid="link-continue-flashcards">
            <Brain className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.cellMorphologyCards")}</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.hematology2340Mastered")}</div>
            </div>
          </Link>
          <Link href="/qbank?career=mlt" className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" data-testid="link-continue-practice">
            <ClipboardList className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.chemistryPracticeQuiz")}</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.15QuestionsAdaptive")}</div>
            </div>
          </Link>
        </div>
      </div>

      <DashboardRemediationPanels isFree={isFree} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5" data-testid="domain-mastery-overview">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" /> Domain Mastery
          </h3>
          <div className="space-y-2.5">
            {domains.slice(0, 8).map((d) => (
              <div key={d.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 truncate mr-2">{d.label}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DomainBadge accuracy={d.mastery} />
                    <span className="font-medium text-gray-600 w-10 text-right">{d.mastery}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${d.mastery}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/mlt/performance" className="inline-flex items-center gap-1 mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium" data-testid="link-view-all-domains">
            View All Domains <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="weak-areas-panel">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Weak Areas
            </h3>
            {weakDomains.length > 0 ? (
              <div className="space-y-2">
                {weakDomains.slice(0, 4).map((d) => (
                  <div key={d.key} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 truncate mr-2">{d.label}</span>
                    <span className="text-red-600 font-medium flex-shrink-0">{d.mastery}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t("allied.mltStudentDashboard.noCriticalWeakAreas")}</p>
            )}
            <Link href="/dashboard/mlt/wrong-answers" className="mt-3 w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 text-center block" data-testid="button-review-wrong">
              Review Wrong Answers
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="recent-activity">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> Recent Activity
            </h3>
            <div className="space-y-2.5">
              {recentActivity.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <a.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-700 truncate">{a.title}</div>
                    <div className="text-xs text-gray-400">{a.discipline} • {a.time}</div>
                  </div>
                  {a.score !== undefined && (
                    <span className={`text-xs font-medium ${a.score >= 70 ? "text-green-600" : "text-amber-600"}`}>{a.score}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFree && (
        <UpgradeBanner onUpgrade={onUpgrade} location="overview" />
      )}
    </div>
  );
}

function CountryTab({ country, domains, isFree, onUpgrade }: { country: "canada" | "usa"; domains: ReturnType<typeof getMockDomainData>; isFree: boolean; onUpgrade: () => void }) {
  const { getRegionConfig } = useRegion();
  const regionConfig = getRegionConfig("mlt");
  const isCanada = country === "canada";
  const examName = isCanada ? "CSMLS MLT" : "ASCP MLS/MLT";
  const examBoard = isCanada ? "CSMLS" : "ASCP";
  const labUnits = isCanada ? "SI Units (mmol/L)" : "Conventional (mg/dL)";

  const blueprintWeights = isCanada
    ? { "Clinical Chemistry": 20, "Hematology": 20, "Microbiology": 15, "Blood Banking": 15, "Urinalysis": 10, "Immunology": 10, "Molecular": 5, "Lab Operations": 5 }
    : { "Clinical Chemistry": 18, "Hematology": 18, "Microbiology": 18, "Blood Banking": 12, "Urinalysis": 10, "Immunology": 8, "Molecular": 8, "Lab Operations": 8 };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5" data-testid={`country-header-${country}`}>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-700">{t("allied.mltStudentDashboard.examBoard")}</span>
            <span className="text-purple-700 font-semibold">{examBoard}</span>
          </div>
          <div className="w-px h-4 bg-purple-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{t("allied.mltStudentDashboard.exam")}</span>
            <span className="text-purple-700">{examName}</span>
          </div>
          <div className="w-px h-4 bg-purple-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{t("allied.mltStudentDashboard.labUnits")}</span>
            <span className="text-purple-700">{labUnits}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`blueprint-${country}`}>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" /> {examBoard} Exam Blueprint
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="text-center px-3 py-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{isCanada ? 200 : 100}</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.questions")}</div>
          </div>
          <div className="text-center px-3 py-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{isCanada ? 250 : 150} min</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.timeLimit")}</div>
          </div>
          <div className="text-center px-3 py-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{isCanada ? 65 : 400}{ isCanada ? "%" : ""}</div>
            <div className="text-xs text-gray-500">{isCanada ? "Pass Mark" : "Scaled Score"}</div>
          </div>
          <div className="text-center px-3 py-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{Object.keys(blueprintWeights).length}</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.domains")}</div>
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(blueprintWeights).map(([domain, weight]) => (
            <div key={domain}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{domain}</span>
                <span className="font-medium text-purple-700">{weight}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${weight * 3}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid={`country-links-${country}`}>
        <Link href={`/allied-health/mlt/${country}/lessons`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors" data-testid={`link-${country}-lessons`}>
          <BookOpen className="w-5 h-5 text-purple-500" />
          <div>
            <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.lessons")}</div>
            <div className="text-xs text-gray-500">{country === "canada" ? "CSMLS" : "ASCP"}-aligned</div>
          </div>
        </Link>
        <Link href={`/allied-health/mlt/${country}/flashcards`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors" data-testid={`link-${country}-flashcards`}>
          <Brain className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.flashcards")}</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.spacedRepetition")}</div>
          </div>
        </Link>
        <Link href={`/allied-health/mlt/${country}/practice-exams`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors" data-testid={`link-${country}-exams`}>
          <FileText className="w-5 h-5 text-green-500" />
          <div>
            <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.practiceExams")}</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.blueprintweighted")}</div>
          </div>
        </Link>
        <Link href={`/allied-health/mlt/${country}/study-plan`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors" data-testid={`link-${country}-study-plan`}>
          <Calendar className="w-5 h-5 text-orange-500" />
          <div>
            <div className="text-sm font-medium text-gray-800">{t("allied.mltStudentDashboard.studyPlan")}</div>
            <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.personalizedSchedule")}</div>
          </div>
        </Link>
      </div>

      {isFree && <UpgradeBanner onUpgrade={onUpgrade} location={`country-${country}`} />}
    </div>
  );
}

function ExamTab({ domains, isFree, onUpgrade }: { domains: ReturnType<typeof getMockDomainData>; isFree: boolean; onUpgrade: () => void }) {
  const mockExamHistory = [
    { id: "e1", name: "Mini Mock - Hematology", date: "2026-03-08", score: 72, total: 25, time: 35 },
    { id: "e2", name: "Full Practice Exam #1", date: "2026-03-05", score: 58, total: 100, time: 140 },
    { id: "e3", name: "Mini Mock - Microbiology", date: "2026-03-02", score: 68, total: 25, time: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="exam-history">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" /> Exam History
        </h3>
        <div className="space-y-3">
          {mockExamHistory.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg" data-testid={`exam-result-${exam.id}`}>
              <div>
                <div className="text-sm font-medium text-gray-700">{exam.name}</div>
                <div className="text-xs text-gray-500">{exam.date} • {exam.total} questions • {exam.time} min</div>
              </div>
              <div className={`text-lg font-bold ${exam.score >= 70 ? "text-green-600" : exam.score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {Math.round((exam.score / exam.total) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        {isFree && <LockedOverlay feature="realistic exam mode" onUpgrade={onUpgrade} />}
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="exam-modes">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" /> Exam Modes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-sm font-medium text-gray-800 mb-1">{t("allied.mltStudentDashboard.quickQuiz")}</div>
              <div className="text-xs text-gray-500 mb-3">{t("allied.mltStudentDashboard.1025QuestionsUntimed")}</div>
              <button className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium" data-testid="button-quick-quiz">{t("allied.mltStudentDashboard.start")}</button>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg text-center">
              <div className="text-sm font-medium text-gray-800 mb-1">{t("allied.mltStudentDashboard.miniMock")}</div>
              <div className="text-xs text-gray-500 mb-3">{t("allied.mltStudentDashboard.50QuestionsTimed")}</div>
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium" data-testid="button-mini-mock">{t("allied.mltStudentDashboard.start2")}</button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-sm font-medium text-gray-800 mb-1">{t("allied.mltStudentDashboard.fullExam")}</div>
              <div className="text-xs text-gray-500 mb-3">{t("allied.mltStudentDashboard.100200QuestionsTimed")}</div>
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium" data-testid="button-full-exam">{t("allied.mltStudentDashboard.start3")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashcardsTab({ domains, isFree, onUpgrade }: { domains: ReturnType<typeof getMockDomainData>; isFree: boolean; onUpgrade: () => void }) {
  const mockDecks = [
    { id: "fd1", title: "Hematology Cell Identification", cards: 45, mastered: 28, discipline: "Hematology" },
    { id: "fd2", title: "Clinical Chemistry Lab Values", cards: 60, mastered: 35, discipline: "Clinical Chemistry" },
    { id: "fd3", title: "Gram Stain Organisms", cards: 35, mastered: 12, discipline: "Microbiology" },
    { id: "fd4", title: "Blood Group Systems", cards: 30, mastered: 18, discipline: "Blood Banking" },
    { id: "fd5", title: "Urine Crystals & Casts", cards: 25, mastered: 20, discipline: "Urinalysis" },
    { id: "fd6", title: "Coagulation Cascade", cards: 20, mastered: 8, discipline: "Coagulation" },
  ];

  const totalCards = mockDecks.reduce((s, d) => s + d.cards, 0);
  const totalMastered = mockDecks.reduce((s, d) => s + d.mastered, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="flashcard-stats">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{mockDecks.length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.decks")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{totalCards}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.totalCards")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{totalMastered}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.mastered")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-amber-600">{totalCards - totalMastered}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.toReview2")}</div>
        </div>
      </div>

      <div className="relative">
        {isFree && mockDecks.length > 2 && <LockedOverlay feature="full flashcard library" onUpgrade={onUpgrade} />}
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="flashcard-decks">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" /> Flashcard Decks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockDecks.map((deck, i) => (
              <div key={deck.id} className={`p-4 rounded-lg border ${i < 2 || !isFree ? "border-gray-100 bg-gray-50" : "border-gray-100 bg-gray-50 opacity-50"}`} data-testid={`deck-${deck.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-800">{deck.title}</div>
                  {i >= 2 && isFree && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="text-xs text-gray-500 mb-2">{deck.discipline} • {deck.cards} cards</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${(deck.mastered / deck.cards) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{deck.mastered}/{deck.cards} mastered</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonsTab({ domains, isFree, onUpgrade }: { domains: ReturnType<typeof getMockDomainData>; isFree: boolean; onUpgrade: () => void }) {
  const mockLessons = [
    { id: "l1", title: "Complete Blood Count Interpretation", discipline: "Hematology", progress: 100, tier: "free" },
    { id: "l2", title: "Gram Stain Fundamentals", discipline: "Microbiology", progress: 60, tier: "free" },
    { id: "l3", title: "Electrolyte Panel Analysis", discipline: "Clinical Chemistry", progress: 30, tier: "mlt-basic" },
    { id: "l4", title: "ABO/Rh Blood Typing", discipline: "Blood Banking", progress: 0, tier: "mlt-basic" },
    { id: "l5", title: "Urinalysis Physical & Chemical", discipline: "Urinalysis", progress: 0, tier: "mlt-basic" },
    { id: "l6", title: "PT/INR & aPTT Interpretation", discipline: "Coagulation", progress: 0, tier: "mlt-advanced" },
    { id: "l7", title: "PCR & Molecular Techniques", discipline: "Molecular Diagnostics", progress: 0, tier: "mlt-advanced" },
    { id: "l8", title: "QC & Westgard Rules", discipline: "Lab Operations", progress: 0, tier: "mlt-advanced" },
  ];

  const completedCount = mockLessons.filter((l) => l.progress === 100).length;
  const inProgressCount = mockLessons.filter((l) => l.progress > 0 && l.progress < 100).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="lesson-stats">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{mockLessons.length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.totalLessons")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.completed")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-blue-600">{inProgressCount}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.inProgress")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-400">{mockLessons.length - completedCount - inProgressCount}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.notStarted")}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="lesson-list">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" /> All Lessons
        </h3>
        <div className="space-y-3">
          {mockLessons.map((lesson) => {
            const isLocked = isFree && lesson.tier !== "free";
            return (
              <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isLocked ? "bg-gray-50 opacity-60" : "bg-gray-50"}`} data-testid={`lesson-${lesson.id}`}>
                {lesson.progress === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <BookOpen className="w-5 h-5 text-purple-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{lesson.title}</div>
                  <div className="text-xs text-gray-500">{lesson.discipline}</div>
                </div>
                {!isLocked && lesson.progress > 0 && (
                  <div className="w-16">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${lesson.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 text-right mt-0.5">{lesson.progress}%</div>
                  </div>
                )}
                {isLocked && (
                  <span className="text-xs text-gray-400 font-medium">{lesson.tier === "mlt-basic" ? "Basic" : "Advanced"}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isFree && <UpgradeBanner onUpgrade={onUpgrade} location="lessons" />}
    </div>
  );
}

function PerformanceTab({ domains }: { domains: ReturnType<typeof getMockDomainData> }) {
  const sorted = [...domains].sort((a, b) => b.mastery - a.mastery);
  const totalQuestions = domains.reduce((s, d) => s + d.questionsAttempted, 0);
  const totalCorrect = domains.reduce((s, d) => s + d.questionsCorrect, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const radarMax = 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="performance-stats">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.questionsAttempted")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{overallAccuracy}%</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.overallAccuracy")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-purple-600">{sorted[0]?.label || "-"}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.strongestDomain")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-red-600">{sorted[sorted.length - 1]?.label || "-"}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.weakestDomain")}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="performance-radar">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" /> Performance Radar
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {domains.map((d) => (
            <div key={d.key} className="w-24 text-center" data-testid={`radar-domain-${d.key}`}>
              <div className="relative w-16 h-16 mx-auto mb-1">
                <svg viewBox="0 0 36 36" className="w-16 h-16">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={d.color} strokeWidth="3"
                    strokeDasharray={`${d.mastery}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{d.mastery}%</div>
              </div>
              <div className="text-xs text-gray-600 leading-tight">{d.label.length > 20 ? d.label.substring(0, 18) + "…" : d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="heatmap">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-500" /> Weak Area Heatmap
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {sorted.map((d) => {
            const hue = d.mastery >= 70 ? 142 : d.mastery >= 50 ? 38 : 0;
            const saturation = Math.min(80, 30 + d.mastery * 0.5);
            const lightness = 95 - d.mastery * 0.3;
            return (
              <div
                key={d.key}
                className="p-3 rounded-lg text-center border"
                style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`, borderColor: `hsl(${hue}, ${saturation}%, ${lightness - 10}%)` }}
                data-testid={`heatmap-${d.key}`}
              >
                <div className="text-xs font-medium text-gray-800 leading-tight mb-1">{d.label.length > 15 ? d.label.substring(0, 13) + "…" : d.label}</div>
                <div className="text-sm font-bold text-gray-900">{d.mastery}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="full-domain-breakdown">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" /> Full Domain Breakdown
        </h3>
        <div className="space-y-3">
          {sorted.map((d) => (
            <div key={d.key} data-testid={`domain-detail-${d.key}`}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{d.label}</span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{d.questionsCorrect}/{d.questionsAttempted} correct</span>
                  <span>{d.lessonsCompleted}/{d.totalLessons} lessons</span>
                  <span>{d.flashcardsMastered}/{d.totalFlashcards} cards</span>
                  <DomainBadge accuracy={d.mastery} />
                  <span className="font-medium text-gray-700 w-10 text-right">{d.mastery}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${d.mastery}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WrongAnswerRemediationRow({ questionId, isFree }: { questionId: string; isFree: boolean }) {
  const [remediation, setRemediation] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isFree) return;
    async function load() {
      try {
        const res = await fetch(`/api/mlt/remediation/${questionId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.bestLesson || data.bestDeck) setRemediation(data);
        }
      } catch (e) {}
      setLoaded(true);
    }
    load();
  }, [questionId, isFree]);

  const handleTrack = async (contentType: string, contentId: string, action: string) => {
    try {
      await fetch("/api/mlt/remediation/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId, contentType, contentId, action }),
      });
    } catch (e) {}
  };

  if (!loaded || !remediation) return null;
  return <RemediationRecommendationCard remediation={remediation} onTrack={handleTrack} />;
}

function WrongAnswersTab({ isFree, onUpgrade }: { isFree: boolean; onUpgrade: () => void }) {
  const [filter, setFilter] = useState<string>("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const wrongAnswers = getMockWrongAnswers();

  const filtered = wrongAnswers.filter((wa) => {
    if (showBookmarked && !wa.bookmarked) return false;
    if (filter === "all") return true;
    if (filter === "unreviewed") return !wa.reviewed;
    return wa.discipline.toLowerCase().includes(filter.toLowerCase());
  });

  const disciplineCounts = wrongAnswers.reduce((acc, wa) => {
    acc[wa.discipline] = (acc[wa.discipline] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="wrong-answer-stats">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{wrongAnswers.length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.totalMissed")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-amber-600">{wrongAnswers.filter((w) => !w.reviewed).length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.unreviewed")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-purple-600">{wrongAnswers.filter((w) => w.bookmarked).length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.bookmarked")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{Object.keys(disciplineCounts).length}</div>
          <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.disciplines")}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="weakness-tags">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Weakness Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(disciplineCounts).sort((a, b) => b[1] - a[1]).map(([disc, count]) => (
            <button
              key={disc}
              onClick={() => setFilter(disc)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === disc ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              data-testid={`filter-discipline-${disc}`}
            >
              {disc} ({count})
            </button>
          ))}
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            data-testid="filter-all"
          >
            All
          </button>
          <button
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${showBookmarked ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            data-testid="filter-bookmarked"
          >
            <Bookmark className="w-3 h-3" /> Bookmarked
          </button>
        </div>
      </div>

      <div className="relative">
        {isFree && filtered.length > 2 && <LockedOverlay feature="full wrong answer notebook" onUpgrade={onUpgrade} />}
        <div className="space-y-3" data-testid="wrong-answer-list">
          {filtered.map((wa, idx) => (
            <div key={wa.id} className={`bg-white rounded-xl border border-gray-100 p-5 ${isFree && idx >= 2 ? "opacity-50" : ""}`} data-testid={`wrong-answer-${wa.id}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded">{wa.discipline}</span>
                  {!wa.reviewed && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">{t("allied.mltStudentDashboard.unreviewed2")}</span>}
                  {wa.bookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                </div>
                <span className="text-xs text-gray-400">{wa.createdAt}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{wa.stem}</p>
              <div className="flex items-center gap-4 text-xs mb-3">
                <span className="text-red-600">Your answer: {wa.selectedAnswer}</span>
                <span className="text-green-600">Correct: {wa.correctAnswer}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {wa.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{tag.replace(/_/g, " ")}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100" data-testid={`button-review-lesson-${wa.id}`}>
                  <BookOpen className="w-3.5 h-3.5" /> Review Lesson
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100" data-testid={`button-study-cards-${wa.id}`}>
                  <Brain className="w-3.5 h-3.5" /> Study Flashcards
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100" data-testid={`button-retry-${wa.id}`}>
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Similar
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100" data-testid={`button-adaptive-drill-${wa.id}`}>
                  <Zap className="w-3.5 h-3.5" /> Adaptive Drill
                </button>
              </div>
              <WrongAnswerRemediationRow questionId={wa.id} isFree={isFree} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyPlanTab({ isFree, onUpgrade }: { isFree: boolean; onUpgrade: () => void }) {
  const [selectedPlanId, setSelectedPlanId] = useState(mltStudyPlans[0]?.id || "");
  const selectedPlan = mltStudyPlans.find(p => p.id === selectedPlanId) || mltStudyPlans[0];
  const simulatedCurrentWeek = Math.min(3, selectedPlan.totalWeeks);
  const progressPercent = Math.round((simulatedCurrentWeek / selectedPlan.totalWeeks) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-2" data-testid="study-plan-selector">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" /> Choose Your Study Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mltStudyPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`text-left p-3 rounded-lg border transition-all ${selectedPlanId === plan.id ? "border-purple-300 bg-purple-50" : "border-gray-100 bg-gray-50 hover:border-purple-200"}`}
              data-testid={`plan-option-${plan.id}`}
            >
              <div className="text-sm font-medium text-gray-800">{plan.name}</div>
              <div className="text-xs text-gray-500 mt-1">{plan.totalWeeks} weeks · {plan.hoursPerWeek} hrs/week · {plan.targetExam}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5" data-testid="study-plan-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{selectedPlan.name}</h3>
            <p className="text-sm text-gray-600">{selectedPlan.description}</p>
            <p className="text-xs text-gray-500 mt-1">Week {simulatedCurrentWeek} of {selectedPlan.totalWeeks} · {selectedPlan.hoursPerWeek} hrs/week</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-700">{progressPercent}%</div>
              <div className="text-xs text-gray-500">{t("allied.mltStudentDashboard.complete")}</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/60 rounded-full h-2.5 mt-3">
          <div className="h-2.5 rounded-full bg-purple-500 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="weekly-schedule">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" /> Weekly Schedule
        </h3>
        <div className="space-y-3">
          {selectedPlan.weeks.map((week) => {
            const weekStatus = week.week < simulatedCurrentWeek ? "completed" : week.week === simulatedCurrentWeek ? "in_progress" : "upcoming";
            const totalTasks = week.days.reduce((sum, d) => sum + d.tasks.length, 0);
            const completedTasks = weekStatus === "completed" ? totalTasks : weekStatus === "in_progress" ? Math.round(totalTasks * 0.5) : 0;
            return (
              <div key={week.week} className={`flex items-center gap-4 px-4 py-3 rounded-lg ${weekStatus === "in_progress" ? "bg-purple-50 border border-purple-100" : weekStatus === "completed" ? "bg-green-50" : "bg-gray-50"}`} data-testid={`week-${week.week}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{
                  backgroundColor: weekStatus === "completed" ? "#dcfce7" : weekStatus === "in_progress" ? "#f3e8ff" : "#f3f4f6",
                  color: weekStatus === "completed" ? "#16a34a" : weekStatus === "in_progress" ? "#9333ea" : "#9ca3af",
                }}>
                  {weekStatus === "completed" ? <CheckCircle2 className="w-5 h-5" /> : `W${week.week}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{week.title}</div>
                  <div className="text-xs text-gray-500">{week.focus} · {completedTasks}/{totalTasks} tasks</div>
                </div>
                {weekStatus === "in_progress" && (
                  <div className="w-20">
                    <div className="w-full bg-purple-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(completedTasks / totalTasks) * 100}%` }} />
                    </div>
                  </div>
                )}
                {weekStatus === "completed" && (
                  <span className="text-xs text-green-600 font-medium">{t("allied.mltStudentDashboard.done")}</span>
                )}
                {weekStatus === "upcoming" && (
                  <span className="text-xs text-gray-400">{t("allied.mltStudentDashboard.upcoming")}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="daily-breakdown">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-purple-500" /> Today's Tasks (Week {simulatedCurrentWeek})
        </h3>
        {selectedPlan.weeks[simulatedCurrentWeek - 1] && (
          <div className="space-y-2">
            {selectedPlan.weeks[simulatedCurrentWeek - 1].days.slice(0, 3).flatMap(day =>
              day.tasks.map((task, ti) => (
                <div key={`${day.day}-${ti}`} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg" data-testid={`task-${day.day}-${ti}`}>
                  {task.type === "lesson" ? <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" /> :
                   task.type === "flashcards" ? <Brain className="w-4 h-4 text-blue-500 flex-shrink-0" /> :
                   task.type === "qbank" ? <ClipboardList className="w-4 h-4 text-green-500 flex-shrink-0" /> :
                   task.type === "mock" ? <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" /> :
                   task.type === "review" ? <Eye className="w-4 h-4 text-amber-500 flex-shrink-0" /> :
                   <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate">{task.description}</div>
                    <div className="text-xs text-gray-400">{day.label} · {task.duration}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isFree && <UpgradeBanner onUpgrade={onUpgrade} location="study-plan" />}
    </div>
  );
}

function UpgradeBanner({ onUpgrade, location }: { onUpgrade: () => void; location: string }) {
  useEffect(() => {
    trackMltUpgradePromptShown(location);
  }, [location]);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6 text-center" data-testid="upgrade-banner">
      <Award className="w-10 h-10 text-purple-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-900 mb-1">{t("allied.mltStudentDashboard.unlockFullMltExamPrep")}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get unlimited questions, full flashcard library, realistic exam mode, personalized study plans, and detailed analytics.
      </p>
      <button
        onClick={onUpgrade}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
        data-testid="button-upgrade-main"
      >
        Upgrade Now <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MltStudentDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTab>(getTabFromPath);
  const { user, effectiveTier } = useAuth();
  const { region, setRegion, regionLabel } = useRegion();
  const domains = useMemo(() => getMockDomainData(), []);

  const isFree = !user || effectiveTier === "free";

  useEffect(() => {
    trackMltPageView(`/dashboard/mlt/${activeTab === "overview" ? "" : activeTab}`, region);
  }, [activeTab, region]);

  function handleUpgrade() {
    trackMltUpgradeClick(`dashboard-${activeTab}`);
    trackMltConversionEvent("upgrade_click", effectiveTier);
    setLocation("/allied-health/pricing");
  }

  const tabs: { id: DashboardTab; label: string; icon: any; path: string }[] = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard/mlt" },
    { id: "canada", label: "Canada", icon: Globe, path: "/dashboard/mlt/canada" },
    { id: "usa", label: "USA", icon: Globe, path: "/dashboard/mlt/usa" },
    { id: "exam", label: "Exams", icon: FileText, path: "/dashboard/mlt/exam" },
    { id: "flashcards", label: "Flashcards", icon: Brain, path: "/dashboard/mlt/flashcards" },
    { id: "lessons", label: "Lessons", icon: BookOpen, path: "/dashboard/mlt/lessons" },
    { id: "performance", label: "Performance", icon: Activity, path: "/dashboard/mlt/performance" },
    { id: "wrong-answers", label: "Wrong Answers", icon: XCircle, path: "/dashboard/mlt/wrong-answers" },
    { id: "study-plan", label: "Study Plan", icon: Calendar, path: "/dashboard/mlt/study-plan" },
  ];

  return (
    <>
      <AlliedSEO
        title={t("allied.mltStudentDashboard.mltStudentDashboardMedicalLaboratory")}
        description={t("allied.mltStudentDashboard.trackYourMltCertificationExam")}
        keywords="MLT dashboard, medical laboratory technologist exam prep, CSMLS exam tracker, ASCP MLS progress, lab tech study progress"
        canonicalPath="/dashboard/mlt"
      />
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="mlt-student-dashboard">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-700 font-medium">{t("allied.mltStudentDashboard.dashboard")}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-mlt-dashboard-title">
            <Microscope className="w-7 h-7 text-purple-600" />
            MLT Progress Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg" data-testid="mlt-region-indicator">
              <Globe className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">{regionLabel}</span>
              <button
                onClick={() => setRegion(region === "US" ? "CA" : "US")}
                className="ml-1 px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                data-testid="button-mlt-switch-region"
              >
                Switch
              </button>
            </div>
            {user && (
              <div className="px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg text-xs font-medium text-purple-700" data-testid="tier-badge">
                {effectiveTier === "free" ? "Free" : effectiveTier}
              </div>
            )}
          </div>
        </div>

        <div className="flex overflow-x-auto gap-1 mb-6 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" data-testid="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setLocation(tab.path, { replace: true });
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "canada" && <CountryTab country="canada" domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "usa" && <CountryTab country="usa" domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "exam" && <ExamTab domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "flashcards" && <FlashcardsTab domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "lessons" && <LessonsTab domains={domains} isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "performance" && <PerformanceTab domains={domains} />}
        {activeTab === "wrong-answers" && <WrongAnswersTab isFree={isFree} onUpgrade={handleUpgrade} />}
        {activeTab === "study-plan" && <StudyPlanTab isFree={isFree} onUpgrade={handleUpgrade} />}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">{t("allied.mltStudentDashboard.performanceDataIsBasedOn")}</p>
        </div>
      </div>
    </>
  );
}
