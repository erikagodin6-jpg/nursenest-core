"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; name?: string };

/**
 * Isolates optional learner UI: on error, renders nothing so the shell + nav stay up.
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
    if (this.state.error) return null;
    return this.props.children;
  }
}
