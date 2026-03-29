import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NURSENEST_PALETTE } from "@/lib/brand-palette";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  BookOpen, Target, Sparkles, Calendar, ArrowRight, Clock,
  Activity, Brain, Shield, Heart, Baby, Smile, Pill, Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const PALETTE = NURSENEST_PALETTE;

const READINESS = 81;
const READINESS_LABEL = "Approaching Exam Ready";
const SUGGESTED_TIMELINE = "2–4 weeks";
const CONFIDENCE = "87%";
const PASSING_PROBABILITY = "78%";

const CATEGORIES: { name: string; score: number; icon: LucideIcon; color: string }[] = [
  { name: "Safety / Infection Control", score: 86, icon: Shield, color: "#10b981" },
  { name: "Clinical Judgment", score: 84, icon: Stethoscope, color: "#8b5cf6" },
  { name: "Adult Health", score: 82, icon: Heart, color: "#ef4444" },
  { name: "Pediatrics", score: 80, icon: Baby, color: "#ec4899" },
  { name: "Prioritization", score: 79, icon: Target, color: "#3b82f6" },
  { name: "Mental Health", score: 77, icon: Smile, color: "#14b8a6" },
  { name: "Maternal / Newborn", score: 75, icon: Baby, color: "#f59e0b" },
  { name: "Pharmacology", score: 73, icon: Pill, color: "#f97316" },
];

const POSITIVE_FACTORS = [
  "Consistent daily study activity (14-day streak)",
  "Strong upward trend in cardiovascular topics (+12%)",
  "Flashcard completion rate above 90%",
  "Prioritization accuracy improved 8% this week",
  "High lesson engagement (avg 22 min/session)",
];

const RISK_FACTORS = [
  "Pharmacology accuracy below 75% threshold",
  "ECG interpretation confidence is low (62%)",
  "Renal emergency scenarios need review",
  "Sepsis timing questions averaging 68%",
  "Maternal/newborn review frequency declining",
];

const TREND_DATA = [
  { week: "Week 1", readiness: 62, accuracy: 58, confidence: 55 },
  { week: "Week 2", readiness: 67, accuracy: 64, confidence: 61 },
  { week: "Week 3", readiness: 71, accuracy: 69, confidence: 67 },
  { week: "Week 4", readiness: 76, accuracy: 74, confidence: 72 },
  { week: "Week 5", readiness: 81, accuracy: 79, confidence: 78 },
];

const ACTION_PLAN = [
  "Complete the Pharmacology Mastery module — focus on drug interactions and adverse effects",
  "Review ECG interpretation with 3 targeted practice sets (20 questions each)",
  "Run 2 renal emergency case simulations before end of week",
  "Take the Sepsis Timing mini-assessment and review incorrect answers",
  "Schedule 3 maternal/newborn flashcard sessions (15 min each) over the next 7 days",
];

function CircularGauge({ value }: { value: number }) {
  const { t } = useI18n();
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const size = radius * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke={PALETTE.border}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={PALETTE.primary}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black" style={{ color: PALETTE.text }} data-testid="text-readiness-score">
          {value}%
        </span>
        <span className="text-xs font-medium text-gray-400">{t("pages.examReadinessDemo.readiness")}</span>
      </div>
    </div>
  );
}

function CategoryBar({ name, score, icon: Icon, color }: { name: string; score: number; icon: LucideIcon; color: string }) {
  const barColor =
    score >= 85 ? "#10b981" :
    score >= 78 ? "#3b82f6" :
    score >= 73 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="flex items-center gap-3" data-testid={`category-${name.toLowerCase().replace(/[^a-z]/g, "-")}`}>
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium truncate" style={{ color: PALETTE.text }}>{name}</span>
          <span className="text-sm font-bold ml-2" style={{ color: barColor }}>{score}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ExamReadinessDemo() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.lightGray }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PALETTE.primary}20` }}>
              <Activity className="w-4 h-4" style={{ color: PALETTE.primary }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t("pages.examReadinessDemo.examReadinessPredictor")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-1" style={{ color: PALETTE.text }} data-testid="text-page-title">
            Emily Chen <span className="font-normal text-gray-400 text-xl">{t("pages.examReadinessDemo.demoStudent")}</span>
          </h1>
          <p className="text-gray-500 font-medium" data-testid="text-exam-track">{t("pages.examReadinessDemo.rnNclexPreparation")}</p>
        </div>

        <Card className="border-none shadow-lg rounded-3xl overflow-hidden mb-8" style={{ backgroundColor: PALETTE.white }} data-testid="card-hero-readiness">
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-shrink-0">
                <CircularGauge value={READINESS} />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3" style={{ backgroundColor: `${PALETTE.primary}15` }}>
                  <TrendingUp className="w-4 h-4" style={{ color: PALETTE.primary }} />
                  <span className="text-sm font-bold" style={{ color: PALETTE.primary }} data-testid="text-readiness-label">{READINESS_LABEL}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.secondary}20` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" style={{ color: "#14b8a6" }} />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadinessDemo.timeline")}</span>
                    </div>
                    <p className="text-lg font-black" style={{ color: PALETTE.text }} data-testid="text-timeline">{SUGGESTED_TIMELINE}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.accent}20` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4" style={{ color: "#f59e0b" }} />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadinessDemo.confidence")}</span>
                    </div>
                    <p className="text-lg font-black" style={{ color: PALETTE.text }} data-testid="text-confidence">{CONFIDENCE}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.highlight}30` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4" style={{ color: "#8b5cf6" }} />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadinessDemo.passProbability")}</span>
                    </div>
                    <p className="text-lg font-black" style={{ color: PALETTE.text }} data-testid="text-pass-probability">{PASSING_PROBABILITY}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4" style={{ color: PALETTE.text }} data-testid="text-breakdown-heading">{t("pages.examReadinessDemo.categoryBreakdown")}</h2>
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden mb-8" style={{ backgroundColor: PALETTE.white }} data-testid="card-category-breakdown">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {CATEGORIES.map((cat) => (
                <CategoryBar key={cat.name} {...cat} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden" style={{ backgroundColor: PALETTE.white }} data-testid="card-positive-factors">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: PALETTE.text }}>{t("pages.examReadinessDemo.factorsHelpingReadiness")}</h3>
              </div>
              <ul className="space-y-3">
                {POSITIVE_FACTORS.map((f, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`positive-factor-${i}`}>
                    <TrendingUp className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: PALETTE.text }}>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-3xl overflow-hidden" style={{ backgroundColor: PALETTE.white }} data-testid="card-risk-factors">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: PALETTE.text }}>{t("pages.examReadinessDemo.factorsLimitingReadiness")}</h3>
              </div>
              <ul className="space-y-3">
                {RISK_FACTORS.map((f, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`risk-factor-${i}`}>
                    <TrendingDown className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: PALETTE.text }}>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4" style={{ color: PALETTE.text }} data-testid="text-trend-heading">{t("pages.examReadinessDemo.predictedReadinessOverTime")}</h2>
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden mb-8" style={{ backgroundColor: PALETTE.white }} data-testid="card-trend-chart">
          <CardContent className="p-6 sm:p-8">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Line
                    type="monotone"
                    dataKey="readiness"
                    stroke={PALETTE.primary}
                    strokeWidth={3}
                    dot={{ r: 5, fill: PALETTE.primary, strokeWidth: 2, stroke: PALETTE.white }}
                    name="Readiness"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke={PALETTE.secondary.replace("E1", "B0")}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: PALETTE.secondary }}
                    name="Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke={PALETTE.accent}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: PALETTE.accent }}
                    name="Confidence"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden h-full" style={{ backgroundColor: PALETTE.white }} data-testid="card-action-plan">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PALETTE.primary}15` }}>
                    <Brain className="w-4 h-4" style={{ color: PALETTE.primary }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: PALETTE.text }}>{t("pages.examReadinessDemo.aiActionPlan")}</h3>
                </div>
                <ol className="space-y-4">
                  {ACTION_PLAN.map((step, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`action-step-${i}`}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: PALETTE.primary, color: PALETTE.white }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: PALETTE.text }}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t" style={{ borderColor: PALETTE.border }}>
                  <Button
                    className="rounded-full px-6 font-semibold"
                    style={{ backgroundColor: PALETTE.primary, color: PALETTE.white, borderColor: PALETTE.primary }}
                    data-testid="button-start-plan"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Start Readiness Plan
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full px-6 font-semibold"
                    data-testid="button-review-weak"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Review Weak Areas
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full px-6 font-semibold"
                    data-testid="button-open-lessons"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Open Suggested Lessons
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg rounded-3xl overflow-hidden" style={{ backgroundColor: PALETTE.white }} data-testid="card-testing-window">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PALETTE.secondary}20` }}>
                  <Clock className="w-4 h-4" style={{ color: "#14b8a6" }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: PALETTE.text }}>{t("pages.examReadinessDemo.recommendedTestingWindow")}</h3>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.secondary}10` }}>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{t("pages.examReadinessDemo.suggestedExamWindow")}</span>
                  <p className="text-xl font-black" style={{ color: PALETTE.text }} data-testid="text-exam-window">{t("pages.examReadinessDemo.24Weeks")}</p>
                </div>

                <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.accent}15` }}>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{t("pages.examReadinessDemo.bestImprovementOpportunity")}</span>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4" style={{ color: "#f97316" }} />
                    <p className="text-base font-bold" style={{ color: PALETTE.text }} data-testid="text-best-opportunity">{t("pages.examReadinessDemo.pharmacology")}</p>
                  </div>
                </div>

                <div className="rounded-2xl p-4" style={{ backgroundColor: `${PALETTE.highlight}20` }}>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{t("pages.examReadinessDemo.estimatedGainWith7More")}</span>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" style={{ color: "#10b981" }} />
                    <p className="text-xl font-black text-emerald-600" data-testid="text-estimated-gain">+4%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-6">
          <p className="text-xs text-gray-400">
            NurseNest.ca — Exam Readiness Predictor (Demo Data)
          </p>
        </div>
      </div>
    </div>
  );
}