#!/usr/bin/env node
/**
 * CI / release gate: focused unit tests for marketing lesson hub reliability (dedupe, invariants, crawl nav).
 *
 * Optional production checks (set env):
 *   VERIFY_LESSON_HUBS_BASE_URL=https://www.nursenest.ca npm run verify:lesson-hubs
 */
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tests = [
  "src/lib/lessons/pathway-lesson-dedupe.test.ts",
  "src/lib/lessons/pathway-lesson-hub-pipeline-collapse-guard.test.ts",
  "src/components/pathway-lessons/lesson-hub-full-lesson-link-nav.test.tsx",
  "src/lib/lessons/pathway-lesson-nclex-rn-cross-region-marketing.test.ts",
];

const unit = spawnSync(process.execPath, ["--import", "tsx", "--test", ...tests], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (unit.status !== 0) process.exit(unit.status ?? 1);

const base = (process.env.VERIFY_LESSON_HUBS_BASE_URL ?? "").replace(/\/$/, "");
if (base) {
  try {
    const html = execFileSync("curl", ["-sS", "-m", "60", `${base}/canada/rn/nclex-rn/lessons`], {
      encoding: "utf8",
      maxBuffer: 12 * 1024 * 1024,
    });
    const hrefs = [...html.matchAll(/href="([^"]*\/lessons\/[^"#]+)"/g)].map((m) => m[1]);
    const unique = new Set(hrefs);
    if (unique.size <= 1) {
      console.error(
        `verify-lesson-hubs: expected multiple /lessons/ hrefs from ${base}/canada/rn/nclex-rn/lessons, got ${unique.size}`,
      );
      process.exit(1);
    }
    console.error(`verify-lesson-hubs: production smoke ok (${unique.size} unique /lessons/ hrefs sampled)`);
  } catch (e) {
    console.error("verify-lesson-hubs: VERIFY_LESSON_HUBS_BASE_URL curl failed:", e);
    process.exit(1);
  }
}

process.exit(0);
