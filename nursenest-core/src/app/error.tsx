"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { getErrorMessage } from "@/lib/runtime/error-message";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "app_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = process.env.NODE_ENV === "development";

  return (
    <main className="mx-auto mt-16 w-full max-w-xl px-6">
      <a href="/" className="mb-6 inline-flex bg-transparent" aria-label="NurseNest home">
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
      </a>
      <ProductErrorState
        title="Something went wrong"
        description="A recoverable issue occurred. You can try again, or return to the home page. Access rules are still enforced on the server."
        reference={digest}
        detail={showDetail ? getErrorMessage(error) : null}
        onRetry={() => reset()}
        homeHref="/"
        homeLabel="Home"
        showLeaf
        severity="default"
      />
    </main>
  );
}
