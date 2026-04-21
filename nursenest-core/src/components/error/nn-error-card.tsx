"use client";

import { useEffect } from "react";
import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useErrorBoundaryAutoRetry } from "@/lib/runtime/use-error-boundary-auto-retry";

export type NnErrorCardProps = {
  /** Error object from Next.js error boundary. */
  error: Error & { digest?: string };
  /** Retry the failed render segment. */
  reset?: () => void;
  /** Surface tag for Sentry + console logs (e.g. "marketing_default", "exam_shell"). */
  surface: string;
  /** Card heading shown to the user. */
  title?: string;
  /** Explanatory line shown below the title. */
  description?: string;
  /** Label and href for the primary recovery action (defaults to Home). */
  primaryAction?: { label: string; href: string };
  /** Optional second CTA below the primary action. */
  secondaryAction?: { label: string; href: string };
  /** Whether to show the error digest reference (always shown, helps support). */
  showDigest?: boolean;
  /** Automatic retry after this delay (ms); off when `reset` is missing. Default 2200. */
  autoRetryAfterMs?: number;
  /** Disable automatic retry (e.g. flows where remount must be manual). */
  disableAutoRetry?: boolean;
};

/**
 * Canonical error recovery card used by every `error.tsx` in the app.
 * Never renders "Internal Server Error" — always provides a recovery path.
 *
 * Design: centred card with logo, human title, retry + CTA buttons.
 * Logging: Sentry capture; console only in development (one line) to avoid production spam.
 */
export function NnErrorCard({
  error,
  reset,
  surface,
  title = "Just a moment",
  description = "We hit a temporary issue. Try again in a moment, or pick another page — nothing is wrong with your account.",
  primaryAction = { label: "Go home", href: "/" },
  secondaryAction,
  showDigest = true,
  autoRetryAfterMs = 2200,
  disableAutoRetry = false,
}: NnErrorCardProps) {
  const autoRetry = useErrorBoundaryAutoRetry(reset ?? (() => {}), {
    errorKey: error.digest,
    delayMs: autoRetryAfterMs,
    enabled: Boolean(reset && !disableAutoRetry && autoRetryAfterMs > 0),
  });

  useEffect(() => {
    captureClientExceptionIfEnabled(error, {
      tags: { surface, feature: "react_error_boundary" },
    });
    if (process.env.NODE_ENV === "development") {
      console.warn(`[nn-error:${surface}]`, error.message, error.digest ?? "");
    }
  }, [error, surface]);

  const digest = showDigest ? error.digest : undefined;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16">
      <div className="nn-card w-full max-w-md p-8 text-center">
        <a
          href={primaryAction.href}
          className="mb-5 inline-flex justify-center bg-transparent"
          aria-label="NurseNest home"
        >
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
        </a>

        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]">
          <BrandLeafIcon tone="muted" size={24} />
        </div>

        <h1 className="nn-marketing-h3">{title}</h1>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{description}</p>

        {autoRetry.status === "scheduled" ? (
          <p className="nn-marketing-caption mt-2 text-[var(--theme-muted-text)]" aria-live="polite">
            Retrying automatically…
          </p>
        ) : null}

        {digest ? (
          <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]" suppressHydrationWarning>
            Reference: {digest}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2">
          {reset ? (
            <button
              type="button"
              className="nn-marketing-body-sm w-full rounded-full bg-[var(--theme-primary)] px-4 py-2.5 font-bold text-[var(--theme-primary-foreground)] transition-opacity hover:opacity-90"
              onClick={reset}
            >
              Try again
            </button>
          ) : null}

          {secondaryAction ? (
            <a
              href={secondaryAction.href}
              className="nn-marketing-body-sm block w-full rounded-full border border-[var(--theme-separator)] px-4 py-2.5 font-medium text-[var(--theme-body-text)] transition-colors hover:bg-[var(--theme-menu-hover-bg)]"
            >
              {secondaryAction.label}
            </a>
          ) : null}

          <a
            href={primaryAction.href}
            className="nn-marketing-body-sm font-medium text-[var(--theme-primary)] underline underline-offset-2 hover:opacity-80"
          >
            {primaryAction.label}
          </a>
        </div>
      </div>
    </div>
  );
}
