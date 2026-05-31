import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  ECG_BEGINNER_CURRICULUM,
  ECG_ADVANCED_CURRICULUM,
  ECG_FULL_CURRICULUM,
  ECG_CURRICULUM_MARKETING_ROUTES,
  ECG_CURRICULUM_TOTAL_MINUTES,
  ECG_CRITICAL_TOPICS,
  getEcgCurriculumTopic,
  getStaleEcgTopics,
  getUnreviewedAdvancedEcgTopics,
  getRelatedEcgConceptUnitIds,
  getEcgTopicsReferencingConcept,
  ECG_GUIDELINE_STALE_MONTHS,
} from "./ecg-curriculum-config";

// ─── Structural Integrity ─────────────────────────────────────────────────

describe("ECG curriculum structural integrity", () => {
  test("beginner curriculum has exactly 8 systematic steps in order", () => {
    const steps = ECG_BEGINNER_CURRICULUM.filter((t) => t.step !== undefined).sort(
      (a, b) => (a.step ?? 0) - (b.step ?? 0),
    );
    assert.equal(steps.length, 8);
    for (let i = 0; i < steps.length; i++) {
      assert.equal(steps[i]!.step, i + 1);
    }
  });

  test("all topic IDs are unique", () => {
    const ids = ECG_FULL_CURRICULUM.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("all prerequisite IDs reference existing topics", () => {
    const allIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
    for (const topic of ECG_FULL_CURRICULUM) {
      for (const prereq of topic.prerequisites) {
        assert.ok(allIds.has(prereq), `Topic ${topic.id} has unknown prerequisite: ${prereq}`);
      }
    }
  });

  test("all learnerRoutes are scoped to /app or /modules (no marketing bounce)", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.learnerRoute.startsWith("/app") || topic.learnerRoute.startsWith("/modules"),
        `Topic ${topic.id} learnerRoute must start with /app or /modules, got: ${topic.learnerRoute}`,
      );
    }
  });

  test("all marketing routes are under /advanced-ecg-nursing or /ecg", () => {
    for (const route of ECG_CURRICULUM_MARKETING_ROUTES) {
      assert.ok(
        route.startsWith("/advanced-ecg-nursing") || route.startsWith("/ecg"),
        `Marketing route ${route} must be /advanced-ecg-nursing/* or /ecg/*`,
      );
    }
  });

  test("stage labels match array membership", () => {
    for (const t of ECG_BEGINNER_CURRICULUM) assert.equal(t.stage, "beginner");
    for (const t of ECG_ADVANCED_CURRICULUM) assert.equal(t.stage, "advanced");
  });

  test("getEcgCurriculumTopic returns topic for known ID", () => {
    const topic = getEcgCurriculumTopic("rate");
    assert.ok(topic);
    assert.equal(topic.stage, "beginner");
    assert.equal(topic.step, 1);
  });

  test("total estimated minutes > 400 (sanity check for full curriculum)", () => {
    assert.ok(ECG_CURRICULUM_TOTAL_MINUTES > 400, `Got ${ECG_CURRICULUM_TOTAL_MINUTES}min`);
  });

  test("ECG_CRITICAL_TOPICS is non-empty and all have remediationPriority=critical", () => {
    assert.ok(ECG_CRITICAL_TOPICS.length > 0);
    for (const t of ECG_CRITICAL_TOPICS) assert.equal(t.remediationPriority, "critical");
  });
});

// ─── Teaching Requirement Governance ──────────────────────────────────────

describe("ECG curriculum teaching requirement governance", () => {
  test("ALL topics require strip_annotation", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.teachingRequirements.includes("strip_annotation"),
        `Topic ${topic.id} missing strip_annotation`,
      );
    }
  });

  test("ALL topics require telemetry_pitfalls", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.teachingRequirements.includes("telemetry_pitfalls"),
        `Topic ${topic.id} missing telemetry_pitfalls`,
      );
    }
  });

  test("ALL topics require differential_reasoning", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.teachingRequirements.includes("differential_reasoning"),
        `Topic ${topic.id} missing differential_reasoning`,
      );
    }
  });

  test("ALL topics require pathophysiology", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.teachingRequirements.includes("pathophysiology"),
        `Topic ${topic.id} missing pathophysiology`,
      );
    }
  });

  test("ACLS-relevant topics require acls_integration", () => {
    const required = ["stemi-localization", "ischemia-injury-infarction", "torsades", "wpw",
      "paced-rhythms", "icu-telemetry", "av-blocks-advanced", "brugada", "rhythm-diagnosis"];
    for (const id of required) {
      const topic = getEcgCurriculumTopic(id);
      assert.ok(topic, `Topic ${id} not found`);
      assert.ok(topic.teachingRequirements.includes("acls_integration"), `Topic ${id} missing acls_integration`);
    }
  });

  test("ICU-relevant topics require icu_integration", () => {
    const required = ["bundle-branch-blocks", "paced-rhythms", "icu-telemetry"];
    for (const id of required) {
      const topic = getEcgCurriculumTopic(id);
      assert.ok(topic, `Topic ${id} not found`);
      assert.ok(topic.teachingRequirements.includes("icu_integration"), `Topic ${id} missing icu_integration`);
    }
  });
});

// ─── Clinical Content Governance ──────────────────────────────────────────

describe("ECG curriculum clinical content governance", () => {
  test("all topics have at least 2 pitfalls (minimum governance threshold)", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.pitfalls.length >= 2,
        `Topic ${topic.id} has ${topic.pitfalls.length} pitfall(s) — minimum is 2`,
      );
    }
  });

  test("all topics have at least 2 differentials (minimum governance threshold)", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.ok(
        topic.differentials.length >= 2,
        `Topic ${topic.id} has ${topic.differentials.length} differential(s) — minimum is 2`,
      );
    }
  });

  test("advanced curriculum covers required clinical topics", () => {
    const required = ["stemi-localization", "electrolyte-ecg", "bundle-branch-blocks",
      "torsades", "paced-rhythms", "icu-telemetry", "brugada", "wpw", "av-blocks-advanced", "axis-deviation"];
    const ids = new Set(ECG_ADVANCED_CURRICULUM.map((t) => t.id));
    for (const id of required) assert.ok(ids.has(id), `Missing advanced topic: ${id}`);
  });

  test("Brugada is NOT mapped to pediatric-ecg marketing page", () => {
    const brugada = getEcgCurriculumTopic("brugada");
    assert.ok(brugada);
    assert.notEqual(brugada.marketingRoute, "/advanced-ecg-nursing/pediatric-ecg",
      "Brugada is adult-dominant and must not map to pediatric page");
  });

  test("Brugada maps to acls-rhythms (VF is the primary consequence)", () => {
    const brugada = getEcgCurriculumTopic("brugada");
    assert.equal(brugada!.marketingRoute, "/advanced-ecg-nursing/acls-rhythms");
  });
});

// ─── Progression Metadata Governance ──────────────────────────────────────

describe("ECG curriculum progression metadata governance", () => {
  test("all topics have positive estimatedMinutes", () => {
    for (const t of ECG_FULL_CURRICULUM) assert.ok(t.estimatedMinutes > 0, `${t.id}: estimatedMinutes must be > 0`);
  });

  test("all topics have positive questionCount", () => {
    for (const t of ECG_FULL_CURRICULUM) assert.ok(t.questionCount > 0, `${t.id}: questionCount must be > 0`);
  });

  test("minimumPassScore is between 0.5 and 1.0", () => {
    for (const t of ECG_FULL_CURRICULUM) {
      assert.ok(t.minimumPassScore >= 0.5 && t.minimumPassScore <= 1.0,
        `${t.id}: minimumPassScore ${t.minimumPassScore} out of range`);
    }
  });

  test("masteryThreshold >= minimumPassScore for all topics", () => {
    for (const t of ECG_FULL_CURRICULUM) {
      assert.ok(t.masteryThreshold >= t.minimumPassScore,
        `${t.id}: masteryThreshold (${t.masteryThreshold}) < minimumPassScore (${t.minimumPassScore})`);
    }
  });

  test("all topics have valid remediationPriority", () => {
    const valid = new Set(["critical", "high", "medium", "low"]);
    for (const t of ECG_FULL_CURRICULUM) {
      assert.ok(valid.has(t.remediationPriority), `${t.id}: invalid priority ${t.remediationPriority}`);
    }
  });

  test("critical topics have questionCount >= 20", () => {
    for (const t of ECG_CRITICAL_TOPICS) {
      assert.ok(t.questionCount >= 20, `Critical topic ${t.id} has only ${t.questionCount} questions`);
    }
  });

  test("all topics have a lessonSlug for deep-link remediation", () => {
    for (const t of ECG_FULL_CURRICULUM) {
      assert.ok(t.lessonSlug && t.lessonSlug.length > 0, `Topic ${t.id} missing lessonSlug`);
    }
  });

  test("lessonSlug values are kebab-case", () => {
    const kebab = /^[a-z0-9-]+$/;
    for (const t of ECG_FULL_CURRICULUM) {
      if (!t.lessonSlug) continue;
      assert.match(t.lessonSlug, kebab, `${t.id} lessonSlug "${t.lessonSlug}" must be kebab-case`);
    }
  });
});

// ─── SiteHeader CLS + Precomputation Contracts ───────────────────────────

describe("SiteHeader CLS attribution and precomputation", () => {
  test("site-header.tsx has data-nn-cls-region on sticky wrapper", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header.tsx"), "utf8");
    assert.match(source, /data-nn-cls-region="site-header"/);
  });

  test("site-header.tsx sets data-nn-region-mismatch on fallback", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header.tsx"), "utf8");
    assert.match(source, /nnRegionMismatch/);
  });

  test("site-header.tsx logs region mismatch warning in non-production", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header.tsx"), "utf8");
    assert.match(source, /console\.warn/);
    assert.match(source, /NODE_ENV.*production/);
  });

  test("site-header-server.tsx uses static import for cookie reader", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header-server.tsx"), "utf8");
    assert.match(source, /^import.*readOptionalMarketingRegionToggleForCountry/m);
    assert.doesNotMatch(source, /await import\(.*read-optional-marketing-region-cookie/);
  });

  test("SiteHeaderPrecomputedNav has tierHubStrip and serverRegion fields", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header.tsx"), "utf8");
    assert.match(source, /tierHubStrip\?:/);
    assert.match(source, /serverRegion\?:/);
  });

  test("SiteHeader uses precomputed tierHubStrip with region validation", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/components/layout/site-header.tsx"), "utf8");
    assert.match(source, /precomputedNavData\?\.tierHubStrip/);
    const hasRegionCheck =
      source.includes("precomputedNavData?.serverRegion") &&
      (source.includes("preRegion === region") || source.includes("serverRegion === region"));
    assert.ok(hasRegionCheck, "SiteHeader must validate server region before using precomputed strip");
  });
});

// ─── Clinical Modules Nav Architecture Contracts ──────────────────────────

describe("Clinical Modules nav architecture", () => {
  test("ClinicalModulesNavLink uses status enum (not boolean flags)", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/lib/navigation/learner-primary-nav.ts"), "utf8");
    assert.match(source, /status:\s*ClinicalModulesLinkStatus/);
    assert.doesNotMatch(source, /isComingSoon\?:/);
    assert.doesNotMatch(source, /isPremiumAddOn\?:/);
  });

  test("ClinicalModulesNavLink has group field for taxonomy", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const source = readFileSync(join(process.cwd(), "src/lib/navigation/learner-primary-nav.ts"), "utf8");
    assert.match(source, /group:\s*ClinicalModulesLinkGroup/);
  });

  test("all Clinical Modules hrefs are learner-scoped (no marketing URLs)", () => {
    const { buildClinicalModulesNavLinks } = require("../../lib/navigation/learner-primary-nav");
    const links = buildClinicalModulesNavLinks(null);
    for (const link of links) {
      assert.ok(
        link.href.startsWith("/app") || link.href.startsWith("/modules") || link.href.startsWith("/tools"),
        `Link "${link.key}" href "${link.href}" must be /app, /modules, or /tools scoped`,
      );
      assert.notEqual(link.href, "/clinical-modules",
        `Link "${link.key}" must not use the marketing /clinical-modules URL`);
    }
  });

  test("all Clinical Modules links have valid status values", () => {
    const { buildClinicalModulesNavLinks } = require("../../lib/navigation/learner-primary-nav");
    const valid = new Set(["available", "premium", "new", "coming_soon", "locked"]);
    for (const link of buildClinicalModulesNavLinks(null)) {
      assert.ok(valid.has(link.status), `"${link.key}" has invalid status: ${link.status}`);
    }
  });

  test("ECG Fundamentals is available, Advanced ECG is premium", () => {
    const { buildClinicalModulesNavLinks } = require("../../lib/navigation/learner-primary-nav");
    const links = buildClinicalModulesNavLinks(null);
    const ecgFund = links.find((l: { key: string }) => l.key === "ecg-fundamentals");
    const advEcg = links.find((l: { key: string }) => l.key === "advanced-ecg");
    assert.ok(ecgFund);
    assert.equal(ecgFund.status, "available");
    assert.ok(advEcg);
    assert.equal(advEcg.status, "premium");
  });
});

// ─── Global Navigation Unification Contracts ───────────────────────────────

describe("Clinical modules navigation governance", () => {
  test("legacy learner-shell primary nav file has been removed", () => {
    const { existsSync } = require("node:fs");
    const { join } = require("node:path");
    assert.equal(existsSync(join(process.cwd(), "src/components/layout/learner-shell-primary-nav.tsx")), false);
  });

  test("ECG module nav inventory remains in the shared learner-primary-nav data layer", () => {
    const { buildClinicalModulesNavLinks } = require("../../lib/navigation/learner-primary-nav");
    const links = buildClinicalModulesNavLinks(null);
    assert.ok(links.some((l: { key: string }) => l.key === "ecg-fundamentals"));
    assert.ok(links.some((l: { key: string }) => l.key === "advanced-ecg"));
  });
});

// ─── Clinical Review Governance (CI gate) ─────────────────────────────────────

describe("ECG curriculum — clinical review governance (CI gate)", () => {
  test("no advanced topics are unreviewed (clinicalReviewStatus !== 'unreviewed')", () => {
    const unreviewed = getUnreviewedAdvancedEcgTopics();
    assert.deepEqual(
      unreviewed.map((t) => t.id),
      [],
      `Advanced topics with missing clinical review: ${unreviewed.map((t) => t.id).join(", ")}. ` +
      "All advanced ECG topics require clinician review before production.",
    );
  });

  test("no topics are stale (reviewedAt within ECG_GUIDELINE_STALE_MONTHS)", () => {
    const stale = getStaleEcgTopics();
    assert.deepEqual(
      stale.map((t) => t.id),
      [],
      `Stale ECG topics: ${stale.map((t) => `${t.id} (reviewed ${t.reviewedAt})`).join(", ")}. ` +
      `Reviews must be refreshed every ${ECG_GUIDELINE_STALE_MONTHS} months.`,
    );
  });

  test("all topics have clinicalReviewStatus field", () => {
    const valid = new Set(["reviewed", "unreviewed", "stale"]);
    for (const t of ECG_FULL_CURRICULUM) {
      assert.ok(
        valid.has(t.clinicalReviewStatus),
        `Topic ${t.id} has invalid clinicalReviewStatus: "${t.clinicalReviewStatus}"`,
      );
    }
  });

  test("all reviewed topics have reviewedAt in ISO-8601 date format", () => {
    const isoDate = /^\d{4}-\d{2}-\d{2}$/;
    for (const t of ECG_FULL_CURRICULUM.filter((t) => t.clinicalReviewStatus === "reviewed")) {
      assert.ok(
        t.reviewedAt && isoDate.test(t.reviewedAt),
        `Topic ${t.id} has clinicalReviewStatus="reviewed" but reviewedAt="${t.reviewedAt}" is not ISO-8601`,
      );
    }
  });

  test("all reviewed topics have guidelineVersion", () => {
    for (const t of ECG_FULL_CURRICULUM.filter((t) => t.clinicalReviewStatus === "reviewed")) {
      assert.ok(
        t.guidelineVersion && t.guidelineVersion.length > 0,
        `Topic ${t.id} is reviewed but missing guidelineVersion`,
      );
    }
  });
});

// ─── Related Concept Unit Governance ─────────────────────────────────────────

describe("ECG curriculum — related concept unit IDs governance", () => {
  test("all relatedConceptUnitIds reference existing curriculum topic IDs", () => {
    const allIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
    for (const topic of ECG_FULL_CURRICULUM) {
      for (const relId of topic.relatedConceptUnitIds ?? []) {
        assert.ok(
          allIds.has(relId),
          `Topic "${topic.id}" relatedConceptUnitIds contains unknown ID: "${relId}"`,
        );
      }
    }
  });

  test("all critical advanced topics have at least 1 related concept unit for foundational scaffolding", () => {
    const criticalAdvanced = ECG_ADVANCED_CURRICULUM.filter(
      (t) => t.remediationPriority === "critical",
    );
    for (const t of criticalAdvanced) {
      assert.ok(
        (t.relatedConceptUnitIds?.length ?? 0) >= 1,
        `Critical advanced topic "${t.id}" has no relatedConceptUnitIds — ` +
        "the adaptive remediation engine needs foundational concepts to surface when learners miss this topic.",
      );
    }
  });

  test("getRelatedEcgConceptUnitIds returns IDs for topics with relations", () => {
    const rels = getRelatedEcgConceptUnitIds("rhythm-diagnosis");
    assert.ok(rels.length > 0, "rhythm-diagnosis should have related concept IDs");
  });

  test("getRelatedEcgConceptUnitIds returns empty array for unknown topic", () => {
    const rels = getRelatedEcgConceptUnitIds("nonexistent-topic-id");
    assert.deepEqual([...rels], []);
  });

  test("getEcgTopicsReferencingConcept returns topics for foundational concept", () => {
    const topics = getEcgTopicsReferencingConcept("qrs");
    assert.ok(topics.length > 0, "Multiple advanced topics should reference 'qrs'");
  });
});

// ─── lessonSlug governance ─────────────────────────────────────────────────────

describe("ECG curriculum — lessonSlug existence governance", () => {
  test("all lessonSlugs are unique across the full curriculum", () => {
    const slugs = ECG_FULL_CURRICULUM.map((t) => t.lessonSlug).filter(Boolean);
    assert.equal(
      new Set(slugs).size,
      slugs.length,
      "Duplicate lessonSlug values detected — each topic must have a unique slug.",
    );
  });

  test("lessonSlug values match pattern: lowercase kebab-case, max 60 chars", () => {
    const kebab = /^[a-z0-9-]{1,60}$/;
    for (const t of ECG_FULL_CURRICULUM) {
      if (!t.lessonSlug) continue;
      assert.match(
        t.lessonSlug,
        kebab,
        `Topic "${t.id}" lessonSlug "${t.lessonSlug}" must be lowercase kebab-case, max 60 chars`,
      );
    }
  });

  test("beginner topics 1–8 all have lessonSlug", () => {
    for (const t of ECG_BEGINNER_CURRICULUM) {
      assert.ok(
        t.lessonSlug && t.lessonSlug.length > 0,
        `Beginner topic "${t.id}" (step ${t.step}) is missing lessonSlug — remediation deep-link will fail`,
      );
    }
  });

  test("advanced critical topics all have lessonSlug", () => {
    for (const t of ECG_ADVANCED_CURRICULUM.filter((t) => t.remediationPriority === "critical")) {
      assert.ok(
        t.lessonSlug && t.lessonSlug.length > 0,
        `Critical advanced topic "${t.id}" missing lessonSlug — remediation deep-link will fail`,
      );
    }
  });
});
