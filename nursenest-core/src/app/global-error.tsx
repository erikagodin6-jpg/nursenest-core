"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ThemeProvider } from "next-themes";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { route: "global-error", feature: "root" },
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-full bg-[var(--theme-page-bg)] p-6 text-[var(--theme-body-text)]">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme={NURSENEST_DEFAULT_THEME}
          themes={THEME_OPTIONS.map((o) => o.id)}
          enableSystem={false}
          enableColorScheme={false}
          storageKey={THEME_STORAGE_KEY}
          disableTransitionOnChange
        >
          <main className="mx-auto mt-16 w-full max-w-xl">
            <a href="/" className="mb-6 inline-flex items-center gap-2 bg-transparent">
              <SiteBrandLogoMark variant="auth" />
            </a>
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="mt-3 text-sm text-muted">A critical error occurred. Please reload or return home.</p>
              {error.digest ? (
                <p className="mt-3 text-xs text-muted" suppressHydrationWarning>
                  Reference: {error.digest}
                </p>
              ) : null}
              <button type="button" className="mt-5 rounded-xl bg-primary px-4 py-2 font-semibold text-white" onClick={() => reset()}>
                Try again
              </button>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
