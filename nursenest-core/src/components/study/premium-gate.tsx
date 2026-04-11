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
const CONTINUE_HREF = "/app/lessons";
const DEFAULT_CTA_LABEL = "Start Free Trial";
const DEFAULT_LOCK_EXPLANATION = "Start your free trial to unlock full access.";

// ── PremiumLockCard ───────────────────────────────────────────────────────────

/**
 * PremiumLockCard — a polished locked section card.
 *
 * Subtle background. Lock icon in header. Optional bullet points.
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
        <Lock className="nn-premium-lock-card__icon h-4 w-4" aria-hidden />
        <span className="nn-premium-lock-card__title">{title}</span>
        <span className="nn-premium-lock-card__badge">
          <Lock className="h-2.5 w-2.5" aria-hidden />
          Premium
        </span>
      </div>
      <div className="nn-premium-lock-card__body">
        <p className="nn-premium-lock-card__description">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="nn-premium-lock-card__bullets">
            {bullets.map((b) => (
              <li key={b} className="nn-premium-lock-card__bullet">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--semantic-success)" }} aria-hidden />
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
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          No charge today · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ── LockedPreviewCard ─────────────────────────────────────────────────────────

/**
 * LockedPreviewCard — renders a faded preview of `children`, then an
 * overlay with a lock message below it (spec §4, §5).
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
          <Lock className="h-3.5 w-3.5" aria-hidden />
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
        <p className="mt-2 text-[11px] text-muted-foreground">
          No charge today · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ── UpgradePromptCard ─────────────────────────────────────────────────────────

/**
 * UpgradePromptCard — a restrained end-of-page conversion block (spec §9).
 *
 * Surface-emphasis card. No aggressive copy. Bullets describe the premium
 * intelligence layer specifically. One primary CTA + one low-pressure secondary.
 */
export function UpgradePromptCard({
  isEntitled = true,
}: {
  isEntitled?: boolean;
}) {
  usePremiumGateImpression("premiumUpgradePromptViewed", isEntitled);

  if (isEntitled) return null;

  return (
    <div className="nn-upgrade-prompt-card">
      <p className="nn-upgrade-prompt-card__title">
        Unlock your full readiness system
      </p>
      <p className="nn-upgrade-prompt-card__body">
        NurseNest tells you exactly what to study, tracks your weaknesses,
        and helps you know when you're ready to pass.
      </p>
      <ul className="nn-upgrade-prompt-card__bullets">
        <li className="nn-upgrade-prompt-card__bullet">
          Understand key concepts faster with structured lessons
        </li>
        <li className="nn-upgrade-prompt-card__bullet">
          Fix your weak areas with Smart Review
        </li>
        <li className="nn-upgrade-prompt-card__bullet">
          Know when you're ready to pass with readiness scoring
        </li>
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
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
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
 * locked continuation (spec §4, §5).
 *
 * Shows a horizontal rule with a centered "Premium" pill label.
 */
export function PreviewDivider({ label = "Unlocks with Premium" }: { label?: string }) {
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
 * blurred number area (spec §7, §10).
 *
 * Visible heading communicates what the metric measures.
 * Blurred value teases depth without revealing the number.
 */
export function LockedMetricCard({
  heading,
  placeholderValue = "—",
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
        <span>Unlocks with free trial</span>
      </div>
    </div>
  );
}

// ── LockedDayShell ────────────────────────────────────────────────────────────

/**
 * LockedDayShell — placeholder card shown for locked study days.
 *
 * Dashed border. Muted badge. Lock icon. Does not reveal content.
 * Shows the day number and a generic locked title so users know
 * more days exist and understand the plan structure.
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
    title: "Unlock This Lesson",
    description: "You're struggling with this area — unlock to improve faster.",
    bullets: [
      "Understand key concepts faster",
      "Fix your weak areas with Smart Review",
      "Know when you're ready to pass",
    ],
  },
  post_questions: {
    title: "Unlock Smart Review",
    description: "Review your mistakes and boost your score.",
    bullets: [
      "See exactly what you got wrong and why",
      "Grouped by confidence and priority",
      "Direct lesson links for every mistake",
    ],
  },
  near_exam: {
    title: "Get Exam-Ready",
    description: "You're close to your exam — get full access to be ready.",
    bullets: [
      "Adaptive CAT exams that mirror the real test",
      "Readiness scoring so you know when to sit",
      "Full study plan personalised to your weak areas",
    ],
  },
  lesson: {
    title: "Unlock This Lesson",
    description: "This lesson is part of your personalised study system.",
    bullets: [
      "Understand key concepts faster",
      "Fix your weak areas with Smart Review",
      "Know when you're ready to pass",
    ],
  },
  lesson_highyield: {
    title: "Unlock This Lesson",
    description: "You're about to learn a high-yield topic — unlock full access to continue.",
    bullets: [
      "Understand key concepts faster",
      "Fix your weak areas with Smart Review",
      "Know when you're ready to pass",
    ],
  },
  practice_test: {
    title: "Unlock Full Practice Exams",
    description: "Simulate the real exam and track your readiness.",
    bullets: [
      "Adaptive CAT exams",
      "Detailed performance analysis",
      "Real exam-style questions",
    ],
  },
  smart_review: {
    title: "Unlock Smart Review",
    description: "See exactly what you're getting wrong and how to fix it.",
    bullets: [
      "Questions grouped by urgency and confidence",
      "Prioritised review queue",
      "Direct lesson links for every question",
    ],
  },
  confidence_analytics: {
    title: "Unlock Confidence Analytics",
    description: "See exactly where you stand and what to focus on next.",
    bullets: [
      "Overconfidence detection",
      "Uncertain knowledge tracking",
      "Prioritised review recommendations",
    ],
  },
  dashboard: {
    title: "Unlock Your Full Study System",
    description: "Start your free trial to access your personalised study plan, smart review, and full exam practice.",
    bullets: [
      "Personalised study plan built from your weak areas",
      "Smart review that shows you exactly what to fix",
      "Readiness scoring so you know when to take the exam",
    ],
  },
  generic: {
    title: "Unlock Full Access",
    description: "Start your free trial to access all lessons, exams, and analytics.",
    bullets: [
      "Understand key concepts faster",
      "Fix your weak areas with Smart Review",
      "Know when you're ready to pass",
    ],
  },
};

/**
 * ContextualPaywallCard — adaptive paywall that changes copy based on context.
 *
 * Uses the PAYWALL_PRESETS mapping to show context-appropriate messaging.
 * All CTAs are consistent: "Start Free Trial" primary, "View Plans" secondary.
 *
 * Pass `topicName` to personalise the description for topic-specific locks.
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
      description = `You're struggling with ${topicName} — unlock to improve faster.`;
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
