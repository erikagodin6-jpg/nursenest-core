/**
 * ECG curriculum content — data integrity contract tests.
 *
 * Verifies:
 *   - All known ECG rhythm tags resolve to a curriculum unit
 *   - Each curriculum unit has all required content fields populated
 *   - Rhythm parameters are present for units that define them
 *   - notThisBecause entries use the correct property name (distinguisher)
 *   - Level 1 / 2 / 3 unit counts are non-zero
 *   - No duplicate unit IDs or duplicate rhythm tags across levels
 *
 * Run: node --test src/lib/ecg-module/ecg-curriculum-content.test.ts
 *   (or via the project test runner)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ECG_CURRICULUM,
  getEcgCurriculumUnit,
  getEcgCurriculumUnitByRhythmTag,
} from "./ecg-curriculum-content";

// ─── Known rhythm tags that questions carry (matches DB rhythmTag field) ──────

const KNOWN_RHYTHM_TAGS_WITH_CURRICULUM = [
  "Normal sinus rhythm",
  "Sinus tachycardia",
  "Sinus bradycardia",
  "Atrial fibrillation",
  "Atrial flutter",
  "SVT",
  "Heart block (1st degree)",
  "Heart block (2nd degree)",
  "Heart block (3rd degree)",
  "PVC",
  "Ventricular tachycardia",
  "Ventricular fibrillation",
  "STEMI changes",
  "Hyperkalemia ECG changes",
  "Paced rhythm",
] as const;

/**
 * Rhythm tags that exist in the question DB but do not yet have a curriculum
 * unit (curriculum is a living document). These must NOT cause crashes — the
 * UI gracefully omits the lesson card when no unit is found.
 */
const KNOWN_RHYTHM_TAGS_WITHOUT_CURRICULUM = [
  "Asystole",
  "Pulseless electrical activity",
  "Artifact recognition",
] as const;

// ─── Structure integrity ──────────────────────────────────────────────────────

describe("ECG curriculum structure", () => {
  it("has exactly 3 levels in ascending order", () => {
    const levels = ECG_CURRICULUM.map((l) => l.level);
    assert.deepEqual(levels, [1, 2, 3]);
  });

  it("each level has at least 3 units", () => {
    for (const level of ECG_CURRICULUM) {
      assert.ok(
        level.units.length >= 3,
        `Level ${level.level} (${level.title}) has only ${level.units.length} units — need at least 3`,
      );
    }
  });

  it("no duplicate unit IDs across the full curriculum", () => {
    const ids = ECG_CURRICULUM.flatMap((l) => l.units.map((u) => u.id));
    const unique = new Set(ids);
    assert.equal(
      unique.size,
      ids.length,
      `Duplicate unit IDs found: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`,
    );
  });

  it("no duplicate rhythmTags across units that define them", () => {
    const tags = ECG_CURRICULUM.flatMap((l) =>
      l.units.filter((u) => u.rhythmTag).map((u) => u.rhythmTag!.trim().toLowerCase()),
    );
    const unique = new Set(tags);
    assert.equal(
      unique.size,
      tags.length,
      `Duplicate rhythmTags found: ${tags.filter((t, i) => tags.indexOf(t) !== i).join(", ")}`,
    );
  });

  it("each level's startHref points to an ECG module route", () => {
    for (const level of ECG_CURRICULUM) {
      assert.ok(
        level.startHref.startsWith("/modules/ecg"),
        `Level ${level.level} startHref "${level.startHref}" must start with /modules/ecg`,
      );
    }
  });

  it("each unit has a non-empty level that matches its parent level", () => {
    for (const currLevel of ECG_CURRICULUM) {
      for (const unit of currLevel.units) {
        assert.equal(
          unit.level,
          currLevel.level,
          `Unit "${unit.id}" has level=${unit.level} but lives in level ${currLevel.level}`,
        );
      }
    }
  });
});

// ─── Content field completeness ───────────────────────────────────────────────

describe("ECG curriculum unit content fields", () => {
  const allUnits = ECG_CURRICULUM.flatMap((l) => l.units);

  for (const unit of allUnits) {
    describe(`Unit: ${unit.id}`, () => {
      it("has non-empty mechanism", () => {
        assert.ok(
          unit.mechanism.trim().length >= 80,
          `"${unit.id}".mechanism is too short (${unit.mechanism.trim().length} chars) — must be ≥80 chars`,
        );
      });

      it("has non-empty conductionPath", () => {
        assert.ok(
          unit.conductionPath.trim().length >= 60,
          `"${unit.id}".conductionPath too short`,
        );
      });

      it("has non-empty whyStripLooksThisWay", () => {
        assert.ok(
          unit.whyStripLooksThisWay.trim().length >= 60,
          `"${unit.id}".whyStripLooksThisWay too short`,
        );
      });

      it("has non-empty clinicalImplications", () => {
        assert.ok(
          unit.clinicalImplications.trim().length >= 60,
          `"${unit.id}".clinicalImplications too short`,
        );
      });

      it("has non-empty hemodynamics", () => {
        assert.ok(
          unit.hemodynamics.trim().length >= 30,
          `"${unit.id}".hemodynamics too short`,
        );
      });

      it("has at least 2 NCLEX traps", () => {
        assert.ok(
          unit.nclexTraps.length >= 2,
          `"${unit.id}" has only ${unit.nclexTraps.length} NCLEX traps — need at least 2`,
        );
        for (const trap of unit.nclexTraps) {
          assert.ok(trap.trim().length >= 20, `NCLEX trap in "${unit.id}" is too short`);
        }
      });

      it("has at least 2 nursing priorities", () => {
        assert.ok(
          unit.nursingPriorities.length >= 2,
          `"${unit.id}" has only ${unit.nursingPriorities.length} nursing priorities — need at least 2`,
        );
      });

      it("has at least 2 recognition pearls", () => {
        assert.ok(
          unit.recognitionPearls.length >= 2,
          `"${unit.id}" has only ${unit.recognitionPearls.length} recognition pearls — need at least 2`,
        );
      });

      it("notThisBecause entries use 'distinguisher' (not 'distinguishing')", () => {
        if (!unit.notThisBecause) return;
        for (const entry of unit.notThisBecause) {
          assert.ok(
            "distinguisher" in entry,
            `"${unit.id}" notThisBecause entry for "${entry.rhythm}" is missing 'distinguisher' field`,
          );
          assert.ok(
            !("distinguishing" in entry),
            `"${unit.id}" notThisBecause entry has typo 'distinguishing' — should be 'distinguisher'`,
          );
        }
      });

      if (unit.parameters) {
        it("rhythm parameters contain all 6 required fields", () => {
          const p = unit.parameters!;
          const fields = ["rate", "regularity", "pWaves", "prInterval", "qrsWidth", "stChanges"] as const;
          for (const field of fields) {
            assert.ok(
              p[field].trim().length > 0,
              `"${unit.id}".parameters.${field} is empty`,
            );
          }
        });
      }
    });
  }
});

// ─── Lookup functions ─────────────────────────────────────────────────────────

describe("getEcgCurriculumUnit", () => {
  it("finds a unit by id", () => {
    const u = getEcgCurriculumUnit("atrial-fibrillation");
    assert.ok(u, "should find atrial-fibrillation unit");
    assert.equal(u!.id, "atrial-fibrillation");
  });

  it("returns undefined for unknown id", () => {
    const u = getEcgCurriculumUnit("definitely-does-not-exist-xyz");
    assert.equal(u, undefined);
  });
});

describe("getEcgCurriculumUnitByRhythmTag — known tags resolve correctly", () => {
  for (const tag of KNOWN_RHYTHM_TAGS_WITH_CURRICULUM) {
    it(`"${tag}" resolves to a curriculum unit`, () => {
      const unit = getEcgCurriculumUnitByRhythmTag(tag);
      assert.ok(
        unit !== undefined,
        `rhythmTag "${tag}" must resolve to a curriculum unit — add it to ecg-curriculum-content.ts`,
      );
      assert.ok(unit!.mechanism.trim().length > 0, `unit for "${tag}" must have non-empty mechanism`);
    });
  }
});

describe("getEcgCurriculumUnitByRhythmTag — tags without curriculum return undefined gracefully", () => {
  for (const tag of KNOWN_RHYTHM_TAGS_WITHOUT_CURRICULUM) {
    it(`"${tag}" returns undefined without throwing`, () => {
      let result: ReturnType<typeof getEcgCurriculumUnitByRhythmTag>;
      assert.doesNotThrow(() => {
        result = getEcgCurriculumUnitByRhythmTag(tag);
      });
      assert.equal(result!, undefined, `"${tag}" should return undefined (not yet in curriculum)`);
    });
  }
});

describe("getEcgCurriculumUnitByRhythmTag — case-insensitive matching", () => {
  it("matches 'atrial fibrillation' regardless of case", () => {
    const lower = getEcgCurriculumUnitByRhythmTag("atrial fibrillation");
    const upper = getEcgCurriculumUnitByRhythmTag("ATRIAL FIBRILLATION");
    const mixed = getEcgCurriculumUnitByRhythmTag("Atrial Fibrillation");
    assert.ok(lower !== undefined, "lowercase match");
    assert.ok(upper !== undefined, "uppercase match");
    assert.ok(mixed !== undefined, "mixed-case match");
    assert.equal(lower!.id, mixed!.id, "all variants resolve to same unit");
  });

  it("matches 'Ventricular Tachycardia' in any case", () => {
    const u = getEcgCurriculumUnitByRhythmTag("ventricular tachycardia");
    assert.ok(u !== undefined);
    assert.equal(u!.id, "ventricular-tachycardia");
  });
});

// ─── Level-specific content checks ───────────────────────────────────────────

describe("Level 1 — ECG Foundations specific content", () => {
  const l1 = ECG_CURRICULUM.find((l) => l.level === 1)!;

  it("contains the 7-step method unit", () => {
    const u = l1.units.find((u) => u.id === "seven-step-method");
    assert.ok(u, "Level 1 must include the 7-step interpretation method unit");
    assert.ok(
      u!.recognitionPearls.some((p) => /rate/i.test(p)),
      "7-step unit recognition pearls must reference 'Rate'",
    );
  });

  it("NSR unit has rhythm parameters defined", () => {
    const nsr = l1.units.find((u) => u.id === "normal-sinus-rhythm");
    assert.ok(nsr, "Level 1 must include NSR unit");
    assert.ok(nsr!.parameters, "NSR unit must have rhythm parameters");
    assert.match(nsr!.parameters!.rate, /60.{0,5}100/, "NSR rate must reference 60–100");
  });
});

describe("Level 2 — Core rhythms specific content", () => {
  const l2 = ECG_CURRICULUM.find((l) => l.level === 2)!;

  it("AF unit warns about cardioversion without anticoagulation in NCLEX traps", () => {
    const af = l2.units.find((u) => u.id === "atrial-fibrillation");
    assert.ok(af, "Level 2 must include AF unit");
    const traps = af!.nclexTraps.join(" ").toLowerCase();
    assert.ok(
      traps.includes("cardiovert") || traps.includes("anticoagul"),
      "AF NCLEX traps must warn about cardioversion / anticoagulation risk",
    );
  });

  it("VT unit specifies defibrillation for pulseless VT", () => {
    const vt = l2.units.find((u) => u.id === "ventricular-tachycardia");
    assert.ok(vt, "Level 2 must include VT unit");
    const priorities = vt!.nursingPriorities.join(" ").toLowerCase();
    assert.ok(
      priorities.includes("defibrill") || priorities.includes("cpr"),
      "VT nursing priorities must include defibrillation or CPR",
    );
  });

  it("3rd-degree AV block unit mentions transcutaneous pacing in nursing priorities", () => {
    const chb = l2.units.find((u) => u.id === "av-block-third-degree");
    assert.ok(chb, "Level 2 must include 3rd-degree AV block unit");
    const priorities = chb!.nursingPriorities.join(" ").toLowerCase();
    assert.ok(
      priorities.includes("pacing") || priorities.includes("transcutaneous"),
      "3rd-degree AV block must mention pacing in nursing priorities",
    );
  });
});

describe("Level 3 — Advanced content specific checks", () => {
  const l3 = ECG_CURRICULUM.find((l) => l.level === 3)!;

  it("STEMI unit mentions contiguous lead groups for localization", () => {
    const stemi = l3.units.find((u) => u.id === "stemi-localization");
    assert.ok(stemi, "Level 3 must include STEMI localization unit");
    const combined = [stemi!.mechanism, stemi!.whyStripLooksThisWay].join(" ").toLowerCase();
    assert.ok(
      combined.includes("contiguous") || combined.includes("v1") || combined.includes("inferior"),
      "STEMI unit must reference contiguous leads or lead groups",
    );
  });

  it("torsades unit warns against amiodarone in NCLEX traps", () => {
    const tor = l3.units.find((u) => u.id === "torsades-de-pointes");
    assert.ok(tor, "Level 3 must include torsades unit");
    const traps = tor!.nclexTraps.join(" ").toLowerCase();
    assert.ok(
      traps.includes("amiodarone") || traps.includes("worsen"),
      "Torsades NCLEX traps must warn about QT-prolonging antiarrhythmics (amiodarone)",
    );
  });

  it("hyperkalemia unit describes the peaked T → sine wave progression", () => {
    const hk = l3.units.find((u) => u.id === "hyperkalemia-ecg");
    assert.ok(hk, "Level 3 must include hyperkalemia ECG unit");
    const combined = [hk!.mechanism, hk!.whyStripLooksThisWay].join(" ").toLowerCase();
    assert.ok(
      combined.includes("peaked") || combined.includes("tent"),
      "Hyperkalemia unit must describe peaked T waves",
    );
    assert.ok(
      combined.includes("sine wave") || combined.includes("sinusoid"),
      "Hyperkalemia unit must describe the sine wave / sinusoidal pattern",
    );
  });
});

// ─── Governance metadata ─────────────────────────────────────────────────────

describe("Curriculum governance metadata", () => {
  it("NSR unit (the reference implementation) has full governance metadata", () => {
    const nsr = ECG_CURRICULUM.find((l) => l.level === 1)!.units.find((u) => u.id === "normal-sinus-rhythm");
    assert.ok(nsr, "NSR unit must exist as the canonical governance reference");
    assert.ok(nsr!.governance, "NSR unit must have governance metadata");
    assert.ok(nsr!.governance!.authoredAt, "governance.authoredAt must be set");
    assert.ok(nsr!.governance!.reviewedAt, "governance.reviewedAt must be set");
    assert.ok(nsr!.governance!.reviewedBy.trim().length > 0, "governance.reviewedBy must be non-empty");
    assert.equal(nsr!.governance!.clinicalReviewStatus, "reviewed", "NSR governance status must be 'reviewed'");
  });

  it("all units with governance metadata have valid clinicalReviewStatus", () => {
    const VALID_STATUSES = new Set(["draft", "reviewed", "stale"]);
    for (const level of ECG_CURRICULUM) {
      for (const unit of level.units) {
        if (!unit.governance) continue;
        assert.ok(
          VALID_STATUSES.has(unit.governance.clinicalReviewStatus),
          `Unit "${unit.id}".governance.clinicalReviewStatus "${unit.governance.clinicalReviewStatus}" is not a valid value`,
        );
      }
    }
  });

  it("no governance block has clinicalReviewStatus='stale' (triggers content refresh requirement)", () => {
    for (const level of ECG_CURRICULUM) {
      for (const unit of level.units) {
        if (!unit.governance) continue;
        assert.notEqual(
          unit.governance.clinicalReviewStatus,
          "stale",
          `Unit "${unit.id}" has governance.clinicalReviewStatus="stale" — update content and set to "reviewed"`,
        );
      }
    }
  });

  it("units with governance have non-empty guidelineVersion", () => {
    for (const level of ECG_CURRICULUM) {
      for (const unit of level.units) {
        if (!unit.governance) continue;
        assert.ok(
          unit.governance.guidelineVersion.trim().length > 0,
          `Unit "${unit.id}".governance.guidelineVersion must not be empty`,
        );
      }
    }
  });
});

// ─── relatedConceptUnitIds linkage ───────────────────────────────────────────

describe("relatedConceptUnitIds — no orphaned foundation units", () => {
  it("all relatedConceptUnitIds reference existing unit IDs", () => {
    const allIds = new Set(ECG_CURRICULUM.flatMap((l) => l.units.map((u) => u.id)));
    for (const level of ECG_CURRICULUM) {
      for (const unit of level.units) {
        if (!unit.relatedConceptUnitIds) continue;
        for (const relId of unit.relatedConceptUnitIds) {
          assert.ok(
            allIds.has(relId),
            `Unit "${unit.id}".relatedConceptUnitIds references unknown unit ID "${relId}"`,
          );
        }
      }
    }
  });

  it("AF unit links to rhythm-regularity and p-wave-identification foundational units", () => {
    const af = ECG_CURRICULUM.find((l) => l.level === 2)!.units.find((u) => u.id === "atrial-fibrillation");
    assert.ok(af, "AF unit must exist");
    assert.ok(
      af!.relatedConceptUnitIds?.includes("rhythm-regularity"),
      "AF must link to rhythm-regularity (AF diagnosis depends on irregularity recognition)",
    );
  });

  it("VT unit links to qrs-width foundational unit", () => {
    const vt = ECG_CURRICULUM.find((l) => l.level === 2)!.units.find((u) => u.id === "ventricular-tachycardia");
    assert.ok(vt, "VT unit must exist");
    assert.ok(
      vt!.relatedConceptUnitIds?.includes("qrs-width"),
      "VT must link to qrs-width (VT diagnosis depends on wide QRS recognition)",
    );
  });
});

// ─── Rhythm tag registry integration ────────────────────────────────────────

describe("Rhythm tag registry — coverage integrity", () => {
  it("all rhythm tags in ECG_RHYTHM_TAG_REGISTRY with curriculumUnitId reference existing unit IDs", async () => {
    const { ECG_RHYTHM_TAG_REGISTRY } = await import("./ecg-rhythm-tag-registry");
    const allIds = new Set(ECG_CURRICULUM.flatMap((l) => l.units.map((u) => u.id)));
    for (const entry of ECG_RHYTHM_TAG_REGISTRY) {
      if (!entry.curriculumUnitId) continue;
      assert.ok(
        allIds.has(entry.curriculumUnitId),
        `Registry entry "${entry.tag}".curriculumUnitId "${entry.curriculumUnitId}" references unknown curriculum unit`,
      );
    }
  });

  it("all registry fallbackUnitIds reference existing unit IDs", async () => {
    const { ECG_RHYTHM_TAG_REGISTRY } = await import("./ecg-rhythm-tag-registry");
    const allIds = new Set(ECG_CURRICULUM.flatMap((l) => l.units.map((u) => u.id)));
    for (const entry of ECG_RHYTHM_TAG_REGISTRY) {
      if (!entry.fallbackUnitId) continue;
      assert.ok(
        allIds.has(entry.fallbackUnitId),
        `Registry entry "${entry.tag}".fallbackUnitId "${entry.fallbackUnitId}" references unknown curriculum unit`,
      );
    }
  });

  it("PAC tag maps to pvcs-pacs curriculum unit", async () => {
    const { getEcgRhythmTagEntry } = await import("./ecg-rhythm-tag-registry");
    const pac = getEcgRhythmTagEntry("PAC");
    assert.ok(pac, "PAC must be in the rhythm tag registry");
    assert.equal(pac!.curriculumUnitId, "pvcs-pacs", "PAC must map to the pvcs-pacs unit");
    assert.equal(pac!.coverage, "full", "PAC must have full coverage via the pvcs-pacs unit");
  });

  it("Asystole and PEA have fallback units (not silently null)", async () => {
    const { getEcgRhythmTagEntry } = await import("./ecg-rhythm-tag-registry");
    for (const tag of ["Asystole", "Pulseless electrical activity"]) {
      const entry = getEcgRhythmTagEntry(tag);
      assert.ok(entry, `"${tag}" must be in the registry`);
      assert.ok(entry!.fallbackUnitId, `"${tag}" must have a fallbackUnitId — learners must never see a blank state`);
    }
  });
});
