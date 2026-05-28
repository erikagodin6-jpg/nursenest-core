/**
 * Route Performance Registry
 *
 * Single source of truth for per-route performance budgets and historical tracking.
 * Every route that must stay fast is registered here with explicit thresholds.
 *
 * The registry drives:
 *   - Playwright performance e2e tests (compare firstContentMs against budgets)
 *   - CI regression gate (compare captured metrics against budget baselines)
 *   - Server-side budget violation logging (via alert-thresholds.ts)
 *   - Admin performance dashboard
 *
 * Budget philosophy:
 *   - Budgets are p95 targets, not averages. A single slow sample doesn't fail CI.
 *   - Marketing routes (TTFB) are stricter — they affect conversion and SEO.
 *   - Learner routes allow more DB time — complex queries are expected.
 *   - "Fail CI" budgets are 2× the normal budget to catch regressions, not noise.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type RouteCategory =
  | "marketing-homepage"
  | "marketing-hub"
  | "learner-hub"
  | "learner-questions"
  | "learner-flashcards"
  | "learner-lessons"
  | "learner-clinical"
  | "learner-assessment"
  | "learner-analytics"
  | "learner-advanced"
  | "api";

export type RouteBudget = {
  /** Unique slug for dashboards / CI reports. */
  id: string;
  label: string;
  /** Canonical app route (pattern or exact). */
  route: string;
  category: RouteCategory;
  /**
   * Time to first byte budget (ms) — server must start responding within this window.
   * Measured server-side; does NOT include network transit.
   */
  ttfbBudgetMs: number;
  /**
   * Time for meaningful content to be visible to the user (Playwright wall-clock ms).
   * Maps to `firstContentMs` in learner-key-pages-performance.ts.
   */
  firstContentBudgetMs: number;
  /**
   * Total DB time per request (ms). Sum of all Prisma query durations.
   */
  dbTimeBudgetMs: number;
  /**
   * Max number of DB queries per request. High counts signal N+1 or missing joins.
   */
  maxQueryCount: number;
  /**
   * JSON response payload budget (KB). Enforced on API routes.
   */
  payloadKB?: number;
  /**
   * Approximate client hydration time budget (ms).
   * Rough proxy: React hydration + client-side data fetches.
   */
  hydrationBudgetMs?: number;
  /**
   * When true, this route is included in `npm run perf:budgets` CI check.
   */
  ciEnforced: boolean;
  /** Notes for context (not used programmatically). */
  notes?: string;
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ROUTE_PERFORMANCE_REGISTRY: readonly RouteBudget[] = [
  // ── Marketing routes ────────────────────────────────────────────────────────
  {
    id: "marketing-homepage",
    label: "Homepage",
    route: "/",
    category: "marketing-homepage",
    ttfbBudgetMs: 800,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 150,
    maxQueryCount: 8,
    ciEnforced: true,
    notes: "Homepage TTFB is SEO-critical. DB touches stats counters only.",
  },
  {
    id: "marketing-pricing",
    label: "Pricing",
    route: "/pricing",
    category: "marketing-hub",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 200,
    maxQueryCount: 10,
    ciEnforced: true,
  },
  {
    id: "marketing-faq",
    label: "FAQ",
    route: "/faq",
    category: "marketing-hub",
    ttfbBudgetMs: 800,
    firstContentBudgetMs: 2500,
    dbTimeBudgetMs: 0,
    maxQueryCount: 0,
    ciEnforced: false,
    notes: "Static page — zero DB expected.",
  },
  {
    id: "marketing-rn-hub",
    label: "RN Marketing Hub",
    route: "/us/rn/nclex-rn",
    category: "marketing-hub",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 200,
    maxQueryCount: 10,
    ciEnforced: false,
  },
  {
    id: "marketing-pn-hub",
    label: "RPN/PN Marketing Hub",
    route: "/canada/pn/rex-pn",
    category: "marketing-hub",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 200,
    maxQueryCount: 10,
    ciEnforced: false,
  },
  {
    id: "marketing-np-hub",
    label: "NP Marketing Hub",
    route: "/canada/np/cnple",
    category: "marketing-hub",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 200,
    maxQueryCount: 10,
    ciEnforced: false,
  },
  {
    id: "marketing-allied-hub",
    label: "Allied Health Marketing Hub",
    route: "/allied/allied-health",
    category: "marketing-hub",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 3500,
    dbTimeBudgetMs: 250,
    maxQueryCount: 12,
    ciEnforced: false,
  },
  {
    id: "marketing-newgrad-hub",
    label: "New Grad Marketing Hub",
    route: "/canada/new-grad",
    category: "marketing-hub",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 3500,
    dbTimeBudgetMs: 200,
    maxQueryCount: 10,
    ciEnforced: false,
  },

  // ── Learner app routes ───────────────────────────────────────────────────────
  {
    id: "learner-dashboard",
    label: "Learner Dashboard",
    route: "/app",
    category: "learner-hub",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 300,
    maxQueryCount: 15,
    ciEnforced: true,
    notes: "Hub bootstrap — snapshot/manifest path expected to serve from cache.",
  },
  {
    id: "learner-questions",
    label: "Question Bank",
    route: "/app/questions",
    category: "learner-questions",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 400,
    maxQueryCount: 15,
    ciEnforced: true,
  },
  {
    id: "learner-flashcards",
    label: "Flashcards Hub",
    route: "/app/flashcards",
    category: "learner-flashcards",
    ttfbBudgetMs: 1000,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 300,
    maxQueryCount: 12,
    ciEnforced: true,
  },
  {
    id: "learner-lessons",
    label: "Lesson Library",
    route: "/app/lessons",
    category: "learner-lessons",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 400,
    maxQueryCount: 15,
    ciEnforced: true,
  },
  {
    id: "learner-clinical-skills",
    label: "Clinical Skills",
    route: "/app/clinical-skills",
    category: "learner-clinical",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 350,
    maxQueryCount: 15,
    ciEnforced: true,
  },
  {
    id: "learner-pharmacology",
    label: "Pharmacology",
    route: "/app/pharmacology",
    category: "learner-clinical",
    ttfbBudgetMs: 1200,
    firstContentBudgetMs: 2000,
    dbTimeBudgetMs: 350,
    maxQueryCount: 15,
    ciEnforced: true,
  },
  {
    id: "learner-ecg",
    label: "ECG Workstation",
    route: "/modules/ecg/basic/lessons",
    category: "learner-advanced",
    ttfbBudgetMs: 1500,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 400,
    maxQueryCount: 18,
    ciEnforced: false,
    notes: "ECG module has richer media — slightly looser budget.",
  },
  {
    id: "learner-cat",
    label: "CAT Exam Launch",
    route: "/app/practice-tests/cat-launch",
    category: "learner-assessment",
    ttfbBudgetMs: 1500,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 500,
    maxQueryCount: 20,
    ciEnforced: true,
    notes: "CAT initializes adaptive state — more DB work expected.",
  },
  {
    id: "learner-cat-insights",
    label: "CAT Results & Insights",
    route: "/app/practice-tests/cat-insights",
    category: "learner-assessment",
    ttfbBudgetMs: 1500,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 500,
    maxQueryCount: 20,
    ciEnforced: false,
  },
  {
    id: "learner-loft",
    label: "LOFT / OSCE Simulation",
    route: "/app/osce",
    category: "learner-advanced",
    ttfbBudgetMs: 1800,
    firstContentBudgetMs: 3000,
    dbTimeBudgetMs: 600,
    maxQueryCount: 22,
    ciEnforced: false,
    notes: "LOFT loads case data and simulation state.",
  },
  {
    id: "learner-analytics",
    label: "Analytics Dashboard",
    route: "/app/analytics",
    category: "learner-analytics",
    ttfbBudgetMs: 1500,
    firstContentBudgetMs: 2500,
    dbTimeBudgetMs: 500,
    maxQueryCount: 20,
    ciEnforced: true,
    notes: "Analytics aggregates across exam sessions, topic stats, CAT history.",
  },
  {
    id: "learner-readiness",
    label: "Readiness Dashboard",
    route: "/app/account/readiness",
    category: "learner-analytics",
    ttfbBudgetMs: 1500,
    firstContentBudgetMs: 2500,
    dbTimeBudgetMs: 500,
    maxQueryCount: 20,
    ciEnforced: false,
  },
] as const;

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Get budget by route ID. */
export function getBudgetById(id: string): RouteBudget | undefined {
  return ROUTE_PERFORMANCE_REGISTRY.find((r) => r.id === id);
}

/** Get the budget whose route prefix matches the given path. */
export function getBudgetForPath(pathname: string): RouteBudget | undefined {
  return ROUTE_PERFORMANCE_REGISTRY.find(
    (r) => pathname === r.route || pathname.startsWith(r.route + "/") || pathname.startsWith(r.route + "?"),
  );
}

/** Get all CI-enforced budgets. */
export function getCiEnforcedBudgets(): readonly RouteBudget[] {
  return ROUTE_PERFORMANCE_REGISTRY.filter((r) => r.ciEnforced);
}

/** Get budgets by category. */
export function getBudgetsByCategory(category: RouteCategory): readonly RouteBudget[] {
  return ROUTE_PERFORMANCE_REGISTRY.filter((r) => r.category === category);
}

// ─── Budget violation checker ─────────────────────────────────────────────────

export type BudgetViolation = {
  routeId: string;
  routeLabel: string;
  metric: "ttfb" | "firstContent" | "dbTime" | "queryCount" | "payload";
  actual: number;
  budget: number;
  overagePercent: number;
};

export function checkBudgetViolations(
  routeId: string,
  observed: {
    ttfbMs?: number;
    firstContentMs?: number;
    dbTimeMs?: number;
    queryCount?: number;
    payloadKB?: number;
  },
): BudgetViolation[] {
  const budget = getBudgetById(routeId);
  if (!budget) return [];

  const violations: BudgetViolation[] = [];

  function check(
    metric: BudgetViolation["metric"],
    actual: number | undefined,
    limit: number | undefined,
  ) {
    if (actual == null || limit == null || limit <= 0) return;
    if (actual > limit) {
      violations.push({
        routeId,
        routeLabel: budget!.label,
        metric,
        actual: Math.round(actual),
        budget: limit,
        overagePercent: Math.round(((actual - limit) / limit) * 100),
      });
    }
  }

  check("ttfb", observed.ttfbMs, budget.ttfbBudgetMs);
  check("firstContent", observed.firstContentMs, budget.firstContentBudgetMs);
  check("dbTime", observed.dbTimeMs, budget.dbTimeBudgetMs);
  check("queryCount", observed.queryCount, budget.maxQueryCount > 0 ? budget.maxQueryCount : undefined);
  check("payload", observed.payloadKB, budget.payloadKB);

  return violations;
}

// ─── Summary formatter ────────────────────────────────────────────────────────

export function formatBudgetViolations(violations: BudgetViolation[]): string {
  if (violations.length === 0) return "✓ All budgets met";
  return violations
    .map(
      (v) =>
        `  ✗ [${v.routeLabel}] ${v.metric}: ${v.actual}ms vs ${v.budget}ms budget (+${v.overagePercent}%)`,
    )
    .join("\n");
}
