/**
 * CNPLE content quality guardrail tests.
 *
 * Run: `npx tsx --test src/lib/np/cnple-content-quality-guardrails.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  auditCnpleContent,
  validateCnpleContent,
  auditCnpleContentBlocks,
} from "@/lib/np/cnple-content-quality-guardrails";

// ── CAT language ──────────────────────────────────────────────────────────────

describe("CNPLE guardrail: CAT language", () => {
  it("flags CNPLE is CAT phrasing", () => {
    const r = auditCnpleContent("CNPLE is a CAT exam for Canadian NPs.");
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.ok(r.violations.some((v) => v.code === "cnple_cat_language"), `codes: ${r.violations.map((v) => v.code).join(", ")}`);
    }
  });

  it("flags CAT format for CNPLE phrasing", () => {
    const r = auditCnpleContent("CAT format sessions for CNPLE preparation are available here.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_cat_language"));
  });

  it("flags 'computerized adaptive' in CNPLE content", () => {
    const r = auditCnpleContent("CNPLE computerized adaptive testing format.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_cat_language"));
  });

  it("does not flag standalone CAT language unrelated to CNPLE", () => {
    // CAT is fine for US NP — pattern only fires on CNPLE+CAT pairing.
    const r = auditCnpleContent("FNP candidates use our CAT adaptive sessions for NCLEX-style NP board prep.");
    assert.equal(r.ok, true);
  });

  it("does not flag 'not CAT' explanatory copy", () => {
    // "CNPLE-style simulation uses an exam-like linear format, not CAT" is correct copy.
    const r = auditCnpleContent("CNPLE-style simulation uses an exam-like linear format, not CAT.");
    assert.equal(r.ok, true);
  });
});

// ── AANP/ANCC framing ─────────────────────────────────────────────────────────

describe("CNPLE guardrail: AANP/ANCC framing", () => {
  it("flags AANP mentioned near CNPLE", () => {
    const r = auditCnpleContent("The CNPLE is aligned with AANP standards for NP competency.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_aanp_ancc_framing"));
  });

  it("flags ANCC mentioned near Canadian NP licensure", () => {
    const r = auditCnpleContent("Canadian NP licensure exam uses ANCC exam format questions.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_aanp_ancc_framing"));
  });

  it("allows AANP in isolation without CNPLE context", () => {
    const r = auditCnpleContent("US nurses preparing for AANP FNP certification should practise adaptive questions.");
    assert.equal(r.ok, true);
  });
});

// ── Fake official stats ───────────────────────────────────────────────────────

describe("CNPLE guardrail: fake official stats", () => {
  it("flags fake item count claim", () => {
    const r = auditCnpleContent("The CNPLE has exactly 200 questions on the exam.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_official_stats"));
  });

  it("flags fake passing score claim with exam name prefix", () => {
    const r = auditCnpleContent("The CNPLE passing score is 75% of the total.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_official_stats"));
  });

  it("flags fake passing mark with Canadian NP exam prefix", () => {
    const r = auditCnpleContent("Canadian NP exam passing mark is 70% to pass.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_official_stats"));
  });
});

// ── Fake blueprint percentage ─────────────────────────────────────────────────

describe("CNPLE guardrail: fake blueprint percentage", () => {
  it("flags '30% of the CNPLE' domain claim", () => {
    const r = auditCnpleContent("30% of the CNPLE is dedicated to pharmacology.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_blueprint_percentage"));
  });

  it("flags percentage weighting tied to CNPLE", () => {
    const r = auditCnpleContent("Pharmacology has 25% weighting on the CNPLE blueprint.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_blueprint_percentage"));
  });

  it("flags '30% of the blueprint'", () => {
    const r = auditCnpleContent("This topic covers 30% of the blueprint.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_fake_blueprint_percentage"));
  });

  it("does not flag general percentage statements unrelated to CNPLE", () => {
    const r = auditCnpleContent("Approximately 30% of Canadians have hypertension.");
    assert.equal(r.ok, true);
  });
});

// ── Official question claims ──────────────────────────────────────────────────

describe("CNPLE guardrail: official question claim", () => {
  it("flags 'official CNPLE questions'", () => {
    const r = auditCnpleContent("These are official CNPLE questions from the 2026 exam pool.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_official_question_claim"));
  });

  it("flags 'guaranteed to match the CNPLE'", () => {
    const r = auditCnpleContent("Our questions are guaranteed to match the CNPLE exam.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_official_question_claim"));
  });

  it("allows 'CNPLE-aligned practice'", () => {
    const r = auditCnpleContent("Practise with CNPLE-aligned clinical judgment questions.");
    assert.equal(r.ok, true);
  });

  it("allows 'CNPLE-style simulation'", () => {
    const r = auditCnpleContent("Use CNPLE-style simulation for exam readiness.");
    assert.equal(r.ok, true);
  });
});

// ── US-only guideline framing ─────────────────────────────────────────────────

describe("CNPLE guardrail: US-only guidelines without Canadian qualifier", () => {
  it("flags USPSTF cited as authority (without US-specific exemption)", () => {
    const r = auditCnpleContent("Follow USPSTF screening recommendations for colorectal cancer.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_us_only_guideline"));
  });

  it("flags bare HIPAA reference in CNPLE content", () => {
    const r = auditCnpleContent("Maintain HIPAA compliance when documenting patient records.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_us_only_guideline"));
  });

  it("does not flag USPSTF when explicitly marked as US-specific", () => {
    const r = auditCnpleContent("The USPSTF (US-specific guideline) differs from the Canadian Task Force recommendation.");
    assert.equal(r.ok, true);
  });

  it("does not flag USPSTF when explicitly contrasted with Canadian guidance", () => {
    const r = auditCnpleContent("Note: USPSTF is not applicable in Canada — follow the Canadian Task Force instead.");
    assert.equal(r.ok, true);
  });
});

// ── Placeholder text ──────────────────────────────────────────────────────────

describe("CNPLE guardrail: placeholder text", () => {
  it("flags TODO placeholder", () => {
    const r = auditCnpleContent("TODO: add CNPLE lesson content here.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_placeholder_text"));
  });

  it("flags lorem ipsum", () => {
    const r = auditCnpleContent("Lorem ipsum dolor sit amet in this CNPLE lesson.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.violations.some((v) => v.code === "cnple_placeholder_text"));
  });
});

// ── Clean content passes ──────────────────────────────────────────────────────

describe("CNPLE guardrail: clean content passes all checks", () => {
  it("accepts correct CNPLE-style simulation copy including 'not CAT' explanation", () => {
    const r = auditCnpleContent(
      "Prepare for the Canadian Nurse Practitioner Licensure Examination. " +
        "Practice clinical judgment across lifespan, primary care, prescribing, diagnostics, and professional practice. " +
        "CNPLE-style simulation uses an exam-like linear format, not CAT. " +
        "Built for Canada's single-classification NP model.",
    );
    assert.equal(r.ok, true);
  });

  it("accepts Canadian guideline references", () => {
    const r = auditCnpleContent(
      "Follow Hypertension Canada guidelines for blood pressure management. " +
        "Reference the Canadian Task Force on Preventive Health Care for screening recommendations. " +
        "Apply PIPEDA and provincial privacy legislation.",
    );
    assert.equal(r.ok, true);
  });

  it("accepts practice mode rationale copy", () => {
    const r = auditCnpleContent(
      "Rationales and linked remediation are available in Practice Mode. " +
        "CNPLE simulation mode suppresses per-item rationales until the session review.",
    );
    assert.equal(r.ok, true);
  });
});

// ── validateCnpleContent (strict mode) ───────────────────────────────────────

describe("validateCnpleContent strict mode", () => {
  it("returns ok:false with code on first violation", () => {
    const r = validateCnpleContent("CNPLE is a CAT exam with 200 questions.");
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(typeof r.code === "string" && r.code.length > 0);
  });

  it("returns ok:true for clean text", () => {
    const r = validateCnpleContent("Prepare for the CNPLE with CNPLE-aligned clinical judgment practice.");
    assert.equal(r.ok, true);
  });
});

// ── auditCnpleContentBlocks (batch) ──────────────────────────────────────────

describe("auditCnpleContentBlocks batch mode", () => {
  it("returns violations only for failing blocks", () => {
    const results = auditCnpleContentBlocks([
      { id: "block-1", text: "Prepare for the CNPLE with evidence-based practice questions." },
      { id: "block-2", text: "CNPLE is a CAT exam using computerized adaptive delivery." },
      { id: "block-3", text: "Follow PIPEDA privacy requirements in all patient interactions." },
    ]);
    assert.equal(results.length, 1);
    assert.equal(results[0]!.blockId, "block-2");
    assert.ok(results[0]!.violations.some((v) => v.code === "cnple_cat_language"));
  });

  it("returns empty array when all blocks are clean", () => {
    const results = auditCnpleContentBlocks([
      { id: "a", text: "Practice CNPLE-aligned clinical judgment questions." },
      { id: "b", text: "Reference Hypertension Canada and Diabetes Canada guidelines." },
    ]);
    assert.equal(results.length, 0);
  });
});
