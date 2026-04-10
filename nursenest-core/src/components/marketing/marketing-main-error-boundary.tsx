"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

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

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      JSON.stringify({
        scope: "client_ui",
        event: "marketing_main_error_boundary",
        name: this.props.name ?? "marketing_main",
        message: error.message?.slice(0, 300),
        componentStack: info.componentStack?.slice(0, 500),
      }),
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Something went wrong loading this section.</p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Try refreshing the page. If it keeps happening, contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
