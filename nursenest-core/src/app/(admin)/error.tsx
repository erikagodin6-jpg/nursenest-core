"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">Admin area unavailable</h1>
      <p className="mt-2 text-sm text-muted">
        {error.message || "Something went wrong loading this page."}
      </p>
      <button
        type="button"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
