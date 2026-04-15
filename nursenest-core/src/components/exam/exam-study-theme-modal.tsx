"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useExamStudyTheme } from "@/components/exam/exam-study-theme-context";

function ThemePreviewSample() {
  return (
    <div
      className="rounded-xl border border-[var(--semantic-border-soft)] p-4 text-left shadow-[var(--semantic-shadow-soft)]"
      style={{
        background: "color-mix(in srgb, var(--semantic-panel-cool) 35%, var(--semantic-surface))",
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
        Preview
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">Study session</p>
      <div className="mt-3 h-2 w-full max-w-[12rem] rounded-full nn-progress-track-semantic">
        <div
          className="h-full rounded-full nn-progress-fill-semantic-brand"
          style={{ width: "62%" }}
        />
      </div>
      <div
        className="mt-3 min-h-[2.5rem] rounded-xl border px-3 py-2 text-xs text-[var(--theme-body-text)]"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "var(--semantic-surface)",
        }}
      >
        Answer option sample
      </div>
    </div>
  );
}

function ExamStudyThemeModalInner({
  initialPreviewId,
  onClose,
}: {
  initialPreviewId: string;
  onClose: () => void;
}) {
  const { t } = useMarketingI18n();
  const { setSessionTheme } = useExamStudyTheme();
  const titleId = useId();
  const [previewId, setPreviewId] = useState(initialPreviewId);
  const themeChoices = useMemo(
    () => [...THEME_OPTIONS].sort((a, b) => Number(!!b.named) - Number(!!a.named)),
    [],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="relative z-[121] flex max-h-[min(92dvh,840px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] sm:rounded-2xl"
    >
      <div className="border-b border-[var(--semantic-border-soft)] px-4 py-3 sm:px-6 sm:py-4">
        <h2 id={titleId} className="text-lg font-bold text-[var(--theme-heading-text)]">
          {t("learner.examTheme.title")}
        </h2>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          {t("learner.examTheme.subtitle")}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-[1fr_min(240px,38%)] sm:p-6">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            {t("learner.examTheme.choose")}
          </p>
          <div className="grid max-h-[min(52vh,420px)] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {themeChoices.map((opt) => {
              const selected = previewId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreviewId(opt.id)}
                  className={`flex flex-col gap-2 rounded-xl border p-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] ${
                    selected
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-surface))]"
                  }`}
                >
                  <span
                    className="h-8 w-full rounded-lg border border-[var(--semantic-border-soft)]"
                    style={{ background: opt.color }}
                    aria-hidden
                  />
                  <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-[var(--theme-heading-text)]">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-[140px] flex-col gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3 sm:min-h-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            {t("learner.examTheme.previewLabel")}
          </p>
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg p-1" data-theme={previewId}>
            <ThemePreviewSample />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          className="min-h-11 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface)]"
          onClick={() => {
            setSessionTheme(null);
            onClose();
          }}
        >
          {t("learner.examTheme.useAppDefault")}
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-11 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--semantic-surface)]"
            onClick={onClose}
          >
            {t("learner.examTheme.cancel")}
          </button>
          <button
            type="button"
            className="min-h-11 rounded-full px-5 text-sm font-semibold text-[var(--role-cta-foreground,var(--theme-primary-foreground))]"
            style={{ background: "var(--role-cta, var(--theme-primary))" }}
            onClick={() => {
              setSessionTheme(previewId);
              onClose();
            }}
          >
            {t("learner.examTheme.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExamStudyThemeModal() {
  const { t } = useMarketingI18n();
  const { sessionTheme, themePickerOpen, setThemePickerOpen, themePickerNonce } = useExamStudyTheme();

  const onClose = useCallback(() => setThemePickerOpen(false), [setThemePickerOpen]);

  useEffect(() => {
    if (!themePickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [themePickerOpen, onClose]);

  if (!themePickerOpen) return null;

  const initialPreviewId = sessionTheme ?? "ocean";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_22%,transparent)] backdrop-blur-[2px]"
        aria-label={t("learner.examTheme.close")}
        onClick={onClose}
      />
      <ExamStudyThemeModalInner
        key={themePickerNonce}
        initialPreviewId={initialPreviewId}
        onClose={onClose}
      />
    </div>
  );
}
