import { useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Brain,
  Eye,
  HelpCircle,
  Sparkles,
  MessageCircle,
} from "lucide-react";

interface PauseAndThinkProps {
  question: string;
  hint?: string;
  className?: string;
}

export function PauseAndThink({ question, hint, className }: PauseAndThinkProps) {
  const { t } = useI18n();
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden ${className || ""}`} data-testid="card-pause-think">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t("components.engagement.pauseThink")}</h4>
        </div>
        <p className="text-gray-700 leading-relaxed italic text-[15px]">{question}</p>
        {hint && (
          <div className="mt-4">
            {!showHint ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary gap-1.5 px-0 hover:bg-transparent hover:text-primary/80"
                onClick={() => setShowHint(true)}
                data-testid="button-show-hint"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Need a hint?
              </Button>
            ) : (
              <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                <p className="text-sm text-gray-600 leading-relaxed">{hint}</p>
              </div>
            )}
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-3">
          Active reasoning builds stronger neural pathways than passive reading.
        </p>
      </CardContent>
    </Card>
  );
}

interface ProgressiveDisclosureProps {
  label: string;
  teaser?: string;
  children: ReactNode;
  variant?: "default" | "mechanism" | "clinical-pearl" | "deep-dive";
  className?: string;
}

const variantConfig = {
  default: {
    icon: ChevronDown,
    openIcon: ChevronUp,
    bg: "bg-gray-50",
    border: "border-gray-100",
    iconColor: "text-gray-500",
    labelColor: "text-gray-700",
  },
  mechanism: {
    icon: Brain,
    openIcon: Brain,
    bg: "bg-primary/5",
    border: "border-primary/10",
    iconColor: "text-primary",
    labelColor: "text-primary",
  },
  "clinical-pearl": {
    icon: Sparkles,
    openIcon: Sparkles,
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconColor: "text-amber-600",
    labelColor: "text-amber-800",
  },
  "deep-dive": {
    icon: Eye,
    openIcon: Eye,
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-600",
    labelColor: "text-blue-800",
  },
};

export function ProgressiveDisclosure({
  label,
  teaser,
  children,
  variant = "default",
  className,
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = variantConfig[variant];
  const Icon = isOpen ? config.openIcon : config.icon;

  return (
    <div className={`rounded-xl border ${config.border} overflow-hidden ${className || ""}`} data-testid="progressive-disclosure">
      <button
        className={`w-full flex items-center justify-between gap-3 p-4 ${config.bg} hover:brightness-[0.98] transition-all text-left`}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-toggle-disclosure"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0`} />
          <div className="min-w-0">
            <span className={`text-sm font-semibold ${config.labelColor}`}>{label}</span>
            {teaser && !isOpen && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{teaser}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

interface CuriosityHookProps {
  question: string;
  answer: ReactNode;
  className?: string;
}

export function CuriosityHook({ question, answer, className }: CuriosityHookProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className={`${className || ""}`} data-testid="curiosity-hook">
      {!isRevealed ? (
        <button
          className="w-full text-left group"
          onClick={() => setIsRevealed(true)}
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all">
            <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {question}
              </p>
              <p className="text-[10px] text-primary/60 mt-1 font-medium uppercase tracking-wider">
                Tap to reveal
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="p-4 rounded-xl bg-white border border-gray-100">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">{question}</p>
              <div className="text-sm text-gray-700 leading-relaxed">{answer}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface KnowledgeCheckProps {
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
  className?: string;
}

export function KnowledgeCheck({ question, options, className }: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
  };

  const isCorrect = selected !== null && options[selected]?.isCorrect;

  return (
    <Card className={`border border-gray-100 overflow-hidden ${className || ""}`} data-testid="knowledge-check">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("components.engagement.quickCheck")}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-3">{question}</p>
        <div className="space-y-2">
          {options.map((opt, i) => {
            let style = "border-gray-100 hover:border-primary/30 cursor-pointer";
            if (showResult && i === selected && opt.isCorrect) {
              style = "border-emerald-300 bg-emerald-50/50";
            } else if (showResult && i === selected && !opt.isCorrect) {
              style = "border-red-300 bg-red-50/50";
            } else if (showResult && opt.isCorrect) {
              style = "border-emerald-200 bg-emerald-50/30";
            } else if (showResult) {
              style = "border-gray-100 opacity-60";
            }

            return (
              <div
                key={i}
                className={`rounded-lg border p-3 transition-all ${style}`}
                onClick={() => handleSelect(i)}
                data-testid={`option-${i}`}
              >
                <p className="text-sm text-gray-700">{opt.text}</p>
                {showResult && (i === selected || opt.isCorrect) && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-gray-100 pt-2">
                    {opt.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {showResult && (
          <div className={`mt-3 text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-amber-600"}`}>
            {isCorrect ? "Correct! You understand the mechanism." : "Not quite: review the mechanism explanation above."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
