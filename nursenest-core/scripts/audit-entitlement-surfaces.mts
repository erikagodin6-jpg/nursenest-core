/**
 * Static scan: learner API entitlement gates, risky client patterns, tier string compares.
 *
 * Policy (Phase 4B):
 * - **Exit 1** only when a **critical** `src/app/api/learner/.../route.ts` file lacks any server entitlement
 *   resolution import/pattern (`requireSubscriberSession`, `resolveEntitlement`, `getUserAccess`,
 *   `loadCanonicalLearnerAccessForUserId`, `toCanonicalLearnerAccess`).
 * - **Warnings** (exit 0): learner routes on the soft allowlist, client `hasAccess` heuristics, duplicated tier literals.
 *
 * Usage (from `nursenest-core/`): `npm run audit:entitlement-surfaces`
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");

const SERVER_GATE_RE =
  /requireSubscriberSession|resolveEntitlement|getUserAccess|loadCanonicalLearnerAccessForUserId|toCanonicalLearnerAccess/;

/** Auth-only or onboarding — not treated as critical missing gates (warnings only). */
const LEARNER_ROUTE_WARN_ALLOWLIST = new Set<string>([
  "src/app/api/learner/baseline-assessment/submit/route.ts",
  "src/app/api/learner/baseline-assessment/status/route.ts",
  "src/app/api/learner/baseline-assessment/skip/route.ts",
  "src/app/api/learner/baseline-assessment/questions/route.ts",
  "src/app/api/learner/reset-progress/route.ts",
  "src/app/api/learner/pathway-hub-stats/route.ts",
  "src/app/api/learner/study-settings/route.ts",
  "src/app/api/learner/pre-nursing-plan/route.ts",
  "src/app/api/learner/pre-nursing-progress/route.ts",
]);

/** Substrings in relative path — if matched without a gate, fail CI (premium-shaped surfaces). */
const CRITICAL_LEARNER_ROUTE_MARKERS = [
  "pathway-lesson-practice-questions",
  "pathway-lessons",
  "pathway-lesson/",
  "adaptive-",
  "adaptive/",
  "lesson-bank",
  "lesson-topic-quiz",
  "lesson-assessment",
  "exam-plan",
  "readiness",
  "mistakes",
  "notes",
  "insights",
  "weak-areas",
  "study-path",
  "study-budget",
  "command-center",
  "personalized-study-plan",
  "engagement-nudges",
  "email-engagement-prefs",
  "protection-telemetry",
  "clinical-scenario-analytics",
  "personal-profile",
];

function walkRouteFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkRouteFiles(p, acc);
    else if (name === "route.ts") acc.push(p);
  }
  return acc;
}

function isCriticalLearnerRoute(relPosix: string): boolean {
  if (!relPosix.startsWith("src/app/api/learner/") || !relPosix.endsWith("/route.ts")) return false;
  return CRITICAL_LEARNER_ROUTE_MARKERS.some((m) => relPosix.includes(m));
}

function scanClientHasAccessWarnings(srcRoot: string): string[] {
  const warnings: string[] = [];
  const appDir = join(srcRoot, "app");
  const walk = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        const rel = relative(repoRoot, p).split("\\").join("/");
        if (!rel.includes("/(student)/app/")) continue;
        let txt: string;
        try {
          txt = readFileSync(p, "utf8");
        } catch {
          continue;
        }
        if (!txt.includes('"use client"') && !txt.includes("'use client'")) continue;
        if (!/\bhasAccess\b/.test(txt)) continue;
        if (SERVER_GATE_RE.test(txt) || /getUserAccess|resolveEntitlement|requireSubscriberSession/.test(txt)) continue;
        warnings.push(`client_hasAccess_heuristic:${rel}`);
      }
    }
  };
  walk(appDir);
  return warnings;
}

function scanTierStringCompares(studentAppRoot: string): string[] {
  const warnings: string[] = [];
  const walk = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith(".tsx")) {
        const rel = relative(repoRoot, p).split("\\").join("/");
        const txt = readFileSync(p, "utf8");
        if (/(===|==)\s*["']RN["']/.test(txt) || /["']RN["']\s*(===|==)/.test(txt)) {
          warnings.push(`tier_literal_compare:${rel}`);
        }
      }
    }
  };
  try {
    walk(studentAppRoot);
  } catch {
    /* optional */
  }
  return warnings;
}

async function main() {
  const learnerApiRoot = join(repoRoot, "src", "app", "api", "learner");
  const files = walkRouteFiles(learnerApiRoot);
  const missingGate: { rel: string; critical: boolean }[] = [];
  const softAllowlisted: string[] = [];

  for (const abs of files) {
    const rel = relative(repoRoot, abs).split("\\").join("/");
    const src = readFileSync(abs, "utf8");
    if (SERVER_GATE_RE.test(src)) continue;
    const critical = isCriticalLearnerRoute(rel);
    if (LEARNER_ROUTE_WARN_ALLOWLIST.has(rel)) {
      softAllowlisted.push(rel);
      continue;
    }
    missingGate.push({ rel, critical });
  }

  const clientWarnings = scanClientHasAccessWarnings(join(repoRoot, "src"));
  const tierLiteralWarnings = scanTierStringCompares(join(repoRoot, "src", "app", "(student)", "app"));

  const criticalMissing = missingGate.filter((m) => m.critical);
  const nonCriticalMissing = missingGate.filter((m) => !m.critical);

  const out = {
    scannedLearnerRouteFiles: files.length,
    missingServerGateCritical: criticalMissing.map((m) => m.rel),
    missingServerGateOther: nonCriticalMissing.map((m) => m.rel),
    softAllowlistedMissingGate: softAllowlisted,
    warnings: [...clientWarnings, ...tierLiteralWarnings],
    policy:
      "exit_1_only_on_critical_learner_route_missing_gate;_warnings_include_allowlisted_routes_and_heuristic_client_checks",
  };

  console.log(JSON.stringify(out, null, 2));

  if (criticalMissing.length > 0) {
    console.error(`\naudit:entitlement-surfaces FAILED — ${criticalMissing.length} critical learner route(s) without server gate:`);
    for (const m of criticalMissing) console.error(`  - ${m.rel}`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
