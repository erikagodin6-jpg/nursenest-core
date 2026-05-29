import type { ActivityKey } from "@/lib/performance/activity-startup-metrics";

export type ActivityRouteClassification = {
  activity: ActivityKey;
  targetBudgetMs: number;
  routeFamily: "learner" | "module";
} | null;

const LEARNER_ACTIVITY_ROUTES: Array<{ activity: ActivityKey; prefixes: string[]; targetBudgetMs: number }> = [
  { activity: "cat", prefixes: ["/app/cat", "/app/practice-tests/cat-launch"], targetBudgetMs: 3000 },
  { activity: "questions", prefixes: ["/app/questions", "/app/practice-tests"], targetBudgetMs: 2000 },
  { activity: "flashcards", prefixes: ["/app/flashcards", "/app/study-tools/flashcards"], targetBudgetMs: 2000 },
  { activity: "lessons", prefixes: ["/app/lessons"], targetBudgetMs: 2000 },
  { activity: "clinical-skills", prefixes: ["/app/clinical-skills"], targetBudgetMs: 2000 },
  { activity: "pharmacology", prefixes: ["/app/pharmacology", "/app/medication-drills"], targetBudgetMs: 2000 },
  { activity: "loft", prefixes: ["/app/osce", "/app/loft", "/app/simulations"], targetBudgetMs: 3000 },
];

const MODULE_ACTIVITY_ROUTES: Array<{ activity: ActivityKey; prefixes: string[]; targetBudgetMs: number }> = [
  { activity: "ecg", prefixes: ["/modules/ecg", "/modules/ecg-advanced", "/modules/ecg-interpretation"], targetBudgetMs: 2000 },
];

function normalizePath(pathname: string | null | undefined): string {
  const path = (pathname ?? "").split("?")[0]?.replace(/\/+$/, "") || "/";
  return path === "/" ? path : path.toLowerCase();
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function classifyActivityRoute(pathname: string | null | undefined): ActivityRouteClassification {
  const normalized = normalizePath(pathname);

  for (const route of LEARNER_ACTIVITY_ROUTES) {
    if (route.prefixes.some((prefix) => matchesPrefix(normalized, prefix))) {
      return { activity: route.activity, targetBudgetMs: route.targetBudgetMs, routeFamily: "learner" };
    }
  }

  for (const route of MODULE_ACTIVITY_ROUTES) {
    if (route.prefixes.some((prefix) => matchesPrefix(normalized, prefix))) {
      return { activity: route.activity, targetBudgetMs: route.targetBudgetMs, routeFamily: "module" };
    }
  }

  return null;
}
