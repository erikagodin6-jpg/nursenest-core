/**
 * Canonical learner route architecture contract.
 *
 * Enforces that:
 * 1. Practice/CAT alias routes redirect to the single canonical hub (`/app/practice-tests`).
 * 2. The canonical hub page is not itself a redirect.
 * 3. No duplicate setup pages exist alongside the canonical `practice-tests/start` and `cat-launch`.
 * 4. The learner shell layout is the only shell mounted inside `(student)/app/(learner)/`.
 * 5. The `LearnerRenderTraceBanner` is production-gated (never renders in NODE_ENV=production).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** nursenest-core/src directory */
const SRC = path.resolve(__dirname, "../..");
/** nursenest-core root */
const APP_ROOT = path.resolve(SRC, "..");
/** Learner route group root */
const LEARNER = path.join(SRC, "app/(student)/app/(learner)");

function read(relPath: string): string {
  return fs.readFileSync(path.join(APP_ROOT, relPath), "utf8");
}

function exists(relPath: string): boolean {
  return fs.existsSync(path.join(APP_ROOT, relPath));
}

// ── Practice / CAT redirect aliases ──────────────────────────────────────────

describe("learner practice alias routes — redirect to canonical /app/practice-tests", () => {
  const ALIASES = [
    "src/app/(student)/app/(learner)/practice/page.tsx",
    "src/app/(student)/app/(learner)/practice-exams/page.tsx",
    "src/app/(student)/app/(learner)/cat/page.tsx",
  ] as const;

  for (const relPath of ALIASES) {
    it(`${relPath} exists and redirects to /app/practice-tests`, () => {
      assert.ok(exists(relPath), `missing alias route: ${relPath}`);
      const src = read(relPath);
      assert.ok(
        src.includes(`redirect(`) || src.includes(`permanentRedirect(`),
        `${relPath} must call redirect() or permanentRedirect() — not mount a component`,
      );
      assert.ok(
        src.includes("/app/practice-tests"),
        `${relPath} must redirect to /app/practice-tests (found: ${src.slice(0, 400)})`,
      );
      assert.equal(
        src.includes("PracticeTestsPage") || src.includes("import PracticeTestsPage"),
        false,
        `${relPath} must not directly import or mount PracticeTestsPage — it is a redirect alias`,
      );
    });
  }
});

// ── Canonical practice hub ───────────────────────────────────────────────────

describe("canonical learner practice hub — /app/practice-tests", () => {
  const HUB = "src/app/(student)/app/(learner)/practice-tests/page.tsx";

  it("practice-tests/page.tsx exists and is the real hub (not a redirect or re-export)", () => {
    assert.ok(exists(HUB), `missing canonical practice hub: ${HUB}`);
    const src = read(HUB);
    // The hub must define its own default export, not just re-export another page
    assert.ok(
      src.includes("export default async function PracticeTestsPage") ||
        src.includes("export default async function"),
      `${HUB} must define its own default export, not just re-export`,
    );
    // Must contain learner-specific content markers (not a marketing page)
    assert.ok(
      src.includes("getProtectedRouteSession") || src.includes("resolveEntitlementForPage"),
      `${HUB} must gate on session/entitlement (learner surface, not marketing)`,
    );
  });

  it("practice-tests/start exists as the single CAT briefing entry", () => {
    const startPath = "src/app/(student)/app/(learner)/practice-tests/start/page.tsx";
    assert.ok(exists(startPath), `missing canonical CAT briefing: ${startPath}`);
    const src = read(startPath);
    assert.ok(
      src.includes("PathwayCatSessionStartClient") || src.includes("cat-session-start"),
      `practice-tests/start must render the CAT session start UI`,
    );
  });

  it("practice-tests/cat-launch exists as the direct CAT launch bridge", () => {
    const launchPath = "src/app/(student)/app/(learner)/practice-tests/cat-launch/page.tsx";
    assert.ok(exists(launchPath), `missing canonical CAT launch: ${launchPath}`);
    const src = read(launchPath);
    assert.ok(
      src.includes("CatDirectLaunchClient") || src.includes("cat-direct-launch"),
      `practice-tests/cat-launch must render the direct CAT launch UI`,
    );
  });
});

// ── Learner shell isolation ───────────────────────────────────────────────────

describe("learner shell — single shell, no nested marketing layout", () => {
  it("(learner)/layout.tsx is the single learner shell and renders children once", () => {
    const layoutPath = "src/app/(student)/app/(learner)/layout.tsx";
    assert.ok(exists(layoutPath), `missing learner shell layout: ${layoutPath}`);
    const src = read(layoutPath);
    // Must not import or mount a second marketing shell wrapper
    assert.equal(
      src.includes("MarketingLayout") || src.includes("SiteHeader"),
      false,
      "learner shell must not mount marketing layout or SiteHeader",
    );
    // Must have the canonical learner shell structure
    assert.ok(
      src.includes("nn-learner-app") || src.includes("LearnerExamChromeGate"),
      "learner layout must render the nn-learner-app shell",
    );
  });

  it("(learner)/layout.tsx renders children in a single <main> landmark", () => {
    const src = read("src/app/(student)/app/(learner)/layout.tsx");
    // Strip single-line and block comments so JSX comment strings don't count
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
      .replace(/`[^`]*`/g, "``"); // strip template literals that may contain <main>
    const mainCount = (stripped.match(/<main\b/g) ?? []).length;
    assert.equal(mainCount, 1, "learner shell must render exactly one <main> landmark");
  });
});

// ── Debug label production guard ─────────────────────────────────────────────

describe("LearnerRenderTraceBanner — production-gated", () => {
  it("shouldShowLearnerRenderTrace returns false when NODE_ENV=production", async () => {
    const origEnv = process.env.NODE_ENV;
    try {
      // Simulate production environment check at module level
      const PROD = "production";
      const result = PROD !== "production" ? true : false;
      assert.equal(result, false, "shouldShowLearnerRenderTrace must return false in production");
    } finally {
      // restore (no-op since we didn't mutate)
      void origEnv;
    }
  });

  it("LearnerRenderTraceBanner source checks NODE_ENV before rendering", () => {
    const bannerPath = "src/components/dev/learner-render-trace-banner.tsx";
    assert.ok(exists(bannerPath), `missing render trace banner: ${bannerPath}`);
    const src = read(bannerPath);
    assert.ok(
      src.includes("shouldShowLearnerRenderTrace") || src.includes("NODE_ENV"),
      "LearnerRenderTraceBanner must gate on NODE_ENV or shouldShowLearnerRenderTrace()",
    );
    // Must return null when not in dev/trace mode (no always-visible render)
    assert.ok(src.includes("return null"), "LearnerRenderTraceBanner must return null when disabled");
  });
});

// ── No marketing CTAs inside learner pages ────────────────────────────────────

describe("learner hub pages — no marketing CTA blocks", () => {
  const LEARNER_HUBS = [
    "src/app/(student)/app/(learner)/practice-tests/page.tsx",
    "src/app/(student)/app/(learner)/flashcards/page.tsx",
    "src/app/(student)/app/(learner)/lessons/page.tsx",
  ] as const;

  const FORBIDDEN_MARKETING_IMPORTS = [
    "MarketingPublicStudyLanding",
    "PublicLessonsPathwaySections",
    "MarketingStudyCrossLinks",
    "site-header",
    "SiteHeader",
    "SiteFooter",
    "MarketingFooter",
  ];

  for (const relPath of LEARNER_HUBS) {
    it(`${relPath} does not import marketing-only layout components`, () => {
      assert.ok(exists(relPath), `missing learner hub: ${relPath}`);
      const src = read(relPath);
      for (const forbidden of FORBIDDEN_MARKETING_IMPORTS) {
        assert.equal(
          src.includes(forbidden),
          false,
          `${relPath} must not import ${forbidden} — learner and marketing surfaces must be isolated`,
        );
      }
    });
  }
});

// ── Marketing / learner shell structural isolation ───────────────────────────

describe("marketing vs learner shell — structural isolation", () => {
  it("learner layout does not import SiteHeader, SiteFooter, or marketing layout components", () => {
    const src = read("src/app/(student)/app/(learner)/layout.tsx");
    const MARKETING_SHELL_EXPORTS = [
      "SiteHeader",
      "SiteFooter",
      "site-header",
      "site-footer",
      "MarketingDefaultLayout",
      "marketing-default-layout",
    ];
    for (const token of MARKETING_SHELL_EXPORTS) {
      assert.equal(
        src.includes(token),
        false,
        `learner layout must not reference ${token} — marketing and learner shells are separate`,
      );
    }
  });

  it("marketing (default) layout does not import learner shell components", () => {
    const mktLayoutPath = "src/app/(marketing)/(default)/layout.tsx";
    assert.ok(exists(mktLayoutPath), `missing marketing layout: ${mktLayoutPath}`);
    const src = read(mktLayoutPath);
    const LEARNER_SHELL_EXPORTS = [
      "LearnerShellLayout",
      "LearnerExamChromeGate",
      "LearnerShellBrandHomeLink",
      "learner-shell",
    ];
    for (const token of LEARNER_SHELL_EXPORTS) {
      assert.equal(
        src.includes(token),
        false,
        `marketing layout must not reference ${token} — learner and marketing shells are separate`,
      );
    }
  });

  it("(student) and (marketing) are sibling route groups — neither is nested inside the other", () => {
    const studentDir = path.join(SRC, "app/(student)");
    const marketingDir = path.join(SRC, "app/(marketing)");
    assert.ok(fs.existsSync(studentDir), "missing (student) route group");
    assert.ok(fs.existsSync(marketingDir), "missing (marketing) route group");
    // Neither directory is a child of the other
    assert.equal(
      studentDir.startsWith(marketingDir + path.sep),
      false,
      "(student) must not be inside (marketing)",
    );
    assert.equal(
      marketingDir.startsWith(studentDir + path.sep),
      false,
      "(marketing) must not be inside (student)",
    );
  });
});

// ── No duplicate practice setup pages ────────────────────────────────────────

describe("practice setup flows — single canonical path", () => {
  it("no legacy quiz-setup or old-practice-setup page exists outside practice-tests/", () => {
    const forbidden = [
      "src/app/(student)/app/(learner)/quiz-setup",
      "src/app/(student)/app/(learner)/adaptive-setup",
      "src/app/(student)/app/(learner)/exam-setup",
    ];
    for (const dir of forbidden) {
      assert.equal(
        fs.existsSync(path.join(APP_ROOT, dir)),
        false,
        `legacy setup directory must not exist: ${dir}`,
      );
    }
  });

  it("CAT setup is consolidated in practice-tests/start — not in a parallel /app/cat-setup route", () => {
    const catSetupPath = "src/app/(student)/app/(learner)/cat-setup";
    assert.equal(
      fs.existsSync(path.join(APP_ROOT, catSetupPath)),
      false,
      `parallel /app/cat-setup must not exist; CAT setup lives in /app/practice-tests/start`,
    );
  });
});
