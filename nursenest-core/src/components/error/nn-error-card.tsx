"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

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
};

/**
 * Canonical error recovery card used by every `error.tsx` in the app.
 * Never renders "Internal Server Error" — always provides a recovery path.
 *
 * Design: centred card with logo, human title, retry + CTA buttons.
 * Logging: Sentry capture + console.error with surface tag on mount.
 */
export function NnErrorCard({
  error,
  reset,
  surface,
  title = "Something went wrong",
  description = "We ran into an unexpected problem. Try again or navigate to a different section.",
  primaryAction = { label: "Go home", href: "/" },
  secondaryAction,
  showDigest = true,
}: NnErrorCardProps) {
  useEffect(() => {
    console.error(`[nn-error:${surface}]`, {
      message: error.message,
      digest: error.digest,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    Sentry.captureException(error, {
      tags: { surface, feature: "react_error_boundary" },
    });
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
          <SiteBrandLogoMark variant="auth" />
        </a>

        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]">
          <BrandLeafIcon tone="muted" size={24} />
        </div>

        <h1 className="nn-marketing-h3">{title}</h1>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{description}</p>

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
