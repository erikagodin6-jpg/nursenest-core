"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientExceptionIfEnabled(error, { tags: { route: "app_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = shouldShowErrorBoundaryDevDetail();

  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-6">
      <Link
        href="/"
        className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_07%,var(--semantic-surface))]"
        aria-label="NurseNest home"
      >
        <BrandLeafIcon tone="brand" size={32} />
      </Link>
      <ProductErrorState
        title="Just a moment"
        description="We’re having a temporary hiccup loading this screen. Try again in a moment — your session and permissions are still protected on our servers."
        reference={digest}
        detail={showDetail ? getErrorMessageDevLine(error) : null}
        autoRetryAfterMs={2200}
        onRetry={() => reset()}
        homeHref="/"
        homeLabel="Home"
        showLeaf
        severity="default"
      />
    </div>
  );
}
