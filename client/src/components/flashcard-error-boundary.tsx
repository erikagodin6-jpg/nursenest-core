import React from "react";

type Props = {
  children?: React.ReactNode;
  error?: Error | null;
  resetErrorBoundary?: () => void;
  onRetry?: () => void;
  section?: "deck-list" | "card-viewer" | "progress" | "page";
  onStudyEmergencyDeck?: () => void;
  onTryCachedData?: () => void;
  fallbackPath?: string;
};

function FlashcardErrorBoundary({
  error,
  resetErrorBoundary,
  onRetry,
}: Props) {
  const handleRetry = () => {
    try {
      onRetry?.();
      resetErrorBoundary?.();

      // fallback hard refresh if state recovery fails
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="w-full px-6 py-8">
      <div
        className="
          mx-auto
          max-w-xl
          rounded-2xl
          border
          p-6
          shadow-sm
        "
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
          color: "var(--foreground)",
        }}
      >
        <div className="space-y-3">
          <div>
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted-foreground)",
              }}
            >
              Flashcards
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-semibold
                tracking-tight
              "
            >
              We couldn’t load your flashcards right now.
            </h2>
          </div>

          <p
            className="
              text-sm
              leading-6
            "
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            Your progress and access are safe. Try reloading this section.
          </p>

          {error?.message && process.env.NODE_ENV === "development" && (
            <div
              className="
                rounded-xl
                border
                p-3
                text-xs
                font-mono
                overflow-auto
              "
              style={{
                background: "var(--surface-secondary)",
                borderColor: "var(--border-subtle)",
                color: "var(--muted-foreground)",
              }}
            >
              {error.message}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleRetry}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                transition-colors
              "
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DegradedModeIndicator() {
  return null;
}

export { FlashcardErrorBoundary };
export default FlashcardErrorBoundary;
