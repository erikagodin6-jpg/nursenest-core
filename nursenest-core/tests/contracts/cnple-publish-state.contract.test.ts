/**
 * CNPLE publish-state contract — static gates that must pass before launch.
 *
 * These tests require no database and no browser. They verify:
 * 1. Static sample cases are structurally valid (ids, steps, domains, governance)
 * 2. Every sitemap path has a corresponding page file on disk
 * 3. No sample cases are flagged for revision
 * 4. The governance record shape is correct on all authored cases
 * 5. No questions in the static pool have missing correct-answer ids
 * 6. Sim shell has no mask-image path (Phase 4 regression guard)
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/cnple-publish-state.contract.test.ts
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CNPLE_SAMPLE_CASES } from "../../src/content/cases/cnple-sample-cases.ts";
import { CNPLE_SITEMAP_PATHS } from "../../src/lib/seo/cnple-seo-cluster.ts";
import { CNPLE_DOMAINS } from "../../src/lib/np/cnple-domain-tags.ts";

const ROOT = process.cwd();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function marketingPagePath(slug: string): string {
  // Remove leading slash and construct the page.tsx path
  const clean = slug.replace(/^\//, "");
  return join(ROOT, "src/app/(marketing)/(default)", clean, "page.tsx");
}

// ─── 1. Static sample cases — structural validity ────────────────────────────

describe("CNPLE static sample cases — structural validity", () => {
  it("has at least 1 published free-tier case", () => {
    const free = CNPLE_SAMPLE_CASES.filter((c) => !c.isPremium);
    assert.ok(free.length >= 1, `Expected at least 1 free-tier case, got ${free.length}`);
  });

  it("has at least 4 premium cases", () => {
    const premium = CNPLE_SAMPLE_CASES.filter((c) => c.isPremium);
    assert.ok(
      premium.length >= 4,
      `Expected at least 4 premium cases, got ${premium.length}. Add more cases for launch.`,
    );
  });

  it("every case has a unique id", () => {
    const ids = CNPLE_SAMPLE_CASES.map((c) => c.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, `Duplicate case ids found: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`);
  });

  it("every case has at least 3 steps", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      assert.ok(
        c.steps.length >= 3,
        `Case "${c.id}" has only ${c.steps.length} steps — CNPLE cases require at least 3`,
      );
    }
  });

  it("every case stepCount matches actual steps array length", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      assert.equal(
        c.stepCount,
        c.steps.length,
        `Case "${c.id}": stepCount ${c.stepCount} does not match steps.length ${c.steps.length}`,
      );
    }
  });

  it("every step has a correctOptionId that matches an option id", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      for (const step of c.steps) {
        const q = step.question;
        const optionIds = q.options.map((o) => o.id);
        assert.ok(
          optionIds.includes(q.correctOptionId),
          `Case "${c.id}" step ${step.index}: correctOptionId "${q.correctOptionId}" not in options [${optionIds.join(", ")}]`,
        );
      }
    }
  });

  it("every step question has at least 4 options", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      for (const step of c.steps) {
        assert.ok(
          step.question.options.length >= 4,
          `Case "${c.id}" step ${step.index}: only ${step.question.options.length} options — CNPLE questions require 4`,
        );
      }
    }
  });

  it("every step has whyWrongByOptionId covering all distractors", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      for (const step of c.steps) {
        const q = step.question;
        const distractors = q.options.map((o) => o.id).filter((id) => id !== q.correctOptionId);
        for (const distractor of distractors) {
          assert.ok(
            q.whyWrongByOptionId[distractor] !== undefined,
            `Case "${c.id}" step ${step.index}: missing whyWrong explanation for distractor "${distractor}"`,
          );
        }
      }
    }
  });

  it("every step has consequencesByOptionId covering all options", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      for (const step of c.steps) {
        const q = step.question;
        for (const opt of q.options) {
          assert.ok(
            q.consequencesByOptionId[opt.id] !== undefined,
            `Case "${c.id}" step ${step.index}: missing consequence for option "${opt.id}"`,
          );
        }
      }
    }
  });

  it("every case primaryDomain is a valid CNPLE domain slug", () => {
    const validDomains = new Set(CNPLE_DOMAINS.map((d) => d.slug));
    for (const c of CNPLE_SAMPLE_CASES) {
      assert.ok(
        validDomains.has(c.primaryDomain),
        `Case "${c.id}": primaryDomain "${c.primaryDomain}" is not a valid CnpleDomainSlug`,
      );
    }
  });
});

// ─── 2. Governance records ───────────────────────────────────────────────────

describe("CNPLE static sample cases — governance records", () => {
  it("every case has a governance record", () => {
    const missing = CNPLE_SAMPLE_CASES.filter((c) => !c.governance);
    assert.equal(
      missing.length,
      0,
      `Cases missing governance records: ${missing.map((c) => c.id).join(", ")}`,
    );
  });

  it("no case has reviewStatus 'flagged'", () => {
    const flagged = CNPLE_SAMPLE_CASES.filter((c) => c.governance?.reviewStatus === "flagged");
    assert.equal(
      flagged.length,
      0,
      `Cases flagged for revision — must be resolved before launch: ${flagged.map((c) => c.id).join(", ")}`,
    );
  });

  it("no case has reviewStatus 'draft'", () => {
    const drafts = CNPLE_SAMPLE_CASES.filter((c) => c.governance?.reviewStatus === "draft");
    assert.equal(
      drafts.length,
      0,
      `Cases still in draft — must reach at least internal_review before launch: ${drafts.map((c) => c.id).join(", ")}`,
    );
  });

  it("every case governance has at least one guideline source", () => {
    for (const c of CNPLE_SAMPLE_CASES) {
      const sources = c.governance?.guidelineSources ?? [];
      assert.ok(
        sources.length >= 1,
        `Case "${c.id}": governance.guidelineSources is empty — all cases must cite at least one clinical guideline`,
      );
    }
  });
});

// ─── 3. Sitemap paths have page files ────────────────────────────────────────

describe("CNPLE sitemap paths — page files exist on disk", () => {
  for (const path of CNPLE_SITEMAP_PATHS) {
    it(`page.tsx exists for ${path}`, () => {
      const filePath = marketingPagePath(path);
      assert.ok(
        existsSync(filePath),
        `Sitemap path "${path}" has no page.tsx at ${filePath} — either add the page or remove from CNPLE_SITEMAP_PATHS`,
      );
    });
  }
});

// ─── 4. Sim shell — no mask-image regression ─────────────────────────────────

describe("CNPLE sim shell — Phase 4 regression guards", () => {
  const simShellSrc = readFileSync(
    join(ROOT, "src/components/exam/cnple-sim-shell.tsx"),
    "utf-8",
  );

  it("no CSS mask-image in sim shell (leaf logo fix from Phase 4 is intact)", () => {
    assert.doesNotMatch(
      simShellSrc,
      /maskImage|mask-image/i,
      "mask-image must not appear in cnple-sim-shell.tsx — this was removed in Phase 4 mobile fix",
    );
  });

  it("mobile patient panel toggle button exists", () => {
    assert.match(
      simShellSrc,
      /Patient Info|Patient Summary/,
      "sim shell must have a mobile-visible patient info toggle",
    );
  });

  it("flag button label is always visible (not hidden on mobile)", () => {
    // The fix removed `hidden sm:inline` from the flag label
    assert.doesNotMatch(
      simShellSrc,
      /className="hidden sm:inline"[^>]*>(?:Flagged|Flag)/,
      "Flag button label must be visible on mobile — hidden sm:inline class was removed in Phase 4",
    );
  });
});

// ─── 5. Report card — Phase 5 enhancements ───────────────────────────────────

describe("CNPLE report card — Phase 5 enhancements present", () => {
  const reportCardSrc = readFileSync(
    join(ROOT, "src/components/cnple/cnple-report-card.tsx"),
    "utf-8",
  );

  it("CnplePrescribingSafetyAlert type is exported", () => {
    assert.match(
      reportCardSrc,
      /CnplePrescribingSafetyAlert/,
      "Prescribing safety alert type must exist in report card",
    );
  });

  it("trend field is present on domain result type", () => {
    assert.match(
      reportCardSrc,
      /CnpleDomainTrend/,
      "Domain trend type must be defined on the report card",
    );
  });

  it("urgencyTier field is present on domain result type", () => {
    assert.match(
      reportCardSrc,
      /CnpleRemediationUrgency/,
      "Remediation urgency tier type must be defined on the report card",
    );
  });

  it("PrescribingSafetyAlertsPanel component is defined", () => {
    assert.match(
      reportCardSrc,
      /PrescribingSafetyAlertsPanel/,
      "PrescribingSafetyAlertsPanel component must exist",
    );
  });

  it("HighRiskWeaknessPanel component is defined", () => {
    assert.match(
      reportCardSrc,
      /HighRiskWeaknessPanel/,
      "HighRiskWeaknessPanel component must exist",
    );
  });
});

// ─── 6. Case governance type — Phase 7 ───────────────────────────────────────

describe("CNPLE case governance type — Phase 7", () => {
  const caseTypesSrc = readFileSync(
    join(ROOT, "src/lib/cases/longitudinal-case-types.ts"),
    "utf-8",
  );

  it("CaseGovernanceRecord type is defined", () => {
    assert.match(caseTypesSrc, /CaseGovernanceRecord/, "CaseGovernanceRecord must be defined in longitudinal-case-types.ts");
  });

  it("CaseReviewStatus type is defined", () => {
    assert.match(caseTypesSrc, /CaseReviewStatus/, "CaseReviewStatus must be defined");
  });

  it("PatientCase has governance field", () => {
    assert.match(caseTypesSrc, /governance\?:\s*CaseGovernanceRecord/, "PatientCase must have optional governance field");
  });
});
