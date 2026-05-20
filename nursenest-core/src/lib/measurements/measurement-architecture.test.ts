import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertClinicalMeasurement } from "@/lib/measurements/convert-clinical-measurement";
import { formatMeasurementFromSi } from "@/lib/measurements/format-measurement";
import {
  getPathwayInstructionalSystem,
  getPathwayMeasurementPolicy,
} from "@/lib/measurements/pathway-measurement-policy";
import {
  lintMeasurementTokensInText,
  parseCanonicalMeasurementToken,
  resolveCanonicalTokensWithProvenance,
} from "@/lib/measurements/measurement-token-governance";
import {
  resolveMeasurementRenderContext,
  resolveRenderedMeasurementSystem,
} from "@/lib/measurements/resolve-measurement-context";
import {
  resolveMeasurementTokens,
  resolveMeasurementTokensDetailed,
} from "@/lib/measurements/measurement-tokens";

describe("pathway instructional measurement policy", () => {
  it("assigns explicit instructional systems per pathway", () => {
    assert.equal(getPathwayInstructionalSystem("us-rn-nclex-rn"), "conventional");
    assert.equal(getPathwayInstructionalSystem("ca-rpn-rex-pn"), "si");
    assert.equal(getPathwayInstructionalSystem("ca-np-cnple"), "si");
    assert.equal(getPathwayInstructionalSystem("ca-rn-nclex-rn"), "si");
  });

  it("keeps instructional system when learner prefers conventional on SI pathway", () => {
    const ctx = resolveMeasurementRenderContext({
      pathwayId: "ca-rpn-rex-pn",
      countryCode: "CA",
      preference: "imperial",
    });
    assert.equal(ctx.instructionalSystem, "si");
    assert.equal(ctx.renderedSystem, "conventional");
    assert.equal(ctx.legacyRenderedSystem, "US");
    assert.equal(ctx.preferenceApplied, true);
  });
});

describe("convertClinicalMeasurement — clinical rounding", () => {
  it("formats glucose 5.6 mmol/L to 101 mg/dL (not excessive precision)", () => {
    const r = convertClinicalMeasurement({
      valueSi: 5.6,
      category: "glucose",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(r.displayPrimary, "101 mg/dL");
    assert.equal(r.renderedPrimaryValue, 101);
  });

  it("formats potassium in mmol/L for both systems", () => {
    const r = convertClinicalMeasurement({
      valueSi: 3.2,
      category: "electrolytes",
      kind: "potassium",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(r.displayPrimary, "3.2 mmol/L");
  });

  it("formats sodium with mEq/L label", () => {
    const r = convertClinicalMeasurement({
      valueSi: 140,
      category: "electrolytes",
      kind: "sodium",
      authoredSystem: "si",
      renderedSystem: "si",
    });
    assert.match(r.displayPrimary, /140.*mEq\/L/);
  });

  it("formats creatinine µmol/L and mg/dL", () => {
    const si = convertClinicalMeasurement({
      valueSi: 88,
      category: "electrolytes",
      kind: "creatinine",
      authoredSystem: "si",
      renderedSystem: "si",
    });
    assert.equal(si.displayPrimary, "88 µmol/L");
    const us = convertClinicalMeasurement({
      valueSi: 88,
      category: "electrolytes",
      kind: "creatinine",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(us.displayPrimary, "1.00 mg/dL");
  });

  it("formats hemoglobin g/L vs g/dL", () => {
    const us = convertClinicalMeasurement({
      valueSi: 130,
      category: "hematology",
      kind: "hemoglobin",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(us.displayPrimary, "13.0 g/dL");
  });

  it("formats temperature and pediatric weight", () => {
    const temp = convertClinicalMeasurement({
      valueSi: 38.5,
      category: "temperature",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(temp.displayPrimary, "101.3°F");
    const wt = convertClinicalMeasurement({
      valueSi: 12,
      category: "pediatric_dosing",
      kind: "weight",
      authoredSystem: "si",
      renderedSystem: "conventional",
    });
    assert.equal(wt.displayPrimary, "26.5 lb");
  });

  it("blocks dual equivalent for high-risk drug_dosage", () => {
    const r = convertClinicalMeasurement({
      valueSi: 5.6,
      category: "drug_dosage",
      kind: "glucose",
      authoredSystem: "si",
      renderedSystem: "conventional",
      options: { showEducationalEquivalent: true },
    });
    assert.equal(r.dualShown, false);
    assert.equal(r.displaySecondary, null);
  });
});

describe("canonical measurement tokens", () => {
  it("parses [[glucose:5.6:mmol/L]]", () => {
    const p = parseCanonicalMeasurementToken("glucose", "5.6", "mmol/L");
    assert.ok(!("error" in p));
    if ("measurement" in p) {
      assert.equal(p.measurement.valueSi, 5.6);
      assert.equal(p.measurement.authoredSystem, "si");
    }
  });

  it("rejects unknown units", () => {
    const p = parseCanonicalMeasurementToken("glucose", "5.6", "stones");
    assert.ok("error" in p);
  });

  it("renders canonical tokens under SI and conventional", () => {
    const text = "Fasting glucose [[glucose:5.6:mmol/L]] is elevated.";
    const si = resolveCanonicalTokensWithProvenance(text, "si", "si");
    assert.match(si.output, /5\.6 mmol\/L/);
    const conv = resolveCanonicalTokensWithProvenance(text, "conventional", "si");
    assert.match(conv.output, /101 mg\/dL/);
  });

  it("lint returns no errors for valid tokens", () => {
    const errs = lintMeasurementTokensInText("Level [[potassium:5.8:mmol/L]]");
    assert.equal(errs.length, 0);
  });
});

describe("legacy token snapshots", () => {
  const stem = "Normal glucose {{glucose_normal}} and K+ {{potassium_normal_si}}.";

  it("renders under SI", () => {
    const out = resolveMeasurementTokens(stem, "SI", { pathwayId: "ca-rpn-rex-pn" });
    assert.match(out, /mmol\/L/);
    assert.doesNotMatch(out, /\{\{/);
  });

  it("renders under conventional", () => {
    const out = resolveMeasurementTokens(stem, "US", { pathwayId: "us-rn-nclex-rn" });
    assert.match(out, /mg\/dL|mmol\/L/);
    assert.doesNotMatch(out, /\{\{/);
  });

  it("does not double-convert unknown legacy tokens", () => {
    const { text, errors } = resolveMeasurementTokensDetailed("Value {{unknown_token_xyz}}.", "SI");
    assert.match(text, /\{\{unknown_token_xyz\}\}/);
    assert.equal(errors.length, 0);
  });
});

describe("resolveRenderedMeasurementSystem", () => {
  it("defaults NCLEX US to conventional without preference", () => {
    assert.equal(
      resolveRenderedMeasurementSystem({
        pathwayId: "us-rn-nclex-rn",
        countryCode: "US",
      }),
      "US",
    );
  });

  it("defaults REx-PN to SI without preference", () => {
    assert.equal(
      resolveRenderedMeasurementSystem({
        pathwayId: "ca-rpn-rex-pn",
        countryCode: "CA",
      }),
      "SI",
    );
  });
});

describe("formatMeasurementFromSi back-compat", () => {
  it("matches governed glucose conversion", () => {
    assert.equal(formatMeasurementFromSi(5.6, "glucose", "US"), "101 mg/dL");
    assert.equal(formatMeasurementFromSi(5.6, "glucose", "SI"), "5.6 mmol/L");
  });
});

describe("pathway policy metadata", () => {
  it("exposes measurement context for analytics", () => {
    const p = getPathwayMeasurementPolicy("ca-np-cnple", "CA");
    assert.equal(p.measurementContext, "canada");
    assert.equal(p.instructionalSystem, "si");
    assert.equal(p.examLabel, "CNPLE");
  });
});
