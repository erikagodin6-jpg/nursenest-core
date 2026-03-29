import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
} from "recharts";
import {
  GraduationCap, TrendingUp, Brain, Clock, Target, Flame,
  BookOpen, AlertTriangle, CheckCircle2, XCircle, Sparkles,
  BarChart3, Layers, Heart,
} from "lucide-react";

const PASTEL = {
  lavender: "#9d82dd",
  lavenderLight: "#f3efff",
  mint: "#5ed3ae",
  mintLight: "#e0f8f0",
  softBlue: "#7eb8e4",
  softBlueLight: "#e3f1fb",
  peach: "#f4a87c",
  peachLight: "#fef0e6",
  blush: "#f4909f",
  blushLight: "#fdeef0",
  gold: "#f2c94c",
  goldLight: "#fef9e7",
  slate: "#94a3b8",
  slateLight: "#f1f5f9",
  teal: "#4dd0b8",
  tealLight: "#e6faf5",
  coral: "#ff8a80",
};

const systemMasteryData = [
  { name: "Cardiovascular", value: 82, color: PASTEL.lavender },
  { name: "Infection Control", value: 81, color: PASTEL.mint },
  { name: "Pediatrics", value: 79, color: PASTEL.softBlue },
  { name: "Respiratory", value: 76, color: PASTEL.peach },
  { name: "Neurology", value: 74, color: PASTEL.teal },
  { name: "Maternal Health", value: 73, color: PASTEL.blush },
  { name: "Endocrine", value: 71, color: PASTEL.gold },
  { name: "Pharmacology", value: 69, color: PASTEL.coral },
  { name: "Renal", value: 66, color: PASTEL.slate },
];

const weakAreas = [
  { topic: "Hyperkalemia Management", accuracy: 52, attempts: 18 },
  { topic: "ECG Interpretation", accuracy: 58, attempts: 24 },
  { topic: "Sepsis Recognition", accuracy: 55, attempts: 15 },
  { topic: "Ventilator Settings", accuracy: 49, attempts: 12 },
  { topic: "Insulin Therapy", accuracy: 57, attempts: 20 },
];

const recentPerformance = [
  { date: "Mar 11, 2026", topic: "Cardiac Pharmacology", result: "correct", score: "8/10" },
  { date: "Mar 10, 2026", topic: "Respiratory Assessment", result: "correct", score: "9/10" },
  { date: "Mar 9, 2026", topic: "Pediatric Dosing", result: "incorrect", score: "5/10" },
  { date: "Mar 8, 2026", topic: "Infection Control Protocols", result: "correct", score: "7/10" },
  { date: "Mar 7, 2026", topic: "Neurological Assessment", result: "incorrect", score: "6/10" },
];

const flashcardStats = [
  { label: "Studied", value: 847, total: 1248, color: PASTEL.lavender, bgColor: PASTEL.lavenderLight },
  { label: "Mastered", value: 512, total: 847, color: PASTEL.mint, bgColor: PASTEL.mintLight },
  { label: "Needs Review", value: 205, total: 847, color: PASTEL.peach, bgColor: PASTEL.peachLight },
  { label: "Flagged", value: 130, total: 847, color: PASTEL.blush, bgColor: PASTEL.blushLight },
];

const recommendations = [
  { topic: "Hyperkalemia Management", reason: "Lowest accuracy — focus on electrolyte imbalance protocols", icon: AlertTriangle },
  { topic: "Ventilator Settings", reason: "Below target — review mechanical ventilation parameters", icon: Target },
  { topic: "Sepsis Recognition", reason: "Trending down — practice qSOFA & SIRS criteria", icon: TrendingUp },
  { topic: "ECG Interpretation", reason: "High volume topic — strengthen 12-lead ECG reading skills", icon: Heart },
];

function CircularProgress({ value, total, color, bgColor, size = 80, strokeWidth = 8 }: {
  value: number; total: number; color: string; bgColor: string; size?: number; strokeWidth?: number;
}) {
  const { t } = useI18n();
  const percentage = Math.round((value / total) * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={bgColor} strokeWidth={strokeWidth} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{percentage}%</span>
    </div>
  );
}

export default function AdminDemoProgress() {
  const { user } = useAuth();
  const isAdmin = user?.tier === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#faf8ff]">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-access-denied">{t("pages.adminDemoProgress.accessDenied")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff]" data-testid="demo-progress-page">
      <Navigation />
      <SEO title={t("pages.adminDemoProgress.demoStudentProgressAdmin")} description={t("pages.adminDemoProgress.demoStudentAnalyticsDashboardFor")} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9d82dd] to-[#7b5fc7] flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Emily Chen
              <span className="text-base font-normal text-gray-500 ml-2">{t("pages.adminDemoProgress.demoStudent")}</span>
            </h1>
            <p className="text-sm text-gray-500">{t("pages.adminDemoProgress.rnNclexPreparationTrack")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-8 ml-[52px]">
          <Badge className="bg-[#f3efff] text-[#9d82dd] hover:bg-[#f3efff] border-0 text-xs" data-testid="badge-track">{t("pages.adminDemoProgress.rnTrack")}</Badge>
          <Badge className="bg-[#e0f8f0] text-[#3ba882] hover:bg-[#e0f8f0] border-0 text-xs" data-testid="badge-status">{t("pages.adminDemoProgress.active")}</Badge>
          <span className="text-xs text-gray-400">{t("pages.adminDemoProgress.enrolledSinceJan152026")}</span>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6 border-0 shadow-sm bg-white rounded-2xl overflow-hidden" data-testid="card-overall-progress">
          <div className="bg-gradient-to-r from-[#9d82dd] to-[#b8a4e8] px-6 py-4">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Overall Progress
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Overall Mastery", value: "78%", icon: Target, color: PASTEL.lavender, bg: PASTEL.lavenderLight },
                { label: "Flashcards Studied", value: "1,248", icon: Brain, color: PASTEL.mint, bg: PASTEL.mintLight },
                { label: "Questions Completed", value: "2,037", icon: BookOpen, color: PASTEL.softBlue, bg: PASTEL.softBlueLight },
                { label: "Study Time", value: "46 hrs", icon: Clock, color: PASTEL.peach, bg: PASTEL.peachLight },
                { label: "Avg Accuracy", value: "72%", icon: TrendingUp, color: PASTEL.gold, bg: PASTEL.goldLight },
                { label: "Current Streak", value: "12 days", icon: Flame, color: PASTEL.blush, bg: PASTEL.blushLight },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: stat.bg }} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* System Mastery Breakdown */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-white rounded-2xl" data-testid="card-system-mastery">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                <Layers className="h-5 w-5 text-[#9d82dd]" /> System Mastery Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={systemMasteryData} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#4b5563" }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Mastery"]}
                    contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                    {systemMasteryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weak Areas Panel */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl" data-testid="card-weak-areas">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                <AlertTriangle className="h-5 w-5 text-[#f4a87c]" /> Weak Areas
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">{t("pages.adminDemoProgress.topicsNeedingFocusedReview")}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weakAreas.map((area) => (
                  <div key={area.topic} className="flex items-center justify-between p-3 rounded-xl bg-[#fef0e6]/50 hover:bg-[#fef0e6] transition-colors" data-testid={`weak-area-${area.topic.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{area.topic}</div>
                      <div className="text-xs text-gray-400">{area.attempts} attempts</div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${area.accuracy}%`, backgroundColor: area.accuracy < 55 ? PASTEL.coral : PASTEL.peach }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-10 text-right">{area.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Performance */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl" data-testid="card-recent-performance">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                <TrendingUp className="h-5 w-5 text-[#7eb8e4]" /> Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{t("pages.adminDemoProgress.date")}</th>
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{t("pages.adminDemoProgress.topic")}</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{t("pages.adminDemoProgress.score")}</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{t("pages.adminDemoProgress.result")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPerformance.map((entry, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors" data-testid={`performance-row-${i}`}>
                        <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">{entry.date}</td>
                        <td className="py-2.5 px-3 font-medium text-gray-800">{entry.topic}</td>
                        <td className="py-2.5 px-3 text-center text-gray-600">{entry.score}</td>
                        <td className="py-2.5 px-3 text-center">
                          {entry.result === "correct" ? (
                            <Badge className="bg-[#e0f8f0] text-[#3ba882] hover:bg-[#e0f8f0] border-0 gap-1 text-xs">
                              <CheckCircle2 className="h-3 w-3" /> Pass
                            </Badge>
                          ) : (
                            <Badge className="bg-[#fdeef0] text-[#e05c6c] hover:bg-[#fdeef0] border-0 gap-1 text-xs">
                              <XCircle className="h-3 w-3" /> Review
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Flashcard Mastery Panel */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl" data-testid="card-flashcard-mastery">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                <Brain className="h-5 w-5 text-[#9d82dd]" /> Flashcard Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 py-2">
                {flashcardStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-2" data-testid={`flashcard-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CircularProgress
                      value={stat.value}
                      total={stat.total}
                      color={stat.color}
                      bgColor={stat.bgColor}
                      size={88}
                      strokeWidth={8}
                    />
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Recommendations */}
        <Card className="border-0 shadow-sm bg-white rounded-2xl mb-8" data-testid="card-study-recommendations">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-[#f2c94c]" /> AI Study Recommendations
            </CardTitle>
            <p className="text-xs text-gray-400 mt-1">{t("pages.adminDemoProgress.personalizedSuggestionsBasedOnPerformance")}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.topic}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#faf8ff] border border-[#e9e2ff]/50 hover:border-[#d4c7f7] transition-colors"
                  data-testid={`recommendation-${rec.topic.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="h-8 w-8 rounded-lg bg-[#f3efff] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <rec.icon className="h-4 w-4 text-[#9d82dd]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{rec.topic}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{rec.reason}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-gradient-to-r from-[#9d82dd] to-[#b8a4e8] hover:from-[#8b6fd0] hover:to-[#a992db] text-white rounded-xl h-11 font-medium"
              data-testid="button-start-recommended-session"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Recommended Flashcard Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
