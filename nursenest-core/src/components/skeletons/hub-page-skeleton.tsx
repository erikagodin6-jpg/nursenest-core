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
    <main
      className="mx-auto w-full max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0"
      aria-busy="true"
      aria-label="Preparing subscription plans"
    >
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

/** Blog article: prose column + title/meta strip (marketing blog slug + tag pages). */
export function BlogPostPageSkeleton() {
  return (
    <article className="nn-premium-blog-loading mx-auto max-w-3xl px-4 py-12 sm:px-6" aria-busy="true" aria-label="Loading article…">
      <Bar w="40%" h="0.75rem" className="rounded-full" />
      <Bar w="85%" h="2rem" className="mt-8 rounded-xl" />
      <div className="mt-4 flex flex-wrap gap-3">
        <Bar w="6rem" h="1.5rem" className="rounded-full" />
        <Bar w="8rem" h="1.5rem" className="rounded-full" />
      </div>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Bar key={i} w={i % 4 === 3 ? "55%" : "100%"} h="0.875rem" />
        ))}
      </div>
    </article>
  );
}

/** Tools hub: hero band + tool card grid. */
export function ToolsHubPageSkeleton() {
  return (
    <div
      className="nn-tools-marketing-hero relative isolate overflow-x-clip border-b border-[var(--border-subtle)]"
      aria-busy="true"
      aria-label="Loading tools…"
    >
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-14 lg:px-8">
        <Bar w="55%" h="2rem" className="rounded-xl" />
        <Bar w="80%" h="0.875rem" className="mt-4" />
        <Bar w="60%" h="0.875rem" className="mt-2" />
        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-1 md:grid-cols-2" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="nn-tools-hub-card flex min-h-[5.5rem] gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-5 shadow-[var(--elevation-rest)]"
            >
              <Bar w="3rem" h="3rem" className="shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bar w="55%" h="1rem" />
                <Bar w="92%" h="0.75rem" />
                <Bar w="78%" h="0.75rem" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Tool detail: back pill + title + calculator panel. */
export function ToolDetailPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading tool…"
    >
      <Bar w="9rem" h="2.5rem" className="rounded-full" />
      <div className="mt-8">
        <Bar w="60%" h="2rem" className="rounded-xl" />
      </div>
      <div className="nn-tools-calculator-surface mt-8 space-y-4 p-5 sm:p-8" aria-hidden>
        <Bar w="40%" h="1rem" />
        <Bar w="100%" h="2.75rem" className="rounded-xl" />
        <Bar w="100%" h="2.75rem" className="rounded-xl" />
        <Bar w="100%" h="2.75rem" className="rounded-xl" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Bar w="8rem" h="2.75rem" className="rounded-full" />
          <Bar w="8rem" h="2.75rem" className="rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** FAQ marketing page: legal card + product strip. */
export function FaqMarketingPageSkeleton() {
  return (
    <div
      className="nn-faq-marketing-root"
      aria-busy="true"
      aria-label="Loading FAQ…"
    >
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
        <Bar w="14rem" h="0.75rem" className="rounded-full" />
      </div>
      <article className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 sm:pb-14 lg:px-8" aria-hidden>
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-6 shadow-[var(--elevation-rest)] sm:p-8">
          <Bar w="55%" h="1.75rem" className="rounded-xl" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Bar key={i} w={i % 4 === 3 ? "55%" : "100%"} h="0.875rem" />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

/** Blog index: list of cards. */
export function BlogIndexPageSkeleton() {
  return (
    <div className="nn-premium-blog-loading mx-auto max-w-5xl px-4 py-12" aria-busy="true" aria-label="Loading blog…">
      <Bar w="50%" h="2rem" className="rounded-xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="nn-study-card nn-study-card--wash space-y-3 p-5">
            <Bar w="70%" h="1.125rem" />
            <Bar w="100%" h="0.75rem" />
            <Bar w="90%" h="0.75rem" />
            <Bar w="5rem" h="1.5rem" className="mt-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Learner practice test runner initial load (matches nn-card shell). */
export function PracticeTestRunPageSkeleton(props: { withRouteAria?: boolean } = {}) {
  const { withRouteAria = true } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": "Loading practice test…" } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6" {...routeShellProps}>
      <Bar w="12rem" h="0.75rem" className="rounded-full" />
      <div className="nn-card mt-6 space-y-4 p-6">
        <Bar w="40%" h="1rem" />
        <Bar w="100%" h="0.5rem" className="rounded-full" />
        <Bar w="100%" h="0.5rem" className="rounded-full" />
        <div className="mt-6 space-y-3">
          <Bar w="100%" h="4rem" className="rounded-xl" />
          <Bar w="100%" h="4rem" className="rounded-xl" />
          <Bar w="100%" h="4rem" className="rounded-xl" />
        </div>
        <div className="mt-8 flex gap-2">
          <Bar w="8rem" h="2.75rem" className="rounded-full" />
          <Bar w="8rem" h="2.75rem" className="rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Practice question / CAT setup workspace — header, filters, question card, and controls. */
export function PracticeActivitySkeleton(
  props: { withRouteAria?: boolean; label?: string } = {},
) {
  const { withRouteAria = true, label = "Loading practice session..." } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": label } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="nn-learner-activity-skeleton mx-auto max-w-6xl px-4 py-6" {...routeShellProps}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Bar w="7rem" h="0.625rem" className="rounded-full" />
          <Bar w="18rem" h="1.25rem" className="rounded-xl" />
        </div>
        <div className="flex gap-2">
          <Bar w="6rem" h="2.25rem" className="rounded-lg" />
          <Bar w="6rem" h="2.25rem" className="rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="nn-card space-y-5 p-5">
          <Bar w="100%" h="0.45rem" className="rounded-full" />
          <div className="space-y-3">
            <Bar w="82%" h="1.2rem" />
            <Bar w="94%" h="1.2rem" />
            <Bar w="70%" h="1.2rem" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bar key={i} w="100%" h="3.25rem" className="rounded-xl" />
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <Bar w="7rem" h="2.5rem" className="rounded-lg" />
            <Bar w="7rem" h="2.5rem" className="rounded-lg" />
          </div>
        </section>
        <aside className="nn-card space-y-3 p-5">
          <Bar w="50%" h="0.75rem" className="rounded-full" />
          <Bar w="100%" h="4rem" className="rounded-xl" />
          <Bar w="100%" h="4rem" className="rounded-xl" />
          <Bar w="82%" h="0.875rem" />
        </aside>
      </div>
    </div>
  );
}

/** Dashboard analytics shell — stable card grid while progress/readiness data resolves. */
export function LearnerDashboardDataSkeleton(
  props: { withRouteAria?: boolean; label?: string } = {},
) {
  const { withRouteAria = true, label = "Loading learner dashboard..." } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": label } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="nn-learner-activity-skeleton mx-auto max-w-6xl px-4 py-6" {...routeShellProps}>
      <Bar w="12rem" h="0.75rem" className="rounded-full" />
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="nn-card space-y-4 p-5">
          <Bar w="55%" h="1.5rem" className="rounded-xl" />
          <Bar w="88%" h="0.875rem" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
                <Bar w="45%" h="0.625rem" className="rounded-full" />
                <Bar w="70%" h="1.6rem" className="mt-3 rounded-xl" />
              </div>
            ))}
          </div>
          <Bar w="100%" h="12rem" className="rounded-xl" />
        </section>
        <aside className="nn-card space-y-3 p-5">
          <Bar w="48%" h="1rem" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={i} w={i % 2 === 0 ? "100%" : "82%"} h="2.4rem" className="rounded-lg" />
          ))}
        </aside>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="nn-card space-y-3 p-5">
            <Bar w="55%" h="1rem" />
            <Bar w="100%" h="5rem" className="rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Clinical module hub shell for labs, skills, med-calc, OSCE, and scenarios. */
export function ClinicalModuleHubSkeleton(
  props: { withRouteAria?: boolean; label?: string } = {},
) {
  const { withRouteAria = true, label = "Loading clinical module..." } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": label } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="nn-learner-activity-skeleton mx-auto max-w-6xl px-4 py-6" {...routeShellProps}>
      <Bar w="14rem" h="0.75rem" className="rounded-full" />
      <section className="nn-card mt-5 space-y-4 p-5">
        <Bar w="9rem" h="0.75rem" className="rounded-full" />
        <Bar w="55%" h="1.75rem" className="rounded-xl" />
        <Bar w="82%" h="0.875rem" />
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
              <Bar w="2.4rem" h="2.4rem" className="rounded-lg" />
              <Bar w="70%" h="1rem" className="mt-4" />
              <Bar w="90%" h="0.75rem" className="mt-2" />
            </div>
          ))}
        </div>
      </section>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="nn-card space-y-3 p-5">
          <Bar w="50%" h="1rem" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={i} w="100%" h="2.2rem" className="rounded-lg" />
          ))}
        </div>
        <div className="nn-card space-y-3 p-5">
          <Bar w="35%" h="1rem" />
          <Bar w="100%" h="10rem" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Single learner lesson document (article + sidebar hints). */
export function LearnerLessonDetailSkeleton(props: { withRouteAria?: boolean } = {}) {
  const { withRouteAria = true } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": "Loading lesson…" } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" {...routeShellProps}>
      <Bar w="14rem" h="0.75rem" className="rounded-full" />
      <Bar w="90%" h="2rem" className="mt-6 rounded-xl" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bar key={i} w={i % 3 === 0 ? "100%" : "92%"} h="0.875rem" />
        ))}
      </div>
      <div className="nn-card mt-10 space-y-3 p-5">
        <Bar w="30%" h="1rem" />
        <Bar w="100%" h="3rem" className="rounded-xl" />
      </div>
    </div>
  );
}

/** Flashcards hub (`/app/flashcards`) — mirrors hero + builder bands. */
export function FlashcardsHubSkeleton(props: { withRouteAria?: boolean } = {}) {
  const { withRouteAria = true } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": "Loading flashcards…" } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6" {...routeShellProps}>
      <Bar w="55%" h="2rem" className="rounded-xl" />
      <Bar w="85%" h="0.875rem" className="mt-3" />
      <div className="nn-card mt-8 space-y-4 border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <Bar w="40%" h="0.75rem" className="rounded-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={i} w="5.5rem" h="2rem" className="rounded-full" />
          ))}
        </div>
        <Bar w="100%" h="0.5rem" className="rounded-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Bar w="100%" h="3rem" className="rounded-xl" />
          <Bar w="100%" h="3rem" className="rounded-xl" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="nn-study-card nn-study-card--wash flex flex-col gap-3 p-4 sm:p-5"
            aria-hidden
          >
            <Bar w="60%" h="1.125rem" />
            <Bar w="90%" h="0.75rem" />
            <div className="flex gap-2">
              <Bar w="5rem" h="1.5rem" className="rounded-full" />
              <Bar w="5rem" h="1.5rem" className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Deck study session — split prompt / rationale columns. */
export function FlashcardStudySessionSkeleton(
  props: {
    withRouteAria?: boolean;
    message?: string;
    detail?: string;
    showRetry?: boolean;
    onRetry?: () => void;
  } = {},
) {
  const {
    withRouteAria = true,
    message = "Preparing your flashcards...",
    detail = "Building a focused study session from your deck.",
    showRetry = false,
    onRetry,
  } = props;
  const routeShellProps = withRouteAria
    ? ({ "aria-busy": true as const, "aria-label": "Loading flashcard session…" } as const)
    : ({ "aria-hidden": true as const } as const);

  return (
    <div className="nn-flashcard-loading-shell mx-auto max-w-6xl px-4 py-6" {...routeShellProps}>
      <div className="nn-flashcard-loading-status" aria-live="polite">
        <div>
          <span className="nn-flashcard-loading-spinner" aria-hidden />
          <p>{message}</p>
        </div>
        <span>{detail}</span>
        {showRetry && onRetry ? (
          <button type="button" onClick={onRetry}>
            Retry Session
          </button>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <Bar w="8rem" h="0.625rem" className="rounded-full" />
          <Bar w="15rem" h="1rem" className="rounded-full" />
        </div>
        <div className="flex gap-3">
          <Bar w="5rem" h="0.875rem" className="rounded-full" />
          <Bar w="6rem" h="0.875rem" className="rounded-full" />
          <Bar w="5rem" h="2.25rem" className="rounded-lg" />
        </div>
      </div>
      <div className="nn-exam-session nn-flashcard-loading-session rounded-2xl border border-[var(--semantic-border-soft)] p-3 sm:p-4">
        <Bar w="100%" h="0.375rem" className="rounded-full" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="nn-flashcard-loading-card space-y-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <div className="flex items-center justify-between gap-3">
              <Bar w="6rem" h="0.75rem" className="rounded-full" />
              <Bar w="4rem" h="2rem" className="rounded-lg" />
            </div>
            <div className="mx-auto flex min-h-[18rem] max-w-2xl flex-col justify-center gap-4">
              <Bar w="94%" h="1.25rem" />
              <Bar w="86%" h="1.25rem" />
              <Bar w="72%" h="1.25rem" />
              <div className="mt-4 grid gap-3">
                <Bar w="100%" h="3rem" className="rounded-xl" />
                <Bar w="100%" h="3rem" className="rounded-xl" />
                <Bar w="100%" h="3rem" className="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="nn-flashcard-loading-rationale space-y-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <Bar w="45%" h="0.75rem" className="rounded-full" />
            <Bar w="100%" h="4rem" className="rounded-xl" />
            <Bar w="100%" h="4rem" className="rounded-xl" />
            <Bar w="80%" h="0.875rem" />
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bar key={i} w="100%" h="2.35rem" className="rounded-lg" />
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <Bar w="6.5rem" h="2.5rem" className="rounded-lg" />
            <Bar w="6.5rem" h="2.5rem" className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
