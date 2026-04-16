"use client";

import * as Sentry from "@sentry/nextjs";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { MARKETING_PRIMARY_CTA_COMPACT_CLASS } from "@/lib/theme/marketing-hero-pattern";

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
    Sentry.captureException(error, {
      tags: { feature: "marketing_pricing", boundary: "PricingPageErrorBoundary" },
      extra: { componentStack: info.componentStack?.slice(0, 800) },
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="nn-marketing-h3">Just a moment</p>
          <p className="mt-2 nn-marketing-body-sm text-muted-foreground">
            We hit a temporary issue loading pricing. Refresh the page or go home and try again in a moment.
          </p>
          <a href="/" className={`mt-6 ${MARKETING_PRIMARY_CTA_COMPACT_CLASS}`}>
            Go to home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
