import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { LocaleLink } from "@/lib/LocaleLink";
import { cn } from "@/lib/utils";
import {
  Target, TrendingUp, Clock, BookOpen, AlertTriangle,
  CheckCircle2, ChevronRight, Calendar, Flame, Trophy,
  BarChart3, ArrowRight, Pencil, X,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type TestResult = { score: number; total: number; percentage: number };

type DomainData = {
  name: string;
  emoji: string;
  averageScore: number;
  questionCount: number;
  proficiency: "Mastered" | "Proficient" | "Developing" | "Needs Review" | "Not Started";
};

// ── NCLEX domains mapped to localStorage lesson slugs ───────────────────────

const NCLEX_DOMAINS: { name: string; emoji: string; lessons: string[] }[] = [
  {
    name: "Safe & Effective Care",
    emoji: "🛡️",
    lessons: [
      "hand-hygiene", "ppe-basics", "isolation-precautions-rpn", "sterile-technique",
      "airborne-precautions", "droplet-precautions", "pacemaker-care",
      "infection-control", "cdiff-basics", "pertussis-basics",
    ],
  },
  {
    name: "Health Promotion",
    emoji: "🌱",
    lessons: [
      "prenatal-basics", "breastfeeding-basics", "newborn-reflexes",
      "diabetes-lifespan", "obesity-management", "cancer-screening",
      "immunizations-basics", "alcohol-withdrawal",
    ],
  },
  {
    name: "Psychosocial Integrity",
    emoji: "🧠",
    lessons: [
      "schizophrenia", "major-depressive-disorder", "ptsd", "panic-disorder",
      "antisocial-personality-disorder", "intimate-partner-violence",
      "postpartum-depression-care", "separation-anxiety", "insomnia",
    ],
  },
  {
    name: "Physiological Integrity",
    emoji: "💊",
    lessons: [
      "aki-management", "ckd-management", "copd-exacerbation", "asthma-emergency",
      "mi-acute", "heart-failure", "hypertension", "dka-hhns", "stroke",
      "siadh-di", "pharmacology", "fluid-electrolytes", "abg-basics",
    ],
  },
];

// ── Body systems for the body-system mastery grid ───────────────────────────

const BODY_SYSTEMS: { name: string; emoji: string; lessons: string[] }[] = [
  {
    name: "Cardiovascular", emoji: "❤️",
    lessons: ["mi-acute", "heart-failure", "hypertension", "cardiac-monitoring", "cardiac-rhythm-rn", "dysrhythmias", "pe-dvt", "cardiogenic-shock"],
  },
  {
    name: "Respiratory", emoji: "🌬️",
    lessons: ["copd-exacerbation", "asthma-emergency", "abg-basics", "abg-interpretation-rn", "oxygen-therapy", "chest-tube-care", "pneumonia-basics"],
  },
  {
    name: "Neurological", emoji: "🧩",
    lessons: ["stroke", "increased-icp", "seizure-safety", "neuro-basics"],
  },
  {
    name: "Pharmacology", emoji: "💊",
    lessons: ["antacids", "h2-receptor-antagonists", "proton-pump-inhibitors", "antiemetics", "laxatives", "anticoagulants", "betamethasone-dexamethasone"],
  },
  {
    name: "Fluids & Electrolytes", emoji: "💧",
    lessons: ["aki-management", "ckd-management", "siadh-di", "rhabdomyolysis", "dialysis-steal", "dka-hhns"],
  },
  {
    name: "Infection Control", emoji: "🦠",
    lessons: ["hand-hygiene", "ppe-basics", "isolation-precautions-rpn", "sterile-technique", "airborne-precautions", "cdiff-basics"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function readTestResults(): Record<string, TestResult> {
  const results: Record<string, TestResult> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const match = key.match(/^nursenest-(?:pre|post)test-(.+)$/);
    if (match) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "");
        if (data && typeof data.percentage === "number") {
          const existing = results[match[1]];
          if (!existing || data.percentage > existing.percentage) {
            results[match[1]] = data;
          }
        }
      } catch {}
    }
  }
  return results;
}

function computeDomains(
  domainDefs: { name: string; emoji: string; lessons: string[] }[],
  results: Record<string, TestResult>
): DomainData[] {
  return domainDefs.map(({ name, emoji, lessons }) => {
    const scores = lessons
      .map(l => results[l]?.percentage)
      .filter((p): p is number => p !== undefined);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const proficiency =
      scores.length === 0 ? "Not Started"
        : avg >= 85 ? "Mastered"
        : avg >= 72 ? "Proficient"
        : avg >= 58 ? "Developing"
        : "Needs Review";
    return { name, emoji, averageScore: avg, questionCount: scores.length, proficiency: proficiency as DomainData["proficiency"] };
  });
}

function computeReadiness(domains: DomainData[]): number {
  const active = domains.filter(d => d.averageScore > 0);
  if (!active.length) return 0;
  return Math.round(active.reduce((s, d) => s + d.averageScore, 0) / active.length);
}

function passProbability(readiness: number): number {
  if (readiness === 0) return 0;
  if (readiness >= 88) return 96;
  if (readiness >= 83) return 91;
  if (readiness >= 78) return 84;
  if (readiness >= 73) return 74;
  if (readiness >= 68) return 62;
  if (readiness >= 60) return 48;
  return Math.max(15, readiness - 25);
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function proficiencyConfig(p: DomainData["proficiency"]) {
  switch (p) {
    case "Mastered":    return { label: "Mastered",      cls: "readiness-badge-strong" };
    case "Proficient":  return { label: "Proficient",    cls: "bg-blue-50 text-blue-700 border border-blue-200" };
    case "Developing":  return { label: "Developing",    cls: "readiness-badge-warn" };
    case "Needs Review":return { label: "Needs Review",  cls: "readiness-badge-alert" };
    default:            return { label: "Not Started",   cls: "bg-gray-100 text-gray-500 border border-gray-200" };
  }
}

function barColor(p: DomainData["proficiency"]) {
  switch (p) {
    case "Mastered":    return "bg-chart-3";
    case "Proficient":  return "bg-chart-2";
    case "Developing":  return "bg-chart-4";
    case "Needs Review":return "bg-red-400";
    default:            return "bg-gray-200";
  }
}

// ── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ value, size = 130, label }: { value: number; size?: number; label: string }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="currentColor" strokeWidth={10}
          className="text-primary/10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--theme-primary)" strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold leading-none tracking-tight text-primary">
          {value}%
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

// ── ExamCountdownBanner ───────────────────────────────────────────────────────

function ExamCountdownBanner({
  examDate,
  onEdit,
}: {
  examDate: string;
  onEdit: () => void;
}) {
  const days = examDate ? daysUntil(examDate) : null;
  const formatted = examDate
    ? new Date(examDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className={cn(
      "themed-hero-gradient leaf-watermark-bg rounded-2xl px-6 py-4 mb-6 flex items-center gap-4 flex-wrap",
    )}>
      <div className="themed-icon-container w-10 h-10 flex-shrink-0">
        <Calendar className="w-5 h-5" />
      </div>
      {days !== null && formatted ? (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Exam Countdown
            </p>
            <p className="font-bold text-foreground text-sm mt-0.5">
              {days > 0
                ? <><span className="text-primary text-xl font-extrabold">{days}</span> days until {formatted}</>
                : days === 0
                ? <>Exam is <span className="text-primary font-extrabold">today</span> — {formatted}. You've got this! 🎉</>
                : <>Exam was {formatted}. Update your date to track a new goal.</>}
            </p>
          </div>
          {days > 0 && days <= 7 && (
            <span className="readiness-badge-alert rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0">
              Final stretch!
            </span>
          )}
          {days > 7 && days <= 21 && (
            <span className="readiness-badge-warn rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0">
              {days} days to go
            </span>
          )}
          {days > 21 && (
            <span className="readiness-badge-strong rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0">
              {days} days to go
            </span>
          )}
        </>
      ) : (
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Exam Date
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">Set your exam date to see your countdown</p>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        className="flex-shrink-0 gap-1.5 text-xs"
        onClick={onEdit}
      >
        <Pencil className="w-3 h-3" />
        {examDate ? "Change" : "Set Exam Date"}
      </Button>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ReadinessReport() {
  const { user } = useAuth();

  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [examDate, setExamDate] = useState<string>(() =>
    localStorage.getItem("nursenest-exam-date") || ""
  );
  const [editingDate, setEditingDate] = useState(false);
  const [pendingDate, setPendingDate] = useState(examDate);

  useEffect(() => {
    setTestResults(readTestResults());
  }, []);

  const nclexDomains = useMemo(() => computeDomains(NCLEX_DOMAINS, testResults), [testResults]);
  const bodySystems   = useMemo(() => computeDomains(BODY_SYSTEMS,   testResults), [testResults]);

  const readiness  = useMemo(() => computeReadiness(nclexDomains), [nclexDomains]);
  const passProb   = useMemo(() => passProbability(readiness), [readiness]);
  const daysToExam = useMemo(() => daysUntil(examDate), [examDate]);

  const totalAnswered = useMemo(
    () => Object.values(testResults).reduce((s, r) => s + (r.total || 0), 0),
    [testResults]
  );

  const weakAreas = useMemo(
    () =>
      [...nclexDomains, ...bodySystems]
        .filter(d => d.averageScore > 0 && (d.proficiency === "Needs Review" || d.proficiency === "Developing"))
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 3),
    [nclexDomains, bodySystems]
  );

  function saveExamDate() {
    const d = pendingDate.trim();
    setExamDate(d);
    if (d) localStorage.setItem("nursenest-exam-date", d);
    else localStorage.removeItem("nursenest-exam-date");
    setEditingDate(false);
  }

  const hasData = totalAnswered > 0;

  return (
    <>
      <SEO
        title="Readiness Report — NurseNest"
        description="Track your NCLEX readiness, pass probability, domain performance, and personalized study recommendations."
        canonicalPath="/readiness-report"
      />
      <Navigation />

      <main className="container mx-auto max-w-5xl px-4 py-6 sm:py-8 animate-page-enter">

        {/* ── Exam date banner ── */}
        <ExamCountdownBanner
          examDate={examDate}
          onEdit={() => { setPendingDate(examDate); setEditingDate(true); }}
        />

        {/* ── Date picker modal ── */}
        {editingDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base">Set Your Exam Date</h2>
                <button onClick={() => setEditingDate(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="date"
                className="auth-input w-full px-3 py-2 rounded-lg text-sm mb-4"
                value={pendingDate}
                onChange={e => setPendingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setEditingDate(false)}>Cancel</Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={saveExamDate}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Your Readiness Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              NCLEX performance tracking · {totalAnswered > 0 ? `${totalAnswered} questions answered` : "Start answering questions to see your report"}
            </p>
          </div>
          <LocaleLink href="/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-shrink-0">
              <BarChart3 className="w-3.5 h-3.5" />
              Full Reports
            </Button>
          </LocaleLink>
        </div>

        {!hasData ? (
          /* ── Empty state ── */
          <Card className="rounded-2xl border-dashed">
            <CardContent className="py-16 text-center">
              <div className="themed-icon-container w-14 h-14 mx-auto mb-4">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="font-bold text-base mb-2">No data yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Complete some lesson quizzes or practice questions to see your readiness score, pass probability, and personalized recommendations.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <LocaleLink href="/reports">
                  <Button variant="outline" size="sm">View Body System Reports</Button>
                </LocaleLink>
                <LocaleLink href="/practice">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                    <ArrowRight className="w-4 h-4" />
                    Start Practicing
                  </Button>
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Hero: readiness + pass probability ── */}
            <div className="themed-hero-gradient leaf-watermark-bg rounded-2xl p-6 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              {/* Score ring */}
              <ScoreRing value={readiness} label="Readiness" />

              {/* Text */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2 flex-wrap">
                  {passProb >= 80 ? (
                    <span className="readiness-badge-strong rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> On Track to Pass
                    </span>
                  ) : passProb >= 60 ? (
                    <span className="readiness-badge-warn rounded-full px-3 py-1 text-xs font-semibold">
                      Approaching Pass Threshold
                    </span>
                  ) : (
                    <span className="readiness-badge-alert rounded-full px-3 py-1 text-xs font-semibold">
                      Needs Focused Study
                    </span>
                  )}
                  {daysToExam !== null && daysToExam > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {daysToExam} days to exam
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-1">
                  {passProb >= 85
                    ? "Strong performance — keep this pace."
                    : passProb >= 70
                    ? "Good progress — focus on your weak areas."
                    : "You're building momentum — stay consistent."}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  {passProb >= 75
                    ? `Your estimated CAT pass probability is ${passProb}% — above the threshold. Shoring up your weaker domains could push this to ${Math.min(passProb + 8, 99)}%.`
                    : `Your estimated CAT pass probability is ${passProb}%. Focus on the priority areas below to improve your score before exam day.`}
                </p>

                {/* Quick stats row */}
                <div className="flex gap-5 mt-4 pt-4 border-t border-border/50 flex-wrap justify-center sm:justify-start">
                  <div>
                    <p className="text-xl font-extrabold leading-none text-foreground">{passProb}%</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Pass Probability</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold leading-none text-foreground">{totalAnswered}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Questions Done</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold leading-none text-foreground">
                      {nclexDomains.filter(d => d.proficiency === "Mastered" || d.proficiency === "Proficient").length}
                      /{nclexDomains.length}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">Domains Strong</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-2 items-center sm:items-end flex-shrink-0">
                <LocaleLink href="/practice">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 whitespace-nowrap">
                    <ArrowRight className="w-4 h-4" />
                    Start Practicing
                  </Button>
                </LocaleLink>
                <LocaleLink href="/study-plan">
                  <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
                    View Study Plan
                  </Button>
                </LocaleLink>
              </div>
            </div>

            {/* ── Pass probability bar ── */}
            <Card className="rounded-2xl mb-5">
              <CardContent className="py-5 px-6">
                <div className="flex items-center justify-between mb-3 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      CAT Pass Probability
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      Estimated from your performance data
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-extrabold text-primary leading-none">{passProb}%</span>
                  </div>
                </div>
                <div className="relative h-2.5 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full themed-progress-bar transition-all duration-1000"
                    style={{ width: `${passProb}%` }}
                  />
                  {/* Passing threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 rounded"
                    style={{ left: "65%" }}
                    title="Passing threshold ~65%"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                  <span>0%</span>
                  <span className="text-emerald-600 font-semibold">← Passing threshold (~65%)</span>
                  <span className="text-primary font-semibold">You: {passProb}%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

            {/* ── Two-column: NCLEX domains + Priority focus ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

              {/* NCLEX domain performance */}
              <Card className="rounded-2xl">
                <CardContent className="pt-5 pb-4 px-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    NCLEX Domain Performance
                  </p>
                  <div className="space-y-4">
                    {nclexDomains.map((d) => {
                      const cfg = proficiencyConfig(d.proficiency);
                      const bar = barColor(d.proficiency);
                      return (
                        <div key={d.name}>
                          <div className="flex items-center justify-between mb-1.5 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-base leading-none flex-shrink-0">{d.emoji}</span>
                              <span className="text-sm font-semibold text-foreground truncate">{d.name}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {d.averageScore > 0 && (
                                <span className="text-sm font-bold text-foreground">{d.averageScore}%</span>
                              )}
                              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cfg.cls)}>
                                {cfg.label}
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-700", bar)}
                              style={{ width: `${d.averageScore || 0}%` }}
                            />
                          </div>
                          {d.questionCount > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {d.questionCount} quiz{d.questionCount !== 1 ? "zes" : ""} completed
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Priority focus areas */}
              <Card className="rounded-2xl">
                <CardContent className="pt-5 pb-4 px-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Top Priorities Right Now
                  </p>

                  {weakAreas.length === 0 ? (
                    <div className="py-8 text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                      <p className="text-sm font-semibold text-foreground">All domains performing well</p>
                      <p className="text-xs text-muted-foreground mt-1">Keep practicing to maintain your strong scores.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weakAreas.map((area, i) => (
                        <div
                          key={area.name}
                          className={cn(
                            "flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer",
                            "hover:shadow-sm",
                            i === 0 ? "themed-card-primary-tint" : "bg-card border-border/60"
                          )}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold",
                              i === 0 ? "bg-red-100 text-red-600"
                              : i === 1 ? "bg-amber-100 text-amber-600"
                              : "themed-icon-container"
                            )}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground">{area.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {area.averageScore}% average · {area.proficiency} level
                              {i === 0 ? " — highest impact area to focus on" : ""}
                            </p>
                          </div>
                          <LocaleLink href="/practice">
                            <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 flex-shrink-0 px-2">
                              Practice <ChevronRight className="w-3 h-3" />
                            </Button>
                          </LocaleLink>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Body system mastery ── */}
            <Card className="rounded-2xl mb-5">
              <CardContent className="pt-5 pb-4 px-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Body System Mastery
                  </p>
                  <LocaleLink href="/reports">
                    <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 px-2">
                      Full Reports <ChevronRight className="w-3 h-3" />
                    </Button>
                  </LocaleLink>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bodySystems.map((sys) => {
                    const cfg = proficiencyConfig(sys.proficiency);
                    const bar = barColor(sys.proficiency);
                    return (
                      <div key={sys.name} className="p-3 rounded-xl bg-primary/[0.03] border border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm leading-none">{sys.emoji}</span>
                            <span className="text-xs font-semibold text-foreground">{sys.name}</span>
                          </div>
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cfg.cls)}>
                            {sys.averageScore > 0 ? `${sys.averageScore}%` : "—"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-700", bar)}
                            style={{ width: `${sys.averageScore}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ── Recommendations ── */}
            <Card className="rounded-2xl">
              <CardContent className="pt-5 pb-5 px-6">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  Recommended Next Steps
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* #1 — Weakest area */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center mb-3">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">
                      {weakAreas[0] ? `Practice ${weakAreas[0].name}` : "Practice Weak Areas"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {weakAreas[0]
                        ? `${weakAreas[0].averageScore}% average — your highest-impact area to study right now.`
                        : "Keep answering questions to identify your weakest areas."}
                    </p>
                    <LocaleLink href="/practice">
                      <Button size="sm" variant="outline" className="mt-3 w-full text-xs gap-1 border-red-200 text-red-700 hover:bg-red-50">
                        Go Practice <ArrowRight className="w-3 h-3" />
                      </Button>
                    </LocaleLink>
                  </div>

                  {/* #2 — Flashcards for weak areas */}
                  <div className="p-4 rounded-xl themed-card-primary-tint border">
                    <div className="themed-icon-container w-9 h-9 mb-3">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Review with Flashcards</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Spaced-repetition flashcards lock in concepts and improve recall — especially effective 7–14 days before exam day.
                    </p>
                    <LocaleLink href="/flashcards">
                      <Button size="sm" className="mt-3 w-full text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        Open Flashcards <ArrowRight className="w-3 h-3" />
                      </Button>
                    </LocaleLink>
                  </div>

                  {/* #3 — Mock exam */}
                  <div className="p-4 rounded-xl themed-card-accent2-tint border">
                    <div className="themed-icon-container-2 w-9 h-9 mb-3">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Try a Mock Exam</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Simulate real NCLEX timing and format. Mock exams reveal confidence gaps and build exam-speed discipline.
                    </p>
                    <LocaleLink href="/exam-readiness">
                      <Button size="sm" variant="outline" className="mt-3 w-full text-xs gap-1">
                        View Exam Prep <ArrowRight className="w-3 h-3" />
                      </Button>
                    </LocaleLink>
                  </div>

                </div>
              </CardContent>
            </Card>

          </>
        )}
      </main>

      <Footer />
    </>
  );
}
