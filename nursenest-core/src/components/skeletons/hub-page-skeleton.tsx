/**
 * Hub-page skeleton loaders for exam hub overview, lessons, questions, CAT intro, and pricing.
 * Uses `.nn-skeleton` (globals.css shimmer) so they stay visually aligned
 * with the actual content that replaces them.
 *
 * All exported functions are RSC-safe (no hooks / client code).
 */

/** A single `.nn-skeleton` bar at arbitrary width/height. */
function Bar({ w = "100%", h = "1rem", className = "" }: { w?: string; h?: string; className?: string }) {
  return <div className={`nn-skeleton ${className}`} style={{ width: w, height: h }} aria-hidden />;
}

/** Mimics a lesson card row: icon chip + title line + two descriptor lines. */
function LessonCardSkeleton() {
  return (
    <div className="nn-study-card nn-study-card--wash flex flex-col gap-3 p-4 sm:p-5" aria-hidden>
      <div className="flex items-center gap-3">
        <Bar w="2rem" h="2rem" className="rounded-lg" />
        <Bar w="55%" h="1rem" />
      </div>
      <Bar w="80%" h="0.75rem" />
      <Bar w="65%" h="0.75rem" />
      <div className="mt-1 flex gap-2">
        <Bar w="4rem" h="1.5rem" className="rounded-full" />
        <Bar w="4rem" h="1.5rem" className="rounded-full" />
      </div>
    </div>
  );
}

/** Mimics the inventory strip card. */
function InventoryStripSkeleton() {
  return (
    <div className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4" aria-hidden>
      <Bar w="6rem" h="0.625rem" className="rounded-full" />
      <div className="mt-3 space-y-2">
        <Bar w="70%" h="0.75rem" />
        <Bar w="55%" h="0.75rem" />
        <Bar w="40%" h="0.75rem" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a lessons hub page (full layout).
 * Matches the `max-w-6xl` wrapper on the real lessons page.
 */
export function LessonsHubSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading lessons…">
      {/* Breadcrumb */}
      <Bar w="14rem" h="0.75rem" className="rounded-full" />

      {/* Hero */}
      <div className="mt-8">
        <Bar w="70%" h="2.25rem" className="rounded-xl" />
        <div className="mt-4 space-y-2">
          <Bar w="90%" h="0.875rem" />
          <Bar w="75%" h="0.875rem" />
        </div>
      </div>

      {/* Inventory strip */}
      <InventoryStripSkeleton />

      {/* Topic nav pills */}
      <div className="mt-8 flex flex-wrap gap-2" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <Bar key={i} w={`${5 + (i % 3) * 1.5}rem`} h="2rem" className="rounded-full" />
        ))}
      </div>

      {/* Lesson cards */}
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LessonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for the exam pathway hub overview page (e.g. /us/rn/nclex-rn).
 * Shown while the server fetches session, question counts, and lesson counts.
 */
export function HubPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14" aria-busy="true" aria-label="Loading exam hub…">
      {/* Breadcrumb */}
      <Bar w="12rem" h="0.75rem" className="rounded-full" />

      {/* Eyebrow + H1 */}
      <Bar w="8rem" h="0.75rem" className="mt-8 rounded-full" />
      <Bar w="65%" h="2.25rem" className="mt-3 rounded-xl" />
      <div className="mt-4 space-y-2">
        <Bar w="95%" h="0.875rem" />
        <Bar w="80%" h="0.875rem" />
      </div>

      {/* Trust strip */}
      <div className="mt-6 flex flex-wrap gap-2" aria-hidden>
        {Array.from({ length: 3 }).map((_, i) => (
          <Bar key={i} w={`${7 + i}rem`} h="2rem" className="rounded-full" />
        ))}
      </div>

      {/* Inventory strip */}
      <div className="mt-6 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/30 p-4" aria-hidden>
        <div className="flex gap-4">
          <Bar w="6rem" h="0.75rem" />
          <Bar w="6rem" h="0.75rem" />
          <Bar w="6rem" h="0.75rem" />
        </div>
      </div>

      {/* 3 primary study cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3" aria-hidden>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="nn-study-card nn-study-card--wash flex flex-col gap-3 p-5" aria-hidden>
            <Bar w="2.5rem" h="2.5rem" className="rounded-lg" />
            <Bar w="60%" h="1.25rem" />
            <Bar w="90%" h="0.75rem" />
            <Bar w="75%" h="0.75rem" />
            <Bar w="5rem" h="2.25rem" className="mt-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton card mimicking a standalone content card (questions "Start in app" block). */
function ContentCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/30 p-5 sm:p-6" aria-hidden>
      <Bar w="9rem" h="1rem" />
      <div className="mt-3 space-y-1.5">
        {Array.from({ length: rows }).map((_, i) => (
          <Bar key={i} w={i === rows - 1 ? "60%" : "95%"} h="0.75rem" />
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <Bar w="7rem" h="2.75rem" className="rounded-full" />
        <Bar w="7rem" h="2.75rem" className="rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a questions hub page.
 * Matches the `max-w-3xl` wrapper on the real questions page.
 */
export function QuestionsHubSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12" aria-busy="true" aria-label="Loading question bank…">
      <Bar w="14rem" h="0.75rem" className="rounded-full" />
      <Bar w="4rem" h="0.75rem" className="mt-6 rounded-full" />

      {/* Title */}
      <Bar w="75%" h="2.25rem" className="mt-4 rounded-xl" />
      <div className="mt-4 space-y-2">
        <Bar w="95%" h="0.875rem" />
        <Bar w="80%" h="0.875rem" />
      </div>

      {/* Inventory strip */}
      <InventoryStripSkeleton />

      {/* CTA card */}
      <ContentCardSkeleton rows={2} />
    </div>
  );
}

/** Mimics the CAT page CTA row. */
function CatCtaRowSkeleton() {
  return (
    <div className="mt-8 flex flex-wrap gap-3" aria-hidden>
      <Bar w="9rem" h="3rem" className="rounded-full" />
      <Bar w="7rem" h="3rem" className="rounded-full" />
      <Bar w="7rem" h="3rem" className="rounded-full" />
    </div>
  );
}

/**
 * Skeleton for a CAT intro page.
 * Matches the `max-w-3xl` wrapper on the real CAT page.
 */
export function CatPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12" aria-busy="true" aria-label="Loading CAT practice…">
      <Bar w="14rem" h="0.75rem" className="rounded-full" />
      <Bar w="4rem" h="0.75rem" className="mt-6 rounded-full" />

      {/* Title */}
      <Bar w="60%" h="2.25rem" className="mt-4 rounded-xl" />
      <div className="mt-4 space-y-2">
        <Bar w="95%" h="0.875rem" />
        <Bar w="70%" h="0.875rem" />
      </div>

      {/* Inventory strip */}
      <InventoryStripSkeleton />

      {/* Bullet list */}
      <div className="mt-6 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Bar w="0.5rem" h="0.5rem" className="mt-1.5 shrink-0 rounded-full" />
            <Bar w={i === 2 ? "55%" : "80%"} h="0.875rem" />
          </div>
        ))}
      </div>

      <CatCtaRowSkeleton />
    </div>
  );
}

/**
 * Skeleton for `/pricing` — header + comparison strip + four plan columns.
 * Uses `.nn-skeleton` bars so transitions match other marketing hubs.
 */
export function PricingPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0" aria-busy="true" aria-label="Loading pricing…">
      <div className="border-b border-[var(--border-subtle)] pb-10 pt-2">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Bar w="75%" h="2.25rem" className="mx-auto rounded-xl" />
          <Bar w="90%" h="0.875rem" className="mx-auto" />
          <Bar w="70%" h="0.875rem" className="mx-auto" />
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <Bar w="5rem" h="2.25rem" className="rounded-full" />
        <Bar w="5rem" h="2.25rem" className="rounded-full" />
      </div>
      <div className="mt-10 space-y-3 rounded-2xl border border-[var(--theme-card-border)] bg-card p-4">
        <Bar w="40%" h="1rem" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-[var(--border-subtle)] py-3 last:border-0">
            <Bar w="28%" h="0.75rem" />
            <Bar w="32%" h="0.75rem" />
            <Bar w="32%" h="0.75rem" />
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex min-h-[18rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm">
            <Bar w="50%" h="1.25rem" />
            <div className="mt-4 flex-1 space-y-2">
              <Bar w="100%" h="0.75rem" />
              <Bar w="95%" h="0.75rem" />
              <Bar w="88%" h="0.75rem" />
            </div>
            <Bar w="40%" h="1.75rem" className="mt-6" />
            <Bar w="100%" h="2.75rem" className="mt-4 rounded-xl" />
          </div>
        ))}
      </div>
    </main>
  );
}
