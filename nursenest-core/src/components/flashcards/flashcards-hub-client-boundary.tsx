"use client";

import React from "react";

import FlashcardErrorBoundary from "@/components/flashcards/flashcard-error-boundary";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export class FlashcardsHubClientBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    logDedupedClientDiagnostic("flashcards_hub", "client_render_failed", error.name || "error", {
      message: error.message.slice(0, 180),
    });
  }

  render() {
    if (this.state.error) {
      return (
        <FlashcardErrorBoundary
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ error: null })}
        />
      );
    }

    return this.props.children;
  }
}
