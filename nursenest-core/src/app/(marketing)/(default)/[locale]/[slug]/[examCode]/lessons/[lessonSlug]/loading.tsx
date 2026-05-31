export default function PathwayLessonSegmentLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section
        aria-busy="true"
        aria-live="polite"
        className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted-text)]">
          Loading Lessons
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[var(--theme-heading-text)]">
          Preparing Your Lesson List
        </h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--theme-muted-text)_12%,transparent)]"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
