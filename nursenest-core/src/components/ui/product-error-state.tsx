"use client";

import Link from "next/link";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";

export type ProductErrorSeverity = "default" | "caution";

export type ProductErrorStateProps = {
  title: string;
  description: string;
  /** Optional reference line (digest, request id) */
  reference?: string;
  /** Prefix for reference line; default "Reference:" */
  referenceLabel?: string;
  /** Dev-only technical detail */
  detail?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Home or app root */
  homeHref?: string;
  homeLabel?: string;
  showLeaf?: boolean;
  severity?: ProductErrorSeverity;
  className?: string;
};

/**
 * Reusable calm error surface for non-fatal product errors (sections, boundaries).
 * Avoids alarm-red panels unless severity is caution.
 */
export function ProductErrorState({
  title,
  description,
  reference,
  referenceLabel = "Reference",
  detail,
  onRetry,
  retryLabel = "Try again",
  secondaryHref,
  secondaryLabel,
  homeHref = "/app",
  homeLabel = "Study hub",
  showLeaf = true,
  severity = "default",
  className = "",
}: ProductErrorStateProps) {
  const surface =
    severity === "caution"
      ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))]"
      : "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))]";

  return (
    <section
      className={`rounded-2xl border p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8 ${surface} ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {showLeaf ? (
          <span className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] sm:mx-0">
            <BrandLeafIcon tone="muted" size={26} />
          </span>
        ) : null}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</p>
          {reference ? (
            <p className="mt-2 text-xs text-[var(--semantic-text-muted)]" suppressHydrationWarning>
              {referenceLabel} {reference}
            </p>
          ) : null}
          {detail ? <p className="mt-2 font-mono text-xs text-[var(--semantic-text-muted)]">{detail}</p> : null}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
              >
                {retryLabel}
              </button>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]"
              >
                {secondaryLabel}
              </Link>
            ) : null}
            <Link
              href={homeHref}
              className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {homeLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
