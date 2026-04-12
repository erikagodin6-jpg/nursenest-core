"use client";

import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { getErrorMessage } from "@/lib/runtime/error-message";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <a href="/" className="mb-6 inline-flex justify-center bg-transparent" aria-label="NurseNest home">
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
      </a>
      <h1 className="text-xl font-semibold text-foreground">Admin area unavailable</h1>
      <p className="mt-2 text-sm text-muted">
        {getErrorMessage(error) || "Something went wrong loading this page."}
      </p>
      <button
        type="button"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
