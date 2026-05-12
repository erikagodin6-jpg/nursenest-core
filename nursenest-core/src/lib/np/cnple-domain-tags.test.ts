/**
 * CNPLE domain tag registry tests.
 *
 * Run: `npx tsx --test src/lib/np/cnple-domain-tags.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CNPLE_DOMAINS,
  CNPLE_DOMAIN_SLUGS,
  getCnpleDomain,
  isValidCnpleDomainSlug,
  type CnpleDomainSlug,
} from "@/lib/np/cnple-domain-tags";
import {
  CNPLE_QUESTION_FAMILIES,
  getCnpleQuestionFamily,
  isValidCnpleQuestionFamilySlug,
} from "@/lib/np/cnple-question-families";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";

// ── Pathway-level assertions ──────────────────────────────────────────────────

describe("CNPLE pathway definition", () => {
  const pathway = getExamPathwayById("ca-np-cnple");

  it("ca-np-cnple pathway exists in registry", () => {
    assert.ok(pathway, "ca-np-cnple must be registered");
  });

  it("CNPLE is not categorised as CAT exam", () => {
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    assert.notEqual(rc.engineType, "CAT", "CNPLE must not use CAT engine type");
    assert.equal(rc.engineType, "LOFT", "CNPLE must use LOFT engine type");
  });

  it("CNPLE display name includes full examination name", () => {
    assert.ok(pathway);
    assert.match(pathway.displayName, /Canadian Nurse Practitioner Licensure Examination/);
  });

  it("CNPLE short name is CNPLE", () => {
    assert.ok(pathway);
    assert.equal(pathway.shortName, "CNPLE");
  });

  it("CNPLE countryCode is CA", () => {
    assert.ok(pathway);
    assert.equal(pathway.countryCode, "CA");
  });

  it("CNPLE is separate from US NP pathways", () => {
    const fnp = getExamPathwayById("us-np-fnp");
    assert.ok(fnp);
    assert.ok(pathway);
    assert.notEqual(pathway.id, fnp.id);
    assert.notEqual(pathway.countryCode, fnp.countryCode);
    // CNPLE does not share exam code or country with any US NP pathway.
    assert.equal(pathway.examCode, "cnple");
    assert.equal(fnp.examCode, "fnp");
  });
});

// ── LOFT simulation config assertions ────────────────────────────────────────

describe("CNPLE readiness config (LOFT)", () => {
  const pathway = getExamPathwayById("ca-np-cnple");

  it("LOFT mode is loft_simulation", () => {
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    assert.equal(rc.mode, "loft_simulation");
  });

  it("question range label mentions linear, not adaptive", () => {
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    assert.match(rc.questionRange, /linear/i);
    assert.doesNotMatch(rc.questionRange, /adaptive/i);
  });
});

// ── Domain taxonomy ───────────────────────────────────────────────────────────

describe("CNPLE domain registry", () => {
  it("has exactly 16 domains", () => {
    assert.equal(CNPLE_DOMAINS.length, 16);
  });

  it("all domains have non-empty slug, label, and shortLabel", () => {
    for (const d of CNPLE_DOMAINS) {
      assert.ok(d.slug.length > 0, `domain missing slug`);
      assert.ok(d.label.length > 0, `domain ${d.slug} missing label`);
      assert.ok(d.shortLabel.length > 0, `domain ${d.slug} missing shortLabel`);
    }
  });

  it("no duplicate domain slugs", () => {
    const slugs = CNPLE_DOMAINS.map((d) => d.slug);
    const unique = new Set(slugs);
    assert.equal(unique.size, slugs.length, "duplicate domain slug found");
  });

  it("getCnpleDomain returns a domain for each registered slug", () => {
    for (const d of CNPLE_DOMAINS) {
      const found = getCnpleDomain(d.slug);
      assert.ok(found, `getCnpleDomain should find domain for slug: ${d.slug}`);
      assert.equal(found!.slug, d.slug);
    }
  });

  it("getCnpleDomain returns undefined for unknown slug", () => {
    assert.equal(getCnpleDomain("not-a-real-domain"), undefined);
  });

  it("isValidCnpleDomainSlug returns true for known slugs", () => {
    const known: CnpleDomainSlug = "clinical-assessment";
    assert.equal(isValidCnpleDomainSlug(known), true);
    assert.equal(isValidCnpleDomainSlug("pharmacotherapeutics"), true);
  });

  it("isValidCnpleDomainSlug returns false for unknown slugs", () => {
    assert.equal(isValidCnpleDomainSlug("fnp-specialty"), false);
    assert.equal(isValidCnpleDomainSlug(""), false);
  });

  it("CNPLE domain slugs include all required competency areas", () => {
    const required: CnpleDomainSlug[] = [
      "clinical-assessment",
      "diagnosis-differential",
      "pharmacotherapeutics",
      "diagnostics-labs",
      "health-promotion-prevention",
      "chronic-disease-management",
      "acute-urgent-care",
      "pediatrics",
      "adult-care",
      "older-adult-care",
      "reproductive-sexual-health",
      "mental-health",
      "indigenous-health-cultural-safety",
      "ethics-legal-professional",
      "interprofessional-collaboration",
      "patient-education-shared-decision",
    ];
    for (const slug of required) {
      assert.ok(CNPLE_DOMAIN_SLUGS.has(slug), `missing required domain: ${slug}`);
    }
  });
});

// ── Question family registry ──────────────────────────────────────────────────

describe("CNPLE question family registry", () => {
  it("has exactly 10 question families", () => {
    assert.equal(CNPLE_QUESTION_FAMILIES.length, 10);
  });

  it("all families have non-empty slug, label, and description", () => {
    for (const f of CNPLE_QUESTION_FAMILIES) {
      assert.ok(f.slug.length > 0, `family missing slug`);
      assert.ok(f.label.length > 0, `family ${f.slug} missing label`);
      assert.ok(f.description.length > 20, `family ${f.slug} description too short`);
    }
  });

  it("no duplicate family slugs", () => {
    const slugs = CNPLE_QUESTION_FAMILIES.map((f) => f.slug);
    const unique = new Set(slugs);
    assert.equal(unique.size, slugs.length, "duplicate family slug found");
  });

  it("all families reference at least one valid CNPLE domain", () => {
    for (const family of CNPLE_QUESTION_FAMILIES) {
      assert.ok(family.primaryDomains.length > 0, `family ${family.slug} has no primaryDomains`);
      for (const domainSlug of family.primaryDomains) {
        assert.ok(
          isValidCnpleDomainSlug(domainSlug),
          `family ${family.slug} references unknown domain: ${domainSlug}`,
        );
      }
    }
  });

  it("getCnpleQuestionFamily returns family for known slug", () => {
    const f = getCnpleQuestionFamily("safe-prescribing-medication-management");
    assert.ok(f);
    assert.equal(f!.slug, "safe-prescribing-medication-management");
  });

  it("getCnpleQuestionFamily returns undefined for unknown slug", () => {
    assert.equal(getCnpleQuestionFamily("not-a-family"), undefined);
  });

  it("isValidCnpleQuestionFamilySlug validates correctly", () => {
    assert.equal(isValidCnpleQuestionFamilySlug("single-best-answer-clinical-judgment"), true);
    assert.equal(isValidCnpleQuestionFamilySlug("aanp-style-mcq"), false);
  });

  it("no family description claims to be official CNPLE items", () => {
    for (const f of CNPLE_QUESTION_FAMILIES) {
      assert.doesNotMatch(
        f.description,
        /official cnple|official exam|guaranteed to match|exact blueprint/i,
        `family ${f.slug} description must not claim official CNPLE status`,
      );
    }
  });

  it("no family authoring notes references AANP or ANCC as CNPLE authority", () => {
    for (const f of CNPLE_QUESTION_FAMILIES) {
      assert.doesNotMatch(
        f.authoringNotes,
        /\b(?:aanp|ancc)\b.{0,60}\b(?:cnple|canadian np)\b/i,
        `family ${f.slug} authoring notes must not conflate AANP/ANCC with CNPLE`,
      );
    }
  });
});
