import { useState } from "react";
import { useParams, Link } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute } from "@shared/careers";
import { useRegion } from "@/allied/use-region";
import { AlliedSEO } from "@/allied/allied-seo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Target, TrendingUp, Clock, Flame, Calendar, ChevronRight,
  BookOpen, Award, Globe, Shield, FileText, Brain, ArrowRight,
  CheckCircle2, AlertTriangle, Settings, RefreshCw
} from "lucide-react";

function getDomainColor(accuracy: number): string {

  if (accuracy >= 70) return "#059669";
  if (accuracy >= 50) return "#d97706";
  return "#dc2626";
}

function getDomainBadge(accuracy: number): { label: string; bg: string; text: string } {
  if (accuracy >= 80) return { label: "Strong", bg: "bg-green-50", text: "text-green-700" };
  if (accuracy >= 70) return { label: "On Track", bg: "bg-green-50", text: "text-green-600" };
  if (accuracy >= 50) return { label: "Needs Work", bg: "bg-amber-50", text: "text-amber-700" };
  return { label: "Critical", bg: "bg-red-50", text: "text-red-700" };
}

export default function AlliedDashboardPage() {
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const [examDate, setExamDate] = useState("");
  const { region, setRegion, getRegionConfig, regionLabel } = useRegion();
  const { user } = useAuth();

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedDashboard.careerNotFound")}</h1></div>;
  }

  const regionConfig = getRegionConfig(career.slug);

  const mockReadiness = 62;
  const mockStreak = 3;
  const mockAccuracy = 68;
  const mockTimeStudied = 12.5;
  const mockCreditsRemaining = 3;
  const mockSubscriptionTier = "Free";
  const mockDaysRemaining: number | null = null;

  const mockDomainMastery = career.domains.map((d, i) => ({
    domain: d,
    mastery: Math.round(30 + Math.random() * 60),
    questionsAttempted: Math.round(10 + Math.random() * 50),
    questionsCorrect: Math.round(5 + Math.random() * 40),
  }));

  const mockReadinessExams = [
    { id: "r1", date: "2026-02-15", score: 58, domains: 4, weakDomains: 2 },
    { id: "r2", date: "2026-02-28", score: 65, domains: 4, weakDomains: 1 },
  ];

  const mockStudyPlan = {
    active: true,
    tasksThisWeek: 12,
    tasksCompleted: 7,
    currentModule: career.domains[0],
  };

  const mockFlashcards = {
    totalDecks: 5,
    cardsStudied: 120,
    cardsMastered: 78,
    cardsRemaining: 42,
  };

  const weakDomains = mockDomainMastery.filter(d => d.mastery < 50).sort((a, b) => a.mastery - b.mastery);
  const daysUntilExam = examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <>
    <AlliedSEO
      title={`${career.name} Dashboard - Performance Analytics`}
      description={`Track your ${career.name} exam preparation progress. View domain mastery, accuracy trends, study streaks, and weak-area analysis for ${career.examNames[0]} certification.`}
      keywords={`${career.name} dashboard, ${career.name} progress tracker, ${career.examNames[0]} analytics, exam readiness, study progress`}
      canonicalPath={`/career/${params.careerSlug}/dashboard`}
    />
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="allied-dashboard-page">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.alliedDashboard.dashboard")}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dashboard-title">{career.shortName} Progress Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg" data-testid="region-indicator">
            <Globe className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-gray-700">{regionLabel}</span>
            <button
              onClick={() => setRegion(region === "US" ? "CA" : "US")}
              className="ml-1 px-2 py-0.5 text-xs font-medium text-teal-600 bg-teal-50 rounded hover:bg-teal-100 transition-colors"
              data-testid="button-switch-region"
            >
              Switch to {region === "US" ? "Canada" : "US"}
            </button>
          </div>
        </div>
      </div>

      {regionConfig && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-4 mb-6 flex flex-wrap items-center gap-4 text-sm" data-testid="region-config-banner">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span className="font-medium text-gray-700">{t("allied.alliedDashboard.examBoard")}</span>
            <span className="text-teal-700">{regionConfig.examBoard}</span>
          </div>
          <div className="w-px h-4 bg-teal-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{t("allied.alliedDashboard.labUnits")}</span>
            <span className="text-teal-700">{region === "US" ? "mg/dL (US conventional)" : "mmol/L (SI units)"}</span>
          </div>
          <div className="w-px h-4 bg-teal-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{t("allied.alliedDashboard.legalFramework")}</span>
            <span className="text-teal-700">{regionConfig.legalModules[0]?.name}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-subscription">
          <Award className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-lg font-bold text-gray-900">{mockSubscriptionTier}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedDashboard.subscription")}</div>
          {mockDaysRemaining !== null && (
            <div className="text-xs text-gray-400 mt-1">{mockDaysRemaining} days left</div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-readiness">
          <Target className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockReadiness}%</div>
          <div className="text-sm text-gray-500">{t("allied.alliedDashboard.readinessScore")}</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${mockReadiness}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-streak">
          <Flame className="w-6 h-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockStreak}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedDashboard.dayStreak")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-accuracy">
          <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockAccuracy}%</div>
          <div className="text-sm text-gray-500">{t("allied.alliedDashboard.avgAccuracy")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-mock-credits">
          <FileText className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockCreditsRemaining}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedDashboard.mockCredits")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6" data-testid="domain-mastery">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-teal-500" /> {t("allied.alliedDashboard.domainMastery")}</h3>
          <div className="space-y-3">
            {mockDomainMastery.map(d => {
              const badge = getDomainBadge(d.mastery);
              return (
                <div key={d.domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 truncate mr-2">{d.domain}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>{badge.label}</span>
                      <span className="font-medium text-gray-600">{d.mastery}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${d.mastery}%`, backgroundColor: getDomainColor(d.mastery) }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{d.questionsCorrect}/{d.questionsAttempted} questions correct</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="exam-countdown">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-teal-500" /> {t("allied.alliedDashboard.examCountdown")}</h3>
            {regionConfig && (
              <div className="text-xs text-gray-500 mb-2">Preparing for: {regionConfig.examName}</div>
            )}
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3" data-testid="input-exam-date" />
            {daysUntilExam !== null && (
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">{daysUntilExam}</div>
                <div className="text-sm text-gray-500">{t("allied.alliedDashboard.daysRemaining")}</div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="weak-areas">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> {t("allied.alliedDashboard.weakAreas")}</h3>
            {weakDomains.length > 0 ? (
              <div className="space-y-2">
                {weakDomains.slice(0, 4).map(t => (
                  <div key={t.domain} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 truncate mr-2">{t.domain}</span>
                    <span className="text-red-600 font-medium flex-shrink-0">{t.mastery}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t("allied.alliedDashboard.noCriticalWeakAreasDetected")}</p>
            )}
            <Link href={`/qbank?career=${career.slug}`} className="mt-4 w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 text-center block" data-testid="button-drill-weak">
              Drill Weak Areas
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="readiness-exams">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-teal-500" /> {t("allied.alliedDashboard.readinessExams")}</h3>
          {mockReadinessExams.length > 0 ? (
            <div className="space-y-3 mb-4">
              {mockReadinessExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{exam.date}</div>
                    <div className="text-xs text-gray-500">{exam.weakDomains} weak domain{exam.weakDomains !== 1 ? "s" : ""}</div>
                  </div>
                  <div className={`text-lg font-bold ${exam.score >= 70 ? "text-green-600" : exam.score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {exam.score}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">{t("allied.alliedDashboard.noReadinessExamsCompletedYet")}</p>
          )}
          <Link
            href={`/diagnostic?career=${career.slug}`}
            className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 text-center block"
            data-testid="button-take-readiness"
          >
            Take Readiness Exam
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="study-plan-progress">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-teal-500" /> {t("allied.alliedDashboard.studyPlan")}</h3>
          {mockStudyPlan.active ? (
            <>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t("allied.alliedDashboard.weeklyProgress")}</span>
                  <span className="font-medium text-gray-700">{mockStudyPlan.tasksCompleted}/{mockStudyPlan.tasksThisWeek}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-teal-500" style={{ width: `${(mockStudyPlan.tasksCompleted / mockStudyPlan.tasksThisWeek) * 100}%` }} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Current focus: <span className="font-medium text-gray-700">{mockStudyPlan.currentModule}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-4">{t("allied.alliedDashboard.noActiveStudyPlanCreate")}</p>
          )}
          <Link
            href={`${getCanonicalRoute(career.slug)}/study-plan`}
            className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 text-center block"
            data-testid="button-view-study-plan"
          >
            {mockStudyPlan.active ? "View Study Plan" : "Create Study Plan"}
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="flashcard-progress">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-teal-500" /> {t("allied.alliedDashboard.flashcards")}</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center px-2 py-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockFlashcards.cardsMastered}</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.mastered")}</div>
            </div>
            <div className="text-center px-2 py-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockFlashcards.cardsRemaining}</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.remaining")}</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{t("allied.alliedDashboard.cardsMastered")}</span>
              <span className="font-medium text-gray-700">{Math.round((mockFlashcards.cardsMastered / mockFlashcards.cardsStudied) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${(mockFlashcards.cardsMastered / mockFlashcards.cardsStudied) * 100}%` }} />
            </div>
          </div>
          <Link
            href={`${getCanonicalRoute(career.slug)}/flashcards`}
            className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 text-center block"
            data-testid="button-view-flashcards"
          >
            Continue Flashcards
          </Link>
        </div>
      </div>

      {regionConfig && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" data-testid="region-legal-modules">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            {regionLabel} Legal Framework Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {regionConfig.legalModules.map(mod => (
              <div key={mod.id} className="px-4 py-3 bg-gray-50 rounded-lg" data-testid={`legal-module-${mod.id}`}>
                <div className="text-sm font-medium text-gray-800">{mod.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{mod.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {regionConfig && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" data-testid="exam-blueprint">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            {regionConfig.examBoard} Exam Blueprint
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
              <div className="text-lg font-bold text-teal-700">{regionConfig.totalQuestions}</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.questions")}</div>
            </div>
            <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
              <div className="text-lg font-bold text-teal-700">{regionConfig.timeLimit} min</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.timeLimit")}</div>
            </div>
            <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
              <div className="text-lg font-bold text-teal-700">{regionConfig.passThreshold}%</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.passThreshold")}</div>
            </div>
            <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
              <div className="text-lg font-bold text-teal-700">{regionConfig.domainMinimum}%</div>
              <div className="text-xs text-gray-500">{t("allied.alliedDashboard.domainMinimum")}</div>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(regionConfig.blueprintWeights).map(([domain, weight]) => (
              <div key={domain}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{domain}</span>
                  <span className="font-medium text-teal-700">{weight}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weakDomains.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6 mb-8" data-testid="remediation-recommendations">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-600" />
            Remediation Recommendations
          </h3>
          <div className="space-y-3">
            {weakDomains.slice(0, 3).map(d => (
              <div key={d.domain} className="flex items-start gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">{d.domain}</span>
                  <span className="text-gray-600"> ({d.mastery}% accuracy) -- Focus on this domain with targeted practice. Complete at least 20 additional questions before your next readiness exam.</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/qbank?career=${career.slug}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
            data-testid="button-start-remediation"
          >
            Start Targeted Practice <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {mockSubscriptionTier === "Free" && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-6 text-center" data-testid="upgrade-cta">
          <Award className="w-10 h-10 text-teal-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">{t("allied.alliedDashboard.unlockFullAccess")}</h3>
          <p className="text-sm text-gray-600 mb-4">Upgrade to get unlimited questions, mock exams, personalized study plans, and detailed analytics for your {career.shortName} certification prep.</p>
          <Link
            href="/allied-health/pricing"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
            data-testid="button-upgrade"
          >
            Upgrade Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">{t("allied.alliedDashboard.performanceDataIsBasedOn")}</p>
      </div>
    </div>
    </>
  );
}
