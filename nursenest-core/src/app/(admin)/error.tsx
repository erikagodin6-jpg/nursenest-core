"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "admin_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = shouldShowErrorBoundaryDevDetail();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <a href="/" className="mb-6 inline-flex justify-center bg-transparent" aria-label="NurseNest home">
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
      </a>
      <ProductErrorState
        title="Just a moment"
        description="We couldn’t finish loading the admin view. This is usually temporary — try again in a moment, or return home."
        reference={digest}
        detail={showDetail ? getErrorMessageDevLine(error) : null}
        autoRetryAfterMs={2200}
        onRetry={() => reset()}
        retryLabel="Try again"
        homeHref="/"
        homeLabel="Home"
        showLeaf
        severity="default"
      />
    </main>
  );
}
