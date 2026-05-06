"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

/**
 * Isolates `MarketingHeroCarousel` render/runtime failures so they never reach
 * `MarketingMainErrorBoundary` or `app/(marketing)/error.tsx`.
 */
export class HomeMarketingHeroCarouselErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error & { digest?: string }, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.error("[HomeMarketingHeroCarouselErrorBoundary]", error?.message, info?.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
