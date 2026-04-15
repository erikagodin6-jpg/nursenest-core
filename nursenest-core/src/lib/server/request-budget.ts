import "server-only";

/**
 * Async-local request wall-clock budget for Route Handlers and server utilities.
 * Non-critical work should bail when {@link remainingRequestBudgetMs} is low.
 */
import { REQUEST_WALL_CLOCK_BUDGET_MS } from "@/lib/config/production-safety-flags";
import { AsyncLocalStorage } from "node:async_hooks";

const DEFAULT_BUDGET_MS = REQUEST_WALL_CLOCK_BUDGET_MS;

type Store = { startedAt: number; budgetMs: number };

const als = new AsyncLocalStorage<Store>();

export const REQUEST_BUDGET_DEFAULT_MS = DEFAULT_BUDGET_MS;

export function runWithRequestBudget<T>(budgetMs: number, fn: () => Promise<T>): Promise<T> {
  const b = Math.min(60_000, Math.max(500, budgetMs));
  return als.run({ startedAt: Date.now(), budgetMs: b }, fn);
}

/** Milliseconds left in the current budget, or full default when unset. */
export function remainingRequestBudgetMs(): number {
  const s = als.getStore();
  if (!s) return DEFAULT_BUDGET_MS;
  const elapsed = Date.now() - s.startedAt;
  return Math.max(0, s.budgetMs - elapsed);
}

/** True when there is little time left for Tier-2 / optional work. */
export function shouldAbortNonCriticalWork(thresholdMs = 400): boolean {
  return remainingRequestBudgetMs() <= thresholdMs;
}
