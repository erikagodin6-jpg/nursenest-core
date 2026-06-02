import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import {
  ALLIED_READINESS_MANIFEST,
  getAlliedReadinessAverage,
  getAlliedReadinessByProfessionKey,
  listAlliedReadinessBelow,
} from "@/lib/allied/allied-readiness-manifest";

const REQUIRED_DOMAIN_KEYS = [
  "coreCurriculum",
  "dedicatedCatalog",
  "seoCoverage",
  "assessmentReadiness",
  "simulationReadiness",
  "remediationReadiness",
] as const;

const REQUIRED_MINIMUM_AVERAGE = 98;
const REQUIRED_MINIMUM_ENTRY_PERCENT = 95;

describe("Allied readiness manifest", () => {
  it("has unique entries that map to registered allied professions", () => {
    const professionKeys = new Set(ALLIED_PROFESSIONS.map((profession) => profession.professionKey));
    const seen = new Set<string>();

    for (const entry of ALLIED_READINESS_MANIFEST) {
      assert.ok(!seen.has(entry.professionKey), `duplicate readiness entry for ${entry.professionKey}`);
      seen.add(entry.professionKey);
      assert.ok(professionKeys.has(entry.professionKey), `${entry.professionKey} is missing from ALLIED_PROFESSIONS`);
    }
  });

  it("keeps every tracked allied profession at or above the maturity floor", () => {
    const belowFloor = listAlliedReadinessBelow(REQUIRED_MINIMUM_ENTRY_PERCENT);
    assert.deepEqual(
      belowFloor.map((entry) => `${entry.professionKey}:${entry.percentComplete}`),
      [],
    );
  });

  it("keeps ecosystem average at enterprise-readiness threshold", () => {
    assert.ok(
      getAlliedReadinessAverage() >= REQUIRED_MINIMUM_AVERAGE,
      `expected allied readiness average >= ${REQUIRED_MINIMUM_AVERAGE}%, got ${getAlliedReadinessAverage()}%`,
    );
  });

  it("enforces status-to-percentage consistency", () => {
    for (const entry of ALLIED_READINESS_MANIFEST) {
      assert.ok(Number.isInteger(entry.percentComplete), `${entry.professionKey} percent must be an integer`);
      assert.ok(entry.percentComplete >= 0 && entry.percentComplete <= 100, `${entry.professionKey} percent out of range`);

      if (entry.status === "complete") {
        assert.equal(entry.percentComplete, 100, `${entry.professionKey} complete status must be 100%`);
      }

      if (entry.status === "near_complete") {
        assert.ok(entry.percentComplete >= 95, `${entry.professionKey} near_complete status must be >=95%`);
      }

      if (entry.status === "mature") {
        assert.ok(entry.percentComplete >= 80, `${entry.professionKey} mature status must be >=80%`);
      }
    }
  });

  it("has complete domain scores, strengths, and explicit remaining gaps", () => {
    for (const entry of ALLIED_READINESS_MANIFEST) {
      assert.ok(entry.strengths.length >= 3, `${entry.professionKey} needs at least 3 strengths`);
      assert.ok(entry.remainingGaps.length >= 1, `${entry.professionKey} needs at least 1 remaining gap`);

      for (const domainKey of REQUIRED_DOMAIN_KEYS) {
        const score = entry.domains[domainKey];
        assert.ok(Number.isInteger(score), `${entry.professionKey}.${domainKey} must be an integer`);
        assert.ok(score >= 0 && score <= 100, `${entry.professionKey}.${domainKey} out of range`);
      }
    }
  });

  it("supports direct profession lookup and threshold filtering", () => {
    assert.equal(getAlliedReadinessByProfessionKey("respiratory")?.percentComplete, 100);
    assert.equal(getAlliedReadinessByProfessionKey("not-a-profession"), undefined);
    assert.equal(listAlliedReadinessBelow(95).length, 0);
  });
});
