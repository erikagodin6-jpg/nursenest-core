import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Crosshair,
  Bookmark,
  BookOpen,
  Star,
  Lock,
  Crown,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ListOrdered,
  Layers,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n";
export interface ExplanationData {
  rationale: string;
  correctAnswerIndex: number;
  correctAnswerText: string;
  options: string[];
  distractorRationales?: Record<string, string>;
  clinicalPearl?: string;
  examStrategy?: string;
  memoryHook?: string;
  frameworkUsed?: string;
  clinicalTrap?: string;
  scenario?: string;
  topic?: string;
  subtopic?: string;
  bodySystem?: string;
  questionType?: string;
  keyTakeaway?: string;
}

interface ExplanationPanelProps {
  data: ExplanationData;
  isLearningMode?: boolean;
  className?: string;
}

let expandableSectionCounter = 0;

function ExpandableSection({
  icon,
  title,
  children,
  variant = "default",
  defaultOpen = false,
  locked = false,
  "data-testid": testId,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  variant?: "default" | "pearl" | "strategy" | "memory" | "warning";
  defaultOpen?: boolean;
  locked?: boolean;
  "data-testid"?: string;
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sectionId] = useState(() => `expandable-section-${++expandableSectionCounter}`);

  const variantStyles = {
    default: "border-slate-200/60 bg-slate-50/50",
    pearl: "border-violet-200/60 bg-violet-50/30",
    strategy: "border-blue-200/60 bg-blue-50/30",
    memory: "border-amber-200/60 bg-amber-50/30",
    warning: "border-red-200/60 bg-red-50/30",
  };

  const contentId = `${sectionId}-content`;

  return (
    <div className={cn("rounded-xl border overflow-hidden", variantStyles[variant])} data-testid={testId}>
      <button
        onClick={() => !locked && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-black/[0.02] transition-colors"
        disabled={locked}
        aria-expanded={locked ? undefined : isOpen}
        aria-controls={locked ? undefined : contentId}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        {locked ? (
          <Lock className="w-3.5 h-3.5 text-slate-400" aria-label={t("components.explanationPanel.premiumContentLocked")} />
        ) : isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && !locked && (
        <div id={contentId} role="region" aria-label={title} className="px-3 pb-3 text-sm text-slate-600 leading-relaxed border-t border-inherit">
          <div className="pt-2">{children}</div>
        </div>
      )}
    </div>
  );
}

function PremiumGatePrompt() {
  const [, navigate] = useLocation();

  return (
    <div
      className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-purple-50/30 p-4"
      data-testid="section-explanation-paywall"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <Crown className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Unlock Full Explanations
          </p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Get detailed distractor rationales, clinical pearls, step-by-step reasoning, mnemonic devices, and exam strategies with a premium plan.
          </p>
          <Button
            size="sm"
            onClick={() => navigate("/pricing")}
            className="rounded-lg gap-1.5 text-xs h-8 px-4 bg-violet-600 hover:bg-violet-700 text-white"
            data-testid="button-explanation-upgrade"
          >
            <Crown className="w-3 h-3" />
            Upgrade for Full Access
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ExplanationPanel({ data, isLearningMode, className }: ExplanationPanelProps) {
  const { effectiveTier, hasAccess } = useAuth();

  const isPremium = hasAccess("rpn");

  const isScenarioQuestion = !!(data.scenario || data.questionType === "clinical-case");

  const keyTakeaway = data.keyTakeaway || extractKeyTakeaway(data.rationale);

  return (
    <div className={cn("space-y-3", className)} data-testid="section-explanation-panel">
      {isLearningMode && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 mb-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Learning Mode
          </span>
        </div>
      )}

      <div
        className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-3"
        data-testid="section-correct-answer-explanation"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold text-slate-800">{t("components.explanationPanel.whyThisIsCorrect")}</span>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed space-y-2">
          {data.rationale.split(/\n\n+/).filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {keyTakeaway && (
        <div
          className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3"
          data-testid="section-key-takeaway"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Key Takeaway
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{keyTakeaway}</p>
        </div>
      )}

      {isPremium ? (
        <>
          <div
            className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-3"
            data-testid="section-distractor-rationales"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-sm font-semibold text-slate-800">
                Why the Other Options Are Wrong
              </span>
            </div>
            <div className="space-y-2">
              {data.options.map((opt, idx) => {
                if (idx === data.correctAnswerIndex) return null;
                const letter = String.fromCharCode(65 + idx);
                const rationale =
                  data.distractorRationales?.[letter] ||
                  data.distractorRationales?.[letter.toLowerCase()] ||
                  data.distractorRationales?.[String(idx)];
                const fallback = `This option is incorrect. The correct answer is ${String.fromCharCode(65 + data.correctAnswerIndex)}. ${data.correctAnswerText} — review the explanation for details.`;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200/60 bg-white p-2.5"
                    data-testid={`distractor-${letter}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-slate-400 mt-0.5 shrink-0">
                        {letter}.
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-600 mb-0.5">{opt}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {rationale || fallback}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {data.bodySystem && (
            <div
              className="rounded-xl border border-blue-200/60 bg-blue-50/30 p-3"
              data-testid="section-clinical-context"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Brain className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800">{t("components.explanationPanel.clinicalContext")}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This question relates to <span className="font-medium">{data.bodySystem}</span>
                {data.topic && <> &mdash; specifically <span className="font-medium">{data.topic}</span></>}
                {data.subtopic && <> ({data.subtopic})</>}.
                {data.frameworkUsed && <> The <span className="font-medium">{data.frameworkUsed}</span> {t("components.explanationPanel.frameworkAppliesHere")}</>}
              </p>
            </div>
          )}

          {isScenarioQuestion && (
            <>
              {data.scenario && (
                <ExpandableSection
                  icon={<ListOrdered className="w-4 h-4 text-indigo-600" />}
                  title={t("components.explanationPanel.stepbystepReasoning")}
                  variant="default"
                  defaultOpen={isLearningMode}
                  data-testid="section-step-by-step"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 italic mb-2">{t("components.explanationPanel.clinicalScenarioAnalysis")}</p>
                    {generateStepByStep(data).map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-indigo-500 mt-0.5 shrink-0">
                          {i + 1}.
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </ExpandableSection>
              )}

              <ExpandableSection
                icon={<Layers className="w-4 h-4 text-indigo-600" />}
                title={t("components.explanationPanel.priorityFramework")}
                variant="default"
                defaultOpen={false}
                data-testid="section-priority-framework"
              >
                <div className="text-xs text-slate-600 leading-relaxed space-y-1.5">
                  <p>
                    <span className="font-semibold">{t("components.explanationPanel.framework")}</span>{" "}
                    {data.frameworkUsed || "Clinical Decision-Making"}
                  </p>
                  <p>
                    <span className="font-semibold">{t("components.explanationPanel.priority")}</span> In this scenario, the correct approach
                    prioritizes {data.correctAnswerText.toLowerCase()} based on patient safety and
                    evidence-based practice guidelines.
                  </p>
                  {data.clinicalTrap && (
                    <p>
                      <span className="font-semibold">{t("components.explanationPanel.commonTrap")}</span> {data.clinicalTrap}
                    </p>
                  )}
                </div>
              </ExpandableSection>
            </>
          )}

          {data.clinicalPearl && (
            <ExpandableSection
              icon={<Lightbulb className="w-4 h-4 text-violet-600" />}
              title={t("components.explanationPanel.clinicalPearl")}
              variant="pearl"
              defaultOpen={false}
              data-testid="section-clinical-pearl"
            >
              <p className="text-xs">{data.clinicalPearl}</p>
            </ExpandableSection>
          )}

          {data.memoryHook && (
            <ExpandableSection
              icon={<Bookmark className="w-4 h-4 text-amber-600" />}
              title={t("components.explanationPanel.mnemonicDevice")}
              variant="memory"
              defaultOpen={false}
              data-testid="section-mnemonic"
            >
              <p className="text-xs font-medium italic">{data.memoryHook}</p>
            </ExpandableSection>
          )}

          {data.examStrategy && (
            <ExpandableSection
              icon={<Crosshair className="w-4 h-4 text-blue-600" />}
              title={t("components.explanationPanel.examStrategy")}
              variant="strategy"
              defaultOpen={false}
              data-testid="section-exam-strategy"
            >
              <p className="text-xs">{data.examStrategy}</p>
            </ExpandableSection>
          )}

          {data.clinicalTrap && !isScenarioQuestion && (
            <ExpandableSection
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
              title={t("components.explanationPanel.clinicalTrap")}
              variant="warning"
              defaultOpen={false}
              data-testid="section-clinical-trap"
            >
              <p className="text-xs">{data.clinicalTrap}</p>
            </ExpandableSection>
          )}

          {(data.topic || data.subtopic || data.bodySystem) && (
            <div className="pt-1">
              <a
                href={(() => {
                  const searchTerm = encodeURIComponent(data.subtopic || data.topic || data.bodySystem || "");
                  return searchTerm ? `/lessons?search=${searchTerm}` : "/lessons";
                })()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                data-testid="link-study-topic"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Study This Topic: {data.subtopic || data.topic || data.bodySystem || "Lessons"}
              </a>
            </div>
          )}
        </>
      ) : (
        <PremiumGatePrompt />
      )}
    </div>
  );
}

function extractKeyTakeaway(rationale: string): string {
  if (!rationale) return "";
  const sentences = rationale.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length === 0) return rationale.slice(0, 150);
  return sentences[0].trim() + ".";
}

function generateStepByStep(data: ExplanationData): string[] {
  const steps: string[] = [];
  if (data.scenario) {
    steps.push("Read and analyze the clinical scenario, identifying key patient data and presenting symptoms.");
  }
  steps.push("Identify the core clinical question being asked and what type of response is required.");
  if (data.bodySystem) {
    steps.push(`Consider the relevant pathophysiology related to ${data.bodySystem}.`);
  }
  steps.push(
    `Evaluate each option against clinical guidelines. The correct answer (${data.correctAnswerText}) aligns with evidence-based practice.`
  );
  if (data.clinicalTrap) {
    steps.push(`Avoid the common trap: ${data.clinicalTrap}`);
  }
  steps.push("Confirm your answer by eliminating distractors and validating your clinical reasoning.");
  return steps;
}

export function ExplanationPromoBanner({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  const [, navigate] = useLocation();

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50/50 border border-violet-200/40",
          className
        )}
        data-testid="section-explanation-promo"
      >
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Detailed explanations for every question
          </p>
          <p className="text-xs text-slate-500">
            Understand why each answer is right or wrong with clinical context
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/pricing")}
          className="rounded-lg gap-1 text-xs shrink-0 border-violet-200 text-violet-700 hover:bg-violet-50"
          data-testid="button-explanation-promo-upgrade"
        >
          <Crown className="w-3 h-3" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-violet-200/40 bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-indigo-50/30 p-6",
        className
      )}
      data-testid="section-explanation-promo"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">
              Detailed Explanations for Every Question
            </p>
            <p className="text-xs text-slate-500">
              Understand the reasoning behind each answer
            </p>
          </div>
        </div>
        <ul className="space-y-2 mb-4">
          {[
            "Step-by-step clinical reasoning breakdowns",
            "Per-distractor rationales explaining why each wrong answer fails",
            "Clinical pearls and mnemonic devices for retention",
            "Priority frameworks for scenario-based questions",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => navigate("/pricing")}
          className="rounded-xl gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
          data-testid="button-explanation-promo-cta"
        >
          <Crown className="w-4 h-4" />
          Upgrade for Full Access
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-100/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-100/20 blur-3xl pointer-events-none" />
    </div>
  );
}
