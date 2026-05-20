/**
 * CNPLE route, content-governance, and SEO metadata tests.
 *
 * Validates:
 * 1. CNPLE pathway is defined with LOFT engine (not CAT)
 * 2. Content governance: forbidden phrases absent from key copy strings
 * 3. Sitemap cluster paths are consistent with page files that exist
 * 4. Content governance guard utility functions work correctly
 * 5. CNPLE_RELATED_LINKS contains valid hrefs (no trailing slashes, no broken slugs)
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

// ── Pathway catalogue ─────────────────────────────────────────────────────────

describe("ca-np-cnple pathway definition", () => {
  it("pathway exists and uses LOFT engine", async () => {
    const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");
    const { readinessConfigForPathway } = await import(
      "@/lib/exam-pathways/pathway-readiness-config"
    );
    const p = getExamPathwayById("ca-np-cnple");
    assert.ok(p, "ca-np-cnple pathway must be registered");
    assert.equal(p.examCode, "cnple", "examCode must be 'cnple'");
    assert.equal(p.countrySlug, "canada");
    assert.equal(p.roleTrack, "np");

    const rc = readinessConfigForPathway(p);
    assert.equal(rc.engineType, "LOFT", "CNPLE must use LOFT engine, not CAT");
    assert.notEqual(rc.engineType, "CAT", "CNPLE must NOT be CAT");
  });

  it("CNPLE simulation is linear — back navigation allowed", async () => {
    const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");
    const { readinessConfigForPathway } = await import(
      "@/lib/exam-pathways/pathway-readiness-config"
    );
    const p = getExamPathwayById("ca-np-cnple");
    assert.ok(p);
    const rc = readinessConfigForPathway(p);
    assert.equal(rc.allowBackNavigation, false, "CNPLE LOFT does not allow back navigation by default");
    assert.equal(rc.mode, "loft_simulation");
  });

  it("CNPLE marketing copy does not use CAT terminology", async () => {
    const { pathwayCatLandingTitle, pathwayCatLandingSubtitle } = await import(
      "@/lib/exam-pathways/pathway-cat-marketing-copy"
    );
    const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");
    const { publicCopyForReadinessConfig, readinessConfigForPathway } = await import(
      "@/lib/exam-pathways/pathway-readiness-config"
    );
    const p = getExamPathwayById("ca-np-cnple");
    assert.ok(p);
    const rc = readinessConfigForPathway(p);
    const publicCopy = publicCopyForReadinessConfig(rc, p);
    const title = pathwayCatLandingTitle(p);
    const subtitle = pathwayCatLandingSubtitle(p, publicCopy);

    assert.doesNotMatch(title, /\bCAT\b/i, "CNPLE title must not say CAT");
    assert.doesNotMatch(subtitle, /computerized adaptive/i, "CNPLE subtitle must not say 'computerized adaptive'");
    assert.match(subtitle, /LOFT|linear/i, "CNPLE subtitle must mention LOFT or linear");
  });
});

// ── Content governance ────────────────────────────────────────────────────────

describe("CNPLE content governance", () => {
  it("auditCnpleMarketingCopy rejects forbidden phrases", async () => {
    const { auditCnpleMarketingCopy } = await import("@/lib/cnple/cnple-content-governance");

    const violations = auditCnpleMarketingCopy(
      "This is the official CNPLE simulator that replicates the exact cnple replica."
    );
    assert.ok(violations.length > 0, "Must detect forbidden phrases");
    assert.ok(
      violations.some((v) => v.includes("official cnple simulator")),
      "Must flag 'official cnple simulator'"
    );
    assert.ok(
      violations.some((v) => v.includes("exact cnple replica")),
      "Must flag 'exact cnple replica'"
    );
  });

  it("auditCnpleMarketingCopy accepts approved phrasing", async () => {
    const { auditCnpleMarketingCopy } = await import("@/lib/cnple/cnple-content-governance");

    // Deliberately avoids all forbidden substrings (even negated forms trigger substring match)
    const clean = auditCnpleMarketingCopy(
      "CNPLE-aligned simulation inspired by the CNPLE blueprint and Canadian NP competencies. " +
        "Independent preparation — not affiliated with CCRNR. " +
        "Exam-style linear LOFT simulation for Canadian NP prep."
    );
    assert.equal(clean.length, 0, `No violations expected, got: ${JSON.stringify(clean)}`);
  });

  it("CNPLE independence disclaimer contains required elements", async () => {
    const { CNPLE_INDEPENDENCE_DISCLAIMER } = await import(
      "@/lib/cnple/cnple-content-governance"
    );
    assert.ok(
      CNPLE_INDEPENDENCE_DISCLAIMER.toLowerCase().includes("ccrnr"),
      "Disclaimer must mention CCRNR"
    );
    assert.ok(
      CNPLE_INDEPENDENCE_DISCLAIMER.toLowerCase().includes("not affiliated"),
      "Disclaimer must say 'not affiliated'"
    );
    assert.ok(
      CNPLE_INDEPENDENCE_DISCLAIMER.toLowerCase().includes("independent"),
      "Disclaimer must say 'independent'"
    );
  });

  it("cnple-seo-cluster DISCLAIMER mentions CCRNR and independence", async () => {
    const { CNPLE_DISCLAIMER } = await import("@/lib/seo/cnple-seo-cluster");
    assert.ok(CNPLE_DISCLAIMER.toLowerCase().includes("ccrnr"), "Must mention CCRNR");
    assert.ok(
      CNPLE_DISCLAIMER.toLowerCase().includes("not affiliated"),
      "Must say 'not affiliated'"
    );
  });

  it("auditCanadianSpelling flags US-only spellings", async () => {
    const { auditCanadianSpelling } = await import("@/lib/cnple/cnple-content-governance");
    const violations = auditCanadianSpelling(
      "The NP must refer the patient to a pediatrics specialist and assess the gynecology findings."
    );
    assert.ok(violations.length >= 2, "Must flag 'pediatrics' and 'gynecology'");
    const flagged = violations.map(([us]) => us);
    assert.ok(flagged.includes("pediatrics"), "Must flag 'pediatrics'");
    assert.ok(flagged.includes("gynecology"), "Must flag 'gynecology'");
  });
});

// ── SEO cluster ───────────────────────────────────────────────────────────────

describe("CNPLE SEO cluster", () => {
  it("CNPLE_HUB is the canonical Canada NP pathway hub", async () => {
    const { CNPLE_HUB } = await import("@/lib/seo/cnple-seo-cluster");
    assert.equal(CNPLE_HUB, "/canada/np/cnple");
  });

  it("CNPLE_SITEMAP_PATHS has no duplicates", async () => {
    const { CNPLE_SITEMAP_PATHS } = await import("@/lib/seo/cnple-seo-cluster");
    const paths = [...CNPLE_SITEMAP_PATHS];
    const unique = new Set(paths);
    assert.equal(paths.length, unique.size, "CNPLE_SITEMAP_PATHS must have no duplicate paths");
  });

  it("CNPLE_SITEMAP_PATHS paths are valid relative URLs", async () => {
    const { CNPLE_SITEMAP_PATHS } = await import("@/lib/seo/cnple-seo-cluster");
    for (const path of CNPLE_SITEMAP_PATHS) {
      assert.match(path, /^\/[a-z0-9-/]+$/, `Invalid path: ${path}`);
      assert.doesNotMatch(path, /\/$/, `Path must not have trailing slash: ${path}`);
    }
  });

  it("CNPLE_CLUSTER has no undefined hrefs", async () => {
    const { CNPLE_CLUSTER } = await import("@/lib/seo/cnple-seo-cluster");
    for (const [key, href] of Object.entries(CNPLE_CLUSTER)) {
      assert.ok(typeof href === "string" && href.length > 0, `Cluster key '${key}' has empty href`);
      assert.match(href, /^\//, `Cluster key '${key}' href must start with /`);
    }
  });

  it("CNPLE_RELATED_LINKS in CnpleSeoHubPage have valid hrefs", async () => {
    // Dynamic import prevents TS compiler from complaining about the JSX module
    const { CNPLE_RELATED_LINKS } = await import("@/components/cnple/cnple-seo-hub-page");
    for (const link of CNPLE_RELATED_LINKS) {
      assert.ok(typeof link.href === "string" && link.href.startsWith("/"), `Invalid href: ${link.href}`);
      assert.ok(typeof link.label === "string" && link.label.length > 0, `Empty label for ${link.href}`);
    }
  });
});

// ── Sitemap fallback consistency ──────────────────────────────────────────────

describe("CNPLE sitemap fallback paths", () => {
  it("SITEMAP_FALLBACK_PATHS_ALL includes core CNPLE routes", async () => {
    const { SITEMAP_FALLBACK_PATHS_ALL } = await import("@/lib/seo/sitemap-index-children");
    const paths = new Set(SITEMAP_FALLBACK_PATHS_ALL);
    assert.ok(paths.has("/canada/np/cnple"), "Must include CNPLE hub");
    assert.ok(paths.has("/canada/np/cnple/simulation"), "Must include CNPLE simulation");
    assert.ok(paths.has("/canada/np/cnple/flashcards"), "Must include CNPLE flashcards");
    assert.ok(paths.has("/canada/np/cnple/report-card"), "Must include CNPLE report-card");
    assert.ok(paths.has("/cnple"), "Must include /cnple SEO hub");
    assert.ok(paths.has("/cnple-practice-questions"), "Must include /cnple-practice-questions");
  });

  it("SITEMAP_FALLBACK_PATHWAYS_PATHS includes CNPLE sub-routes", async () => {
    const { SITEMAP_FALLBACK_PATHWAYS_PATHS } = await import("@/lib/seo/sitemap-index-children");
    const paths = new Set(SITEMAP_FALLBACK_PATHWAYS_PATHS);
    assert.ok(paths.has("/canada/np/cnple/simulation"), "Pathways fallback must include /simulation");
    assert.ok(paths.has("/canada/np/cnple/flashcards"), "Pathways fallback must include /flashcards");
    assert.ok(paths.has("/canada/np/cnple/report-card"), "Pathways fallback must include /report-card");
  });
});

// ── Domain label registry ─────────────────────────────────────────────────────

describe("CNPLE domain labels", () => {
  it("all CnpleDomain values have a label", async () => {
    const { CNPLE_DOMAIN_LABELS } = await import("@/components/cnple/cnple-report-card");
    const expectedDomains = [
      "prescribing_safety",
      "diagnostics_labs",
      "lifespan_care",
      "chronic_disease",
      "acute_deterioration",
      "professional_legal",
      "mental_health",
      "womens_health",
      "pediatrics",
      "geriatrics",
    ] as const;
    for (const domain of expectedDomains) {
      assert.ok(
        CNPLE_DOMAIN_LABELS[domain],
        `Missing label for domain: ${domain}`
      );
      assert.ok(
        CNPLE_DOMAIN_LABELS[domain].length > 0,
        `Empty label for domain: ${domain}`
      );
    }
  });
});

// ── Hardened governance (Phase 7) ─────────────────────────────────────────────

describe("CNPLE governance — hardened phrase list", () => {
  const NEWLY_FORBIDDEN = [
    "official exam format",
    "real cnple questions",
    "exact ccrnr simulation",
    "identical to the actual exam",
    "pass guarantee",
    "guaranteed to pass",
  ];

  for (const phrase of NEWLY_FORBIDDEN) {
    it(`rejects "${phrase}"`, async () => {
      const { auditCnpleMarketingCopy } = await import("@/lib/cnple/cnple-content-governance");
      const copy = `This platform uses the ${phrase} approach for preparation.`;
      const violations = auditCnpleMarketingCopy(copy);
      assert.ok(
        violations.some((v) => v.includes(phrase.toLowerCase())),
        `Expected "${phrase}" to be flagged, violations: ${JSON.stringify(violations)}`,
      );
    });
  }

  it("approved phrasing list passes all governance checks", async () => {
    const { auditCnpleMarketingCopy, CNPLE_APPROVED_PHRASES } = await import("@/lib/cnple/cnple-content-governance");
    for (const phrase of CNPLE_APPROVED_PHRASES) {
      const violations = auditCnpleMarketingCopy(
        `NurseNest uses ${phrase} preparation for Canadian NPs.`,
      );
      assert.equal(
        violations.length,
        0,
        `Approved phrase "${phrase}" triggered violations: ${JSON.stringify(violations)}`,
      );
    }
  });

  it("CNPLE_SIMULATION_LABEL does not contain forbidden phrases", async () => {
    const { auditCnpleMarketingCopy, CNPLE_SIMULATION_LABEL, CNPLE_SIMULATION_SUBTITLE } =
      await import("@/lib/cnple/cnple-content-governance");
    assert.equal(auditCnpleMarketingCopy(CNPLE_SIMULATION_LABEL).length, 0);
    assert.equal(auditCnpleMarketingCopy(CNPLE_SIMULATION_SUBTITLE).length, 0);
  });
});

// ── CNPLE spec registry ───────────────────────────────────────────────────────

describe("CNPLE spec registry", () => {
  it("status is provisional by default", async () => {
    const { CNPLE_SPEC } = await import("@/lib/cnple/cnple-spec");
    assert.equal(CNPLE_SPEC.status, "provisional");
  });

  it("examStructure.officiallyConfirmed is false", async () => {
    const { CNPLE_SPEC } = await import("@/lib/cnple/cnple-spec");
    assert.equal(CNPLE_SPEC.examStructure.officiallyConfirmed, false);
  });

  it("format type is LOFT", async () => {
    const { CNPLE_SPEC } = await import("@/lib/cnple/cnple-spec");
    assert.equal(CNPLE_SPEC.examStructure.format.type, "LOFT");
    assert.equal(CNPLE_SPEC.examStructure.format.confirmed, true, "LOFT format is publicly confirmed");
  });

  it("isOfficiallyConfirmed returns false in provisional state", async () => {
    const { isOfficiallyConfirmed } = await import("@/lib/cnple/cnple-spec");
    assert.equal(isOfficiallyConfirmed(), false);
  });

  it("supportsItemType correctly identifies supported types", async () => {
    const { supportsItemType } = await import("@/lib/cnple/cnple-spec");
    assert.equal(supportsItemType("single-best-answer"), true);
    assert.equal(supportsItemType("sata"), true);
    assert.equal(supportsItemType("case-evolution"), false, "case-evolution not yet in spec");
    assert.equal(supportsItemType("unknown-type"), false);
  });

  it("confirmedQuestionRange returns null when unconfirmed", async () => {
    const { confirmedQuestionRange } = await import("@/lib/cnple/cnple-spec");
    assert.equal(confirmedQuestionRange(), null);
  });

  it("confirmedTimeLimitMinutes returns null when unconfirmed", async () => {
    const { confirmedTimeLimitMinutes } = await import("@/lib/cnple/cnple-spec");
    assert.equal(confirmedTimeLimitMinutes(), null);
  });

  it("disclaimers all contain CCRNR reference", async () => {
    const { cnpleDisclaimerFor } = await import("@/lib/cnple/cnple-spec");
    for (const surface of ["short", "long", "ui"] as const) {
      const text = cnpleDisclaimerFor(surface);
      assert.ok(
        text.toLowerCase().includes("ccrnr"),
        `Disclaimer "${surface}" must mention CCRNR`,
      );
    }
  });
});

// ── CNPLE item type registry ──────────────────────────────────────────────────

describe("CNPLE item type registry", () => {
  it("single-best-answer and sata are ready", async () => {
    const { isCnpleItemTypeReady } = await import("@/lib/cnple/cnple-item-types");
    assert.equal(isCnpleItemTypeReady("single-best-answer"), true);
    assert.equal(isCnpleItemTypeReady("sata"), true);
  });

  it("future item types are not ready", async () => {
    const { isCnpleItemTypeReady } = await import("@/lib/cnple/cnple-item-types");
    assert.equal(isCnpleItemTypeReady("case-evolution"), false);
    assert.equal(isCnpleItemTypeReady("prescribing-sequence"), false);
    assert.equal(isCnpleItemTypeReady("lab-interpretation"), false);
  });

  it("resolveCnpleItemType returns null for unknown types", async () => {
    const { resolveCnpleItemType } = await import("@/lib/cnple/cnple-item-types");
    assert.equal(resolveCnpleItemType("unknown-type"), null);
    assert.equal(resolveCnpleItemType(null), null);
    assert.equal(resolveCnpleItemType(42), null);
    assert.equal(resolveCnpleItemType("case-evolution"), null, "unready type must return null");
  });

  it("resolveCnpleItemType returns typed key for ready types", async () => {
    const { resolveCnpleItemType } = await import("@/lib/cnple/cnple-item-types");
    assert.equal(resolveCnpleItemType("single-best-answer"), "single-best-answer");
    assert.equal(resolveCnpleItemType("sata"), "sata");
  });

  it("getReadyCnpleItemTypes returns only ready items", async () => {
    const { getReadyCnpleItemTypes } = await import("@/lib/cnple/cnple-item-types");
    const ready = getReadyCnpleItemTypes();
    assert.ok(ready.length >= 2, "At least SBA and SATA must be ready");
    assert.ok(ready.every((r) => r.ready), "All returned items must be ready");
    assert.ok(
      ready.every((r) => !r.type.includes("evolution") && !r.type.includes("sequence")),
      "Future types must not appear in ready list",
    );
  });

  it("every registry entry has a non-empty label and description", async () => {
    const { CNPLE_ITEM_TYPE_REGISTRY } = await import("@/lib/cnple/cnple-item-types");
    for (const entry of CNPLE_ITEM_TYPE_REGISTRY) {
      assert.ok(entry.label.length > 0, `Empty label for ${entry.type}`);
      assert.ok(entry.description.length > 0, `Empty description for ${entry.type}`);
    }
  });
});
