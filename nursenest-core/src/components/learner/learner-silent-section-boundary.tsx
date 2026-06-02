"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";

type Props = { children: ReactNode; name?: string };

/**
 * Isolates optional learner UI: on error, shell + nav stay up and a calm fallback appears
 * (“Data loading — continue studying”) instead of a blank hole.
 */
export class LearnerSilentSectionBoundary extends Component<Props, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    emitRuntimeEvent("activity_route_body_boundary_failed", {
      surfaceName: this.props.name ?? "section",
      errorName: error.name,
      errorMessage: error.message,
      componentStack: (errorInfo.componentStack ?? "").slice(0, 240),
    });
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[LearnerSilentSectionBoundary]", this.props.name ?? "section", error.message, errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return <LearnerSilentSectionDegradedFallback surfaceName={this.props.name} />;
    }
    return this.props.children;
  }
}
