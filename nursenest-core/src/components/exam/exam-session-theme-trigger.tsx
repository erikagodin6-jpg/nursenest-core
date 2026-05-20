"use client";

import { useExamStudyThemeOptional } from "@/components/exam/exam-study-theme-context";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Opens the exam/study session theme modal. No-ops when the learner theme provider is absent.
 */
export function ExamSessionThemeTrigger({
  className = "",
  variant = "toolbar",
}: {
  className?: string;
  /** `toolbar` = compact icon; `pill` = labeled control for top bars */
  variant?: "toolbar" | "pill";
}) {
  const { t } = useMarketingI18n();
  const ctx = useExamStudyThemeOptional();
  if (!ctx) return null;

  const label = t("learner.examTheme.open");
  const active = Boolean(ctx.sessionTheme);

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={() => ctx.setThemePickerOpen(true)}
        className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] ${className} ${
          active
            ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
            : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
        }`}
        aria-label={label}
        title={label}
      >
        <PaletteIcon className="size-4 shrink-0 opacity-90" aria-hidden />
        <span className="max-[380px]:hidden">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => ctx.setThemePickerOpen(true)}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] ${className} ${
        active
          ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
      }`}
      aria-label={label}
      title={label}
    >
      <PaletteIcon className="size-5" aria-hidden />
    </button>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 1 0 9 9c0 .55-.45 1-1 1h-2a2 2 0 0 1-2-2v-.5a.5.5 0 0 0-.5-.5h-1a2 2 0 0 1-2-2V12a2 2 0 0 0-2-2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="6.5" r="1.25" fill="currentColor" />
      <circle cx="11" cy="5" r="1.25" fill="currentColor" />
      <circle cx="14.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
