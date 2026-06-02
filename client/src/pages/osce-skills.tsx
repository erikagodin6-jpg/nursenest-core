import { useState, useMemo, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Heart,
  Wind,
  Brain,
  Hand,
  Droplets,
  Scissors,
  User,
  CircleMinus,
  CheckCircle,
  XCircle,
  ChevronRight,
  Lock,
  RotateCcw,
  ArrowLeft,
  ListOrdered,
  AlertTriangle,
  Lightbulb,
  ClipboardList,
  Package,
  Trophy,
  BookOpen,
  Bone,
  Activity,
  Shield,
  Thermometer,
  Pill,
  Syringe,
  Monitor,
  ArrowDown,
  Utensils,
  Square,
  Baby,
  MessageCircle,
  Home,
  Bandage,
} from "lucide-react";
import { osceSkillStations, type OSCESkillStation, type OSCEStep, type OSCECategory } from "@/data/osce-skills-data";
import { osceSkillStations2 } from "@/data/osce-skills-data-2";
import { osceSkillStations3 } from "@/data/osce-skills-data-3";
import { osceSkillStations4 } from "@/data/osce-skills-data-4";
import { osceSkillStations5 } from "@/data/osce-skills-data-5";
import { osceSkillStations6 } from "@/data/osce-skills-data-6";
import { osceSkillStations7 } from "@/data/osce-skills-data-7";

import { useI18n } from "@/lib/i18n";
const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

const allStations: OSCESkillStation[] = [
  ...osceSkillStations,
  ...osceSkillStations2,
  ...osceSkillStations3,
  ...osceSkillStations4,
  ...osceSkillStations5,
  ...osceSkillStations6,
  ...osceSkillStations7,
];

const iconMap: Record<string, any> = {
  User,
  Heart,
  Wind,
  Brain,
  Hand,
  Droplets,
  Scissors,
  Stethoscope,
  CircleMinus,
  ClipboardList,
  Bone,
  Activity,
  Shield,
  Thermometer,
  Pill,
  Syringe,
  Monitor,
  AlertTriangle,
  ArrowDown,
  Utensils,
  Square,
  Baby,
  MessageCircle,
  Home,
  BookOpen,
  Bandage,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Assessment: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Hygiene: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Procedure: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Drain & Tube Care": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Core Skills": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Acute Care": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "Maternal & Newborn": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  "Pediatric": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  "Mental Health": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "Communication": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  "Geriatric Care": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Community Health": { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
  "Critical Care": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Intermediate: { bg: "bg-amber-50", text: "text-amber-700" },
  Advanced: { bg: "bg-rose-50", text: "text-rose-700" },
};

type Category = "All" | OSCECategory;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function StationGrid({
  onSelect,
  category,
  setCategory,
}: {
  onSelect: (s: OSCESkillStation) => void;
  category: Category;
  setCategory: (c: Category) => void;
}) {
  const filtered = category === "All" ? allStations : allStations.filter((s) => s.category === category);
  const categories: Category[] = [
    "All", "Core Skills", "Assessment", "Procedure", "Acute Care",
    "Maternal & Newborn", "Pediatric", "Mental Health", "Communication",
    "Geriatric Care", "Community Health", "Critical Care", "Hygiene", "Drain & Tube Care",
  ];

  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#BFA6F6]/10 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-[#BFA6F6]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#2E3A59]" data-testid="text-osce-title">
              OSCE Skills Practice
            </h1>
            <p className="text-[#2E3A59]/60 mt-1">
              Master clinical procedures with step-by-step interactive skill stations
            </p>
          </div>
        </div>
        <p className="text-[#2E3A59]/70 max-w-3xl">
          Each station presents a clinical scenario with an ordered checklist of steps. Put the steps in the correct
          sequence, then review your performance. Critical steps are flagged — missing them means a fail, just like a
          real OSCE examination.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8" data-testid="osce-category-tabs">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(cat)}
            className={
              category === cat
                ? "bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white"
                : "border-[#2E3A59]/20 text-[#2E3A59]/70 hover:bg-[#BFA6F6]/10"
            }
            data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((station) => {
          const IconComponent = iconMap[station.icon] || Stethoscope;
          const catColor = categoryColors[station.category] || categoryColors.Assessment;
          const diffColor = difficultyColors[station.difficulty] || difficultyColors.Beginner;

          return (
            <Card
              key={station.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-[#2E3A59]/10 hover:border-[#BFA6F6]/40"
              onClick={() => onSelect(station)}
              data-testid={`card-osce-station-${station.id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${catColor.bg} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${catColor.text}`} />
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>
                      {station.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                      {station.difficulty}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-[#2E3A59] mb-1">{station.title}</h3>
                <p className="text-sm text-[#2E3A59]/60 mb-3">{station.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#2E3A59]/50">{station.steps.length} steps</span>
                  <ChevronRight className="w-4 h-4 text-[#BFA6F6]" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StepOrderingExercise({
  station,
  onBack,
}: {
  station: OSCESkillStation;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "ordering" | "results" | "review">("intro");
  const [availableSteps, setAvailableSteps] = useState<OSCEStep[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OSCEStep[]>([]);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    criticalMissed: number;
    totalCritical: number;
    passed: boolean;
    stepResults: { step: OSCEStep; correctPosition: number; userPosition: number; isCorrect: boolean }[];
  } | null>(null);

  const startExercise = useCallback(() => {
    setAvailableSteps(shuffleArray(station.steps));
    setSelectedOrder([]);
    setResults(null);
    setPhase("ordering");
  }, [station.steps]);

  const selectStep = useCallback(
    (step: OSCEStep) => {
      setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));
      setSelectedOrder((prev) => [...prev, step]);
    },
    [],
  );

  const removeStep = useCallback(
    (step: OSCEStep) => {
      setSelectedOrder((prev) => prev.filter((s) => s.id !== step.id));
      setAvailableSteps((prev) => [...prev, step]);
    },
    [],
  );

  const evaluateOrder = useCallback(() => {
    const stepResults = station.steps.map((correctStep, correctIdx) => {
      const userIdx = selectedOrder.findIndex((s) => s.id === correctStep.id);
      return {
        step: correctStep,
        correctPosition: correctIdx + 1,
        userPosition: userIdx + 1,
        isCorrect: userIdx === correctIdx,
      };
    });

    const score = stepResults.filter((r) => r.isCorrect).length;
    const totalCritical = station.steps.filter((s) => s.criticalStep).length;
    const criticalCorrect = stepResults.filter(
      (r) => r.step.criticalStep && r.isCorrect,
    ).length;
    const criticalMissed = totalCritical - criticalCorrect;

    const passed = criticalMissed === 0 && score >= Math.ceil(station.steps.length * 0.7);

    setResults({
      score,
      total: station.steps.length,
      criticalMissed,
      totalCritical,
      passed,
      stepResults,
    });
    setPhase("results");
  }, [station.steps, selectedOrder]);

  const IconComponent = iconMap[station.icon] || Stethoscope;
  const catColor = categoryColors[station.category] || categoryColors.Assessment;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-[#2E3A59]/70 hover:text-[#2E3A59]"
        data-testid="button-back-to-stations"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Skill Stations
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl ${catColor.bg} flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${catColor.text}`} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-station-title">
            {station.title}
          </h2>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>
              {station.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[station.difficulty]?.bg} ${difficultyColors[station.difficulty]?.text}`}
            >
              {station.difficulty}
            </span>
            {station.examLevel && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFA6F6]/10 text-[#BFA6F6]">
                {station.examLevel}
              </span>
            )}
            {station.timeLimit && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {station.timeLimit}
              </span>
            )}
          </div>
        </div>
      </div>

      {phase === "intro" && (
        <div className="space-y-6">
          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#BFA6F6]" />
                Clinical Scenario
              </h3>
              <p className="text-[#2E3A59]/80 leading-relaxed" data-testid="text-scenario-intro">
                {station.scenarioIntro}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#BFA6F6]" />
                Equipment Needed
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {station.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[#2E3A59]/70">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {station.candidateInstructions && (
            <Card className="border-[#2E3A59]/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#BFA6F6]" />
                  Candidate Instructions
                </h3>
                <p className="text-[#2E3A59]/80 leading-relaxed text-sm">{station.candidateInstructions}</p>
              </CardContent>
            </Card>
          )}

          {station.patientActorScript && (
            <Card className="border-[#2E3A59]/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#BFA6F6]" />
                  Standardized Patient Script
                </h3>
                <p className="text-[#2E3A59]/80 leading-relaxed text-sm italic">{station.patientActorScript}</p>
              </CardContent>
            </Card>
          )}

          <div className="bg-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-xl p-4">
            <p className="text-sm text-[#2E3A59]/70">
              <strong className="text-[#2E3A59]">{t("pages.osceSkills.howItWorks")}</strong> You will be presented with the procedure steps
              in a shuffled order. Select them in the correct sequence. Critical steps are marked — missing their correct
              position results in a fail. You need all critical steps correct and at least 70% overall to pass.
            </p>
          </div>

          <Button
            onClick={startExercise}
            className="w-full bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white py-6 text-lg"
            data-testid="button-start-exercise"
          >
            <ListOrdered className="w-5 h-5 mr-2" />
            Begin Step Ordering
          </Button>
        </div>
      )}

      {phase === "ordering" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-[#BFA6F6]" />
                Available Steps
                <span className="text-xs text-[#2E3A59]/50 font-normal">
                  ({availableSteps.length} remaining)
                </span>
              </h3>
              <div className="space-y-2 min-h-[200px]" data-testid="available-steps-list">
                {availableSteps.length === 0 && (
                  <div className="text-center py-8 text-[#2E3A59]/40 text-sm">
                    All steps selected. Review your order and submit.
                  </div>
                )}
                {availableSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => selectStep(step)}
                    className="w-full text-left p-3 rounded-lg border border-[#2E3A59]/10 hover:border-[#BFA6F6]/40 hover:bg-[#BFA6F6]/5 transition-all text-sm text-[#2E3A59]/80"
                    data-testid={`button-select-step-${step.id}`}
                  >
                    {step.instruction}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#BFA6F6]" />
                Your Order
                <span className="text-xs text-[#2E3A59]/50 font-normal">
                  ({selectedOrder.length} / {station.steps.length})
                </span>
              </h3>
              <div className="space-y-2 min-h-[200px]" data-testid="selected-steps-list">
                {selectedOrder.length === 0 && (
                  <div className="text-center py-8 text-[#2E3A59]/40 text-sm">
                    Click steps on the left to add them in order.
                  </div>
                )}
                {selectedOrder.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 p-3 rounded-lg border border-[#BFA6F6]/20 bg-[#BFA6F6]/5"
                    data-testid={`selected-step-${idx}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#BFA6F6] text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-[#2E3A59]/80 flex-1">{step.instruction}</span>
                    <button
                      onClick={() => removeStep(step)}
                      className="text-[#2E3A59]/40 hover:text-rose-500 transition-colors"
                      data-testid={`button-remove-step-${step.id}`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setAvailableSteps(shuffleArray(station.steps));
                setSelectedOrder([]);
              }}
              className="border-[#2E3A59]/20 text-[#2E3A59]/70"
              data-testid="button-reset-order"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={evaluateOrder}
              disabled={selectedOrder.length !== station.steps.length}
              className="flex-1 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white disabled:opacity-50"
              data-testid="button-submit-order"
            >
              Submit Order ({selectedOrder.length}/{station.steps.length})
            </Button>
          </div>
        </div>
      )}

      {phase === "results" && results && (
        <div className="space-y-6">
          <Card
            className={`border-2 ${results.passed ? "border-emerald-300 bg-emerald-50/30" : "border-rose-300 bg-rose-50/30"}`}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                {results.passed ? (
                  <Trophy className="w-16 h-16 mx-auto text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-16 h-16 mx-auto text-rose-500" />
                )}
              </div>
              <h3
                className={`text-2xl font-bold mb-2 ${results.passed ? "text-emerald-700" : "text-rose-700"}`}
                data-testid="text-result-status"
              >
                {results.passed ? "PASS" : "NEEDS IMPROVEMENT"}
              </h3>
              <p className="text-[#2E3A59]/70 mb-4">
                You placed {results.score} of {results.total} steps correctly (
                {Math.round((results.score / results.total) * 100)}%)
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div data-testid="text-steps-score">
                  <span className="font-semibold text-[#2E3A59]">{results.score}/{results.total}</span>
                  <span className="text-[#2E3A59]/50 ml-1">{t("pages.osceSkills.stepsCorrect")}</span>
                </div>
                <div data-testid="text-critical-score">
                  <span
                    className={`font-semibold ${results.criticalMissed > 0 ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    {results.totalCritical - results.criticalMissed}/{results.totalCritical}
                  </span>
                  <span className="text-[#2E3A59]/50 ml-1">{t("pages.osceSkills.criticalSteps")}</span>
                </div>
              </div>
              {results.criticalMissed > 0 && (
                <p className="text-rose-600 text-sm mt-3">
                  {results.criticalMissed} critical step(s) were in the wrong position. All critical steps must be
                  correctly placed to pass.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-4">{t("pages.osceSkills.stepbystepResults")}</h3>
              <div className="space-y-2">
                {results.stepResults.map((r, idx) => (
                  <div
                    key={r.step.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      r.isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"
                    }`}
                    data-testid={`result-step-${idx}`}
                  >
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="w-6 h-6 rounded-full bg-[#2E3A59]/10 text-[#2E3A59] text-xs flex items-center justify-center font-medium">
                        {r.correctPosition}
                      </span>
                      {r.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#2E3A59]/80">{r.step.instruction}</span>
                        {r.step.criticalStep && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 flex-shrink-0">
                            Critical
                          </span>
                        )}
                      </div>
                      {!r.isCorrect && (
                        <p className="text-xs text-rose-600 mt-1">
                          You placed this at position {r.userPosition}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={startExercise}
              className="border-[#2E3A59]/20 text-[#2E3A59]/70"
              data-testid="button-retry"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => setPhase("review")}
              className="flex-1 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white"
              data-testid="button-review-procedure"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Review Full Procedure
            </Button>
          </div>
        </div>
      )}

      {phase === "review" && (
        <div className="space-y-6">
          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-[#BFA6F6]" />
                Complete Procedure ({station.steps.length} Steps)
              </h3>
              <div className="space-y-3">
                {station.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border ${
                      step.criticalStep
                        ? "border-rose-200 bg-rose-50/50"
                        : "border-[#2E3A59]/10 bg-white"
                    }`}
                    data-testid={`review-step-${idx}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          step.criticalStep
                            ? "bg-rose-500 text-white"
                            : "bg-[#BFA6F6] text-white"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#2E3A59] text-sm">{step.instruction}</span>
                          {step.criticalStep && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#2E3A59]/60">{step.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Common Errors
              </h3>
              <ul className="space-y-2">
                {station.commonErrors.map((error, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#2E3A59]/70">
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    {error}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2E3A59]/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#BFA6F6]" />
                Clinical Pearls
              </h3>
              <ul className="space-y-2">
                {station.clinicalPearls.map((pearl, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#2E3A59]/70">
                    <CheckCircle className="w-4 h-4 text-[#BFA6F6] flex-shrink-0 mt-0.5" />
                    {pearl}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {station.criticalFailCriteria && station.criticalFailCriteria.length > 0 && (
            <Card className="border-rose-200 bg-rose-50/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  Critical Fail Criteria
                </h3>
                <ul className="space-y-2">
                  {station.criticalFailCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-rose-700/80">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      {crit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {station.examinerChecklist && station.examinerChecklist.length > 0 && (
            <Card className="border-[#2E3A59]/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#BFA6F6]" />
                  Examiner Marking Checklist
                </h3>
                <div className="space-y-1">
                  {station.examinerChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-[#2E3A59]/5 last:border-0">
                      <span className="text-sm text-[#2E3A59]/80">{item.action}</span>
                      <span className="text-xs font-semibold bg-[#BFA6F6]/10 text-[#BFA6F6] px-2 py-0.5 rounded-full">{item.marks} {item.marks === 1 ? "mark" : "marks"}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 font-semibold text-[#2E3A59]">
                    <span>{t("pages.osceSkills.total")}</span>
                    <span>{station.examinerChecklist.reduce((sum, i) => sum + i.marks, 0)} marks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {station.examinerQuestions && station.examinerQuestions.length > 0 && (
            <Card className="border-[#2E3A59]/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#BFA6F6]" />
                  Examiner Questions
                </h3>
                <div className="space-y-4">
                  {station.examinerQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[#BFA6F6]/5 rounded-lg p-4">
                      <p className="text-sm font-medium text-[#2E3A59] mb-2">{idx + 1}. {q.question}</p>
                      <p className="text-sm text-[#2E3A59]/70">{q.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {station.teachingPoints && station.teachingPoints.length > 0 && (
            <Card className="border-[#2E3A59]/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Teaching Points
                </h3>
                <ul className="space-y-2">
                  {station.teachingPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#2E3A59]/70">
                      <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="bg-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-xl p-4">
            <p className="text-sm text-[#2E3A59]/70">
              <strong className="text-[#2E3A59]">{t("pages.osceSkills.passingCriteria")}</strong> {station.passingCriteria}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={startExercise}
              className="border-[#2E3A59]/20 text-[#2E3A59]/70"
              data-testid="button-retry-from-review"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onBack}
              className="flex-1 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white"
              data-testid="button-back-to-all-stations"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Skill Stations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OSCESkillsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const hasPaidAccess = user && paidTiers.includes(user.tier);
  const [selectedStation, setSelectedStation] = useState<OSCESkillStation | null>(null);
  const [category, setCategory] = useState<Category>("All");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={t("pages.osceSkills.osceSkillsPracticeNursenest")}
        description={t("pages.osceSkills.masterClinicalNursingProceduresWith")}
      />
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { name: "Home", url: "/" },
            { name: "OSCE Skills", url: "/osce-skills" },
            ...(selectedStation ? [{ name: selectedStation.title, url: "" }] : []),
          ]}
        />

        {!hasPaidAccess ? (
          <div className="text-center py-16">
            <Lock className="w-16 h-16 mx-auto text-[#2E3A59]/30 mb-4" />
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-2">{t("pages.osceSkills.osceSkillsPractice")}</h2>
            <p className="text-[#2E3A59]/60 mb-6 max-w-md mx-auto">
              Access interactive skill stations with step-by-step procedural checklists and pass/fail evaluation.
            </p>
            <p className="text-[#2E3A59]/50 text-sm">
              This feature requires an active subscription.
            </p>
          </div>
        ) : selectedStation ? (
          <StepOrderingExercise
            station={selectedStation}
            onBack={() => setSelectedStation(null)}
          />
        ) : (
          <StationGrid
            onSelect={setSelectedStation}
            category={category}
            setCategory={setCategory}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
