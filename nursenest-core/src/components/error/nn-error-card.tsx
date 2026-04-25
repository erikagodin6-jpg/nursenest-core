"use client";

import { useEffect } from "react";
import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useErrorBoundaryAutoRetry } from "@/lib/runtime/use-error-boundary-auto-retry";

export type NnErrorCardProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  surface: string;
  title?: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  showDigest?: boolean;
  autoRetryAfterMs?: number;
  disableAutoRetry?: boolean;
};

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
        {/* SINGLE LOGO ONLY */}
        <a
          href={primaryAction.href}
          className="mb-6 inline-flex justify-center"
          aria-label="NurseNest home"
        >
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
        </a>

        <h1 className="nn-marketing-h3">{title}</h1>

        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          {description}
        </p>

        {autoRetry.status === "scheduled" && (
          <p className="nn-marketing-caption mt-2 text-[var(--theme-muted-text)]">
            Retrying automatically…
          </p>
        )}

        {digest && (
          <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]">
            Reference: {digest}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {reset && (
            <button
              type="button"
              className="nn-marketing-body-sm w-full rounded-full bg-[var(--theme-primary)] px-4 py-2.5 font-bold text-[var(--theme-primary-foreground)] transition-opacity hover:opacity-90"
              onClick={reset}
            >
              Try again
            </button>
          )}

          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="nn-marketing-body-sm block w-full rounded-full border border-[var(--theme-separator)] px-4 py-2.5 font-medium text-[var(--theme-body-text)] transition-colors hover:bg-[var(--theme-menu-hover-bg)]"
            >
              {secondaryAction.label}
            </a>
          )}

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