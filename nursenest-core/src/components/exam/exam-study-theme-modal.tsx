"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { ArrowRight, Check, Palette } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  EXAM_STUDY_THEME_STORAGE_KEY,
  useExamStudyTheme,
} from "@/components/exam/exam-study-theme-context";
import {
  getExamInterfaceThemePresets,
  normalizeExamInterfaceThemeId,
} from "@/lib/exam/exam-interface-theme-presets";

function useModalFocusTrap(active: boolean, rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!active || !rootRef.current) return;
    const root = rootRef.current;
    const sel =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = [...root.querySelectorAll<HTMLElement>(sel)].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [active, rootRef]);
}

/** Legacy mock-exams preview: thin chrome bar + stem skeleton + options + footer nav — inherit `data-theme` from parent. */
function ExamShellMiniPreview() {
  const { t } = useMarketingI18n();
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--semantic-border-soft)] shadow-sm">
      <div className="flex h-8 items-center gap-2 bg-[color-mix(in_srgb,var(--theme-primary)_20%,var(--semantic-surface))] px-3">
        <span className="text-[10px] font-semibold tabular-nums text-[var(--theme-heading-text)]">
          {t("learner.examTheme.previewProgress")}
        </span>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_25%,transparent)]">
          <div
            className="h-full w-1/3 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_85%,var(--semantic-text-primary))]"
            aria-hidden
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-[var(--theme-heading-text)]">12:34</span>
      </div>
      <div className="space-y-1.5 bg-[var(--semantic-surface)] p-2.5">
        <div className="h-2 w-3/4 rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_35%,transparent)]" />
        <div className="h-2 w-1/2 rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_22%,transparent)]" />
        <div className="mt-2 flex gap-1.5">
          <div className="h-5 flex-1 rounded border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]" />
          <div
            className="h-5 flex-1 rounded border-l-2 bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--semantic-surface))]"
            style={{ borderLeftColor: "var(--theme-primary)" }}
          />
        </div>
      </div>
      <div className="flex h-7 items-center justify-between bg-[color-mix(in_srgb,var(--theme-primary)_16%,var(--semantic-surface))] px-3">
        <span className="text-[9px] font-medium text-[var(--semantic-text-muted)]">
          {t("learner.examTheme.previewPrevious")}
        </span>
        <span className="rounded px-2 py-0.5 text-[9px] font-semibold text-[var(--role-cta-foreground,var(--theme-primary-foreground))]"
          style={{ background: "var(--role-cta, var(--theme-primary))" }}
        >
          {t("learner.examTheme.previewNext")}
        </span>
      </div>
    </div>
  );
}

type CustomizeMode = "session-settings" | "pre-exam";

function ExamCustomizeDialogBody({
  mode,
  titleId,
  previewId,
  setPreviewId,
  onClose,
  onApplySessionTheme,
  onBeginExam,
  beginDisabled,
}: {
  mode: CustomizeMode;
  titleId: string;
  previewId: string;
  setPreviewId: (id: string) => void;
  onClose: () => void;
  onApplySessionTheme: (id: string | null) => void;
  onBeginExam?: () => void;
  beginDisabled?: boolean;
}) {
  const { t } = useMarketingI18n();
  const beginLabel = beginDisabled ? t("learner.examPractice.preparing") : t("learner.examTheme.beginExam");
  const presets = useMemo(() => getExamInterfaceThemePresets(), []);

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]">
          <Palette className="h-6 w-6 text-[var(--semantic-brand)]" aria-hidden />
        </div>
        <h2 id={titleId} className="text-xl font-bold text-[var(--theme-heading-text)]">
          {t("learner.examTheme.title")}
        </h2>
        <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.examTheme.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((theme) => {
          const selected = previewId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              data-testid={`button-exam-theme-${theme.id}`}
              onClick={() => setPreviewId(theme.id)}
              className={`relative overflow-hidden rounded-xl border-2 p-0 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] ${
                selected
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] shadow-lg ring-2 ring-[color-mix(in_srgb,var(--semantic-brand)_22%,transparent)]"
                  : "border-[var(--semantic-border-soft)] hover:border-[color-mix(in_srgb,var(--semantic-text-muted)_40%,var(--semantic-border-soft))]"
              }`}
            >
              <div
                className="h-8 w-full border-b border-[var(--semantic-border-soft)]"
                style={{ background: theme.color }}
                aria-hidden
              />
              <div className="bg-[var(--semantic-surface)] px-2 py-2.5">
                <span className="block text-xs font-semibold leading-tight text-[var(--theme-heading-text)]">
                  {theme.label}
                </span>
              </div>
              {selected ? (
                <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--semantic-brand)] text-[var(--role-cta-foreground,var(--theme-primary-foreground))] shadow-sm">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))] p-3">
        <p className="mb-2 text-xs font-medium text-[var(--semantic-text-muted)]">
          {t("learner.examTheme.previewLabel")}
        </p>
        <div data-theme={previewId}>
          <ExamShellMiniPreview />
        </div>
      </div>

      {mode === "session-settings" ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="min-h-12 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface)]"
            onClick={() => {
              onApplySessionTheme(null);
              onClose();
            }}
          >
            {t("learner.examTheme.useAppDefault")}
          </button>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              className="min-h-12 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--semantic-surface)]"
              onClick={onClose}
            >
              {t("learner.examTheme.cancel")}
            </button>
            <button
              type="button"
              className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[var(--role-cta-foreground,var(--theme-primary-foreground))]"
              style={{ background: "var(--role-cta, var(--theme-primary))" }}
              onClick={() => {
                onApplySessionTheme(previewId);
                onClose();
              }}
            >
              {t("learner.examTheme.apply")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            className="min-h-12 flex-1 rounded-full border border-[var(--semantic-border-soft)] text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--semantic-surface)]"
            onClick={onClose}
            data-testid="button-exam-customize-back"
          >
            {t("learner.examTheme.back")}
          </button>
          <button
            type="button"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-base font-semibold text-[var(--role-cta-foreground,var(--theme-primary-foreground))] disabled:opacity-60"
            style={{ background: "var(--role-cta, var(--theme-primary))" }}
            disabled={beginDisabled}
            onClick={() => {
              onApplySessionTheme(previewId);
              onBeginExam?.();
            }}
            data-testid="button-exam-customize-begin"
          >
            {beginLabel}
            {!beginDisabled ? <ArrowRight className="h-5 w-5 shrink-0" aria-hidden /> : null}
          </button>
        </div>
      )}
    </div>
  );
}

function readInitialExamThemeId(): string {
  if (typeof window === "undefined") return "plum-mist";
  try {
    const v = localStorage.getItem(EXAM_STUDY_THEME_STORAGE_KEY);
    if (v && v.length > 0 && v !== "inherit") {
      return normalizeExamInterfaceThemeId(v);
    }
  } catch {
    /* ignore */
  }
  return "plum-mist";
}

/** Mounts only while open so preview state re-initializes from storage each open (no setState-in-effect). */
function ExamPreExamCustomizeModalContent({
  onClose,
  onBegin,
  starting,
}: {
  onClose: () => void;
  onBegin: () => void;
  starting: boolean;
}) {
  const { t } = useMarketingI18n();
  const { setSessionTheme } = useExamStudyTheme();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [previewId, setPreviewId] = useState(readInitialExamThemeId);

  useModalFocusTrap(true, panelRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const tmr = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }, 0);
    return () => window.clearTimeout(tmr);
  }, []);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_28%,transparent)] backdrop-blur-[2px]"
        aria-label={t("learner.examTheme.close")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-[131] w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] outline-none"
      >
        <ExamCustomizeDialogBody
          mode="pre-exam"
          titleId={titleId}
          previewId={previewId}
          setPreviewId={(id) => setPreviewId(normalizeExamInterfaceThemeId(id))}
          onClose={onClose}
          onApplySessionTheme={(id) => setSessionTheme(id)}
          onBeginExam={onBegin}
          beginDisabled={starting}
        />
      </div>
    </div>
  );
}

/** Pre-exam step: legacy “Customize → Begin Exam” flow before starting a practice session. */
export function ExamPreExamCustomizeModal({
  open,
  onClose,
  onBegin,
  starting,
}: {
  open: boolean;
  onClose: () => void;
  onBegin: () => void;
  starting: boolean;
}) {
  if (!open) return null;
  return <ExamPreExamCustomizeModalContent onClose={onClose} onBegin={onBegin} starting={starting} />;
}

function ExamStudyThemeModalInner({
  sessionTheme,
  setSessionTheme,
  onClose,
  themePickerNonce,
}: {
  sessionTheme: string | null;
  setSessionTheme: (id: string | null) => void;
  onClose: () => void;
  themePickerNonce: number;
}) {
  const { t } = useMarketingI18n();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [previewId, setPreviewId] = useState(() => normalizeExamInterfaceThemeId(sessionTheme ?? undefined));

  useModalFocusTrap(true, panelRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const tmr = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }, 0);
    return () => window.clearTimeout(tmr);
  }, [themePickerNonce]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_22%,transparent)] backdrop-blur-[2px]"
        aria-label={t("learner.examTheme.close")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-[121] max-h-[min(92dvh,880px)] w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-y-auto rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] outline-none"
      >
        <ExamCustomizeDialogBody
          mode="session-settings"
          titleId={titleId}
          previewId={previewId}
          setPreviewId={(id) => setPreviewId(normalizeExamInterfaceThemeId(id))}
          onClose={onClose}
          onApplySessionTheme={(id) => setSessionTheme(id)}
        />
      </div>
    </div>
  );
}

export function ExamStudyThemeModal() {
  const { sessionTheme, setSessionTheme, themePickerOpen, setThemePickerOpen, themePickerNonce } =
    useExamStudyTheme();
  const onClose = useCallback(() => setThemePickerOpen(false), [setThemePickerOpen]);

  if (!themePickerOpen) return null;

  return (
    <ExamStudyThemeModalInner
      key={`${themePickerNonce}-${sessionTheme ?? ""}`}
      sessionTheme={sessionTheme}
      setSessionTheme={setSessionTheme}
      onClose={onClose}
      themePickerNonce={themePickerNonce}
    />
  );
}
