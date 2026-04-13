"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircleHeart, Sparkles, X } from "lucide-react";
import { useUserFeedback } from "@/components/feedback/user-feedback-context";

const CATEGORIES = [
  { value: "BUG", label: "Something broke", hint: "Errors, crashes, or unexpected behavior" },
  { value: "BROKEN_CONTENT", label: "Broken content", hint: "Typos, missing media, wrong answers" },
  { value: "CONFUSING_QUESTION", label: "Confusing question or rationale", hint: "Wording, explanations, or scoring" },
  { value: "LESSON_ISSUE", label: "Lesson issue", hint: "Structure, pacing, or lesson flow" },
  { value: "BILLING_SUBSCRIPTION", label: "Billing or subscription", hint: "Plans, receipts, or access" },
  { value: "PERFORMANCE", label: "Slow or sluggish", hint: "Loading, lag, or timeouts" },
  { value: "FEATURE_REQUEST", label: "Idea or improvement", hint: "What would help you most?" },
  { value: "GENERAL", label: "General feedback", hint: "Anything else on your mind" },
] as const;

const SEVERITIES = [
  { value: "LOW", label: "Low", hint: "Minor annoyance" },
  { value: "MEDIUM", label: "Medium", hint: "Gets in the way sometimes" },
  { value: "HIGH", label: "High", hint: "Blocks me often" },
  { value: "CRITICAL", label: "Critical", hint: "Cannot continue / lost trust" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];
type SeverityValue = (typeof SEVERITIES)[number]["value"];

type Phase = "form" | "success";

const MAX_SCREENSHOT_BYTES = 280_000;

function buildExamContext(pathname: string, sp: URLSearchParams): Record<string, unknown> {
  const out: Record<string, unknown> = { pathname };
  const shell = sp.get("examShell");
  const sessionId = sp.get("sessionId");
  if (shell) out.examShell = shell;
  if (sessionId) out.sessionId = sessionId.slice(0, 80);
  if (pathname.includes("/practice-tests/")) out.practiceTestContext = true;
  return out;
}

function deviceHintFromWindow(): string {
  if (typeof window === "undefined") return "";
  const w = window.screen?.width ?? 0;
  const h = window.screen?.height ?? 0;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  return `${w}x${h}px screen · ${iw}x${ih}px viewport`;
}

export function UserFeedbackDialog() {
  const { isOpen, close, surface, pathwayId } = useUserFeedback();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);

  const [phase, setPhase] = useState<Phase>("form");
  const [category, setCategory] = useState<CategoryValue>("BUG");
  const [summary, setSummary] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState<SeverityValue>("MEDIUM");
  const [includeDevice, setIncludeDevice] = useState(true);
  const [pageUrlOverride, setPageUrlOverride] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setPhase("form");
    setCategory("BUG");
    setSummary("");
    setShowAdvanced(false);
    setDetails("");
    setSeverity("MEDIUM");
    setIncludeDevice(true);
    setPageUrlOverride("");
    setScreenshotDataUrl(null);
    setScreenshotName(null);
    setSubmitting(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, submitting]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const routeKey = useMemo(() => {
    const q = searchParams?.toString();
    const base = pathname || "/";
    if (!q) return base.slice(0, 512);
    const full = `${base}?${q}`;
    return full.slice(0, 512);
  }, [pathname, searchParams]);

  const onFile = useCallback((file: File | null) => {
    setScreenshotDataUrl(null);
    setScreenshotName(null);
    if (!file) return;
    if (!file.type.includes("png") && !file.type.includes("jpeg")) {
      setError("Please choose a PNG or JPEG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r !== "string") return;
      if (r.length > MAX_SCREENSHOT_BYTES) {
        setError("That image is a bit large. Try cropping or skip the attachment.");
        return;
      }
      setScreenshotDataUrl(r);
      setScreenshotName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const submit = useCallback(async () => {
    setError(null);
    setSubmitting(true);
    try {
      const pageUrl = (pageUrlOverride.trim() || (typeof window !== "undefined" ? window.location.href : "")).slice(
        0,
        2048,
      );
      const examContext = buildExamContext(pathname, searchParams ?? new URLSearchParams());
      const clientMeta: Record<string, unknown> = {
        surface,
        submittedAt: new Date().toISOString(),
        timeZone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
      };

      const res = await fetch("/api/feedback/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          severity: showAdvanced ? severity : undefined,
          summary: summary.trim(),
          details: showAdvanced && details.trim() ? details.trim() : null,
          pageUrl,
          routeKey,
          pathwayId,
          examContext,
          userAgent: includeDevice && typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 512) : null,
          deviceHint: includeDevice ? deviceHintFromWindow() : null,
          screenshotDataUrl: screenshotDataUrl,
          clientMeta,
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setPhase("success");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [
    category,
    severity,
    summary,
    details,
    showAdvanced,
    pageUrlOverride,
    routeKey,
    pathwayId,
    pathname,
    searchParams,
    includeDevice,
    screenshotDataUrl,
    surface,
  ]);

  if (!isOpen) return null;

  const headline =
    surface === "learner" ? "Help us make NurseNest better" : "We read every message";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) close();
      }}
    >
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-bg-base,Canvas)_55%,transparent)] backdrop-blur-[2px]"
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)] sm:max-h-[min(88vh,680px)] sm:rounded-3xl"
      >
        <header
          className="flex shrink-0 items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--surface-strong))] px-5 pb-4 pt-5 sm:px-6"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in srgb, var(--semantic-brand) 8%, transparent) 0%, transparent 55%)",
          }}
        >
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Feedback
            </p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
              {headline}
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-muted)]">
              Tell us what happened in your own words. Your report goes straight to our team — no ticket numbers, no
              robotic scripts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => !submitting && close()}
            className="nn-focus-ring -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_25%,var(--surface-strong))] text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
            aria-label="Close feedback"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        {phase === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--surface-strong))]"
              aria-hidden
            >
              <CheckCircle2 className="h-9 w-9 text-[var(--semantic-success)]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">Thank you for caring enough to tell us.</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--semantic-text-muted)]">
                We have saved your message. When we ship a fix or need a quick follow-up, we will use the context you
                shared — never to spam you.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="nn-focus-ring mt-2 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--surface-strong))] px-6 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--surface-strong))]"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <div className="space-y-5 px-5 py-5 sm:px-6">
              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--surface-strong))] px-4 py-3 text-sm text-[var(--theme-heading-text)]"
                >
                  {error}
                </div>
              ) : null}

              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-[var(--theme-heading-text)]">What is this about?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => {
                    const selected = category === c.value;
                    return (
                      <label
                        key={c.value}
                        className={`nn-focus-within-ring cursor-pointer rounded-2xl border p-3 transition ${
                          selected
                            ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_22%,var(--surface-strong))] shadow-sm"
                            : "border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--surface-strong))] hover:border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fb-cat"
                          value={c.value}
                          checked={selected}
                          onChange={() => setCategory(c.value)}
                          className="sr-only"
                        />
                        <span className="block text-sm font-semibold text-[var(--theme-heading-text)]">{c.label}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-[var(--semantic-text-muted)]">{c.hint}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="fb-summary" className="text-sm font-semibold text-[var(--theme-heading-text)]">
                  In one or two sentences, what should we know?
                </label>
                <textarea
                  id="fb-summary"
                  ref={firstFieldRef}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Example: The rationale on question 4 contradicts the correct answer…"
                  className="nn-focus-ring mt-2 w-full resize-y rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[color-mix(in_srgb,var(--semantic-bg-base)_40%,var(--surface-strong))] px-4 py-3 text-sm leading-relaxed text-[var(--theme-body-text)] placeholder:text-[var(--semantic-text-muted)]"
                />
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{summary.trim().length}/500 · minimum 10 characters</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                aria-expanded={showAdvanced}
              >
                {showAdvanced ? "Hide optional details" : "Add optional details"}
              </button>

              {showAdvanced ? (
                <div className="space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_6%,var(--surface-strong))] p-4">
                  <fieldset>
                    <legend className="text-sm font-semibold text-[var(--theme-heading-text)]">How much is this affecting you?</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SEVERITIES.map((s) => {
                        const on = severity === s.value;
                        return (
                          <label
                            key={s.value}
                            className={`nn-focus-within-ring cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              on
                                ? "border-[color-mix(in_srgb,var(--semantic-warning)_50%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--surface-strong))] text-[var(--theme-heading-text)]"
                                : "border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] bg-[var(--surface-strong)] text-[var(--semantic-text-muted)] hover:border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="fb-sev"
                              value={s.value}
                              className="sr-only"
                              checked={on}
                              onChange={() => setSeverity(s.value)}
                            />
                            {s.label}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="fb-details" className="text-sm font-semibold text-[var(--theme-heading-text)]">
                      More context (optional)
                    </label>
                    <textarea
                      id="fb-details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
                      maxLength={8000}
                      className="nn-focus-ring mt-2 w-full resize-y rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-relaxed text-[var(--theme-body-text)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="fb-url" className="text-sm font-semibold text-[var(--theme-heading-text)]">
                      Page URL (optional override)
                    </label>
                    <input
                      id="fb-url"
                      type="url"
                      value={pageUrlOverride}
                      onChange={(e) => setPageUrlOverride(e.target.value)}
                      placeholder="We already capture the current page unless you change this."
                      className="nn-focus-ring mt-2 w-full rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--theme-body-text)]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[var(--theme-heading-text)]">Screenshot (optional)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      capture="environment"
                      onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                      className="nn-focus-ring mt-2 block w-full text-sm text-[var(--semantic-text-muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--surface-strong))] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--theme-heading-text)]"
                    />
                    {screenshotName ? (
                      <p className="mt-1 text-xs text-[var(--semantic-success)]">Attached: {screenshotName}</p>
                    ) : null}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-1 py-1">
                    <input
                      type="checkbox"
                      checked={includeDevice}
                      onChange={(e) => setIncludeDevice(e.target.checked)}
                      className="nn-focus-ring mt-1 h-4 w-4 shrink-0 rounded border-[var(--semantic-border-soft)]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[var(--theme-heading-text)]">Include device & browser basics</span>
                      <span className="mt-0.5 block text-xs text-[var(--semantic-text-muted)]">
                        Helps us reproduce layout issues. No cross-site tracking.
                      </span>
                    </span>
                  </label>
                </div>
              ) : null}
            </div>

            <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] bg-[color-mix(in_srgb,var(--semantic-bg-base)_25%,var(--surface-strong))] px-5 py-4 backdrop-blur-sm sm:px-6">
              <button
                type="button"
                disabled={submitting || summary.trim().length < 10}
                onClick={() => void submit()}
                className="nn-focus-ring inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--surface-strong))] text-sm font-semibold text-[var(--theme-heading-text)] transition enabled:hover:bg-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--surface-strong))] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  <>
                    <MessageCircleHeart className="h-4 w-4" aria-hidden />
                    Send to NurseNest
                  </>
                )}
              </button>
              <p className="text-center text-[11px] leading-snug text-[var(--semantic-text-muted)]">
                By sending, you agree we may use this information to diagnose and improve the product.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
