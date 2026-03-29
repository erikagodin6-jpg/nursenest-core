import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  Radio, AlertTriangle, CheckCircle2, ChevronRight, ArrowRight, ArrowLeft,
  Clock, Activity, Stethoscope, ClipboardList, Heart, BookOpen,
  Shield, Eye, Target, RotateCcw, ChevronDown, ChevronUp
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
interface DecisionPoint {
  id: string;
  prompt: string;
  choices: { label: string; isCorrect: boolean; feedback: string }[];
}

interface VitalSigns {
  hr?: string;
  bp?: string;
  rr?: string;
  spo2?: string;
  temp?: string;
  gcs?: string;
  glucose?: string;
  etco2?: string;
  [key: string]: string | undefined;
}

interface PatientHistory {
  chiefComplaint?: string;
  hpi?: string;
  pmh?: string[];
  medications?: string[];
  allergies?: string[];
  socialHistory?: string;
  [key: string]: any;
}

interface Scenario {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: number;
  professionTrack: string;
  examRelevance: string;
  dispatchInfo: string;
  sceneDescription: string;
  sceneSafety: string;
  primaryAssessment: string;
  secondaryAssessment: string;
  vitalSigns: VitalSigns;
  history: PatientHistory;
  decisionPoints: DecisionPoint[];
  correctInterventions: string[];
  commonErrors: string[];
  debrief: string;
  learningObjectives: string[];
  relatedLessonSlugs: string[];
}

type SimStep = "dispatch" | "scene" | "primary" | "vitals" | "secondary" | "history" | "decisions" | "debrief";

const STEPS: { id: SimStep; label: string; icon: any }[] = [
  { id: "dispatch", label: "Dispatch", icon: Radio },
  { id: "scene", label: "Scene Size-Up", icon: Eye },
  { id: "primary", label: "Primary Assessment", icon: Stethoscope },
  { id: "vitals", label: "Vital Signs", icon: Activity },
  { id: "secondary", label: "Secondary Assessment", icon: ClipboardList },
  { id: "history", label: "Patient History", icon: BookOpen },
  { id: "decisions", label: "Decision Points", icon: Target },
  { id: "debrief", label: "Debrief", icon: CheckCircle2 },
];

function DifficultyBadge({ level }: { level: number }) {
  const { t } = useI18n();
  const labels = ["", "Easy", "Moderate", "Intermediate", "Advanced", "Expert"];
  const colors = ["", "bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-yellow-100 text-yellow-700", "bg-orange-100 text-orange-700", "bg-red-100 text-red-700"];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[level] || colors[3]}`} data-testid="badge-difficulty">{labels[level] || "Intermediate"}</span>;
}

function VitalSignsPanel({ vitals }: { vitals: VitalSigns }) {
  const vitalEntries = Object.entries(vitals).filter(([_, v]) => v);
  const labels: Record<string, string> = {
    hr: "Heart Rate", bp: "Blood Pressure", rr: "Respiratory Rate",
    spo2: "SpO₂", temp: "Temperature", gcs: "GCS", glucose: "Blood Glucose",
    etco2: "EtCO₂", painScale: "Pain Scale",
  };
  if (vitalEntries.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="vitals-panel">
      {vitalEntries.map(([key, val]) => (
        <div key={key} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">{labels[key] || key}</div>
          <div className="text-lg font-bold text-gray-900">{val}</div>
        </div>
      ))}
    </div>
  );
}

function HistoryPanel({ history }: { history: PatientHistory }) {
  return (
    <div className="space-y-4" data-testid="history-panel">
      {history.chiefComplaint && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.chiefComplaint")}</h4>
          <p className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 p-3">{history.chiefComplaint}</p>
        </div>
      )}
      {history.hpi && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.historyOfPresentIllness")}</h4>
          <p className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 p-3">{history.hpi}</p>
        </div>
      )}
      {history.pmh && history.pmh.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.pastMedicalHistory")}</h4>
          <ul className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 p-3 space-y-1">
            {history.pmh.map((item: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-teal-500 mt-1">•</span> {item}</li>)}
          </ul>
        </div>
      )}
      {history.medications && history.medications.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.medications")}</h4>
          <ul className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 p-3 space-y-1">
            {history.medications.map((item: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> {item}</li>)}
          </ul>
        </div>
      )}
      {history.allergies && history.allergies.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.allergies")}</h4>
          <div className="flex flex-wrap gap-2">
            {history.allergies.map((a: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-100">{a}</span>
            ))}
          </div>
        </div>
      )}
      {history.socialHistory && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{t("allied.paramedicScenarioPlayer.socialHistory")}</h4>
          <p className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 p-3">{history.socialHistory}</p>
        </div>
      )}
    </div>
  );
}

export default function ParamedicScenarioPlayer() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<SimStep>("dispatch");
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [answeredDecisions, setAnsweredDecisions] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [showExpandedDebrief, setShowExpandedDebrief] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/allied/scenarios/by-slug/${params.slug}`);
        if (!res.ok) throw new Error("Scenario not found");
        const data = await res.json();
        setScenario(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) load();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.paramedicScenarioPlayer.scenarioNotFound")}</h1>
        <p className="text-gray-600 mb-4">{error || "This scenario doesn't exist or hasn't been published yet."}</p>
        <Link href="/allied-health/paramedic/scenarios" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-scenarios">
          Back to Scenarios
        </Link>
      </div>
    );
  }

  const stepIdx = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((stepIdx + 1) / STEPS.length) * 100;
  const totalDecisions = scenario.decisionPoints?.length || 0;

  const handleAnswer = (dpId: string, choiceIdx: number, isCorrect: boolean) => {
    if (answeredDecisions.has(dpId)) return;
    setSelectedChoices(prev => ({ ...prev, [dpId]: choiceIdx }));
    setAnsweredDecisions(prev => new Set(prev).add(dpId));
    if (isCorrect) setScore(s => s + 1);
  };

  const nextStep = () => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      if (currentStep === "decisions" && decisionIdx < totalDecisions - 1) {
        setDecisionIdx(i => i + 1);
      } else {
        setCurrentStep(STEPS[idx + 1].id);
        if (STEPS[idx + 1].id === "decisions") setDecisionIdx(0);
      }
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (currentStep === "decisions" && decisionIdx > 0) {
      setDecisionIdx(i => i - 1);
    } else if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].id);
    }
  };

  const restart = () => {
    setCurrentStep("dispatch");
    setDecisionIdx(0);
    setSelectedChoices({});
    setAnsweredDecisions(new Set());
    setScore(0);
    setShowExpandedDebrief(false);
  };

  const canAdvance = () => {
    if (currentStep === "decisions") {
      const dp = scenario.decisionPoints?.[decisionIdx];
      if (dp && !answeredDecisions.has(dp.id)) return false;
    }
    return currentStep !== "debrief";
  };

  const getNextLabel = () => {
    if (currentStep === "decisions" && decisionIdx < totalDecisions - 1) return "Next Decision";
    if (currentStep === "decisions" && decisionIdx === totalDecisions - 1) return "View Debrief";
    const idx = STEPS.findIndex(s => s.id === currentStep);
    return idx < STEPS.length - 1 ? `Proceed: ${STEPS[idx + 1].label}` : "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="scenario-player">
      <AlliedSEO
        title={`${scenario.title} - Paramedic Scenario Simulation`}
        description={`Practice ${scenario.category} clinical decision-making with this realistic EMS scenario simulation.`}
        keywords={`paramedic scenario, EMS simulation, ${scenario.category}, clinical decision making`}
        canonicalPath={`/allied-health/paramedic/scenarios/${scenario.slug}`}
      />

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/allied-health/paramedic" className="hover:text-teal-600" data-testid="link-breadcrumb-career">{t("allied.paramedicScenarioPlayer.paramedic")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/allied-health/paramedic/scenarios" className="hover:text-teal-600" data-testid="link-breadcrumb-scenarios">{t("allied.paramedicScenarioPlayer.scenarios")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium truncate">{scenario.title}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900" data-testid="text-scenario-title">{scenario.title}</h1>
        <div className="flex items-center gap-2">
          <DifficultyBadge level={scenario.difficulty} />
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{scenario.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} data-testid="progress-bar" />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{stepIdx + 1}/{STEPS.length}</span>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STEPS.map((step, i) => {
          const isActive = step.id === currentStep;
          const isPast = i < stepIdx;
          return (
            <button
              key={step.id}
              onClick={() => i <= stepIdx && setCurrentStep(step.id)}
              disabled={i > stepIdx}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-teal-600 text-white" :
                isPast ? "bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer" :
                "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
              data-testid={`step-${step.id}`}
            >
              <step.icon className="w-3.5 h-3.5" />
              {step.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 min-h-[300px]">
        {currentStep === "dispatch" && (
          <div data-testid="step-content-dispatch">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Radio className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.dispatchInformation")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.youReceiveTheFollowingCall")}</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <p className="text-sm text-red-900 leading-relaxed whitespace-pre-wrap" data-testid="text-dispatch-info">{scenario.dispatchInfo}</p>
            </div>
          </div>
        )}

        {currentStep === "scene" && (
          <div data-testid="step-content-scene">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.sceneSizeup")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.assessTheSceneBeforeApproaching")}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("allied.paramedicScenarioPlayer.sceneDescription")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap" data-testid="text-scene-description">{scenario.sceneDescription}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-amber-800">{t("allied.paramedicScenarioPlayer.sceneSafety")}</h3>
                </div>
                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap" data-testid="text-scene-safety">{scenario.sceneSafety}</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === "primary" && (
          <div data-testid="step-content-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.primaryAssessment")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.abcdeMarchApproach")}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap" data-testid="text-primary-assessment">{scenario.primaryAssessment}</p>
            </div>
          </div>
        )}

        {currentStep === "vitals" && (
          <div data-testid="step-content-vitals">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.vitalSigns")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.initialSetOfVitalsObtained")}</p>
              </div>
            </div>
            <VitalSignsPanel vitals={scenario.vitalSigns} />
          </div>
        )}

        {currentStep === "secondary" && (
          <div data-testid="step-content-secondary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.secondaryAssessment")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.headtotoeFocusedExamination")}</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <p className="text-sm text-purple-900 leading-relaxed whitespace-pre-wrap" data-testid="text-secondary-assessment">{scenario.secondaryAssessment}</p>
            </div>
          </div>
        )}

        {currentStep === "history" && (
          <div data-testid="step-content-history">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.patientHistory")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.sampleOpqrstFindings")}</p>
              </div>
            </div>
            <HistoryPanel history={scenario.history} />
          </div>
        )}

        {currentStep === "decisions" && scenario.decisionPoints?.[decisionIdx] && (
          <div data-testid="step-content-decisions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Decision Point {decisionIdx + 1} of {totalDecisions}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.chooseTheBestCourseOf")}</p>
              </div>
            </div>
            {(() => {
              const dp = scenario.decisionPoints[decisionIdx];
              const isAnswered = answeredDecisions.has(dp.id);
              const selectedIdx = selectedChoices[dp.id];
              return (
                <div>
                  <p className="font-medium text-gray-900 mb-4 text-sm" data-testid="text-decision-prompt">{dp.prompt}</p>
                  <div className="space-y-3">
                    {dp.choices.map((choice, idx) => {
                      let cls = "border-gray-200 hover:border-teal-300 cursor-pointer";
                      if (isAnswered) {
                        if (choice.isCorrect) cls = "border-green-300 bg-green-50";
                        else if (idx === selectedIdx && !choice.isCorrect) cls = "border-red-300 bg-red-50";
                        else cls = "border-gray-100 opacity-60";
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(dp.id, idx, choice.isCorrect)}
                          disabled={isAnswered}
                          className={`w-full text-left px-4 py-3 rounded-xl border ${cls} transition-all text-sm text-gray-700`}
                          data-testid={`decision-choice-${idx}`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {choice.label}
                          {isAnswered && (
                            <p className="mt-2 text-xs text-gray-500 italic">{choice.feedback}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {currentStep === "debrief" && (
          <div data-testid="step-content-debrief">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("allied.paramedicScenarioPlayer.scenarioDebrief")}</h2>
                <p className="text-xs text-gray-500">{t("allied.paramedicScenarioPlayer.reviewYourPerformance")}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl font-bold text-teal-700 mb-1" data-testid="text-score">{score}/{totalDecisions}</div>
              <p className="text-sm text-teal-600">{t("allied.paramedicScenarioPlayer.decisionPointsAnsweredCorrectly")}</p>
              <div className="mt-3 w-full max-w-xs mx-auto bg-white/60 rounded-full h-3">
                <div className="bg-teal-500 h-3 rounded-full transition-all" style={{ width: `${totalDecisions > 0 ? (score / totalDecisions) * 100 : 0}%` }} />
              </div>
            </div>

            {scenario.debrief && (
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("allied.paramedicScenarioPlayer.clinicalSummary")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap" data-testid="text-debrief">{scenario.debrief}</p>
              </div>
            )}

            {scenario.learningObjectives && scenario.learningObjectives.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-5 mb-4 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {scenario.learningObjectives.map((obj, i) => (
                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowExpandedDebrief(!showExpandedDebrief)}
              className="flex items-center gap-2 text-sm text-teal-700 font-medium mb-4 hover:text-teal-800"
              data-testid="button-toggle-review"
            >
              {showExpandedDebrief ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showExpandedDebrief ? "Hide" : "Show"} Full Scenario Review
            </button>

            {showExpandedDebrief && (
              <div className="space-y-4 mb-4">
                {scenario.correctInterventions && scenario.correctInterventions.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">{t("allied.paramedicScenarioPlayer.correctInterventions")}</h3>
                    <ul className="space-y-1">
                      {scenario.correctInterventions.map((item, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {scenario.commonErrors && scenario.commonErrors.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">{t("allied.paramedicScenarioPlayer.commonErrorsToAvoid")}</h3>
                    <ul className="space-y-1">
                      {scenario.commonErrors.map((item, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {scenario.relatedLessonSlugs && scenario.relatedLessonSlugs.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <h3 className="text-sm font-semibold text-purple-800 mb-2">{t("allied.paramedicScenarioPlayer.relatedLessons")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {scenario.relatedLessonSlugs.map((slug, i) => (
                        <span key={i} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{slug}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={restart} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-restart">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <Link href="/allied-health/paramedic/scenarios" className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-50" data-testid="button-back-scenarios">
                <ArrowLeft className="w-4 h-4" /> All Scenarios
              </Link>
            </div>
          </div>
        )}
      </div>

      {currentStep !== "debrief" && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={stepIdx === 0 && decisionIdx === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-prev-step"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={nextStep}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-next-step"
          >
            {getNextLabel()} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
