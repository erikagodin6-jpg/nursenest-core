import Link from "next/link";

export function MarketingHomeEmergencyFallback() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        Canada-first exam prep
      </p>

      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-6xl">
        NurseNest
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--theme-body-text)]">
        Canada-first nursing and allied health exam prep with lessons, flashcards, practice questions, and mock exams.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/lessons"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse lessons
        </Link>

        <Link
          href="/flashcards"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
        >
          Study flashcards
        </Link>

        <Link
          href="/pricing"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
        >
          View pricing
        </Link>
      </div>
    </main>
  );
}