"use client";

/**
 * Premium Gate System — high-conversion paywall components
 *
 * All locked states use theme-aware CSS custom properties — no hardcoded hex.
 * Gating philosophy:
 *   - Always show structure (titles, sections) — never hide content entirely
 *   - Show partial previews with soft blur / gradient fade
 *   - Copy guides the user, not blocks them
 *   - "Start Free Trial" is the consistent primary CTA everywhere
 *   - "View Plans" is the consistent secondary action everywhere
 *   - Locked UI feels premium and calm, not aggressive or error-like
 *
 * Components:
 *   PremiumLockCard      — standalone locked card (complete section gate)
 *   LockedPreviewCard    — faded preview + lock overlay below it
 *   UpgradePromptCard    — end-of-page conversion block
 *   EntitledSection      — renders children or fallback based on isEntitled
 *   PreviewDivider       — separator between free preview and locked content
 *   LockedMetricCard     — blurred metric with visible heading (analytics)
 *   ContextualPaywallCard — adaptive paywall with context-aware messaging
 *
 * Analytics:
 *   usePremiumGateImpression — fires one event per surface mount via
 *   window.posthog if available. One impression per surface load, not per render.
 */

import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

// ── Analytics ────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Fires a PostHog impression event once per component mount.
 * Only fires when `isEntitled` is false (gate is visible to the user).
 * Silently no-ops if PostHog is not available.
 */
export function usePremiumGateImpression(
  eventName: string,
  isEntitled: boolean,
) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (isEntitled || firedRef.current) return;
    firedRef.current = true;
    try {
      window.posthog?.capture(eventName, { surface: eventName });
    } catch {
      // Analytics must never break the product
    }
  }, [isEntitled, eventName]);
}

function trackPaywallCta(surface: string, action: string) {
  try {
    window.posthog?.capture("paywall_cta_clicked", { surface, action });
  } catch {
    // silent
  }
}

// ── Shared upgrade href ───────────────────────────────────────────────────────

const UPGRADE_HREF = "/pricing";
const DEFAULT_CTA_LABEL = "Start Free Trial";

// ── PremiumLockCard ───────────────────────────────────────────────────────────

/**
 * PremiumLockCard — a polished locked section card.
 *
 * Theme-tinted background with accent bar. Lock icon in a branded circle.
 * Optional bullet points with check icons.
 * Consistent "Start Free Trial" CTA with optional secondary link.
 *
 * Use when the entire section is locked with no free preview.
 */
export function PremiumLockCard({
  title,
  description,
  bullets,
  ctaHref = UPGRADE_HREF,
  ctaLabel = DEFAULT_CTA_LABEL,
  secondaryHref,
  secondaryLabel,
  tierLabel,
  surface,
}: {
  title: string;
  description: string;
  bullets?: string[];
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tierLabel?: string;
  /** Analytics surface identifier for CTA tracking */
  surface?: string;
}) {
  return (
    <div className="nn-premium-lock-card">
      <div className="nn-premium-lock-card__header">
        <span className="nn-premium-lock-card__icon-wrap">
          <Lock className="nn-premium-lock-card__icon h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="nn-premium-lock-card__title">{title}</span>
        <span className="nn-premium-lock-card__badge">
          Premium
        </span>
      </div>
      <div className="nn-premium-lock-card__body">
        <p className="nn-premium-lock-card__description">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="nn-premium-lock-card__bullets">
            {bullets.map((b) => (
              <li key={b} className="nn-premium-lock-card__bullet">
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: "var(--semantic-success)" }}
                  aria-hidden
                />
                {b}
              </li>
            ))}
          </ul>
        )}
        {tierLabel && (
          <p className="nn-premium-lock-card__tier-hint">
            Part of the {tierLabel} plan
          </p>
        )}
        <div className="nn-premium-lock-card__actions">
          <Link
            href={ctaHref}
            onClick={() => surface && trackPaywallCta(surface, "primary")}
            className="nn-btn-primary inline-flex min-h-[2.25rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
          >
            {ctaLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              onClick={() => surface && trackPaywallCta(surface, "secondary")}
              className="nn-btn-secondary inline-flex min-h-[2.25rem] items-center rounded-lg px-4 text-sm font-semibold"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          No charge today · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ── LockedPreviewCard ─────────────────────────────────────────────────────────

/**
 * LockedPreviewCard — renders a faded preview of `children`, then an
 * overlay with a lock message below it.
 *
 * The preview content is visible as structure but muted via opacity + mask.
 * The overlay sits below (not on top), keeping the layout clear.
 */
export function LockedPreviewCard({
  children,
  overlayTitle,
  overlayDescription,
  ctaHref = UPGRADE_HREF,
  ctaLabel = DEFAULT_CTA_LABEL,
  surface,
}: {
  children: React.ReactNode;
  overlayTitle: string;
  overlayDescription: string;
  ctaHref?: string;
  ctaLabel?: string;
  /** Analytics surface identifier for CTA tracking */
  surface?: string;
}) {
  return (
    <div className="nn-locked-preview">
      {/* Faded preview — shows structure, not detail */}
      <div className="nn-locked-preview__content" aria-hidden="true">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="nn-locked-preview__overlay">
        <p className="nn-locked-preview__overlay-title">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {overlayTitle}
        </p>
        <p className="nn-locked-preview__overlay-desc">{overlayDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={ctaHref}
            onClick={() => surface && trackPaywallCta(surface, "primary")}
            className="nn-btn-primary inline-flex min-h-[2rem] items-center rounded-lg px-3.5 text-sm font-semibold shadow-none"
          >
            {ctaLabel}
          </Link>
          <Link
            href={UPGRADE_HREF}
            onClick={() => surface && trackPaywallCta(surface, "secondary")}
            className="nn-btn-secondary inline-flex min-h-[2rem] items-center rounded-lg px-3.5 text-sm font-semibold"
          >
            View Plans
          </Link>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          No charge today · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ── UpgradePromptCard ─────────────────────────────────────────────────────────

/**
 * UpgradePromptCard — a restrained end-of-page conversion block.
 *
 * Theme-tinted card with accent bar. Bullet points use CheckCircle2 icons.
 * One primary CTA + one low-pressure secondary.
 */
export function UpgradePromptCard({
  isEntitled = true,
}: {
  isEntitled?: boolean;
}) {
  usePremiumGateImpression("premiumUpgradePromptViewed", isEntitled);

  if (isEntitled) return null;

  const bullets = [
    "Lessons and review linked to what you actually missed",
    "Readiness score that tracks when you are exam-ready",
    "Adaptive CAT exams that mirror the real test format",
  ];

  return (
    <div className="nn-upgrade-prompt-card">
      <p className="nn-upgrade-prompt-card__title">Your Full Study System</p>
      <p className="nn-upgrade-prompt-card__body">
        Lessons, Smart Review, readiness scoring, and adaptive practice exams,
        all connected to your weak areas.
      </p>
      <ul className="nn-upgrade-prompt-card__bullets">
        {bullets.map((b) => (
          <li key={b} className="nn-upgrade-prompt-card__bullet">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--semantic-success)" }}
              aria-hidden
            />
            {b}
          </li>
        ))}
      </ul>
      <div className="nn-upgrade-prompt-card__actions">
        <Link
          href={UPGRADE_HREF}
          onClick={() => trackPaywallCta("upgrade_prompt_card", "primary")}
          className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
        >
          Start Free Trial
        </Link>
        <Link
          href={UPGRADE_HREF}
          className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold"
        >
          View Plans
        </Link>
      </div>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">
        No charge today · Cancel anytime before your trial ends
      </p>
    </div>
  );
}

// ── EntitledSection ───────────────────────────────────────────────────────────

/**
 * EntitledSection — conditional gate wrapper.
 *
 * When `isEntitled` is true, renders `children`.
 * When false, renders `fallback` (which should be a locked/preview state).
 *
 * Defaults to entitled so existing unmodified callsites keep working.
 */
export function EntitledSection({
  isEntitled = true,
  children,
  fallback,
}: {
  isEntitled?: boolean;
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  return <>{isEntitled ? children : fallback}</>;
}

// ── PreviewDivider ────────────────────────────────────────────────────────────

/**
 * PreviewDivider — visual separator between free preview content and
 * locked continuation.
 *
 * Shows a horizontal rule with a centered "Premium" pill label.
 */
export function PreviewDivider({ label = "Included with Premium" }: { label?: string }) {
  return (
    <div className="nn-preview-divider" role="separator" aria-label={label}>
      <div className="nn-preview-divider__line" aria-hidden />
      <span className="nn-preview-divider__label">
        <Lock className="h-2.5 w-2.5" aria-hidden />
        {label}
      </span>
      <div className="nn-preview-divider__line" aria-hidden />
    </div>
  );
}

// ── LockedMetricCard ──────────────────────────────────────────────────────────

/**
 * LockedMetricCard — shows a metric card with a visible heading but
 * blurred number area.
 *
 * Visible heading communicates what the metric measures.
 * Blurred value teases depth without revealing the number.
 */
export function LockedMetricCard({
  heading,
  placeholderValue = "--",
}: {
  heading: string;
  placeholderValue?: string;
}) {
  return (
    <div className="nn-locked-metric-card">
      <p className="nn-locked-metric-card__header">{heading}</p>
      <div className="nn-locked-metric-card__blur" aria-hidden="true">
        {placeholderValue}
      </div>
      <div className="nn-locked-metric-card__lock">
        <Lock className="h-3 w-3" aria-hidden />
        <span>Included with trial</span>
      </div>
    </div>
  );
}

// ── LockedDayShell ────────────────────────────────────────────────────────────

/**
 * LockedDayShell — placeholder card shown for locked study days.
 *
 * Dashed border. Day badge. Lock icon. Does not reveal content.
 * Shows the day number and a generic locked title so users understand the plan structure.
 */
export function LockedDayShell({
  dayNumber,
  title,
}: {
  dayNumber: number;
  title: string;
}) {
  return (
    <div className="nn-study-day-shell">
      <div className="nn-study-day-shell__header">
        <span className="nn-study-day-shell__badge" aria-label={`Day ${dayNumber}`}>
          {dayNumber}
        </span>
        <span className="nn-study-day-shell__title">{title}</span>
        <Lock className="nn-study-day-shell__lock h-4 w-4" aria-hidden />
      </div>
    </div>
  );
}

// ── Contextual Paywall Messaging ──────────────────────────────────────────────

export type PaywallContext =
  | "weak_topic"
  | "post_questions"
  | "near_exam"
  | "lesson"
  | "lesson_highyield"
  | "practice_test"
  | "smart_review"
  | "confidence_analytics"
  | "dashboard"
  | "generic";

const PAYWALL_PRESETS: Record<
  PaywallContext,
  { title: string; description: string; bullets: string[] }
> = {
  weak_topic: {
    title: "Continue This Lesson",
    description: "This topic showed up in your weak areas. Full access lets you work through it properly.",
    bullets: [
      "Structured lesson with key concepts explained",
      "Practice questions linked to this topic",
      "Smart Review tracks your improvement",
    ],
  },
  post_questions: {
    title: "Review Your Mistakes",
    description: "See what you got wrong and why, grouped by what matters most.",
    bullets: [
      "Every mistake grouped by confidence and urgency",
      "Lesson links for each question you missed",
      "Overconfidence detection for false positives",
    ],
  },
  near_exam: {
    title: "Get Exam-Ready",
    description: "Your exam is coming up. Full access gives you the tools to prepare properly.",
    bullets: [
      "Adaptive CAT exams that mirror the real test",
      "Readiness score so you know when to sit",
      "Study plan built from your weakest areas",
    ],
  },
  lesson: {
    title: "Continue This Lesson",
    description: "This lesson is part of your study pathway. Start a trial to continue.",
    bullets: [
      "Full lesson content with key concepts",
      "Practice questions tied to this topic",
      "Progress tracked across your study plan",
    ],
  },
  lesson_highyield: {
    title: "Continue This Lesson",
    description: "This is a high-yield topic. It comes up often on the exam.",
    bullets: [
      "Full lesson content with clinical focus",
      "Practice questions tied to this topic",
      "Smart Review flags when you need to revisit it",
    ],
  },
  practice_test: {
    title: "Full Practice Exams",
    description: "Timed, adaptive exams that match the format you will see on test day.",
    bullets: [
      "Adaptive CAT with real-time difficulty adjustment",
      "Performance breakdown by topic and confidence",
      "Readiness score after every test",
    ],
  },
  smart_review: {
    title: "Smart Review",
    description: "Your mistakes, organized by what to fix first.",
    bullets: [
      "Questions grouped by urgency and confidence",
      "Prioritized review queue for high-impact fixes",
      "Lesson links for every question you missed",
    ],
  },
  confidence_analytics: {
    title: "Confidence Analytics",
    description: "See where your confidence matches your accuracy, and where it does not.",
    bullets: [
      "Overconfident error detection",
      "Uncertain knowledge patterns",
      "Prioritized review recommendations",
    ],
  },
  dashboard: {
    title: "Your Full Study System",
    description: "Lessons, Smart Review, readiness scoring, and adaptive CAT exams, all connected.",
    bullets: [
      "Study plan built from your actual weak areas",
      "Smart Review that prioritizes what to fix first",
      "Readiness score that tells you when you are ready",
    ],
  },
  generic: {
    title: "Full Access",
    description: "All lessons, practice exams, Smart Review, and analytics.",
    bullets: [
      "Structured lessons across your pathway",
      "Adaptive CAT exams and practice tests",
      "Readiness scoring and confidence analytics",
    ],
  },
};

/**
 * ContextualPaywallCard — adaptive paywall that changes copy based on context.
 *
 * Uses the PAYWALL_PRESETS mapping to show context-appropriate messaging.
 * All CTAs are consistent: "Start Free Trial" primary, "View Plans" secondary.
 *
 * Pass `topicName` to personalize the description for topic-specific locks.
 */
export function ContextualPaywallCard({
  context = "generic",
  customTitle,
  customDescription,
  topicName,
}: {
  context?: PaywallContext;
  customTitle?: string;
  customDescription?: string;
  /** If provided, replaces "this area" / "this topic" in the description */
  topicName?: string;
}) {
  const preset = PAYWALL_PRESETS[context];
  let title = customTitle ?? preset.title;
  let description = customDescription ?? preset.description;

  if (topicName) {
    if (context === "weak_topic") {
      description = `${topicName} showed up in your weak areas. Full access lets you work through it properly.`;
    } else if (context === "lesson" || context === "lesson_highyield") {
      title = `Unlock: ${topicName}`;
    }
  }

  const surface = `contextual_paywall_${context}`;

  usePremiumGateImpression(`paywall_viewed_${context}`, false);

  return (
    <PremiumLockCard
      title={title}
      description={description}
      bullets={preset.bullets}
      secondaryHref={UPGRADE_HREF}
      secondaryLabel="View Plans"
      surface={surface}
    />
  );
}
