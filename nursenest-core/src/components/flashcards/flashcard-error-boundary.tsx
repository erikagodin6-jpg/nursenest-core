"use client";

type Props = {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  onRetry?: () => void;
};

export default function FlashcardErrorBoundary({ error, resetErrorBoundary, onRetry }: Props) {
  const handleRetry = () => {
    try {
      onRetry?.();
      resetErrorBoundary?.();

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
        className="mx-auto max-w-xl rounded-2xl border p-6 shadow-sm"
        style={{
          background: "var(--surface-elevated, var(--semantic-surface))",
          borderColor: "var(--border-subtle, var(--semantic-border-soft))",
          color: "var(--foreground, var(--semantic-text-primary))",
        }}
      >
        <div className="space-y-3">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color: "var(--muted-foreground, var(--semantic-text-muted))",
              }}
            >
              Flashcards
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              We couldn&apos;t load your flashcards right now.
            </h2>
          </div>

          <p
            className="text-sm leading-6"
            style={{
              color: "var(--muted-foreground, var(--semantic-text-secondary))",
            }}
          >
            Your progress and access are safe. Try reloading this section.
          </p>

          {error?.message && process.env.NODE_ENV === "development" ? (
            <div
              className="overflow-auto rounded-xl border p-3 font-mono text-xs"
              style={{
                background: "var(--surface-secondary, var(--semantic-panel-muted))",
                borderColor: "var(--border-subtle, var(--semantic-border-soft))",
                color: "var(--muted-foreground, var(--semantic-text-muted))",
              }}
            >
              {error.message}
            </div>
          ) : null}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--primary, var(--semantic-brand))",
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
