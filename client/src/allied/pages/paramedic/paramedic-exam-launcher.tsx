import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { EXAM_CONFIGS } from "./paramedic-exam-simulator";
import { useI18n } from "@/lib/i18n";
import {
  FileText, Brain, Zap, ArrowRight, CheckCircle2,
  AlertTriangle, Shield
} from "lucide-react";

interface CategoryInfo {
  category: string;
  count: number;
}

const MODE_CARDS = [
  {
    mode: "practice",
    title: "Practice Mode",
    description: "Questions one at a time with rationale shown immediately after answering. No timer pressure — learn at your own pace.",
    icon: FileText,
    color: "teal",
    features: ["Immediate rationale", "No timer", "Learn at your pace", "Full domain coverage"],
  },
  {
    mode: "exam",
    title: "Exam Mode",
    description: "Full timed exam simulating real certification conditions. Navigate freely, flag questions, rationale hidden until submission.",
    icon: Shield,
    color: "purple",
    features: ["Timed like real exam", "Question navigator", "Flag & bookmark", "Results after submission"],
  },
  {
    mode: "adaptive",
    title: "Adaptive Mode",
    description: "Difficulty adjusts based on your performance. Correct answers increase difficulty, wrong answers decrease it.",
    icon: Brain,
    color: "blue",
    features: ["Dynamic difficulty", "Ability estimation", "Confidence-based", "Personalized challenge"],
  },
  {
    mode: "drill",
    title: "Drill Mode",
    description: "Rapid-fire questions filtered by a single topic. Immediate feedback with streak tracking. Perfect for targeting weak areas.",
    icon: Zap,
    color: "amber",
    features: ["Single topic focus", "Streak tracking", "Immediate feedback", "Rapid-fire format"],
  },
];

const EXAM_TYPES = [
  { value: "nremt", label: "NREMT Paramedic", questions: 100, time: 120 },
  { value: "copr-pcp", label: "COPR PCP", questions: 80, time: 120 },
  { value: "copr-acp", label: "COPR ACP", questions: 100, time: 150 },
];

export default function ParamedicExamLauncher() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [examType, setExamType] = useState("nremt");
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [drillTopic, setDrillTopic] = useState("");
  const [drillCount, setDrillCount] = useState(20);
  const [adaptiveMax, setAdaptiveMax] = useState(50);
  const [practiceCount, setPracticeCount] = useState(30);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest("GET", "/api/paramedic/exam-categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0 && !drillTopic) setDrillTopic(data[0].category);
      })
      .catch(() => {});
  }, []);

  const totalQuestionCount = categories.reduce((sum, c) => sum + c.count, 0);

  const handleStartExam = async () => {
    if (!user || !selectedMode) return;
    setCreating(true);
    setError(null);

    try {
      let totalQuestions = 0;
      let timeLimit: number | null = null;
      let topic: string | null = null;

      if (selectedMode === "exam") {
        const config = EXAM_CONFIGS[examType];
        totalQuestions = config.questions;
        timeLimit = config.timeMinutes;
      } else if (selectedMode === "practice") {
        totalQuestions = practiceCount;
      } else if (selectedMode === "adaptive") {
        totalQuestions = adaptiveMax;
      } else if (selectedMode === "drill") {
        totalQuestions = drillCount;
        topic = drillTopic;
      }

      const res = await apiRequest("POST", "/api/paramedic/exam-sessions", {
        mode: selectedMode,
        examType,
        totalQuestions,
        timeLimit,
        drillTopic: topic,
      });

      const session = await res.json();
      if (session.error) {
        setError(session.error);
        return;
      }
      navigate(`/allied-health/paramedic/exam-simulator/${session.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to create exam session");
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="launcher-login-required">
        <div className="text-center max-w-md px-6">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicExamLauncher.signInRequired")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.paramedicParamedicExamLauncher.createAFreeAccountTo")}</p>
          <a href="/login" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="link-login">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="paramedic-exam-launcher">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/allied-health/paramedic" className="hover:text-teal-600" data-testid="breadcrumb-paramedic">{t("allied.paramedicParamedicExamLauncher.paramedic")}</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href="/allied-health/paramedic/practice-exams" className="hover:text-teal-600" data-testid="breadcrumb-practice-exams">{t("allied.paramedicParamedicExamLauncher.practiceExams")}</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-teal-700 font-medium">{t("allied.paramedicParamedicExamLauncher.startExam")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-launcher-title">
            Start a Practice Exam
          </h1>
          <p className="text-gray-600 mt-2">{t("allied.paramedicParamedicExamLauncher.chooseYourModeExamType")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("allied.paramedicParamedicExamLauncher.1SelectMode")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODE_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedMode === card.mode;
              const colorMap: Record<string, string> = {
                teal: isSelected ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200" : "border-gray-200 hover:border-teal-300",
                purple: isSelected ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200" : "border-gray-200 hover:border-purple-300",
                blue: isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300",
                amber: isSelected ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200" : "border-gray-200 hover:border-amber-300",
              };
              const iconColorMap: Record<string, string> = {
                teal: "text-teal-500", purple: "text-purple-500", blue: "text-blue-500", amber: "text-amber-500",
              };

              return (
                <button
                  key={card.mode}
                  onClick={() => setSelectedMode(card.mode)}
                  className={`bg-white rounded-2xl border-2 p-5 text-left transition-all ${colorMap[card.color]}`}
                  data-testid={`mode-card-${card.mode}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-7 h-7 ${iconColorMap[card.color]}`} />
                    <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{card.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.features.map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" /> {f}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedMode && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">{t("allied.paramedicParamedicExamLauncher.2ConfigureSession")}</h2>

            {selectedMode !== "drill" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">{t("allied.paramedicParamedicExamLauncher.examType")}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EXAM_TYPES.map(et => (
                    <button
                      key={et.value}
                      onClick={() => setExamType(et.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        examType === et.value ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"
                      }`}
                      data-testid={`exam-type-${et.value}`}
                    >
                      <div className="font-semibold text-sm text-gray-900">{et.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {et.questions} questions · {et.time} min
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMode === "drill" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">{t("allied.paramedicParamedicExamLauncher.topicCategory")}</label>
                  <select
                    value={drillTopic}
                    onChange={(e) => setDrillTopic(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none"
                    data-testid="select-drill-topic"
                  >
                    {categories.map(c => (
                      <option key={c.category} value={c.category}>{c.category} ({c.count} questions)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">{t("allied.paramedicParamedicExamLauncher.numberOfQuestions")}</label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={drillCount}
                    onChange={(e) => setDrillCount(Number(e.target.value))}
                    className="w-full"
                    data-testid="input-drill-count"
                  />
                  <p className="text-sm text-gray-500 mt-1">{drillCount} questions</p>
                </div>
              </>
            )}

            {selectedMode === "practice" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">{t("allied.paramedicParamedicExamLauncher.numberOfQuestions2")}</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={practiceCount}
                  onChange={(e) => setPracticeCount(Number(e.target.value))}
                  className="w-full"
                  data-testid="input-practice-count"
                />
                <p className="text-sm text-gray-500 mt-1">{practiceCount} questions (blueprint-weighted)</p>
              </div>
            )}

            {selectedMode === "adaptive" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">{t("allied.paramedicParamedicExamLauncher.maximumQuestions")}</label>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={adaptiveMax}
                  onChange={(e) => setAdaptiveMax(Number(e.target.value))}
                  className="w-full"
                  data-testid="input-adaptive-max"
                />
                <p className="text-sm text-gray-500 mt-1">Up to {adaptiveMax} questions (may end early if confidence reached)</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" data-testid="error-message">
                {error}
              </div>
            )}

            <button
              onClick={handleStartExam}
              disabled={creating}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              data-testid="button-start-exam"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  Start {selectedMode === "exam" ? "Timed " : ""}
                  {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Exam
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("allied.paramedicParamedicExamLauncher.questionPoolStats")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-700">{totalQuestionCount || "—"}</div>
              <div className="text-xs text-gray-500">{t("allied.paramedicParamedicExamLauncher.totalQuestions")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">{categories.length || "—"}</div>
              <div className="text-xs text-gray-500">{t("allied.paramedicParamedicExamLauncher.categories")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">5</div>
              <div className="text-xs text-gray-500">{t("allied.paramedicParamedicExamLauncher.difficultyLevels")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">3</div>
              <div className="text-xs text-gray-500">{t("allied.paramedicParamedicExamLauncher.examTypes")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">4</div>
              <div className="text-xs text-gray-500">{t("allied.paramedicParamedicExamLauncher.studyModes")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
