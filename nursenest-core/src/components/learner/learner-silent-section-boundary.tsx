"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";

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
