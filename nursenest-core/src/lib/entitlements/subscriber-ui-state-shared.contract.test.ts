/**
 * Hermetic: mobile shared subscriber UI helper stays wired for server-first gating.
 *
 * Run: `node --import tsx --test src/lib/entitlements/subscriber-ui-state-shared.contract.test.ts`
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..", "..");
const sharedSrc = join(repoRoot, "packages", "nursenest-mobile-shared", "src");

describe("subscriber UI state (mobile-shared contract)", () => {
  it("exports resolveSubscriberUiState and 403 headline helper from shared entry", () => {
    const index = readFileSync(join(sharedSrc, "index.ts"), "utf8");
    assert.match(index, /export \* from "\.\/subscriber-ui-state\.js"/);
    const mod = readFileSync(join(sharedSrc, "subscriber-ui-state.ts"), "utf8");
    assert.match(mod, /export function resolveSubscriberUiState/);
    assert.match(mod, /export function subscriberHeadlineFromSubscriberApi403/);
    assert.match(mod, /parseApiErrorCode/);
  });

  it("home tab consumes resolveSubscriberUiState + refetch-friendly query options", () => {
    const home = readFileSync(join(repoRoot, "apps", "mobile", "app", "(tabs)", "index.tsx"), "utf8");
    assert.match(home, /resolveSubscriberUiState/);
    assert.match(home, /staleTime:\s*30_000/);
    assert.match(home, /refetchOnWindowFocus:\s*true/);
    assert.match(home, /ready:\s*authReady/);
  });
});
