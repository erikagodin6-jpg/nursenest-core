import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap, Calendar, Clock, Target, ChevronRight, CheckCircle2,
  BookOpen, Brain, FileText, Zap, ArrowRight, RefreshCw, ChevronDown,
  ChevronUp, Pill, BarChart3, Play, AlertTriangle, Sparkles, ClipboardList
} from "lucide-react";

const PHARMTECH_CATEGORIES = [
  "Pharmacology & Drug Classifications",
  "Dosage Calculations",
  "Pharmacy Law & Regulations",
  "Sterile & Non-Sterile Compounding",
  "Prescription Processing",
  "Patient Safety & Quality Assurance",
];

const PHASE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  "foundation": { label: "Foundation", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "core": { label: "Core Study", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  "weak-area": { label: "Weak Area Focus", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "mock-exam": { label: "Mock Exam", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  "final-review": { label: "Final Review", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const TASK_ICONS: Record<string, any> = {
  lesson: BookOpen,
  flashcards: Brain,
  practice: ClipboardList,
  exam: FileText,
  review: RefreshCw,
};

const PRESET_PLANS = [
  { key: "2-week", label: "2-Week Crash Plan", desc: "Intensive review for those close to their exam date", pace: "intensive", weeks: 2, minutesPerSession: 60, daysPerWeek: 6, icon: Zap, color: "from-red-500 to-orange-500" },
  { key: "4-week", label: "4-Week Balanced Plan", desc: "Steady pace covering all domains with practice exams", pace: "balanced", weeks: 4, minutesPerSession: 45, daysPerWeek: 5, icon: Target, color: "from-green-500 to-emerald-500" },
  { key: "8-week", label: "8-Week Comprehensive Plan", desc: "Deep coverage of every topic with ample review time", pace: "light", weeks: 8, minutesPerSession: 30, daysPerWeek: 5, icon: GraduationCap, color: "from-blue-500 to-indigo-500" },
];

interface StudyPlanTask {
  id: string;
  planId: string;
  weekNum: number;
  dayNum: number;
  phase: string;
  taskType: string;
  title: string;
  description: string | null;
  category: string | null;
  linkUrl: string | null;
  estimatedMinutes: number;
  completed: boolean;
  completedAt: string | null;
  skipped: boolean;
  rescheduledTo: string | null;
  sortOrder: number;
}

interface StudyPlan {
  id: string;
  userId: string | null;
  examDate: string | null;
  daysPerWeek: number;
  minutesPerSession: number;
  pace: string;
  learningStyle: string;
  weakAreas: string[];
  presetType: string | null;
  progressPercent: number;
  totalTasks: number;
  completedTasks: number;
  isActive: boolean;
  tasks: StudyPlanTask[];
}

export default function PharmtechStudyPlanPage() {
  const { t } = useI18n();
  const params = useParams<{ planId?: string }>();
  const [, setLocation] = useLocation();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const [examDate, setExamDate] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [minutesPerSession, setMinutesPerSession] = useState("30");
  const [pace, setPace] = useState("balanced");
  const [learningStyle, setLearningStyle] = useState("mixed");
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  useEffect(() => {
    if (params.planId) {
      loadPlan(params.planId);
    }
  }, [params.planId]);

  async function loadPlan(planId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/pharmtech/study-plans/${planId}`);
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
        const currentWeek = getCurrentWeek(data.tasks);
        setExpandedWeeks(new Set([currentWeek]));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function getCurrentWeek(tasks: StudyPlanTask[]): number {
    const incomplete = tasks.filter(t => !t.completed && !t.skipped);
    if (incomplete.length === 0) return 1;
    return incomplete[0].weekNum;
  }

  async function createPlan(presetKey?: string) {
    setCreating(true);
    try {
      const preset = presetKey ? PRESET_PLANS.find(p => p.key === presetKey) : null;
      const body = preset ? {
        daysPerWeek: preset.daysPerWeek,
        minutesPerSession: preset.minutesPerSession,
        pace: preset.pace,
        learningStyle: "mixed",
        weakAreas: [],
        presetType: preset.key,
      } : {
        examDate: examDate || null,
        daysPerWeek: parseInt(daysPerWeek),
        minutesPerSession: parseInt(minutesPerSession),
        pace,
        learningStyle,
        weakAreas,
      };

      const res = await fetch("/api/pharmtech/study-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setLocation(`/allied-health/pharmacy-technician/study-plan/${data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  async function toggleTask(taskId: string, completed: boolean) {
    if (!plan) return;
    try {
      const res = await fetch(`/api/pharmtech/study-plan-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            progressPercent: data.progressPercent,
            totalTasks: data.totalTasks,
            completedTasks: data.completedTasks,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed, completedAt: completed ? new Date().toISOString() : null } : t),
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function refreshPlan() {
    if (!plan) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/pharmtech/study-plans/${plan.id}/refresh`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  function toggleWeek(weekNum: number) {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum); else next.add(weekNum);
      return next;
    });
  }

  const toggleWeakArea = (cat: string) => {
    setWeakAreas(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const weeklyData = useMemo(() => {
    if (!plan) return [];
    const weeks: Map<number, { weekNum: number; phase: string; tasks: StudyPlanTask[] }> = new Map();
    for (const task of plan.tasks) {
      if (!weeks.has(task.weekNum)) {
        weeks.set(task.weekNum, { weekNum: task.weekNum, phase: task.phase, tasks: [] });
      }
      weeks.get(task.weekNum)!.tasks.push(task);
    }
    return Array.from(weeks.values()).sort((a, b) => a.weekNum - b.weekNum);
  }, [plan]);

  const daysUntilExam = plan?.examDate ? Math.max(0, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  const weakestCategory = useMemo(() => {
    if (!plan) return null;
    const catStats: Record<string, { total: number; completed: number }> = {};
    for (const t of plan.tasks) {
      if (!t.category) continue;
      if (!catStats[t.category]) catStats[t.category] = { total: 0, completed: 0 };
      catStats[t.category].total++;
      if (t.completed) catStats[t.category].completed++;
    }
    let worst: string | null = null;
    let worstPct = 100;
    for (const [cat, stats] of Object.entries(catStats)) {
      const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      if (pct < worstPct) { worstPct = pct; worst = cat; }
    }
    return worst;
  }, [plan]);

  const nextTask = useMemo(() => {
    if (!plan) return null;
    return plan.tasks.find(t => !t.completed && !t.skipped) || null;
  }, [plan]);

  if (params.planId && loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">{t("allied.pharmtechStudyPlan.loadingYourStudyPlan")}</p>
      </div>
    );
  }

  if (params.planId && plan) {
    return (
      <>
        <AlliedSEO
          title={t("allied.pharmtechStudyPlan.myStudyPlanPharmacyTechnician")}
          description={t("allied.pharmtechStudyPlan.trackYourPersonalizedPharmacyTechnician")}
          keywords="pharmacy technician study plan, PTCB study schedule, pharmacy tech exam prep plan"
          canonicalPath={`/allied-health/pharmacy-technician/study-plan/${plan.id}`}
        />
        <div className="max-w-4xl mx-auto px-4 py-8" data-testid="pharmtech-study-plan-detail">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">{t("allied.pharmtechStudyPlan.pharmacyTech")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/pharmacy-technician/study-plan" className="hover:text-green-600">{t("allied.pharmtechStudyPlan.studyPlan")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-green-700 font-medium">{t("allied.pharmtechStudyPlan.myPlan")}</span>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 mb-8" data-testid="plan-overview-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900" data-testid="text-plan-title">
                  {plan.presetType ? PRESET_PLANS.find(p => p.key === plan.presetType)?.label || "Study Plan" : "Custom Study Plan"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.pace === "intensive" ? "Intensive" : plan.pace === "light" ? "Light" : "Balanced"} pace · {plan.daysPerWeek} days/week · {plan.minutesPerSession} min/session
                </p>
              </div>
              <button
                onClick={refreshPlan}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-xl text-sm font-medium border border-green-200 hover:bg-green-50 transition-colors disabled:opacity-50"
                data-testid="button-refresh-plan"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh My Plan
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {daysUntilExam !== null && (
                <div className="bg-white/80 rounded-xl p-3 text-center" data-testid="stat-exam-countdown">
                  <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{daysUntilExam}</div>
                  <div className="text-xs text-gray-500">{t("allied.pharmtechStudyPlan.daysToExam")}</div>
                </div>
              )}
              <div className="bg-white/80 rounded-xl p-3 text-center" data-testid="stat-progress">
                <BarChart3 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{plan.progressPercent}%</div>
                <div className="text-xs text-gray-500">{t("allied.pharmtechStudyPlan.complete")}</div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 text-center" data-testid="stat-tasks-done">
                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{plan.completedTasks}/{plan.totalTasks}</div>
                <div className="text-xs text-gray-500">{t("allied.pharmtechStudyPlan.tasksDone")}</div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 text-center" data-testid="stat-weeks">
                <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{weeklyData.length}</div>
                <div className="text-xs text-gray-500">{t("allied.pharmtechStudyPlan.weeks")}</div>
              </div>
            </div>

            <div className="w-full bg-white/60 rounded-full h-3" data-testid="progress-bar">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${plan.progressPercent}%` }}
              />
            </div>
          </div>

          {nextTask && (
            <div className="bg-white rounded-xl border border-green-100 p-5 mb-6" data-testid="next-task-card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-green-500" /> Recommended Next Task
              </h3>
              <Link
                href={nextTask.linkUrl || "#"}
                className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                data-testid="link-next-task"
              >
                {(() => { const Icon = TASK_ICONS[nextTask.taskType] || BookOpen; return <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />; })()}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{nextTask.title}</div>
                  <div className="text-xs text-gray-500">
                    Week {nextTask.weekNum}, Day {nextTask.dayNum} · {nextTask.estimatedMinutes} min · {PHASE_LABELS[nextTask.phase]?.label || nextTask.phase}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600" />
              </Link>
            </div>
          )}

          {weakestCategory && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 mb-6 flex items-center gap-3" data-testid="weakest-category">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-amber-800">{t("allied.pharmtechStudyPlan.weakestArea")} </span>
                <span className="text-sm text-amber-700">{weakestCategory}</span>
              </div>
            </div>
          )}

          <div className="space-y-4" data-testid="weekly-schedule">
            {weeklyData.map(week => {
              const weekTasks = week.tasks;
              const weekCompleted = weekTasks.filter(t => t.completed).length;
              const weekTotal = weekTasks.length;
              const weekPct = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
              const isExpanded = expandedWeeks.has(week.weekNum);
              const phaseInfo = PHASE_LABELS[week.phase] || { label: week.phase, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" };

              const dayGroups: Map<number, StudyPlanTask[]> = new Map();
              for (const t of weekTasks) {
                if (!dayGroups.has(t.dayNum)) dayGroups.set(t.dayNum, []);
                dayGroups.get(t.dayNum)!.push(t);
              }

              return (
                <div key={week.weekNum} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`week-${week.weekNum}`}>
                  <button
                    onClick={() => toggleWeek(week.weekNum)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    data-testid={`toggle-week-${week.weekNum}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">Week {week.weekNum}</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${phaseInfo.bg} ${phaseInfo.color}`}>
                        {phaseInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{weekCompleted}/{weekTotal} tasks · {weekPct}%</span>
                      <div className="w-20 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                        <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${weekPct}%` }} />
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4">
                      {Array.from(dayGroups.entries()).sort(([a], [b]) => a - b).map(([dayNum, dayTasks]) => (
                        <div key={dayNum}>
                          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Day {dayNum}</div>
                          <div className="space-y-2">
                            {dayTasks.map(task => {
                              const Icon = TASK_ICONS[task.taskType] || BookOpen;
                              return (
                                <div key={task.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${task.completed ? "bg-green-50/50" : "bg-gray-50 hover:bg-gray-100"}`} data-testid={`task-${task.id}`}>
                                  <button
                                    onClick={() => toggleTask(task.id, !task.completed)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"}`}
                                    data-testid={`checkbox-${task.id}`}
                                  >
                                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                  <Icon className={`w-4 h-4 flex-shrink-0 ${task.completed ? "text-green-400" : "text-green-600"}`} />
                                  <div className="flex-1 min-w-0">
                                    <Link href={task.linkUrl || "#"} className={`text-sm font-medium hover:text-green-600 transition-colors ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                      {task.title}
                                    </Link>
                                    {task.description && <div className="text-xs text-gray-400 mt-0.5">{task.description}</div>}
                                  </div>
                                  <span className="text-xs text-gray-400 flex-shrink-0">{task.estimatedMinutes}m</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechStudyPlan.studyPlanGeneratorPharmacyTechnician")}
        description={t("allied.pharmtechStudyPlan.createAPersonalizedPharmacyTechnician")}
        keywords="pharmacy technician study plan, PTCB study schedule, pharmacy tech exam prep plan, ExCPT study guide, pharmacy tech study planner"
        canonicalPath="/allied-health/pharmacy-technician/study-plan"
      />
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="pharmtech-study-plan-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">{t("allied.pharmtechStudyPlan.pharmacyTech2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechStudyPlan.studyPlan2")}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" data-testid="text-study-plan-title">
          Pharmacy Tech Study Plan Generator
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Create a structured multi-week study schedule tailored to your exam date, available time, and learning preferences. Choose a quick-start preset or customize your own plan.
        </p>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" /> Quick-Start Presets
          </h2>
          <div className="grid sm:grid-cols-3 gap-4" data-testid="preset-plans">
            {PRESET_PLANS.map(preset => (
              <button
                key={preset.key}
                onClick={() => createPlan(preset.key)}
                disabled={creating}
                className="group text-left bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all disabled:opacity-50"
                data-testid={`preset-${preset.key}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center mb-4`}>
                  <preset.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{preset.label}</h3>
                <p className="text-sm text-gray-500 mb-3">{preset.desc}</p>
                <div className="text-xs text-gray-400">
                  {preset.daysPerWeek} days/week · {preset.minutesPerSession} min/session
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
            data-testid="button-toggle-custom"
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Or create a custom plan
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="custom-plan-form">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t("allied.pharmtechStudyPlan.customStudyPlan")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.pharmtechStudyPlan.examDateOptional")}</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  data-testid="input-exam-date"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.pharmtechStudyPlan.daysPerWeek")}</label>
                <select
                  value={daysPerWeek}
                  onChange={e => setDaysPerWeek(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  data-testid="select-days-per-week"
                >
                  {[3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.pharmtechStudyPlan.minutesPerSession")}</label>
                <select
                  value={minutesPerSession}
                  onChange={e => setMinutesPerSession(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  data-testid="select-minutes"
                >
                  {[15, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} minutes</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.pharmtechStudyPlan.studyPace")}</label>
                <select
                  value={pace}
                  onChange={e => setPace(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  data-testid="select-pace"
                >
                  <option value="light">{t("allied.pharmtechStudyPlan.light8Weeks")}</option>
                  <option value="balanced">{t("allied.pharmtechStudyPlan.balanced4Weeks")}</option>
                  <option value="intensive">{t("allied.pharmtechStudyPlan.intensive2Weeks")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.pharmtechStudyPlan.learningStyle")}</label>
                <select
                  value={learningStyle}
                  onChange={e => setLearningStyle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  data-testid="select-learning-style"
                >
                  <option value="mixed">{t("allied.pharmtechStudyPlan.mixedAllTypes")}</option>
                  <option value="flashcards">{t("allied.pharmtechStudyPlan.flashcardheavy")}</option>
                  <option value="questions">{t("allied.pharmtechStudyPlan.questionheavy")}</option>
                  <option value="lessons">{t("allied.pharmtechStudyPlan.lessonheavy")}</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">{t("allied.pharmtechStudyPlan.weakAreasOptional")}</label>
              <div className="flex flex-wrap gap-2">
                {PHARMTECH_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleWeakArea(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${weakAreas.includes(cat) ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200"}`}
                    data-testid={`weak-area-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => createPlan()}
              disabled={creating}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="button-generate-plan"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5" /> Generate My Study Plan
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
