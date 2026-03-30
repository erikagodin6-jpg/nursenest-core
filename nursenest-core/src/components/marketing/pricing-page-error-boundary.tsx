"use client";

import * as Sentry from "@sentry/nextjs";
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { hasError: boolean };

/**
 * Isolates pricing page subtree failures so the rest of the marketing shell still renders.
 */
export class PricingPageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    safeClientLog("pricing_page", "react_error_boundary", {
      message: error.message,
      componentStack: info.componentStack?.slice(0, 500),
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-lg font-semibold text-[var(--theme-heading-text)]">Something went wrong loading this page</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page or return to the home page and try again.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Go to home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
