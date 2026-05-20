import { ReactNode, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  CheckCircle2, XCircle, Lightbulb, Crosshair, Bookmark,
  ChevronLeft, ChevronRight, Target, Trophy, RotateCcw,
  Clock, BookOpen, Flag, GraduationCap, Star, AlertCircle,
  ChevronDown
} from "lucide-react";

export function StudyPageShell({ children, className }: { children: ReactNode; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("min-h-screen bg-warmwhite", className)}>
      {children}
    </div>
  );
}

export function QuestionStemCard({
  questionNumber,
  totalQuestions,
  badges,
  children,
  className,
  "data-testid": testId,
}: {
  questionNumber?: number;
  totalQuestions?: number;
  badges?: ReactNode;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <Card className={cn("premium-card border-0 shadow-md bg-white rounded-2xl", className)} data-testid={testId}>
      {(badges || (questionNumber !== undefined && totalQuestions !== undefined)) && (
        <div className="px-6 sm:px-8 pt-5 pb-0 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">{badges}</div>
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <span className="text-xs font-medium text-gray-400 tabular-nums">
              {questionNumber} / {totalQuestions}
            </span>
          )}
        </div>
      )}
      <CardContent className="px-6 sm:px-8 py-6">{children}</CardContent>
    </Card>
  );
}

export function PremiumBadge({
  children,
  variant = "default",
  className,
  "data-testid": testId,
}: {
  children: ReactNode;
  variant?: "default" | "system" | "exam" | "difficulty" | "tier";
  className?: string;
  "data-testid"?: string;
}) {
  const variantStyles = {
    default: "bg-gray-100/80 text-gray-600 border-gray-200/60",
    system: "bg-primary/8 text-primary border-primary/15",
    exam: "bg-blue-50 text-blue-600 border-blue-100",
    difficulty: "bg-amber-50 text-amber-700 border-amber-100",
    tier: "bg-gray-900/5 text-gray-700 border-gray-200",
  };
  return (
    <Badge
      className={cn(
        "font-medium text-[11px] px-2.5 py-0.5 rounded-lg border shadow-none",
        variantStyles[variant],
        className
      )}
      data-testid={testId}
    >
      {children}
    </Badge>
  );
}

export function AnswerOption({
  index,
  text,
  isSelected,
  isCorrect,
  isWrong,
  isRevealed,
  disabled,
  onClick,
  iconEl,
  className,
  "data-testid": testId,
}: {
  index: number;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  iconEl?: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  const letter = String.fromCharCode(65 + index);

  let containerCls = "border-gray-200/80 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-sm active:scale-[0.995]";
  let circleCls = "border-gray-300 text-gray-500 bg-white";
  let statusIcon: ReactNode = null;

  if (isCorrect) {
    containerCls = "shadow-sm answer-correct-state ring-1 ring-primary/10";
    circleCls = "text-white answer-correct-circle";
    statusIcon = <CheckCircle2 className="h-4 w-4 shrink-0 theme-icon" />;
  } else if (isWrong) {
    containerCls = "border-red-200 bg-red-50/30 ring-1 ring-red-100";
    circleCls = "border-red-400 text-white bg-red-400";
    statusIcon = <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />;
  } else if (isRevealed && !isSelected) {
    containerCls = "border-gray-100 opacity-40";
  } else if (isSelected && !isRevealed) {
    containerCls = "border-primary/50 bg-primary/[0.04] ring-2 ring-primary/15 shadow-sm";
    circleCls = "border-primary text-primary bg-primary/10";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-4 py-3.5 sm:py-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 sm:gap-3.5 group active:scale-[0.99] min-h-[48px]",
        containerCls,
        disabled && !isRevealed ? "" : disabled ? "cursor-default" : "cursor-pointer",
        className
      )}
      data-testid={testId}
    >
      <span className={cn(
        "shrink-0 w-9 h-9 rounded-lg border-[1.5px] flex items-center justify-center text-sm font-semibold transition-all duration-200",
        circleCls
      )}>
        {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : isWrong ? <XCircle className="h-4 w-4" /> : letter}
      </span>
      <span className="flex-1 text-sm sm:text-[15px] leading-relaxed text-foreground">{typeof text === "object" && text !== null ? (text as any).text || JSON.stringify(text) : text}</span>
      {iconEl || statusIcon}
    </button>
  );
}

export function ResultHeader({
  isCorrect,
  correctText,
  "data-testid": testId,
}: {
  isCorrect: boolean;
  correctText: string;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl flex items-center gap-3",
        isCorrect
          ? "result-correct-bg border"
          : "bg-amber-50/50 border border-amber-200/50"
      )}
      data-testid={testId}
    >
      <div className={cn(
        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        isCorrect ? "result-correct-icon-bg" : "bg-amber-500"
      )}>
        {isCorrect
          ? <CheckCircle2 className="h-4 w-4 text-white" />
          : <XCircle className="h-4 w-4 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-sm",
          isCorrect ? "theme-text" : "text-amber-700"
        )} data-testid={testId ? `${testId}-label` : undefined}>
          {isCorrect ? "Correct!" : "Incorrect"}
        </p>
        <p className="text-sm mt-0.5 leading-relaxed text-muted-foreground">{correctText}</p>
      </div>
    </div>
  );
}

export function RationaleSection({
  icon,
  title,
  children,
  variant = "default",
  className,
  "data-testid": testId,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  variant?: "default" | "pearl" | "strategy" | "memory" | "distractor";
  className?: string;
  "data-testid"?: string;
}) {
  const variantStyles = {
    default: "bg-gray-50/80 border-gray-200/60",
    pearl: "bg-violet-50/60 border-violet-200/50",
    strategy: "bg-blue-50/60 border-blue-200/50",
    memory: "bg-amber-50/60 border-amber-200/50",
    distractor: "bg-gray-50/60 border-gray-200/50",
  };

  const titleColors = {
    default: "text-gray-700",
    pearl: "text-violet-700",
    strategy: "text-blue-700",
    memory: "text-amber-700",
    distractor: "text-gray-700",
  };

  const accentBar = {
    default: "bg-gray-300",
    pearl: "bg-violet-300",
    strategy: "bg-blue-300",
    memory: "bg-amber-300",
    distractor: "bg-gray-300",
  };

  return (
    <div className={cn("px-4 py-3.5 rounded-xl border relative", variantStyles[variant], className)} data-testid={testId}>
      <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-full", accentBar[variant])} />
      <div className="flex items-center gap-2 mb-2 pl-2.5">
        {icon}
        <p className={cn("text-xs font-semibold uppercase tracking-wider", titleColors[variant])}>{title}</p>
      </div>
      <div className="text-sm leading-[1.75] text-gray-700 pl-2.5">{children}</div>
    </div>
  );
}

export function CollapsibleRationaleSection({
  icon,
  title,
  children,
  variant = "default",
  className,
  defaultOpen = false,
  "data-testid": testId,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  variant?: "default" | "pearl" | "strategy" | "memory" | "distractor";
  className?: string;
  defaultOpen?: boolean;
  "data-testid"?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: "bg-gray-50/80 border-gray-200/60",
    pearl: "bg-violet-50/60 border-violet-200/50",
    strategy: "bg-blue-50/60 border-blue-200/50",
    memory: "bg-amber-50/60 border-amber-200/50",
    distractor: "bg-gray-50/60 border-gray-200/50",
  };

  const titleColors = {
    default: "text-gray-700",
    pearl: "text-violet-700",
    strategy: "text-blue-700",
    memory: "text-amber-700",
    distractor: "text-gray-700",
  };

  const accentBar = {
    default: "bg-gray-300",
    pearl: "bg-violet-300",
    strategy: "bg-blue-300",
    memory: "bg-amber-300",
    distractor: "bg-gray-300",
  };

  return (
    <div className={cn("rounded-xl border relative", variantStyles[variant], className)} data-testid={testId}>
      <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-full", accentBar[variant])} />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 pl-6 text-left"
        data-testid={testId ? `${testId}-toggle` : undefined}
      >
        {icon}
        <p className={cn("text-xs font-semibold uppercase tracking-wider flex-1", titleColors[variant])}>{title}</p>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="text-sm leading-[1.75] text-gray-700 px-4 pb-3 pl-6">{children}</div>
      )}
    </div>
  );
}

export function RationaleImageBlock({
  src,
  alt,
  caption,
  description,
  "data-testid": testId,
}: {
  src: string;
  alt: string;
  caption?: string;
  description?: string;
  "data-testid"?: string;
}) {
  return (
    <figure className="mt-3 rounded-xl border border-gray-200/80 rationale-image-bg">
      <div className="px-4 py-2 border-b border-gray-200/60 bg-white/80">
        <p className="text-xs font-bold uppercase tracking-wider theme-text flex items-center gap-1.5">
          <Target className="w-3 h-3" />
          Clinical Reference
        </p>
      </div>
      <div className="p-4 flex justify-center">
        <img
          src={src}
          alt={alt}
          title={alt}
          className="rounded-xl w-full h-auto object-contain max-h-[360px] md:max-h-[480px] block shadow-sm"
          loading="lazy"
          data-testid={testId}
        />
      </div>
      {(caption || description) && (
        <div className="px-4 pb-3 space-y-1">
          {caption && <p className="text-xs font-semibold text-foreground">{caption}</p>}
          {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      )}
      <figcaption className="sr-only">{caption || alt}</figcaption>
    </figure>
  );
}

export function DistractorCard({
  letter,
  text,
  rationale,
}: {
  letter: string;
  text: string;
  rationale: string;
}) {
  return (
    <div className="pl-3 border-l-[3px] border-gray-300/80 py-0.5">
      <p className="text-sm font-semibold text-gray-700">{letter}. {text}</p>
      <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{rationale}</p>
    </div>
  );
}

export function RationaleText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) {
    return <p>{text}</p>;
  }
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
      ))}
    </>
  );
}

export function StudyTopicLink({
  topic,
  subtopic,
  bodySystem,
}: {
  topic?: string;
  subtopic?: string;
  bodySystem?: string;
}) {
  const label = subtopic || topic || bodySystem || "Lessons";
  const searchTerm = encodeURIComponent(subtopic || topic || bodySystem || "");
  const href = searchTerm ? `/lessons?search=${searchTerm}` : "/lessons";

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      data-testid="link-study-topic"
    >
      <BookOpen className="h-3.5 w-3.5" />
      Study This Topic: {label}
    </a>
  );
}

export function PostAnswerReviewLayout({
  questionColumn,
  rationaleColumn,
  className,
}: {
  questionColumn: ReactNode;
  rationaleColumn: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("animate-fade-in-up", className)}>
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
        <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)]" style={{ scrollbarGutter: "stable" }}>{questionColumn}</div>
        <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)]" style={{ scrollbarGutter: "stable" }}>{rationaleColumn}</div>
      </div>
      <div className="lg:hidden space-y-1.5 overflow-y-auto">
        {questionColumn}
        {rationaleColumn}
      </div>
    </div>
  );
}

export function ProgressHeader({
  left,
  center,
  right,
  className,
  "data-testid": testId,
}: {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "study-control-bar",
        className
      )}
      data-testid={testId}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">{left}</div>
        <div className="flex items-center gap-3 flex-1 justify-center">{center}</div>
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      </div>
    </div>
  );
}

export function StudyProgressBar({
  value,
  className,
  variant = "primary",
}: {
  value: number;
  className?: string;
  variant?: "primary" | "emerald" | "indigo" | "gray";
}) {
  const barColors = {
    primary: "bg-primary",
    emerald: "themed-progress-fill",
    indigo: "bg-indigo-500",
    gray: "bg-gray-700",
  };

  return (
    <div className={cn("h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", barColors[variant])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function StatPill({
  icon,
  label,
  value,
  className,
  "data-testid": testId,
}: {
  icon?: ReactNode;
  label?: string;
  value: string | number;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)} data-testid={testId}>
      {icon}
      <span className="font-semibold tabular-nums">{value}</span>
      {label && <span className="text-gray-400 text-xs">{label}</span>}
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
  "data-testid": testId,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}) {
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-xl transition-all duration-200", variants[variant], className)}
      data-testid={testId}
    >
      {children}
    </Button>
  );
}

export function FlashcardContainer({
  children,
  flipped,
  onClick,
  className,
}: {
  children: ReactNode;
  flipped?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[320px] sm:min-h-[380px] cursor-pointer select-none",
        className
      )}
      onClick={onClick}
    >
      <Card className={cn(
        "premium-card border-0 shadow-xl min-h-[320px] sm:min-h-[380px] flex flex-col items-center justify-center p-6 sm:p-10 text-center transition-all duration-300 active:scale-[0.99]",
        flipped
          ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-2xl shadow-primary/20"
          : "bg-white hover:shadow-2xl"
      )}>
        {children}
      </Card>
    </div>
  );
}

export function FlashcardRatingButtons({
  onWrong,
  onUnsure,
  onCorrect,
  wrongTestId,
  unsureTestId,
  correctTestId,
}: {
  onWrong: () => void;
  onUnsure?: () => void;
  onCorrect: () => void;
  wrongTestId?: string;
  unsureTestId?: string;
  correctTestId?: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-center text-[11px] text-gray-400 uppercase tracking-[0.15em] font-medium">
        How well did you know this?
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onWrong}
          variant="outline"
          className="rounded-2xl gap-3 px-5 py-7 border-red-200/60 text-red-600 hover:bg-red-50/60 hover:border-red-300/60 flex-1 transition-all duration-200 hover:shadow-md active:scale-[0.97]"
          data-testid={wrongTestId}
        >
          <XCircle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold text-sm">{t("components.premiumStudy.iGotItWrong")}</div>
            <div className="text-[10px] text-red-400 mt-0.5">{t("components.premiumStudy.reviewTomorrow")}</div>
          </div>
        </Button>
        {onUnsure && (
          <Button
            onClick={onUnsure}
            variant="outline"
            className="rounded-2xl gap-3 px-5 py-7 border-amber-200/60 text-amber-600 hover:bg-amber-50/60 hover:border-amber-300/60 flex-1 transition-all duration-200 hover:shadow-md active:scale-[0.97]"
            data-testid={unsureTestId}
          >
            <RotateCcw className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">{t("components.premiumStudy.iWasUnsure")}</div>
              <div className="text-[10px] text-amber-400 mt-0.5">{t("components.premiumStudy.reviewIn3Days")}</div>
            </div>
          </Button>
        )}
        <Button
          onClick={onCorrect}
          className="rounded-2xl gap-3 px-5 py-7 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 transition-all duration-200 hover:shadow-md hover:shadow-primary/15 active:scale-[0.97]"
          data-testid={correctTestId}
        >
          <CheckCircle2 className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold text-sm">{t("components.premiumStudy.iKnewThis")}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{t("components.premiumStudy.reviewIn7Days")}</div>
          </div>
        </Button>
      </div>
    </div>
  );
}

export function ScoreCircle({
  percentage,
  size = "lg",
  className,
}: {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeStyles = {
    sm: "w-16 h-16 text-xl",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-4xl",
  };

  const colorCls = percentage >= 80
    ? "bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 border-emerald-200/60"
    : percentage >= 60
    ? "bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600 border-amber-200/60"
    : "bg-gradient-to-br from-red-100 to-rose-50 text-red-600 border-red-200/60";

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center font-black border-2",
      sizeStyles[size],
      colorCls,
      className
    )}>
      {percentage}%
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-md mx-auto">{description}</p>}
      {children}
    </div>
  );
}

export function QuestionContextHeader({
  focusArea,
  topic,
  className,
  "data-testid": testId,
}: {
  focusArea?: string;
  topic?: string;
  className?: string;
  "data-testid"?: string;
}) {
  if (!focusArea && !topic) return null;
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)} data-testid={testId}>
      {focusArea && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide theme-badge-bg theme-text">
          <Crosshair className="w-3 h-3" />
          {focusArea}
        </span>
      )}
      {topic && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100/80 text-[11px] font-medium text-muted-foreground">
          {topic}
        </span>
      )}
    </div>
  );
}

export function KeyTakeawayBox({
  children,
  className,
  "data-testid": testId,
}: {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("key-takeaway-box rounded-xl p-3 border", className)} data-testid={testId}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Star className="w-3.5 h-3.5 theme-icon" />
        <span className="text-[10px] font-bold uppercase tracking-widest theme-text">{t("components.premiumStudy.keyTakeaway")}</span>
      </div>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function ThemedProgressBar({
  current,
  total,
  className,
  "data-testid": testId,
}: {
  current: number;
  total: number;
  className?: string;
  "data-testid"?: string;
}) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;
  return (
    <div className={cn("space-y-1.5", className)} data-testid={testId}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">
          Question {current} of {total}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out themed-progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
