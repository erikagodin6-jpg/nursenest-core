import type { Page } from "@playwright/test";

export type LearnerSessionSnapshot = {
  country: "US" | "CA" | null;
  tier: string | null;
  alliedProfessionKey: string | null;
};

/**
 * Reads `/api/auth/session` in the browser (includes cookies). Aligns with
 * `authCallbacks.session` in `src/lib/auth-callbacks.ts`.
 */
export async function readLearnerSessionSnapshot(page: Page): Promise<LearnerSessionSnapshot | null> {
  const raw = await page
    .evaluate(async () => {
      const r = await fetch("/api/auth/session", { credentials: "include" });
      if (!r.ok) return null;
      return r.json() as Promise<{ user?: Record<string, unknown> } | null>;
    })
    .catch(() => null);

  const u = raw?.user;
  if (!u || typeof u !== "object") return null;

  const c = u.country;
  const country = c === "CA" || c === "US" ? c : null;

  const t = u.tier;
  const tier = typeof t === "string" ? t : null;

  const ap = u.alliedProfessionKey;
  const alliedProfessionKey = typeof ap === "string" && ap.length > 0 ? ap : null;

  return { country, tier, alliedProfessionKey };
}
