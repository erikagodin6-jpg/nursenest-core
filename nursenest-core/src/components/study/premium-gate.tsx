"use client";

/**
 * Premium Gate System
 *
 * All locked states use theme-aware CSS custom properties — no hardcoded hex.
 * Gating philosophy (spec §4, §11, §16):
 *   - Always show at least one usable free feature
 *   - Show partial previews, not blank walls
 *   - Copy is calm, specific, respectful — never fear-based
 *   - One primary CTA per locked section
 *
 * Components:
 *   PremiumLockCard      — standalone locked card (complete section gate)
 *   LockedPreviewCard    — faded preview + lock overlay below it
 *   UpgradePromptCard    — end-of-page conversion block (spec §9)
 *   EntitledSection      — renders children or fallback based on isEntitled
 *   PreviewDivider       — separator between free preview and locked content
 *   LockedMetricCard     — blurred metric with visible heading (analytics)
 *
 * Analytics (spec §18):
 *   usePremiumGateImpression — fires one event per surface mount via
 *   window.posthog if available. One impression per surface load, not per render.
 */

import Link from "next/link";
import { Lock } from "lucide-react";
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

// ── Shared upgrade href ───────────────────────────────────────────────────────

const UPGRADE_HREF = "/pricing";
const CONTINUE_HREF = "/app/lessons";

// ── PremiumLockCard ───────────────────────────────────────────────────────────

/**
 * PremiumLockCard — a polished locked section card (spec §10).
 *
 * Same shape as rest of system. Subtle background. Lock icon in header.
 * Short explanatory description. Single "View plans" CTA (spec §12).
 *
 * Use when the entire section is locked with no free preview.
 */
export function PremiumLockCard({
  title,
  description,
  ctaHref = UPGRADE_HREF,
  ctaLabel = "View plans",
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
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
        <div className="nn-premium-lock-card__actions">
          <Link
            href={ctaHref}
            className="nn-btn-primary inline-flex min-h-[2.25rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
          >
            {ctaLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="nn-btn-secondary inline-flex min-h-[2.25rem] items-center rounded-lg px-4 text-sm font-semibold"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
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
  ctaLabel = "View plans",
}: {
  children: React.ReactNode;
  overlayTitle: string;
  overlayDescription: string;
  ctaHref?: string;
  ctaLabel?: string;
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
            className="nn-btn-primary inline-flex min-h-[2rem] items-center rounded-lg px-3.5 text-sm font-semibold shadow-none"
          >
            {ctaLabel}
          </Link>
          <Link
            href={CONTINUE_HREF}
            className="nn-btn-secondary inline-flex min-h-[2rem] items-center rounded-lg px-3.5 text-sm font-semibold"
          >
            Continue free study
          </Link>
        </div>
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
        Get full study plans, smart review grouping, deeper analytics, and more
        adaptive exam practice.
      </p>
      <ul className="nn-upgrade-prompt-card__bullets">
        <li className="nn-upgrade-prompt-card__bullet">
          Full adaptive 3–5 day study plan
        </li>
        <li className="nn-upgrade-prompt-card__bullet">
          Smart review by weak areas and confidence
        </li>
        <li className="nn-upgrade-prompt-card__bullet">
          Deeper readiness analytics
        </li>
        <li className="nn-upgrade-prompt-card__bullet">
          More CAT practice and retest guidance
        </li>
      </ul>
      <div className="nn-upgrade-prompt-card__actions">
        <Link
          href={UPGRADE_HREF}
          onClick={() => {
            try {
              window.posthog?.capture("premiumUpgradeClicked", {
                source: "upgrade_prompt_card",
              });
            } catch {
              // silent
            }
          }}
          className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
        >
          View plans
        </Link>
        <Link
          href={CONTINUE_HREF}
          className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold"
        >
          Not now
        </Link>
      </div>
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
        <span>Unlocks with Premium</span>
      </div>
    </div>
  );
}

// ── LockedDayShell ────────────────────────────────────────────────────────────

/**
 * LockedDayShell — placeholder card shown for locked study days (spec §5).
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
