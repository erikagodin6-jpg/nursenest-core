"use client";

/**
 * Global context bar — slim row of clickable context pills.
 *
 * Shows the user's current country, language, profession, and exam context.
 * Each pill opens a selector popover or triggers the mobile context drawer.
 *
 * Layout: [🇵🇭 Philippines] [English] [RN] [NCLEX-RN]
 *
 * Desktop: inline popovers on click.
 * Mobile: tapping any pill opens the mobile context drawer.
 */

import { ChevronDown } from "lucide-react";
import {
  REGION_CONFIG,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";
import {
  getRegionFlag,
  getLocaleDisplay,
  getProfessionsForRegion,
  getExamsForRegionProfession,
} from "@/lib/navigation/context-switch-helpers";

// ── Types ────────────────────────────────────────────────────────────────────

type GlobalContextBarProps = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  onRegionClick?: () => void;
  onLanguageClick?: () => void;
  onProfessionClick?: () => void;
  onExamClick?: () => void;
};

// ── Component ────────────────────────────────────────────────────────────────

export function GlobalContextBar({
  region,
  locale,
  profession,
  exam,
  onRegionClick,
  onLanguageClick,
  onProfessionClick,
  onExamClick,
}: GlobalContextBarProps) {
  const regionCfg = REGION_CONFIG[region];
  const flag = getRegionFlag(region);
  const localeDisplay = getLocaleDisplay(locale);
  const professions = getProfessionsForRegion(region);
  const exams = profession ? getExamsForRegionProfession(region, profession) : [];
  const professionLabel = profession
    ? (professions.find((p) => p.roleTrack === profession)?.label ?? profession.toUpperCase())
    : "RN";
  const examLabel = exam
    ? (exams.find((e) => e.examCode === exam)?.label ?? exam.toUpperCase())
    : null;
  const hasMultipleExams = exams.length > 1;

  return (
    <div
      className="nn-context-bar border-b"
      style={{
        background: "var(--nn-nav-bg, var(--surface))",
        borderColor: "var(--nn-nav-border, var(--border-subtle))",
      }}
    >
      <div className="nn-section-shell flex min-h-[44px] items-center gap-1.5 overflow-x-auto py-1 scrollbar-none sm:min-h-9 sm:gap-2 sm:py-0">
        {/* Country pill */}
        <ContextPill
          onClick={onRegionClick}
          active
          aria-label={`Country: ${regionCfg.displayName}. Click to change.`}
        >
          <span className="text-sm leading-none" aria-hidden>{flag}</span>
          <span className="max-w-[120px] truncate">{regionCfg.displayName}</span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
        </ContextPill>

        <ContextDivider />

        {/* Language pill */}
        <ContextPill
          onClick={onLanguageClick}
          active
          aria-label={`Language: ${localeDisplay.label}. Click to change.`}
        >
          <span className="max-w-[80px] truncate">{localeDisplay.label}</span>
          {regionCfg.allowedLocales.length > 1 && (
            <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
          )}
        </ContextPill>

        <ContextDivider />

        {/* Profession pill */}
        <ContextPill
          onClick={professions.length > 1 ? onProfessionClick : undefined}
          active
          aria-label={`Profession: ${professionLabel}${professions.length <= 1 ? "" : ". Click to change."}`}
        >
          <span>{professionLabel}</span>
          {professions.length > 1 && (
            <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
          )}
        </ContextPill>

        {/* Exam pill — only if there's an exam to show */}
        {examLabel && (
          <>
            <ContextDivider />
            <ContextPill
              onClick={hasMultipleExams ? onExamClick : undefined}
              active
              aria-label={`Exam: ${examLabel}${!hasMultipleExams ? "" : ". Click to change."}`}
            >
              <span>{examLabel}</span>
              {hasMultipleExams && (
                <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
              )}
            </ContextPill>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ContextPill({
  children,
  onClick,
  active,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isClickable = Boolean(onClick);
  const baseClass =
    "inline-flex min-h-[36px] items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors duration-100 sm:min-h-0 sm:py-1";
  const interactiveClass = isClickable
    ? "cursor-pointer hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
    : "cursor-default";
  const colorClass = active
    ? "bg-white/22 text-[var(--nn-nav-fg,white)] border border-white/35"
    : "text-[var(--nn-nav-fg,white)] opacity-70";

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${interactiveClass} ${colorClass}`}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={`${baseClass} ${colorClass}`} {...rest}>
      {children}
    </span>
  );
}

function ContextDivider() {
  return (
    <span className="h-3 w-px shrink-0 bg-white/35" aria-hidden />
  );
}
