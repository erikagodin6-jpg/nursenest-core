/**
 * Platform UI governance guard.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/ui-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  PLATFORM_UI_ACCESSIBILITY_REQUIREMENTS,
  PLATFORM_UI_ALLOWED_TOKEN_PREFIXES,
  PLATFORM_UI_AUTH_REFERENCE,
  PLATFORM_UI_CLINICAL_EXCEPTIONS,
  PLATFORM_UI_CROSS_THEME_VALIDATION,
  PLATFORM_UI_ELEVATION_PRESETS,
  PLATFORM_UI_FORBIDDEN_PATTERNS,
  PLATFORM_UI_MIGRATION_TARGETS,
  PLATFORM_UI_MOTION_PRESETS,
  PLATFORM_UI_PRIMITIVE_CATEGORIES,
  scanUiGovernanceSource,
} from "../../src/lib/governance/platform-ui-governance";

const ROOT = process.cwd();
const GLOBALS_CSS = path.resolve(ROOT, "src/app/globals.css");
const PLATFORM_CSS = path.resolve(ROOT, "src/app/platform-ui-governance.css");
const PLATFORM_PRIMITIVES = path.resolve(ROOT, "src/components/premium-ui/platform-primitives.tsx");
const PREMIUM_UI_INDEX = path.resolve(ROOT, "src/components/premium-ui/index.ts");
const GOVERNANCE_DOC = path.resolve(ROOT, "docs/governance/platform-ui-governance.md");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("platform UI governance", () => {
  const globalsCss = read(GLOBALS_CSS);
  const platformCss = read(PLATFORM_CSS);
  const platformPrimitives = read(PLATFORM_PRIMITIVES);
  const premiumUiIndex = read(PREMIUM_UI_INDEX);
  const governanceDoc = read(GOVERNANCE_DOC);

  it("anchors platform convergence to the completed auth reference implementation", () => {
    assert.equal(
      PLATFORM_UI_AUTH_REFERENCE.primitivesPath,
      "src/components/auth/auth-experience/auth-primitives.tsx",
    );
    assert.match(governanceDoc, /premium auth pass is the reference implementation/i);
    assert.match(governanceDoc, /Auth primitive reference/i);
  });

  it("loads the platform governance token layer globally", () => {
    assert.match(globalsCss, /@import "\.\/platform-ui-governance\.css";/);
    for (const token of [
      "--nn-space-4",
      "--nn-radius-md",
      "--nn-motion-fast",
      "--nn-elevation-card",
    ]) {
      assert.match(platformCss, new RegExp(token), `${token} must be defined`);
    }
  });

  it("defines all required primitive categories and exports shared primitives", () => {
    assert.deepEqual(Object.keys(PLATFORM_UI_PRIMITIVE_CATEGORIES).sort(), [
      "buttons",
      "feedback",
      "inputs",
      "navigation",
      "panels",
      "typography",
    ]);

    for (const primitive of [
      "PlatformButton",
      "PlatformIconButton",
      "PlatformInput",
      "PlatformTextarea",
      "PlatformSelect",
      "PlatformPanel",
      "PlatformFeedback",
      "PlatformTopbar",
      "PlatformTabs",
      "PlatformSegmentedControl",
      "PlatformBreadcrumbs",
      "PlatformText",
      "PlatformLabel",
    ]) {
      assert.match(platformPrimitives, new RegExp(`function ${primitive}\\b`), `${primitive} implementation missing`);
      assert.match(premiumUiIndex, new RegExp(`\\b${primitive}\\b`), `${primitive} must be exported`);
    }

    for (const hook of [
      'data-nn-platform-primitive="button"',
      'data-nn-platform-primitive="input"',
      'data-nn-platform-primitive="panel"',
      'data-nn-platform-primitive="feedback"',
      'data-nn-platform-primitive="topbar"',
      'data-nn-platform-primitive="typography"',
    ]) {
      assert.match(platformPrimitives, new RegExp(hook), `${hook} hook missing`);
    }
  });

  it("codifies forbidden token, spacing, motion, elevation, and theme-branching patterns", () => {
    const ruleIds = PLATFORM_UI_FORBIDDEN_PATTERNS.map((rule) => rule.ruleId).sort();
    assert.deepEqual(ruleIds, [
      "ad-hoc-opacity",
      "arbitrary-radius",
      "arbitrary-shadow",
      "arbitrary-spacing",
      "arbitrary-tailwind-color",
      "component-theme-branching",
      "custom-transition-duration",
      "hardcoded-hex",
      "inline-color-style",
    ]);
    assert.ok(PLATFORM_UI_ALLOWED_TOKEN_PREFIXES.includes("--semantic-"));
    assert.ok(PLATFORM_UI_ALLOWED_TOKEN_PREFIXES.includes("--auth-"));
    assert.ok(PLATFORM_UI_ALLOWED_TOKEN_PREFIXES.includes("--role-"));
    assert.ok(PLATFORM_UI_ALLOWED_TOKEN_PREFIXES.includes("--surface-"));
    assert.match(governanceDoc, /Do not introduce hardcoded hex/i);
    assert.match(governanceDoc, /Do not create arbitrary box shadows/i);
  });

  it("keeps new governance primitives token-driven", () => {
    const checkedSources = [platformCss, platformPrimitives, governanceDoc].join("\n");
    const violations = scanUiGovernanceSource(checkedSources);
    assert.deepEqual(violations, []);

    for (const tokenPrefix of ["--semantic-", "--auth-", "--role-", "--surface-"]) {
      assert.match(platformCss, new RegExp(tokenPrefix), `${tokenPrefix} usage required`);
    }
  });

  it("standardizes motion and elevation presets through governance tokens", () => {
    assert.equal(PLATFORM_UI_MOTION_PRESETS.fast, "var(--nn-motion-fast)");
    assert.equal(PLATFORM_UI_MOTION_PRESETS.base, "var(--nn-motion-base)");
    assert.equal(PLATFORM_UI_MOTION_PRESETS.easing, "var(--nn-motion-ease)");
    assert.equal(PLATFORM_UI_ELEVATION_PRESETS.monitor, "var(--nn-elevation-monitor)");
    assert.match(platformCss, /prefers-reduced-motion:\s*reduce/);
    assert.match(governanceDoc, /Motion should be calm, clinical, premium, and stable/i);
  });

  it("preserves clinical density while defining convergence targets", () => {
    const targets = new Map(PLATFORM_UI_MIGRATION_TARGETS.map((target) => [target.id, target]));

    assert.equal(targets.get("flashcards-practice-exams")?.priority, "p0");
    assert.equal(targets.get("flashcards-practice-exams")?.preserveExistingFlow, true);
    assert.equal(targets.get("ecg-telemetry")?.preserveClinicalDensity, true);
    assert.equal(targets.get("physiology-monitor-workstation")?.preserveClinicalDensity, true);
    assert.equal(targets.get("reports")?.preserveClinicalDensity, true);

    assert.match(governanceDoc, /must preserve their original launcher hierarchy/i);
    assert.match(governanceDoc, /Telemetry and monitor workstations may use denser panel layouts/i);
    assert.ok(PLATFORM_UI_CLINICAL_EXCEPTIONS.length >= 3);
  });

  it("requires auth-level accessibility and cross-theme validation", () => {
    for (const requirement of [
      "WCAG AA contrast",
      "keyboard navigation",
      "logical tab order",
      "visible focus treatment",
      "aria-invalid for invalid controls",
      "aria-live for async feedback",
      "prefers-reduced-motion support",
      "screen-reader semantics",
      "minimum touch target sizing",
    ]) {
      assert.ok(PLATFORM_UI_ACCESSIBILITY_REQUIREMENTS.includes(requirement));
      assert.match(
        governanceDoc.replace(/`/g, ""),
        new RegExp(requirement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      );
    }

    assert.deepEqual([...PLATFORM_UI_CROSS_THEME_VALIDATION], ["blossom", "ocean", "midnight"]);
    assert.match(governanceDoc, /Blossom[\s\S]*Ocean[\s\S]*Midnight/);
  });
});
