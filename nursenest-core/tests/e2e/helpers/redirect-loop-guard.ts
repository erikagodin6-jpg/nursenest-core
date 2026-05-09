import type { Page } from "@playwright/test";

/**
 * Resolves when the URL pathname stays unchanged for `stableMs` (post-redirect settle),
 * or throws if pathname alternates between two values (infinite redirect / auth loop).
 */
export async function waitForStableLearnerPathname(
  page: Page,
  opts: { stableMs?: number; timeoutMs?: number; label?: string } = {},
): Promise<string> {
  const stableMs = opts.stableMs ?? 900;
  const timeoutMs = opts.timeoutMs ?? 35_000;
  const deadline = Date.now() + timeoutMs;
  let lastPath = "";
  let stableAccum = 0;
  const tail: string[] = [];

  while (Date.now() < deadline) {
    let path = "";
    try {
      path = new URL(page.url()).pathname;
    } catch {
      path = "";
    }

    tail.push(path);
    if (tail.length > 10) tail.shift();

    if (tail.length >= 8) {
      const u = [...new Set(tail.slice(-8))];
      if (u.length === 2) {
        let alternates = true;
        for (let i = 1; i < tail.length; i++) {
          if (tail[i] === tail[i - 1]) {
            alternates = false;
            break;
          }
        }
        if (alternates) {
          throw new Error(
            [
              `Redirect loop (${opts.label ?? "learner navigation"})`,
              `between ${u[0]} and ${u[1]}`,
              "Check AUTH_URL/NEXTAUTH_URL vs BASE_URL, session cookies, and onboarding flags.",
            ].join(" — "),
          );
        }
      }
    }

    if (path && path === lastPath) {
      stableAccum += 220;
      if (stableAccum >= stableMs) return path;
    } else {
      lastPath = path;
      stableAccum = 0;
    }

    await page.waitForTimeout(220);
  }

  throw new Error(
    `Timeout (${timeoutMs}ms) waiting for stable pathname (${opts.label ?? "learner navigation"}); last=${lastPath || "(empty)"}`,
  );
}
