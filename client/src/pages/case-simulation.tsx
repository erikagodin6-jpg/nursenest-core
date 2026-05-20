import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Wind,
  Brain,
  Gauge,
  Zap,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Target,
  Stethoscope,
  Clock,
  ShieldAlert,
  Lock,
  Sparkles,
} from "lucide-react";
import { clinicalCases, type ClinicalCase, type CaseStage, type CaseDecision } from "@/data/clinical-cases";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const systemIcons: Record<string, any> = {
  Cardiovascular: Heart,
  Respiratory: Wind,
  Neurological: Brain,
  Endocrine: Gauge,
  Emergency: Zap,
};

const difficultyConfig: Record<string, { bg: string; text: string; label: string }> = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Beginner" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-700", label: "Intermediate" },
  advanced: { bg: "bg-rose-50", text: "text-rose-700", label: "Advanced" },
};

function CaseSelector({ onSelect }: { onSelect: (c: ClinicalCase) => void }) {
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900" data-testid="text-page-title">
              Clinical Case Simulations
            </h1>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
              Decision-Based Learning
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
          Interactive patient scenarios that evolve based on your clinical decisions. 
          Each choice reveals physiological consequences and builds the reasoning patterns 
          that separate safe practitioners from dangerous ones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clinicalCases.map((c) => {
          const Icon = systemIcons[c.bodySystem] || Activity;
          const diff = difficultyConfig[c.difficulty];
          return (
            <Card
              key={c.id}
              className="border border-gray-100 bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
              onClick={() => onSelect(c)}
              data-testid={`card-case-${c.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary/70" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                    {diff.label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{c.chiefComplaint}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{c.stages.length} decision points</span>
                  <ChevronRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function VitalDisplay({ vitals }: { vitals: CaseStage["vitals"] }) {
  const { t } = useI18n();
  const vitalItems = [
    { label: "HR", value: `${vitals.hr}`, unit: "bpm", icon: Heart, danger: vitals.hr > 110 || vitals.hr < 50 },
    { label: "BP", value: vitals.bp, unit: "mmHg", icon: Activity, danger: parseInt(vitals.bp) < 90 || parseInt(vitals.bp) > 160 },
    { label: "RR", value: `${vitals.rr}`, unit: "/min", icon: Wind, danger: vitals.rr > 24 || vitals.rr < 10 },
    { label: "SpO2", value: `${vitals.spo2}`, unit: "%", icon: Droplets, danger: vitals.spo2 < 92 },
    { label: "Temp", value: `${vitals.temp}`, unit: "°C", icon: Thermometer, danger: vitals.temp > 38.5 || vitals.temp < 36 },
  ];
  if (vitals.pain !== undefined) {
    vitalItems.push({ label: "Pain", value: `${vitals.pain}`, unit: "/10", icon: Zap, danger: vitals.pain > 7 });
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {vitalItems.map((v) => (
        <div
          key={v.label}
          className={`text-center p-2.5 rounded-lg border ${v.danger ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <v.icon className={`w-3 h-3 ${v.danger ? "text-red-500" : "text-gray-400"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${v.danger ? "text-red-500" : "text-gray-400"}`}>
              {v.label}
            </span>
          </div>
          <div className={`text-lg font-bold ${v.danger ? "text-red-700" : "text-gray-900"}`}>
            {v.value}
          </div>
          <div className="text-[10px] text-gray-400">{v.unit}</div>
        </div>
      ))}
    </div>
  );
}

function CaseRunner({ caseData, onExit }: { caseData: ClinicalCase; onExit: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [showDebriefing, setShowDebriefing] = useState(false);

  const stage = caseData.stages[stageIndex];
  const isLastStage = stageIndex === caseData.stages.length - 1;

  const chosenDecision = stage?.decisions.find((d) => d.id === selectedDecision);

  const handleSelect = (decisionId: string) => {
    setSelectedDecision(decisionId);
    setShowConsequence(true);
    setDecisions((prev) => ({ ...prev, [stage.id]: decisionId }));
  };

  const handleNext = () => {
    if (isLastStage) {
      setShowDebriefing(true);
    } else {
      setStageIndex((i) => i + 1);
      setSelectedDecision(null);
      setShowConsequence(false);
    }
  };

  const handleRestart = () => {
    setStageIndex(0);
    setSelectedDecision(null);
    setShowConsequence(false);
    setDecisions({});
    setShowDebriefing(false);
  };

  const optimalCount = useMemo(() => {
    return Object.entries(decisions).filter(([stageId, decId]) => {
      const s = caseData.stages.find((st) => st.id === stageId);
      return s?.decisions.find((d) => d.id === decId)?.isOptimal;
    }).length;
  }, [decisions, caseData]);

  if (showDebriefing) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{t("pages.caseSimulation.caseDebriefing")}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Optimal decisions: {optimalCount}/{caseData.stages.length}
            </span>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Key Learning Points
            </h3>
            <div className="space-y-3">
              {caseData.debriefing.keyLearning.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Mechanism Summary
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">{caseData.debriefing.mechanismSummary}</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50/30">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Common Cognitive Errors
            </h3>
            <div className="space-y-2">
              {caseData.debriefing.commonErrors.map((err, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm leading-relaxed">{err}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button variant="outline" className="rounded-full gap-2" onClick={handleRestart} data-testid="button-restart-case">
            <RotateCcw className="w-4 h-4" />
            Restart Case
          </Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={onExit} data-testid="button-all-cases">
            <ArrowLeft className="w-4 h-4" />
            All Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary text-sm -ml-2" onClick={onExit} data-testid="button-exit-case">
          <ArrowLeft className="w-4 h-4" />
          All Cases
        </Button>
        <div className="flex items-center gap-2">
          {caseData.stages.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1.5 rounded-full transition-colors ${i < stageIndex ? "bg-primary" : i === stageIndex ? "bg-primary/60" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("pages.caseSimulation.patientProfile")}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{caseData.patientProfile}</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
          <span className="text-xs text-gray-400 ml-auto">Stage {stageIndex + 1} of {caseData.stages.length}</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 sm:p-6 mb-6">
          <p className="text-gray-700 leading-relaxed text-[15px]">{stage.narrative}</p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t("pages.caseSimulation.vitalSigns")}</p>
          <VitalDisplay vitals={stage.vitals} />
        </div>

        {stage.labs && stage.labs.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t("pages.caseSimulation.laboratoryResults")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stage.labs.map((lab, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${lab.flag === "critical" ? "bg-red-50 border-red-200" : lab.flag ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{lab.name}</p>
                  <p className={`text-lg font-bold ${lab.flag === "critical" ? "text-red-700" : lab.flag ? "text-amber-700" : "text-gray-900"}`}>
                    {lab.value} <span className="text-xs font-normal text-gray-400">{lab.unit}</span>
                  </p>
                  {lab.flag && (
                    <span className={`text-[9px] font-bold uppercase ${lab.flag === "critical" ? "text-red-500" : "text-amber-500"}`}>
                      {lab.flag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage.assessmentFindings && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t("pages.caseSimulation.assessmentFindings")}</p>
            <div className="space-y-2">
              {stage.assessmentFindings.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Eye className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-1" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage.nursingPriority && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{t("pages.caseSimulation.nursingPriority")}</p>
                <p className="text-sm text-blue-800 leading-relaxed">{stage.nursingPriority}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-bold text-gray-900 mb-4">{t("pages.caseSimulation.whatIsYourNextAction")}</p>
          <div className="space-y-3">
            {stage.decisions.map((dec) => {
              const isSelected = selectedDecision === dec.id;
              const isRevealed = showConsequence;
              let borderColor = "border-gray-100 hover:border-primary/30";
              if (isRevealed && isSelected && dec.isOptimal) borderColor = "border-emerald-300 bg-emerald-50/30";
              else if (isRevealed && isSelected && !dec.isOptimal) borderColor = "border-red-300 bg-red-50/30";
              else if (isRevealed && dec.isOptimal) borderColor = "border-emerald-200 bg-emerald-50/20";
              else if (isSelected) borderColor = "border-primary bg-primary/5";

              return (
                <div key={dec.id}>
                  <Card
                    className={`border-2 transition-all duration-300 ${borderColor} ${!isRevealed ? "cursor-pointer" : ""}`}
                    onClick={() => !isRevealed && handleSelect(dec.id)}
                    data-testid={`card-decision-${dec.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isRevealed ? (
                          dec.isOptimal ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          )
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed">{dec.text}</p>
                      </div>

                      {isRevealed && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.caseSimulation.consequence")}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{dec.consequence}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{t("pages.caseSimulation.mechanismExplanation")}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{dec.mechanismExplanation}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {stage.criticalThinking && showConsequence && (
          <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-gray-900">{t("pages.caseSimulation.criticalThinking")}</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic">{stage.criticalThinking}</p>
            </CardContent>
          </Card>
        )}

        {showConsequence && (
          <div className="flex justify-end mt-6">
            <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110" onClick={handleNext} data-testid="button-next-stage">
              {isLastStage ? "View Debriefing" : "Next Stage"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

export default function CaseSimulationPage() {
  const { user, effectiveTier } = useAuth();
  const [activeCase, setActiveCase] = useState<ClinicalCase | null>(null);
  const hasPaidAccess = paidTiers.includes(effectiveTier);

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.caseSimulation.clinicalCaseSimulationsInteractivePatient")}
        description={t("pages.caseSimulation.practiceClinicalDecisionmakingWithInteractive")}
        keywords="clinical case simulation nursing, interactive patient scenarios, nursing clinical reasoning, case study nursing, clinical decision making, nursing simulation"
        canonicalPath="/case-simulations"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        {!hasPaidAccess ? (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.caseSimulation.clinicalCaseSimulations")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.caseSimulation.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                Interactive patient scenarios with branching decisions are available exclusively for RPN, RN, and NP subscribers. Each simulation builds the clinical reasoning patterns that define safe practice.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade-case-sims">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.caseSimulation.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>
        ) : activeCase ? (
          <CaseRunner caseData={activeCase} onExit={() => setActiveCase(null)} />
        ) : (
          <CaseSelector onSelect={setActiveCase} />
        )}

        <EducationalIntegrity variant="footer" className="mt-16" />
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
