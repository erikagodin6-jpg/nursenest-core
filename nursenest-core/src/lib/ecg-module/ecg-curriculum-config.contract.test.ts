import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  ECG_BEGINNER_CURRICULUM,
  ECG_ADVANCED_CURRICULUM,
  ECG_FULL_CURRICULUM,
  ECG_CURRICULUM_MARKETING_ROUTES,
  getEcgCurriculumTopic,
} from "./ecg-curriculum-config";

describe("ECG curriculum config contracts", () => {
  test("beginner curriculum has exactly 8 systematic steps in order", () => {
    const steps = ECG_BEGINNER_CURRICULUM.filter((t) => t.step !== undefined).sort(
      (a, b) => (a.step ?? 0) - (b.step ?? 0),
    );
    assert.equal(steps.length, 8, "Beginner stage must have exactly 8 systematic steps");
    for (let i = 0; i < steps.length; i++) {
      assert.equal(steps[i]!.step, i + 1, `Step ${i + 1} must be numbered sequentially`);
    }
  });

  test("all topics have at least one teaching requirement", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.teachingRequirements.length > 0,
        `Topic ${topic.id} must have at least one teaching requirement`,
      );
    }
  });

  test("all topics have at least one pitfall", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(topic.pitfalls.length > 0, `Topic ${topic.id} must have at least one clinical pitfall`);
    }
  });

  test("all topics have at least one differential", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.differentials.length > 0,
        `Topic ${topic.id} must explicitly teach differentials (why NOT X)`,
      );
    }
  });

  test("all topic IDs are unique", () => {
    const ids = ECG_FULL_CURRICULUM.map((t) => t.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, "All topic IDs must be unique");
  });

  test("all prerequisite IDs reference existing topics", () => {
    const allIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
    for (const topic of ECG_FULL_CURRICULUM) {
      for (const prereq of topic.prerequisites) {
        assert.ok(allIds.has(prereq), `Topic ${topic.id} has unknown prerequisite: ${prereq}`);
      }
    }
  });

  test("all topics have a learnerRoute", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.learnerRoute.startsWith("/"),
        `Topic ${topic.id} learnerRoute must start with /`,
      );
    }
  });

  test("all marketing routes start with /advanced-ecg-nursing or /ecg", () => {
    for (const route of ECG_CURRICULUM_MARKETING_ROUTES) {
      assert.ok(
        route.startsWith("/advanced-ecg-nursing") || route.startsWith("/ecg"),
        `Marketing route ${route} must be under /advanced-ecg-nursing or /ecg`,
      );
    }
  });

  test("advanced curriculum covers all required clinical topics", () => {
    const requiredIds = [
      "stemi-localization",
      "electrolyte-ecg",
      "bundle-branch-blocks",
      "torsades",
      "paced-rhythms",
      "icu-telemetry",
    ];
    const advancedIds = new Set(ECG_ADVANCED_CURRICULUM.map((t) => t.id));
    for (const id of requiredIds) {
      assert.ok(advancedIds.has(id), `Advanced curriculum must include topic: ${id}`);
    }
  });

  test("getEcgCurriculumTopic returns topic for known ID", () => {
    const topic = getEcgCurriculumTopic("rate");
    assert.ok(topic, "Should return beginner rate topic");
    assert.equal(topic.stage, "beginner");
    assert.equal(topic.step, 1);
  });

  test("beginner stage topics all have stage = beginner", () => {
    for (const topic of ECG_BEGINNER_CURRICULUM) {
      assert.equal(topic.stage, "beginner", `Topic ${topic.id} is in beginner array but has stage ${topic.stage}`);
    }
  });

  test("advanced stage topics all have stage = advanced", () => {
    for (const topic of ECG_ADVANCED_CURRICULUM) {
      assert.equal(topic.stage, "advanced", `Topic ${topic.id} is in advanced array but has stage ${topic.stage}`);
    }
  });
});

describe("SiteHeader CLS attribution contract", () => {
  test("site-header.tsx has data-nn-cls-region attribute on sticky wrapper", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/components/layout/site-header.tsx"),
      "utf8",
    );
    assert.match(source, /data-nn-cls-region="site-header"/, "Sticky header must have CLS region attribution");
  });

  test("site-header-server.tsx precomputes tierHubStrip server-side", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf8",
    );
    assert.match(source, /buildMarketingTierHubStrip/, "Server must precompute tier hub strip");
    assert.match(source, /tierHubStrip/, "Server must pass tierHubStrip to precomputedNavData");
    assert.match(source, /serverRegion/, "Server must pass serverRegion for client cache validation");
  });

  test("SiteHeaderPrecomputedNav type includes tierHubStrip and serverRegion", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/components/layout/site-header.tsx"),
      "utf8",
    );
    assert.match(source, /tierHubStrip\?:/, "SiteHeaderPrecomputedNav must declare tierHubStrip");
    assert.match(source, /serverRegion\?:/, "SiteHeaderPrecomputedNav must declare serverRegion");
  });

  test("SiteHeader uses precomputed tierHubStrip when region matches", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/components/layout/site-header.tsx"),
      "utf8",
    );
    assert.match(
      source,
      /precomputedNavData\?\.tierHubStrip/,
      "SiteHeader must use precomputed tier strip from server",
    );
    // Region validation: either direct comparison or via a local variable both satisfy the contract.
    const hasRegionCheck =
      source.includes("precomputedNavData?.serverRegion") &&
      (source.includes("preRegion === region") || source.includes("serverRegion === region"));
    assert.ok(hasRegionCheck, "SiteHeader must validate server region matches before using precomputed strip");
  });
});

describe("Clinical Modules nav contracts", () => {
  test("CLINICAL_MODULES_SHELL_NAV_ID is included in LearnerShellStudyNavRowId union", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/lib/navigation/learner-primary-nav.ts"),
      "utf8",
    );
    assert.match(source, /CLINICAL_MODULES_SHELL_NAV_ID/, "LearnerShellStudyNavRowId must include clinical_modules");
    assert.match(source, /buildClinicalModulesShellNavItem/, "Nav must expose buildClinicalModulesShellNavItem");
    assert.match(source, /buildClinicalModulesNavLinks/, "Nav must expose buildClinicalModulesNavLinks");
  });

  test("Clinical Modules nav links include ECG Fundamentals and Advanced ECG", () => {
    const { buildClinicalModulesNavLinks } = require("./../../lib/navigation/learner-primary-nav");
    const links = buildClinicalModulesNavLinks(null);
    const ecgFundamentals = links.find((l: { key: string }) => l.key === "ecg-fundamentals");
    const advancedEcg = links.find((l: { key: string }) => l.key === "advanced-ecg");
    assert.ok(ecgFundamentals, "Clinical Modules must include ECG Fundamentals");
    assert.ok(advancedEcg, "Clinical Modules must include Advanced ECG");
    assert.equal(advancedEcg.isPremiumAddOn, true, "Advanced ECG must be marked as premium add-on");
  });

  test("Clinical Modules flyout is rendered in LearnerShellDesktopStudyLinks", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(
      join(process.cwd(), "src/components/layout/learner-shell-primary-nav.tsx"),
      "utf8",
    );
    assert.match(source, /ClinicalModulesFlyout/, "Desktop nav must render ClinicalModulesFlyout");
    assert.match(
      source,
      /CLINICAL_MODULES_SHELL_NAV_ID/,
      "Desktop nav must check for clinical_modules item ID",
    );
  });
});
