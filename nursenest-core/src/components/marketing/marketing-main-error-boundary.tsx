"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { logNnMarketingClientError } from "@/lib/marketing/nn-marketing-client-error-log";
import { SUPPORT_CONTACT_COPY } from "@/lib/support/support-policy";

type Props = { children: ReactNode; name?: string };
type State = { hasError: boolean };

/**
 * Isolates marketing main-column failures so the rest of the shell (header/footer) can stay up.
 */
export class MarketingMainErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error & { digest?: string }, info: ErrorInfo): void {
    try {
      logNnMarketingClientError(
        `marketing_main_error_boundary:${this.props.name ?? "marketing_main"}`,
        error,
        { componentStack: info.componentStack == null ? undefined : info.componentStack },
      );
    } catch {
      /* logging must never mask the original error path */
    }
    try {
      const shouldLog =
        process.env.NODE_ENV !== "production" ||
        process.env.NEXT_PUBLIC_NN_DEBUG_HOMEPAGE === "1";
      if (shouldLog) {
        console.error(
          "[NN_HOMEPAGE_REAL_CRASH]",
          JSON.stringify({
            boundary: `marketing_main_error_boundary:${this.props.name ?? "marketing_main"}`,
            pathname: typeof window !== "undefined" ? window.location.pathname : null,
            name: error?.name,
            message: error?.message,
            digest: error?.digest,
            stack: error?.stack,
            componentStack: info?.componentStack ?? null,
          }),
        );
      }
    } catch {
      /* ignore */
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="mx-auto max-w-2xl px-4 py-16 text-center"
          data-nn-app-error-screen="1"
          data-nn-error-boundary="marketing"
        >
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Something went wrong loading this section.</p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Try refreshing the page. If it keeps happening: {SUPPORT_CONTACT_COPY}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
