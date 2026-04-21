"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";

type Props = {
  children: ReactNode;
  /** Surface label for support / logging context */
  surface?: string;
};

type State = { hasError: boolean };

/**
 * Isolates exam / practice-test client trees so a render error does not blank the whole learner shell.
 */
export class ExamSessionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, {
      tags: { surface: this.props.surface ?? "exam_session", feature: "ExamSessionErrorBoundary" },
      extra: { componentStack: info.componentStack?.slice(0, 800) },
    });
    if (process.env.NODE_ENV === "development") {
      console.warn("[ExamSessionErrorBoundary]", this.props.surface ?? "exam", error.message);
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="nn-card mt-6 space-y-3 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Something went wrong loading this session.</p>
          <p>Your progress may still be saved on the server. You can try again here or refresh the page.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={this.handleRetry}
            >
              Try again
            </button>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <Link
              href="/app/practice-tests"
              className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold"
            >
              Back to practice tests
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
