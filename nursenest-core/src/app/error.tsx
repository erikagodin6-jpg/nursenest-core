"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
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
      <Link
        href="/"
        className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_07%,var(--semantic-surface))]"
        aria-label="NurseNest home"
      >
        <BrandLeafIcon tone="brand" size={32} />
      </Link>
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
