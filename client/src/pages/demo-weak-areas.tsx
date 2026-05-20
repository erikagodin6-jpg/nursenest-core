import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, Target,
  BookOpen, Sparkles, ArrowRight, Shield, BarChart3,
  Minus, ChevronRight, Zap, Activity
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const DEMO_STUDENT = {
  name: "Emily Chen",
  track: "RN / NCLEX-RN",
  readiness: 74,
  highRiskTopics: 5,
  mostMissedSystem: "Renal / Electrolytes",
  priorityRecommendation: "Focus on fluid & electrolyte imbalance patterns before moving to cardiac rhythm interpretation",
  confidenceLevel: "Moderate — improving with targeted review",
};

const WEAK_AREAS = [
  { topic: "ECG Interpretation", accuracy: 58, trend: "down", risk: "High", detail: "Consistently misidentifies atrial fibrillation vs flutter; struggles with ST-segment changes in acute MI scenarios" },
  { topic: "Fluid & Electrolyte Imbalances", accuracy: 60, trend: "flat", risk: "High", detail: "Confuses hypokalemia and hyperkalemia presentations; misses critical lab value correlations with clinical symptoms" },
  { topic: "Pharmacology — Cardiac Meds", accuracy: 62, trend: "up", risk: "Improving", detail: "Improving on beta-blocker side effects but still weak on ACE inhibitor contraindications and digoxin toxicity signs" },
  { topic: "Renal Assessment & Dialysis", accuracy: 63, trend: "down", risk: "High", detail: "Difficulty distinguishing pre-renal vs intrinsic renal failure; inconsistent on dialysis access care protocols" },
  { topic: "Acid-Base Balance (ABG)", accuracy: 65, trend: "flat", risk: "Moderate", detail: "Can identify simple respiratory acidosis but struggles with mixed acid-base disorders and compensation patterns" },
  { topic: "ABG Interpretation", accuracy: 68, trend: "up", risk: "Moderate", detail: "Improving trend on metabolic alkalosis recognition; needs more practice on partially compensated states" },
];

const RISK_EXPLANATIONS = [
  { area: "ECG & Cardiac Monitoring", reason: "Emily's error pattern shows systematic confusion between similar rhythm strips. This is a priority-1 safety topic — misidentification in clinical practice directly impacts patient outcomes.", severity: "Critical" },
  { area: "Electrolyte Imbalances", reason: "Electrolyte questions frequently appear as the underlying cause in multi-step clinical scenarios. Emily's accuracy here limits performance on connected topics like cardiac and renal nursing.", severity: "High" },
  { area: "Pharmacology Integration", reason: "While drug knowledge is improving, Emily struggles when pharmacology questions require integration with pathophysiology — a common NCLEX pattern requiring clinical reasoning across domains.", severity: "Moderate" },
  { area: "Renal System Connections", reason: "Renal questions often cross-link with electrolytes, acid-base, and fluid management. Strengthening this area will create compound improvements across 3–4 other weak topics.", severity: "High" },
];

const TREND_DATA = [
  { week: "Week 1", overall: 68, weakArea: 52, confidence: 45 },
  { week: "Week 2", overall: 70, weakArea: 55, confidence: 52 },
  { week: "Week 3", overall: 72, weakArea: 59, confidence: 60 },
  { week: "Week 4", overall: 74, weakArea: 63, confidence: 65 },
];

const HEATMAP_TOPICS = [
  { name: "Cardiovascular", score: 72 },
  { name: "Respiratory", score: 81 },
  { name: "Renal / Urinary", score: 60 },
  { name: "Neurological", score: 78 },
  { name: "GI / Hepatic", score: 85 },
  { name: "Endocrine", score: 76 },
  { name: "Musculoskeletal", score: 88 },
  { name: "Maternal / Newborn", score: 82 },
  { name: "Pediatrics", score: 79 },
];

const AI_RECOMMENDATIONS = [
  "Complete a 20-question targeted ECG interpretation drill focusing specifically on atrial rhythms and ST-segment changes",
  "Review the Fluid & Electrolyte Imbalances lesson module, paying special attention to potassium and sodium clinical presentations",
  "Practice 15 integrated pharmacology scenarios that combine cardiac medications with patient assessment data",
  "Work through 3 renal case simulations emphasizing pre-renal vs intrinsic failure differentiation",
  "Take a mixed ABG interpretation quiz (10 questions) focusing on partially compensated and mixed disorders",
];

function getHeatmapColor(score: number): string {

  if (score >= 82) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function getHeatmapBg(score: number): string {
  if (score >= 82) return "#d1fae5";
  if (score >= 70) return "#fef3c7";
  return "#ffe4e6";
}

function getRiskBadgeStyle(risk: string) {
  switch (risk) {
    case "High": return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100";
    case "Moderate": return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
    case "Improving": return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    default: return "bg-gray-100 text-gray-700";
  }
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-rose-500" />;
  return <Minus className="w-4 h-4 text-amber-500" />;
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === "Critical" ? "bg-rose-500" : severity === "High" ? "bg-amber-500" : "bg-blue-400";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color} mr-2 shrink-0 mt-1.5`} />;
}

export default function DemoWeakAreas() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-[#f0fdf4] to-[#fdf2f8]">
      <Navigation />
      <SEO title={t("pages.demoWeakAreas.weakAreasAiReportDemo")} description={t("pages.demoWeakAreas.aipoweredWeakAreasAnalysisDemo")} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium text-purple-600 border border-purple-100 shadow-sm" data-testid="badge-ai-report">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Performance Intelligence
          </div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-report-title">
            Weak Areas AI Report
          </h1>
          <p className="text-gray-500 text-sm">
            {DEMO_STUDENT.name} — {DEMO_STUDENT.track} Track • Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </header>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-summary">
          <div className="bg-gradient-to-r from-purple-50 via-white to-mint-50 px-6 py-5 border-b border-purple-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Performance Summary
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-b from-purple-50 to-white border border-purple-100" data-testid="metric-readiness">
                <div className="text-3xl font-bold text-purple-600">{DEMO_STUDENT.readiness}%</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t("pages.demoWeakAreas.overallReadiness")}</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-b from-rose-50 to-white border border-rose-100" data-testid="metric-high-risk">
                <div className="text-3xl font-bold text-rose-500">{DEMO_STUDENT.highRiskTopics}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t("pages.demoWeakAreas.highriskTopics")}</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100" data-testid="metric-missed-system">
                <div className="text-lg font-bold text-amber-600 leading-tight">{DEMO_STUDENT.mostMissedSystem}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t("pages.demoWeakAreas.mostMissedSystem")}</div>
              </div>
              <div className="col-span-2 p-4 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-100" data-testid="metric-recommendation">
                <div className="text-sm text-gray-700 leading-relaxed">{DEMO_STUDENT.priorityRecommendation}</div>
                <div className="text-xs text-gray-500 mt-2 font-medium">{t("pages.demoWeakAreas.priorityReviewRecommendation")}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2" data-testid="metric-confidence">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="font-medium">{t("pages.demoWeakAreas.confidenceLevel")}</span> {DEMO_STUDENT.confidenceLevel}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-weak-areas">
          <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 px-6 py-5 border-b border-rose-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Ranked Weak Areas
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {WEAK_AREAS.map((area, i) => (
                <div
                  key={area.topic}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all bg-white"
                  data-testid={`weak-area-${i}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">{area.topic}</span>
                      <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getRiskBadgeStyle(area.risk)}`}>
                        {area.risk}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{area.detail}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <TrendIcon trend={area.trend} />
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{area.accuracy}%</div>
                      <div className="text-[10px] text-gray-400 uppercase font-medium">{t("pages.demoWeakAreas.accuracy")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-risk-breakdown">
          <div className="bg-gradient-to-r from-amber-50 via-white to-purple-50 px-6 py-5 border-b border-amber-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Why These Topics Need Review
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {RISK_EXPLANATIONS.map((item, i) => (
                <div key={i} className="flex items-start gap-1 p-4 rounded-xl bg-gray-50/80 border border-gray-100" data-testid={`risk-explanation-${i}`}>
                  <SeverityDot severity={item.severity} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{item.area}</span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                        item.severity === "Critical" ? "border-rose-200 text-rose-600 bg-rose-50" :
                        item.severity === "High" ? "border-amber-200 text-amber-600 bg-amber-50" :
                        "border-blue-200 text-blue-600 bg-blue-50"
                      }`}>
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-trend-chart">
          <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 px-6 py-5 border-b border-blue-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              4-Week Performance Trend
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="h-72" data-testid="chart-performance-trend">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#a78bfa", strokeWidth: 2, stroke: "#fff" }}
                    name="Overall Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="weakArea"
                    stroke="#f472b6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#f472b6", strokeWidth: 2, stroke: "#fff" }}
                    name="Weak-Area Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#34d399", strokeWidth: 2, stroke: "#fff" }}
                    name="Confidence Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-heatmap">
          <div className="bg-gradient-to-r from-emerald-50 via-white to-rose-50 px-6 py-5 border-b border-emerald-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-500" />
              Topic Mastery Heatmap
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-3" data-testid="heatmap-grid">
              {HEATMAP_TOPICS.map((topic) => (
                <div
                  key={topic.name}
                  className={`rounded-xl border p-4 text-center transition-all hover:scale-[1.02] ${getHeatmapColor(topic.score)}`}
                  style={{ backgroundColor: getHeatmapBg(topic.score) }}
                  data-testid={`heatmap-cell-${topic.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
                >
                  <div className="text-2xl font-bold">{topic.score}%</div>
                  <div className="text-xs font-medium mt-1 opacity-80">{topic.name}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" />
                Strong (82%+)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
                Developing (70–81%)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-200 border border-rose-300" />
                Needs Focus (&lt;70%)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" data-testid="card-recommendations">
          <div className="bg-gradient-to-r from-purple-50 via-white to-blue-50 px-6 py-5 border-b border-purple-100/50">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              AI Recommendations — Next Steps
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {AI_RECOMMENDATIONS.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100" data-testid={`recommendation-${i}`}>
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{rec}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              <Button
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 h-auto shadow-md shadow-purple-200 text-sm font-semibold"
                data-testid="button-start-weak-areas"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Weak Areas Session
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl px-6 py-3 h-auto text-sm font-semibold"
                data-testid="button-review-lesson"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Review Recommended Lesson
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400 pb-8" data-testid="text-footer-note">
          This report is generated by NurseNest AI using performance data from practice sessions, mock exams, and adaptive learning history.
          <br />Demo data for marketing purposes only.
        </div>
      </div>
    </div>
  );
}
