import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap, Target, Clock, Flame, Brain, BookOpen,
  CheckCircle2, AlertCircle, PlayCircle, Calendar,
  Lightbulb, ExternalLink, ArrowRight, Sparkles,
  Activity, TrendingUp, Stethoscope, Pill, Heart,
  ClipboardList, BarChart3, Star
} from "lucide-react";

const METRICS = [
  { label: "Exam Readiness", value: "76%", icon: Target, color: "bg-[#f3efff] text-[#9d82dd]", accent: "#9d82dd" },
  { label: "Weekly Study Goal", value: "8 hrs", icon: Clock, color: "bg-[#e0f8f0] text-[#3bba8e]", accent: "#3bba8e" },
  { label: "Current Streak", value: "12 days", icon: Flame, color: "bg-[#fff3e6] text-[#e8943a]", accent: "#e8943a" },
  { label: "Cards Due Today", value: "34", icon: Brain, color: "bg-[#e8f4fc] text-[#4da3d4]", accent: "#4da3d4" },
  { label: "Priority Focus", value: "Pharma + Renal", icon: AlertCircle, color: "bg-[#fdeef0] text-[#e86b7a]", accent: "#e86b7a" },
];

type TaskStatus = "completed" | "in-progress" | "due-today" | "overdue";

interface DayTask {
  title: string;
  type: string;
  minutes: number;
  status: TaskStatus;
  domain: string;
}

interface DaySchedule {
  day: string;
  date: string;
  tasks: DayTask[];
  isRestDay?: boolean;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
  "completed": { label: "Completed", bg: "bg-[#e0f8f0]", text: "text-[#2d8a6b]", dot: "bg-[#3bba8e]" },
  "in-progress": { label: "In Progress", bg: "bg-[#f3efff]", text: "text-[#7c63c4]", dot: "bg-[#9d82dd]" },
  "due-today": { label: "Due Today", bg: "bg-[#e8f4fc]", text: "text-[#3584b8]", dot: "bg-[#4da3d4]" },
  "overdue": { label: "Overdue", bg: "bg-[#fdeef0]", text: "text-[#c4505e]", dot: "bg-[#e86b7a]" },
};

const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: "Monday",
    date: "Mar 9",
    tasks: [
      { title: "Pharmacology: Antihypertensives Review", type: "Flashcards", minutes: 25, status: "completed", domain: "Pharmacology" },
      { title: "Renal System: Fluid & Electrolytes", type: "Lesson", minutes: 35, status: "completed", domain: "Renal" },
      { title: "Drug Dosage Calculations Practice", type: "Quiz", minutes: 20, status: "completed", domain: "Pharmacology" },
    ],
  },
  {
    day: "Tuesday",
    date: "Mar 10",
    tasks: [
      { title: "Renal: Acute Kidney Injury Deep Dive", type: "Lesson", minutes: 40, status: "completed", domain: "Renal" },
      { title: "Pharmacology: Diuretics & Nephrotoxic Drugs", type: "Flashcards", minutes: 20, status: "completed", domain: "Pharmacology" },
      { title: "Cardiovascular Basics: Maintenance Review", type: "Review", minutes: 15, status: "completed", domain: "Cardiovascular" },
    ],
  },
  {
    day: "Wednesday",
    date: "Mar 11",
    tasks: [
      { title: "Sepsis Protocols & Early Recognition", type: "Lesson", minutes: 45, status: "in-progress", domain: "Infection Control" },
      { title: "Pharmacology: Antibiotic Classes", type: "Flashcards", minutes: 25, status: "due-today", domain: "Pharmacology" },
      { title: "Renal: Dialysis Nursing Care", type: "Quiz", minutes: 20, status: "due-today", domain: "Renal" },
    ],
  },
  {
    day: "Thursday",
    date: "Mar 12",
    tasks: [
      { title: "Pharmacology: Insulin & Oral Hypoglycemics", type: "Flashcards", minutes: 30, status: "due-today", domain: "Pharmacology" },
      { title: "Infection Control: PPE & Isolation Precautions", type: "Lesson", minutes: 25, status: "due-today", domain: "Infection Control" },
      { title: "Weak Areas: Mixed NCLEX-Style Questions", type: "Quiz", minutes: 30, status: "due-today", domain: "Mixed" },
    ],
  },
  {
    day: "Friday",
    date: "Mar 13",
    tasks: [
      { title: "Renal: Chronic Kidney Disease Stages", type: "Lesson", minutes: 35, status: "overdue", domain: "Renal" },
      { title: "Pharmacology: Cardiac Glycosides", type: "Flashcards", minutes: 20, status: "overdue", domain: "Pharmacology" },
    ],
  },
  {
    day: "Saturday",
    date: "Mar 14",
    tasks: [
      { title: "Full-Length Practice Exam: Pharmacology Focus", type: "Exam", minutes: 60, status: "overdue", domain: "Pharmacology" },
      { title: "Weak Area Review: Sepsis & Renal", type: "Review", minutes: 25, status: "overdue", domain: "Mixed" },
    ],
  },
  {
    day: "Sunday",
    date: "Mar 15",
    isRestDay: true,
    tasks: [],
  },
];

const ADAPTATION_REASONS = [
  { icon: TrendingUp, color: "text-[#e86b7a]", title: "Lower accuracy in Renal topics", description: "Your recent quiz scores in Renal (Fluid & Electrolytes, AKI) averaged 58%. This week adds extra renal content and spaced-repetition flashcard sets to close the gap." },
  { icon: Pill, color: "text-[#9d82dd]", title: "Pharmacology needs reinforcement", description: "Antihypertensives and diuretics had a 62% recall rate on flashcard reviews. The plan front-loads pharmacology practice to strengthen drug class recall before the weekend exam." },
  { icon: Heart, color: "text-[#3bba8e]", title: "Strong cardiovascular foundation", description: "Your cardiovascular scores consistently hit 85%+. The plan includes only a light maintenance review to keep this knowledge fresh without over-studying." },
  { icon: Activity, color: "text-[#4da3d4]", title: "Missed sepsis recognition questions", description: "You answered 3 of 7 sepsis early-recognition questions incorrectly last week. Wednesday is dedicated to sepsis protocols and antibiotic pharmacology to address this gap." },
];

const RECOMMENDED_RESOURCES = [
  { title: "Pharmacology: Antihypertensives Deck", type: "Flashcard Deck", icon: Brain, color: "bg-[#f3efff] text-[#9d82dd]", action: "Open Recommended Deck" },
  { title: "Renal System: Complete Review", type: "Lesson Module", icon: BookOpen, color: "bg-[#e8f4fc] text-[#4da3d4]", action: "Review Linked Lesson" },
  { title: "Sepsis: Early Recognition Signs", type: "Clinical Lesson", icon: Stethoscope, color: "bg-[#fdeef0] text-[#e86b7a]", action: "Review Linked Lesson" },
  { title: "NCLEX Pharmacology Question Set", type: "Test Bank", icon: ClipboardList, color: "bg-[#e0f8f0] text-[#3bba8e]", action: "Start Practice Set" },
  { title: "Fluid & Electrolyte Imbalances", type: "Flashcard Deck", icon: Brain, color: "bg-[#fff3e6] text-[#e8943a]", action: "Open Recommended Deck" },
];

const TYPE_ICONS: Record<string, any> = {
  Flashcards: Brain,
  Lesson: BookOpen,
  Quiz: ClipboardList,
  Review: BarChart3,
  Exam: Target,
};

export default function DemoStudyPlanPage() {
  const { t } = useI18n();
  const allTasks = WEEKLY_SCHEDULE.filter(d => !d.isRestDay).flatMap(d => d.tasks);
  const completedTasks = allTasks.filter(t => t.status === "completed").length;
  const totalTasks = allTasks.length;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#fdfcfa", color: "#1a1a2e" }} data-testid="demo-study-plan-page">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f3efff" }}>
                <GraduationCap className="w-6 h-6" style={{ color: "#9d82dd" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">{t("pages.demoStudyPlan.adaptiveStudyPlan")}</h1>
                <p className="text-sm" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.emilyChenMiddotRnNclex")}</p>
              </div>
            </div>
          </div>
          <Badge className="text-xs px-3 py-1 border-0 font-semibold" style={{ backgroundColor: "#f3efff", color: "#9d82dd" }} data-testid="badge-ai-generated">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Personalized Plan
          </Badge>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8" data-testid="metrics-strip">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: "16px" }} data-testid={`metric-card-${i}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#8b8fa3" }}>{m.label}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: m.accent }} data-testid={`metric-value-${i}`}>{m.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-none shadow-sm mb-8" style={{ borderRadius: "16px" }} data-testid="card-plan-overview">
          <CardContent className="p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f3efff" }}>
                  <Calendar className="w-5 h-5" style={{ color: "#9d82dd" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" data-testid="text-plan-title">{t("pages.demoStudyPlan.thisWeeksFocusPlan")}</h2>
                  <p className="text-sm" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.personalizedForYourLearningGaps")}</p>
                </div>
              </div>
              <Button className="rounded-full px-6 text-sm font-semibold shadow-sm" style={{ backgroundColor: "#9d82dd", color: "#fff", border: "none" }} data-testid="button-start-today">
                <PlayCircle className="w-4 h-4 mr-1.5" /> Start Today's Plan
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#faf8ff" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.primaryGoals")}</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm"><Star className="w-3.5 h-3.5" style={{ color: "#9d82dd" }} /> {t("pages.demoStudyPlan.strengthenPharmacologyRecall")}</li>
                  <li className="flex items-center gap-2 text-sm"><Star className="w-3.5 h-3.5" style={{ color: "#9d82dd" }} /> {t("pages.demoStudyPlan.masterRenalFluidBalance")}</li>
                  <li className="flex items-center gap-2 text-sm"><Star className="w-3.5 h-3.5" style={{ color: "#9d82dd" }} /> {t("pages.demoStudyPlan.closeSepsisKnowledgeGaps")}</li>
                  <li className="flex items-center gap-2 text-sm"><Star className="w-3.5 h-3.5" style={{ color: "#9d82dd" }} /> {t("pages.demoStudyPlan.maintainCardiovascularBaseline")}</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#f0faf6" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.estimatedCompletion")}</p>
                <p className="text-3xl font-bold" style={{ color: "#3bba8e" }}>6.5 hrs</p>
                <p className="text-xs mt-1" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.across6StudyDaysSun")}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#fef7f0" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.weeklySuccessTarget")}</p>
                <p className="text-3xl font-bold" style={{ color: "#e8943a" }}>80%+</p>
                <p className="text-xs mt-1" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.onWeakareaFlashcardReviews")}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full" style={{ backgroundColor: "#f0ecf8" }}>
                <div className="h-2.5 rounded-full transition-all" style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%`, backgroundColor: "#9d82dd" }} data-testid="progress-bar" />
              </div>
              <span className="text-xs font-medium" style={{ color: "#8b8fa3" }}>{completedTasks}/{totalTasks} tasks done</span>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8" data-testid="weekly-schedule">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: "#9d82dd" }} /> Day-by-Day Schedule
          </h2>
          <div className="space-y-3">
            {WEEKLY_SCHEDULE.map((day, di) => (
              <Card key={di} className="border-none shadow-sm overflow-hidden" style={{ borderRadius: "14px" }} data-testid={`day-card-${di}`}>
                <div className="flex items-center gap-3 px-5 py-3.5" style={{ backgroundColor: di < 2 ? "#f0faf6" : di === 2 ? "#faf8ff" : di < 5 ? "#fdfcfa" : day.isRestDay ? "#f8f9fa" : "#fef7f0" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: day.isRestDay ? "#e5e7eb" : "#9d82dd", color: day.isRestDay ? "#6b7280" : "#fff" }}>
                    {day.day.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold">{day.day}</span>
                    <span className="text-xs ml-2" style={{ color: "#8b8fa3" }}>{day.date}</span>
                  </div>
                  {day.isRestDay ? (
                    <Badge className="text-xs border-0 font-medium" style={{ backgroundColor: "#e5e7eb", color: "#6b7280" }}>{t("pages.demoStudyPlan.restDay")}</Badge>
                  ) : (
                    <span className="text-xs" style={{ color: "#8b8fa3" }}>
                      {day.tasks.reduce((s, t) => s + t.minutes, 0)} min &middot; {day.tasks.length} tasks
                    </span>
                  )}
                </div>
                {!day.isRestDay && (
                  <div className="divide-y" style={{ borderColor: "#f5f3f0" }}>
                    {day.tasks.map((task, ti) => {
                      const sc = STATUS_CONFIG[task.status];
                      const TypeIcon = TYPE_ICONS[task.type] || BookOpen;
                      return (
                        <div key={ti} className="flex items-center gap-3 px-5 py-3" data-testid={`task-${di}-${ti}`}>
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#9d82dd" }} />
                              <span className={`text-sm ${task.status === "completed" ? "line-through opacity-60" : ""}`}>{task.title}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px]" style={{ color: "#8b8fa3" }}>{task.type} &middot; {task.minutes} min</span>
                              <Badge className="text-[10px] px-1.5 py-0 border-0 font-normal" style={{ backgroundColor: "#f5f3f0", color: "#8b8fa3" }}>{task.domain}</Badge>
                            </div>
                          </div>
                          <Badge className={`text-[11px] px-2 py-0.5 border-0 font-medium ${sc.bg} ${sc.text}`} data-testid={`status-${di}-${ti}`}>
                            {task.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {sc.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
                {day.isRestDay && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.restRechargeLightReadingOr")}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-sm" style={{ borderRadius: "16px" }} data-testid="card-adaptation-panel">
            <CardContent className="p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff3e6" }}>
                  <Lightbulb className="w-5 h-5" style={{ color: "#e8943a" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{t("pages.demoStudyPlan.whyThisPlanWasBuilt")}</h2>
                  <p className="text-xs" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.smartAdaptationBasedOnYour")}</p>
                </div>
              </div>
              <div className="space-y-4">
                {ADAPTATION_REASONS.map((reason, i) => {
                  const Icon = reason.icon;
                  return (
                    <div key={i} className="flex gap-3" data-testid={`adaptation-reason-${i}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#faf8ff" }}>
                        <Icon className="w-4 h-4" style={{ color: reason.color.replace("text-[", "").replace("]", "") }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-0.5">{reason.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{reason.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm" style={{ borderRadius: "16px" }} data-testid="card-recommended-resources">
            <CardContent className="p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f4fc" }}>
                  <BookOpen className="w-5 h-5" style={{ color: "#4da3d4" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{t("pages.demoStudyPlan.recommendedResources")}</h2>
                  <p className="text-xs" style={{ color: "#8b8fa3" }}>{t("pages.demoStudyPlan.curatedStudyToolsForThis")}</p>
                </div>
              </div>
              <div className="space-y-3">
                {RECOMMENDED_RESOURCES.map((resource, i) => {
                  const Icon = resource.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition-shadow" style={{ backgroundColor: "#fdfcfa" }} data-testid={`resource-${i}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${resource.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{resource.title}</p>
                        <p className="text-[11px]" style={{ color: "#8b8fa3" }}>{resource.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs rounded-full px-3 flex-shrink-0" style={{ color: "#9d82dd" }} data-testid={`button-resource-${i}`}>
                        {resource.action} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pb-6">
          <p className="text-xs" style={{ color: "#b0b4c3" }}>
            Demo view &middot; Hardcoded data for Emily Chen &middot; NurseNest Adaptive Study Plan
          </p>
        </div>
      </div>
    </div>
  );
}
