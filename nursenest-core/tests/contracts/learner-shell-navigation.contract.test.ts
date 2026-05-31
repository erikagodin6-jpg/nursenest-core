/**
 * Learner Shell Navigation Contract Tests
 *
 * These tests enforce the navigation governance contract defined in:
 *   src/lib/nav-governance/navigation-contract.ts
 *
 * CI ENFORCEMENT:
 *   These tests run on every pull request and BLOCK MERGE if they fail.
 *   A failing test means a route is bypassing the canonical learner shell
 *   without explicit approval.
 *
 * RUN:
 *   node --import tsx --test tests/contracts/learner-shell-navigation.contract.test.ts
 *
 * TO ADD A NEW APPROVED EXCEPTION:
 *   1. Add an entry to APPROVED_MODULE_EXCEPTIONS in navigation-contract.ts
 *   2. Include justification, owner, and migration status
 *   3. The test will now pass for that route
 *   4. DO NOT suppress a test failure without updating the contract
 *
 * WHAT IS TESTED:
 *   1. The canonical learner shell exists at the expected path
 *   2. The canonical nav component exists at the expected path
 *   3. No layout.tsx outside (learner)/ renders nav without approval
 *   4. Every approved exception is still present (no phantom registrations)
 *   5. The learner shell layout imports the canonical global SiteHeaderServer
 *   6. No prohibited navigation patterns appear in new routes
 *   7. CAT exam focused mode is the only approved full-chrome suppression
 *   8. Contract version matches what the tests expect
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

// Static top-level import of contract (tsx supports TypeScript imports)
import {
  APPROVED_MODULE_EXCEPTIONS,
  CANONICAL_LEARNER_SHELL_PATH,
  CANONICAL_NAV_COMPONENT_PATH,
  NAVIGATION_CONTRACT_VERSION,
  isApprovedModuleException,
  getApprovedExceptionForRoute,
} from "../../src/lib/nav-governance/navigation-contract.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function read(relativePath: string): string {
  const abs = path.resolve(ROOT, relativePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${relativePath}`);
  return fs.readFileSync(abs, "utf8");
}

function exists(relativePath: string): boolean {
  return fs.existsSync(path.resolve(ROOT, relativePath));
}

function findLayoutFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findLayoutFiles(fullPath));
    else if (entry.name === "layout.tsx" || entry.name === "layout.ts") results.push(fullPath);
  }
  return results;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

// Alias for test readability
const contract = {
  APPROVED_MODULE_EXCEPTIONS,
  CANONICAL_LEARNER_SHELL_PATH,
  CANONICAL_NAV_COMPONENT_PATH,
  NAVIGATION_CONTRACT_VERSION,
  isApprovedModuleException,
  getApprovedExceptionForRoute,
};

describe("navigation shell contract", () => {

  // ── 1. Canonical shell existence ─────────────────────────────────────────

  it("canonical learner shell exists at the registered path", () => {
    assert.ok(
      exists(contract.CANONICAL_LEARNER_SHELL_PATH),
      `Canonical learner shell NOT FOUND at: ${contract.CANONICAL_LEARNER_SHELL_PATH}\n` +
      "The shell was moved or deleted. Update CANONICAL_LEARNER_SHELL_PATH in navigation-contract.ts.",
    );
  });

  it("canonical nav component exists at the registered path", () => {
    assert.ok(
      exists(contract.CANONICAL_NAV_COMPONENT_PATH),
      `Canonical nav component NOT FOUND at: ${contract.CANONICAL_NAV_COMPONENT_PATH}\n` +
      "The nav component was moved or deleted. Update CANONICAL_NAV_COMPONENT_PATH in navigation-contract.ts.",
    );
  });

  // ── 2. Shell imports nav component ───────────────────────────────────────

  it("canonical learner shell imports the global site header component", () => {
    const shellSource = read(contract.CANONICAL_LEARNER_SHELL_PATH);
    const hasNavImport = shellSource.includes("site-header-server") && shellSource.includes("SiteHeaderServer");
    assert.ok(
      hasNavImport,
      `Canonical learner shell does not import the global site header component.\n` +
      `Expected import from: ${contract.CANONICAL_NAV_COMPONENT_PATH}\n` +
      `Shell: ${contract.CANONICAL_LEARNER_SHELL_PATH}`,
    );
  });

  it("canonical learner shell renders the global site header and not the legacy learner nav row", () => {
    const shellSource = read(contract.CANONICAL_LEARNER_SHELL_PATH);
    assert.match(shellSource, /<SiteHeaderServer/);
    assert.doesNotMatch(shellSource, /LearnerShellDesktopStudyLinks/);
    assert.doesNotMatch(shellSource, /LearnerShellMobileBottomNav/);
  });

  // ── 3. No unauthorised navigation outside learner shell ──────────────────

  it("no layout.tsx outside canonical learner shell renders unauthorised navigation", () => {
    const appDir = path.resolve(ROOT, "src/app");
    const allLayouts = findLayoutFiles(appDir);
    const violations: string[] = [];

    const PROHIBITED_COMPONENTS = [
      "PremiumEducationalModuleShell",
      "AdvancedEcgModuleShell",
    ];

    for (const layoutPath of allLayouts) {
      const relPath = path.relative(ROOT, layoutPath).replace(/\\/g, "/");

      // Skip: canonical shell itself
      if (relPath === contract.CANONICAL_LEARNER_SHELL_PATH) continue;

      // Skip: layouts that are WITHIN the learner shell hierarchy
      if (relPath.includes("(app)/app/(learner)/")) continue;

      // Skip: structural provider layouts
      if (relPath === "src/app/(app)/layout.tsx" || relPath === "src/app/(app)/app/layout.tsx") continue;

      // Check for prohibited navigation components
      const source = fs.readFileSync(layoutPath, "utf8");
      const foundProhibited = PROHIBITED_COMPONENTS.filter((c) => source.includes(c));
      if (foundProhibited.length === 0) continue;

      // This route has prohibited components — check if it's an approved exception
      const routePath = relPath
        .replace("src/app/(app)/modules", "/app/modules")
        .replace(/\/layout\.(tsx|ts)$/, "");

      if (contract.isApprovedModuleException(routePath)) continue;

      violations.push(
        `VIOLATION: ${relPath}\n` +
        `  Route: ${routePath}\n` +
        `  Prohibited components: ${foundProhibited.join(", ")}\n` +
        `  Fix: Add to APPROVED_MODULE_EXCEPTIONS in navigation-contract.ts (with justification)\n` +
        `       or migrate to src/app/(app)/app/(learner)/ to use the canonical shell.`,
      );
    }

    assert.deepEqual(
      violations,
      [],
      `\n\nNAVIGATION CONTRACT VIOLATIONS DETECTED:\n\n${violations.join("\n\n")}\n\n` +
      "Each violation must be either:\n" +
      "  A) Added to APPROVED_MODULE_EXCEPTIONS in navigation-contract.ts (with written justification)\n" +
      "  B) Migrated to the canonical learner shell under (app)/app/(learner)/\n",
    );
  });

  // ── 4. Approved exceptions still exist ──────────────────────────────────

  it("all registered approved exceptions still have layout files on disk", () => {
    const missing: string[] = [];
    for (const exception of contract.APPROVED_MODULE_EXCEPTIONS) {
      const expectedLayoutPath = path.resolve(
        ROOT,
        "src/app/(app)/modules" + exception.routePrefix.replace("/app/modules", "") + "/layout.tsx",
      );
      if (!fs.existsSync(expectedLayoutPath)) {
        missing.push(
          `Phantom exception: ${exception.label} (${exception.routePrefix})\n` +
          `  Expected layout at: ${path.relative(ROOT, expectedLayoutPath)}\n` +
          `  Remove from APPROVED_MODULE_EXCEPTIONS if this module was migrated or removed.`,
        );
      }
    }
    assert.deepEqual(
      missing,
      [],
      `\n\nPHANTOM EXCEPTION REGISTRATIONS:\n\n${missing.join("\n\n")}\n\n` +
      "Clean up APPROVED_MODULE_EXCEPTIONS in navigation-contract.ts.",
    );
  });

  // ── 5. Exam focused mode is the only full-chrome suppression ─────────────

  it("focused exam mode is the only approved full-chrome suppression", () => {
    const shellModeSource = read("src/lib/learner/learner-shell-mode.ts");
    // suppressFullChrome must only be true for exam-focused mode
    // The contract requires: suppressFullChrome: mode === "exam-focused"
    // or an equivalent single-condition expression
    // Find assignment lines only (not type declarations)
    const suppressFullChromeAssignments = shellModeSource
      .split("\n")
      .filter((line) => line.includes("suppressFullChrome") && line.includes(":") && !line.includes("readonly") && !line.includes("boolean"));

    assert.ok(
      suppressFullChromeAssignments.length > 0,
      "suppressFullChrome assignment must be present in learner-shell-mode.ts",
    );

    for (const line of suppressFullChromeAssignments) {
      const mentionsExamFocused = line.includes("exam-focused");
      assert.ok(
        mentionsExamFocused,
        `suppressFullChrome must only gate on "exam-focused" mode.\n` +
        `Line: ${line.trim()}\n` +
        `Full-chrome suppression is ONLY approved for active CAT/practice exam sessions.\n` +
        `If you need to suppress chrome for another reason, discuss with the platform team first.`,
      );
    }
  });

  // ── 6. learner-shell-mode.ts uses single resolver function ───────────────

  it("learner shell mode uses centralised learnerShellFlags() resolver", () => {
    const shellModeSource = read("src/lib/learner/learner-shell-mode.ts");
    assert.ok(
      shellModeSource.includes("export function learnerShellFlags("),
      "learner-shell-mode.ts must export learnerShellFlags() as the single resolver.",
    );
    assert.ok(
      shellModeSource.includes("export function resolveLearnerShellMode("),
      "learner-shell-mode.ts must export resolveLearnerShellMode().",
    );
  });

  // ── 7. No new custom header components in learner routes ─────────────────

  it("no learner route layouts introduce duplicate custom headers", () => {
    const appDir = path.resolve(ROOT, "src/app/(app)/app/(learner)");
    if (!fs.existsSync(appDir)) return;

    const layouts = findLayoutFiles(appDir);
    const PROHIBITED_HEADER_IMPORTS = [
      "CustomLearnerHeader",
      "ModuleSpecificHeader",
      "PageSpecificNavBar",
    ];

    const violations: string[] = [];
    for (const layoutPath of layouts) {
      const relPath = path.relative(ROOT, layoutPath).replace(/\\/g, "/");
      if (relPath === contract.CANONICAL_LEARNER_SHELL_PATH) continue;

      const source = fs.readFileSync(layoutPath, "utf8");
      const found = PROHIBITED_HEADER_IMPORTS.filter((c) => source.includes(c));
      if (found.length > 0) {
        violations.push(`${relPath}: prohibited header components: ${found.join(", ")}`);
      }
    }

    assert.deepEqual(violations, [],
      `Prohibited custom header components found in learner routes:\n${violations.join("\n")}`);
  });

  // ── 8. Contract version is pinned ────────────────────────────────────────

  it("navigation contract version matches test expectations", () => {
    assert.strictEqual(
      contract.NAVIGATION_CONTRACT_VERSION,
      "2.0.0",
      "Navigation contract version changed. Update this test to pin the new version, and document what changed.",
    );
  });

  // ── 9. Nav component exports required named exports ──────────────────────

  it("canonical nav component exports the global server header", () => {
    const navSource = read(contract.CANONICAL_NAV_COMPONENT_PATH);
    assert.match(navSource, /export async function SiteHeaderServer/);
  });

  // ── 10. New physiology/simulation routes inherit learner shell ────────────

  it("simulation-center routes are under the canonical learner shell", () => {
    const simCenterPath = "src/app/(app)/app/(learner)/simulation-center/page.tsx";
    assert.ok(
      exists(simCenterPath),
      `simulation-center page not found at expected path: ${simCenterPath}`,
    );
    // It's under (learner)/ — therefore inherits the shell — no further check needed
  });

  it("physiology-monitor routes are under the canonical learner shell", () => {
    const monitorPath = "src/app/(app)/app/(learner)/physiology-monitor/page.tsx";
    assert.ok(
      exists(monitorPath),
      `physiology-monitor page not found at expected path: ${monitorPath}`,
    );
  });
});
