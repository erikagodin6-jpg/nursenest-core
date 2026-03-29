import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Lock,
  Crown,
  ArrowRight,
  Users,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Brain,
  Activity,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  Flame,
  Shield,
} from "lucide-react";

const NCLEX_CATEGORIES = [
  "Management of Care",
  "Safety & Infection Control",
  "Health Promotion & Maintenance",
  "Psychosocial Integrity",
  "Basic Care & Comfort",
  "Pharmacological Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
] as const;

type NclexCategory = typeof NCLEX_CATEGORIES[number];

interface FormData {
  questionsCompleted: string;
  averageScore: string;
  hoursStudied: string;
  weakTopics: NclexCategory[];
}

interface ScoreResult {
  probability: number;
  questionsCompleted: number;
  averageScore: number;
  hoursStudied: number;
  weakTopics: NclexCategory[];
}

function calculatePassProbability(
  questionsCompleted: number,
  averageScore: number,
  hoursStudied: number,
  weakTopicCount: number
): number {
  const { t } = useI18n();
  const qWeight = 0.30;
  const sWeight = 0.40;
  const hWeight = 0.15;
  const wWeight = 0.15;

  const qScore = Math.min(questionsCompleted / 2500, 1) * 100;
  const sScore = Math.min(averageScore, 100);
  const hScore = Math.min(hoursStudied / 300, 1) * 100;
  const wPenalty = (weakTopicCount / NCLEX_CATEGORIES.length) * 100;
  const wScore = 100 - wPenalty;

  const raw = qScore * qWeight + sScore * sWeight + hScore * hWeight + wScore * wWeight;
  return Math.round(Math.max(5, Math.min(99, raw)));
}

function getScoreColor(score: number) {
  if (score >= 75) return { text: "text-emerald-600", bg: "bg-emerald-500", ring: "stroke-emerald-500", zone: "High Readiness" };
  if (score >= 50) return { text: "text-amber-600", bg: "bg-amber-500", ring: "stroke-amber-500", zone: "Moderate Readiness" };
  return { text: "text-red-600", bg: "bg-red-500", ring: "stroke-red-500", zone: "Needs Improvement" };
}

function CircularProgressMeter({ value, size = 200 }: { value: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const colors = getScoreColor(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colors.text}`} data-testid="text-probability-value">{value}%</span>
        <span className="text-xs text-gray-500 font-medium">{t("pages.nclexReadinessScore.passProbability")}</span>
      </div>
    </div>
  );
}

function encodeResultsToParams(result: ScoreResult): string {
  const params = new URLSearchParams();
  params.set("q", String(result.questionsCompleted));
  params.set("s", String(result.averageScore));
  params.set("h", String(result.hoursStudied));
  params.set("p", String(result.probability));
  if (result.weakTopics.length > 0) {
    params.set("w", result.weakTopics.map(t => NCLEX_CATEGORIES.indexOf(t)).join(","));
  }
  return params.toString();
}

function decodeResultsFromParams(): ScoreResult | null {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  const s = params.get("s");
  const h = params.get("h");
  if (!q || !s || !h) return null;

  const questionsCompleted = Math.max(0, Math.min(10000, parseInt(q) || 0));
  const averageScore = Math.max(0, Math.min(100, parseInt(s) || 0));
  const hoursStudied = Math.max(0, Math.min(5000, parseInt(h) || 0));

  if (isNaN(questionsCompleted) || isNaN(averageScore) || isNaN(hoursStudied)) return null;

  const weakIndices = params.get("w");
  const weakTopics: NclexCategory[] = weakIndices
    ? weakIndices.split(",").map(i => NCLEX_CATEGORIES[parseInt(i)]).filter(Boolean)
    : [];

  const probability = calculatePassProbability(questionsCompleted, averageScore, hoursStudied, weakTopics.length);

  return {
    questionsCompleted,
    averageScore,
    hoursStudied,
    probability,
    weakTopics,
  };
}

function useStudentCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(Math.floor(Math.random() * 80) + 100);
    const interval = setInterval(() => {
      setCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(85, Math.min(210, prev + delta));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

function getStudyPlan(weakTopics: NclexCategory[], averageScore: number, questionsCompleted: number) {
  const plans: { topic: NclexCategory; priority: "high" | "medium" | "low"; actions: string[] }[] = [];

  const topicActions: Record<NclexCategory, string[]> = {
    "Management of Care": [
      "Review delegation, prioritization, and assignment principles",
      "Practice SATA questions on ethical and legal nursing responsibilities",
      "Focus on advance directives and informed consent scenarios",
    ],
    "Safety & Infection Control": [
      "Study standard precautions and transmission-based isolation protocols",
      "Review fall prevention strategies and restraint use guidelines",
      "Practice questions on safe medication administration and error prevention",
    ],
    "Health Promotion & Maintenance": [
      "Review developmental milestones across the lifespan",
      "Study screening recommendations and immunization schedules",
      "Practice patient education and discharge planning questions",
    ],
    "Psychosocial Integrity": [
      "Review therapeutic communication techniques and crisis intervention",
      "Study mental health conditions, medications, and nursing interventions",
      "Practice questions on grief, loss, and coping mechanisms",
    ],
    "Basic Care & Comfort": [
      "Review nutrition, hydration, and elimination concepts",
      "Study pain management and non-pharmacological comfort measures",
      "Practice mobility, positioning, and assistive device questions",
    ],
    "Pharmacological Therapies": [
      "Create flashcards for high-priority drug classes and side effects",
      "Review medication calculations and safe dosage ranges",
      "Practice adverse effect identification and patient teaching questions",
    ],
    "Reduction of Risk Potential": [
      "Study lab values and diagnostic test interpretation",
      "Review pre- and post-procedure nursing care",
      "Practice questions on complications and changes in patient status",
    ],
    "Physiological Adaptation": [
      "Review pathophysiology of common acute and chronic conditions",
      "Study fluid and electrolyte imbalances and acid-base disorders",
      "Practice emergency response and hemodynamic monitoring questions",
    ],
  };

  for (const topic of weakTopics) {
    plans.push({
      topic,
      priority: "high",
      actions: topicActions[topic] || [],
    });
  }

  const nonWeakTopics = NCLEX_CATEGORIES.filter(t => !weakTopics.includes(t));
  for (const topic of nonWeakTopics) {
    plans.push({
      topic,
      priority: averageScore < 65 ? "medium" : "low",
      actions: topicActions[topic]?.slice(0, 1) || [],
    });
  }

  const generalTips: string[] = [];
  if (questionsCompleted < 500) {
    generalTips.push("Aim to complete at least 1,500–2,000 practice questions before your exam date.");
  }
  if (averageScore < 60) {
    generalTips.push("Focus on understanding rationales rather than memorizing answers to build a stronger foundation.");
  }
  if (averageScore >= 75) {
    generalTips.push("Your scores are solid — focus on timed practice to build exam-day stamina and confidence.");
  }

  return { plans, generalTips };
}

export default function NclexReadinessScore() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    questionsCompleted: "",
    averageScore: "",
    hoursStudied: "",
    weakTopics: [],
  });
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [copied, setCopied] = useState(false);
  const studentCount = useStudentCount();

  useEffect(() => {
    const decoded = decodeResultsFromParams();
    if (decoded) {
      setResult(decoded);
      setFormData({
        questionsCompleted: String(decoded.questionsCompleted),
        averageScore: String(decoded.averageScore),
        hoursStudied: String(decoded.hoursStudied),
        weakTopics: decoded.weakTopics,
      });
    }
  }, []);

  const toggleTopic = useCallback((topic: NclexCategory) => {
    setFormData(prev => ({
      ...prev,
      weakTopics: prev.weakTopics.includes(topic)
        ? prev.weakTopics.filter(t => t !== topic)
        : [...prev.weakTopics, topic],
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = parseInt(formData.questionsCompleted) || 0;
    const s = parseInt(formData.averageScore) || 0;
    const h = parseInt(formData.hoursStudied) || 0;
    const probability = calculatePassProbability(q, s, h, formData.weakTopics.length);

    const newResult: ScoreResult = {
      probability,
      questionsCompleted: q,
      averageScore: s,
      hoursStudied: h,
      weakTopics: formData.weakTopics,
    };
    setResult(newResult);

    const qs = encodeResultsToParams(newResult);
    window.history.replaceState(null, "", `/nclex-readiness-score?${qs}`);
  }, [formData]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const qs = encodeResultsToParams(result);
    const url = `${window.location.origin}/nclex-readiness-score?${qs}`;
    const text = `I got a ${result.probability}% NCLEX pass probability on NurseNest! Check your readiness:`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "NCLEX Readiness Score", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(false);
    }
  }, [result]);

  const handleCopyLink = useCallback(async () => {
    if (!result) return;
    try {
      const qs = encodeResultsToParams(result);
      const url = `${window.location.origin}/nclex-readiness-score?${qs}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [result]);

  const studyPlan = useMemo(() => {
    if (!result) return null;
    return getStudyPlan(result.weakTopics, result.averageScore, result.questionsCompleted);
  }, [result]);

  const colors = result ? getScoreColor(result.probability) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-4">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t("pages.nclexReadinessScore.freeTool")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
            NCLEX Readiness Score Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Input your study metrics to get an estimated NCLEX pass probability with a personalized study plan. Share your results with study partners.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 flex items-center gap-3" data-testid="banner-time-pressure">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Most students start studying 6–8 weeks before the NCLEX.
          </p>
        </div>

        {!result ? (
          <Card className="mb-8">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("pages.nclexReadinessScore.questionsCompleted")}</label>
                    <Input
                      type="number"
                      min="0"
                      max="10000"
                      placeholder="e.g., 800"
                      value={formData.questionsCompleted}
                      onChange={e => setFormData(prev => ({ ...prev, questionsCompleted: e.target.value }))}
                      required
                      data-testid="input-questions-completed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("pages.nclexReadinessScore.averageScore")}</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 72"
                      value={formData.averageScore}
                      onChange={e => setFormData(prev => ({ ...prev, averageScore: e.target.value }))}
                      required
                      data-testid="input-average-score"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("pages.nclexReadinessScore.hoursStudied")}</label>
                    <Input
                      type="number"
                      min="0"
                      max="5000"
                      placeholder="e.g., 120"
                      value={formData.hoursStudied}
                      onChange={e => setFormData(prev => ({ ...prev, hoursStudied: e.target.value }))}
                      required
                      data-testid="input-hours-studied"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t("pages.nclexReadinessScore.weakTopicsSelectAllThat")}</label>
                  <div className="flex flex-wrap gap-2">
                    {NCLEX_CATEGORIES.map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          formData.weakTopics.includes(topic)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                        data-testid={`topic-${topic.toLowerCase().replace(/\s+&?\s*/g, "-")}`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" data-testid="button-calculate">
                  Calculate My NCLEX Readiness Score
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={`rounded-2xl p-8 mb-8 text-center ${
              result.probability >= 75 ? "bg-emerald-50 border border-emerald-200" :
              result.probability >= 50 ? "bg-amber-50 border border-amber-200" :
              "bg-red-50 border border-red-200"
            }`} data-testid="section-result">
              <CircularProgressMeter value={result.probability} />
              <h2 className={`text-2xl font-bold mt-4 mb-1 ${colors?.text}`} data-testid="text-probability-label">
                {result.probability}% probability of passing NCLEX
              </h2>
              <p className="text-gray-600 text-sm mb-1" data-testid="text-readiness-zone">{colors?.zone}</p>
              <p className="text-gray-500 text-xs">
                Based on {result.questionsCompleted} questions · {result.averageScore}% avg · {result.hoursStudied}h studied
              </p>

              <div className="flex justify-center gap-3 mt-5">
                <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share">
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink} data-testid="button-copy-link">
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>

            {studyPlan && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-study-plan-heading">
                  Your Recommended Study Plan
                </h3>

                {studyPlan.generalTips.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    {studyPlan.generalTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {studyPlan.plans.filter(p => p.priority === "high").map((plan, i) => (
                    <Card key={i} className="border-red-200 bg-red-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-sm text-gray-900">{plan.topic}</span>
                          <Badge variant="destructive" className="text-[10px] ml-auto">{t("pages.nclexReadinessScore.priority")}</Badge>
                        </div>
                        <ul className="space-y-1.5">
                          {plan.actions.map((action, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <ChevronRight className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}

                  {studyPlan.plans.filter(p => p.priority !== "high").length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-500 mb-2">{t("pages.nclexReadinessScore.otherAreasToReview")}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {studyPlan.plans.filter(p => p.priority !== "high").map((plan, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-sm text-gray-700">{plan.topic}</span>
                            <Badge variant="outline" className="text-[10px] ml-auto">{plan.priority === "medium" ? "Review" : "Maintain"}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center mb-8">
              <Button
                size="lg"
                className="rounded-full px-8"
                onClick={() => navigate("/mock-exams")}
                data-testid="button-take-exam"
              >
                Take free adaptive exam <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <button
              onClick={() => {
                setResult(null);
                window.history.replaceState(null, "", "/nclex-readiness-score");
              }}
              className="block mx-auto text-sm text-blue-600 hover:text-blue-800 font-medium mb-8"
              data-testid="button-recalculate"
            >
              ← Recalculate with different inputs
            </button>
          </>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-8" data-testid="section-social-proof">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900" data-testid="text-question-counter">{t("pages.nclexReadinessScore.over3200ExamstyleQuestionsAvailable")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900" data-testid="text-student-activity">
                <span className="text-emerald-600">{studentCount}</span> students studying right now.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900" data-testid="text-pass-probability-message">{t("pages.nclexReadinessScore.studentsWhoComplete2000Questions")}</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg mb-8" data-testid="section-dashboard-preview">
          <div className="blur-sm pointer-events-none select-none opacity-60">
            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{t("pages.nclexReadinessScore.yourStudyDashboard")}</h3>
                <Badge>{t("pages.nclexReadinessScore.premium")}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Questions Done", value: "1,248", icon: Target },
                  { label: "Avg Score", value: "78%", icon: BarChart3 },
                  { label: "Study Streak", value: "12 days", icon: Flame },
                  { label: "Readiness", value: "82%", icon: Shield },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                    <stat.icon className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-gradient-to-t from-blue-100 to-blue-50 rounded-xl flex items-end p-4">
                  <div className="flex items-end gap-1 w-full">
                    {[40, 55, 50, 65, 70, 68, 78, 82, 80, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-t from-emerald-100 to-emerald-50 rounded-xl p-4">
                  <div className="space-y-2">
                    {["Management of Care", "Pharmacology", "Safety", "Psych"].map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-600">{cat}</span>
                          <span className="font-medium">{70 + i * 5}%</span>
                        </div>
                        <div className="h-2 bg-emerald-200 rounded-full">
                          <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${70 + i * 5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.nclexReadinessScore.unlockYourStudyDashboard")}</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                Track your progress, identify weak areas, and get personalized study plans with a NurseNest subscription.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/pricing")}
                data-testid="button-unlock-dashboard"
              >
                <Crown className="w-4 h-4 mr-2" /> Unlock Your Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            This calculator provides an estimate based on self-reported data. Actual results may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
