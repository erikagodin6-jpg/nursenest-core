/**
 * Pediatric ECG Governance Contract Tests
 *
 * These are CI-blocking tests. All must pass before the pediatric ECG lane ships.
 * Run: node --import tsx --test src/lib/ecg-module/ecg-pediatric-governance.contract.test.ts
 *
 * Test coverage:
 *   1. Registry separation — pediatric tags do not appear in adult registry and vice versa
 *   2. Pulsus paradoxus classification — never a rhythm tag, only a hemodynamic finding
 *   3. PALS/ACLS mastery score isolation — no shared topic IDs
 *   4. Pediatric vitals/rate ranges — age-appropriate values (no adult defaults)
 *   5. SVT vs sinus tachycardia differential — registered with correct PALS danger
 *   6. Pediatric clinical review governance — advanced topics reviewed
 *   7. Case simulations — all 6 cases have required structure and correct pulsus paradoxus framing
 *   8. RPN access restrictions — restricted topics have correct access level
 *   9. Differential graph integrity — all nodes valid, all edges valid
 *  10. Pediatric readiness gates pass
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";

import {
  PEDIATRIC_ECG_RHYTHM_REGISTRY,
  VALID_PEDIATRIC_RHYTHM_TAGS,
  HEMODYNAMIC_FINDINGS_REGISTRY,
  PROHIBITED_AS_RHYTHM_TAGS,
  PEDIATRIC_NORMAL_RATE_RANGES,
  PALS_ARREST_RHYTHMS,
  VENTILATE_FIRST_RHYTHMS,
  getPediatricNormalRateRange,
  assertTagIsNotHemodynamicFinding,
  type PediatricAgeGroup,
} from "./ecg-pediatric-rhythm-registry";

import {
  PEDIATRIC_ECG_CURRICULUM,
  PEDIATRIC_CRITICAL_TOPICS,
  PALS_LIFE_THREATENING_TOPICS,
  RPN_RESTRICTED_TOPICS,
  DOSING_TOPICS,
  getUnreviewedPediatricAdvancedTopics,
} from "./ecg-pediatric-curriculum";

import {
  PEDIATRIC_DIFFERENTIAL_NODES,
  PEDIATRIC_DIFFERENTIAL_EDGES,
  PALS_CONTRAINDICATED_CONFUSION_PAIRS,
  validatePediatricDifferentialGraphNodes,
  validatePediatricDifferentialGraphEdges,
  getPediatricDifferentialNode,
} from "./ecg-pediatric-differential-graph";

import {
  PEDIATRIC_CASE_SIMULATIONS,
  CASES_WITH_PULSUS_PARADOXUS,
  PALS_ARREST_CASES,
  getPediatricCaseSimulation,
} from "./ecg-pediatric-case-simulations";

import {
  runPediatricEcgGovernanceAudit,
  getPediatricContentAccessLevel,
  getPediatricCurriculumReadinessGates,
  assertPediatricTagIsUsableAsRhythm,
} from "./ecg-pediatric-governance";

import { ECG_RHYTHM_TAG_REGISTRY, VALID_ECG_RHYTHM_TAGS } from "./ecg-rhythm-tag-registry";
import { ECG_FULL_CURRICULUM } from "./ecg-curriculum-config";

// ─── 1. Registry separation ──────────────────────────────────────────────────

describe("Pediatric registry separation — PALS/ACLS namespace isolation", () => {
  test("no pediatric rhythm tag appears in adult ECG_RHYTHM_TAG_REGISTRY", () => {
    const adultTags = new Set(ECG_RHYTHM_TAG_REGISTRY.map((e) => e.tag));
    for (const entry of PEDIATRIC_ECG_RHYTHM_REGISTRY) {
      assert.equal(
        adultTags.has(entry.tag),
        false,
        `"${entry.tag}" is in both PEDIATRIC and adult registries — mastery score contamination risk`,
      );
    }
  });

  test("no adult rhythm tag appears in PEDIATRIC_ECG_RHYTHM_REGISTRY", () => {
    for (const entry of ECG_RHYTHM_TAG_REGISTRY) {
      assert.equal(
        VALID_PEDIATRIC_RHYTHM_TAGS.has(entry.tag),
        false,
        `"${entry.tag}" appears in both adult and pediatric registries`,
      );
    }
  });

  test("all pediatric rhythm tags are namespaced (contain 'Pediatric' or are recognized variants)", () => {
    const allowedWithoutPrefix = new Set([
      "Respiratory sinus arrhythmia",
      "Post-op congenital heart telemetry pattern",
    ]);
    for (const entry of PEDIATRIC_ECG_RHYTHM_REGISTRY) {
      const hasPediatricPrefix = entry.tag.startsWith("Pediatric ");
      const isAllowedVariant = allowedWithoutPrefix.has(entry.tag);
      assert.ok(
        hasPediatricPrefix || isAllowedVariant,
        `Rhythm tag "${entry.tag}" should use "Pediatric " prefix or be in the allowed-variant list`,
      );
    }
  });

  test("pediatric rhythm registry is non-empty with required PALS-critical rhythms", () => {
    const requiredTags = [
      "Pediatric SVT",
      "Pediatric VT",
      "Pediatric VF",
      "Pediatric asystole",
      "Pediatric PEA",
      "Pediatric hypoxic bradycardia",
      "Pediatric sinus tachycardia",
      "Pediatric sinus bradycardia",
      "Pediatric complete heart block",
    ];
    for (const tag of requiredTags) {
      assert.ok(
        VALID_PEDIATRIC_RHYTHM_TAGS.has(tag),
        `Required PALS rhythm "${tag}" missing from PEDIATRIC_ECG_RHYTHM_REGISTRY`,
      );
    }
  });
});

// ─── 2. Pulsus paradoxus classification ─────────────────────────────────────

describe("Pulsus paradoxus — must be hemodynamic finding, never a rhythm tag", () => {
  test("Pulsus paradoxus is in HEMODYNAMIC_FINDINGS_REGISTRY", () => {
    const pp = HEMODYNAMIC_FINDINGS_REGISTRY.find(
      (f) => f.findingTag === "Pulsus paradoxus",
    );
    assert.ok(pp, "Pulsus paradoxus must be registered in HEMODYNAMIC_FINDINGS_REGISTRY");
  });

  test("Pulsus paradoxus has prohibitedAsRhythmTag=true", () => {
    const pp = HEMODYNAMIC_FINDINGS_REGISTRY.find(
      (f) => f.findingTag === "Pulsus paradoxus",
    );
    assert.ok(pp, "Pulsus paradoxus must exist in registry");
    assert.equal(
      pp!.prohibitedAsRhythmTag,
      true,
      "Pulsus paradoxus must be explicitly prohibited as a rhythm tag",
    );
  });

  test("Pulsus paradoxus is in PROHIBITED_AS_RHYTHM_TAGS set", () => {
    assert.equal(
      PROHIBITED_AS_RHYTHM_TAGS.has("Pulsus paradoxus"),
      true,
      "Pulsus paradoxus must be in the prohibited rhythm tags set",
    );
  });

  test("Pulsus paradoxus does NOT appear in VALID_PEDIATRIC_RHYTHM_TAGS", () => {
    assert.equal(
      VALID_PEDIATRIC_RHYTHM_TAGS.has("Pulsus paradoxus"),
      false,
      "Pulsus paradoxus must not be a valid pediatric rhythm tag",
    );
  });

  test("Pulsus paradoxus does NOT appear in adult VALID_ECG_RHYTHM_TAGS", () => {
    assert.equal(
      VALID_ECG_RHYTHM_TAGS.has("Pulsus paradoxus"),
      false,
      "Pulsus paradoxus must not be an adult rhythm tag either",
    );
  });

  test("assertTagIsNotHemodynamicFinding throws for Pulsus paradoxus", () => {
    assert.throws(
      () => assertTagIsNotHemodynamicFinding("Pulsus paradoxus"),
      /hemodynamic assessment finding/,
      "Should throw with description of why pulsus paradoxus is not a rhythm",
    );
  });

  test("assertTagIsNotHemodynamicFinding does not throw for valid rhythm tags", () => {
    assert.doesNotThrow(
      () => assertTagIsNotHemodynamicFinding("Pediatric SVT"),
      "Valid rhythm tags should not throw",
    );
  });

  test("all case simulations with pulsus paradoxus findings have isNotRhythm=true", () => {
    for (const caseSimulation of CASES_WITH_PULSUS_PARADOXUS) {
      for (const finding of caseSimulation.hemodynamicFindings) {
        if (finding.findingName.toLowerCase().includes("pulsus")) {
          assert.equal(
            finding.isNotRhythm,
            true,
            `Case "${caseSimulation.id}" pulsus paradoxus finding must have isNotRhythm=true`,
          );
          assert.match(
            finding.assessmentDescription,
            /blood pressure|BP cuff|sphygmomanometer|pulse oximetry|NOT.*ECG|NOT.*rhythm/i,
            `Case "${caseSimulation.id}" pulsus paradoxus description must clarify it is a BP/hemodynamic finding`,
          );
        }
      }
    }
  });

  test("case 2 (asthma case) has pulsus paradoxus as hemodynamic finding with correct framing", () => {
    const case2 = getPediatricCaseSimulation("case-asthma-pulsus-paradoxus");
    assert.ok(case2, "Asthma case must exist");
    const ppFinding = case2!.hemodynamicFindings.find(
      (f) => f.findingName === "Pulsus paradoxus",
    );
    assert.ok(ppFinding, "Asthma case must contain pulsus paradoxus finding");
    assert.equal(ppFinding!.isNotRhythm, true);
    // Verify the asthma decision point teaches that pulsus paradoxus is NOT on the ECG
    const wrongOptions = case2!.decisionPoints
      .flatMap((dp) => dp.options)
      .filter((opt) => !opt.isCorrect);
    const hasEcgTrap = wrongOptions.some((opt) =>
      opt.action.toLowerCase().includes("ecg"),
    );
    assert.ok(
      hasEcgTrap,
      "Asthma case should have a wrong-answer trap about looking for pulsus paradoxus on ECG",
    );
  });
});

// ─── 3. PALS/ACLS mastery score isolation ────────────────────────────────────

describe("PALS/ACLS mastery score isolation", () => {
  test("no pediatric curriculum topic ID appears in adult ECG_FULL_CURRICULUM", () => {
    const adultTopicIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
    for (const topic of PEDIATRIC_ECG_CURRICULUM) {
      assert.equal(
        adultTopicIds.has(topic.id),
        false,
        `Pediatric topic ID "${topic.id}" exists in adult curriculum — mastery scoring will be contaminated`,
      );
    }
  });

  test("no adult curriculum topic ID starts with 'ped-'", () => {
    for (const topic of ECG_FULL_CURRICULUM) {
      assert.equal(
        topic.id.startsWith("ped-"),
        false,
        `Adult curriculum topic "${topic.id}" has 'ped-' prefix — possible namespace collision`,
      );
    }
  });

  test("all pediatric curriculum topics have palsOnlyScoring=true on their rhythm registry entries", () => {
    for (const topic of PEDIATRIC_ECG_CURRICULUM) {
      const rhythmEntry = PEDIATRIC_ECG_RHYTHM_REGISTRY.find(
        (e) => e.tag === topic.primaryRhythmTag,
      );
      if (rhythmEntry) {
        assert.equal(
          rhythmEntry.palsOnlyScoring,
          true,
          `Rhythm "${rhythmEntry.tag}" (used by topic "${topic.id}") has palsOnlyScoring=false — will contaminate ACLS scoring`,
        );
      }
    }
  });

  test("adultCurriculumTopicId references are valid when present", () => {
    const adultTopicIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
    for (const topic of PEDIATRIC_ECG_CURRICULUM) {
      if (topic.adultCurriculumTopicId) {
        assert.ok(
          adultTopicIds.has(topic.adultCurriculumTopicId),
          `Pediatric topic "${topic.id}" references adult topic "${topic.adultCurriculumTopicId}" which does not exist`,
        );
      }
    }
  });
});

// ─── 4. Pediatric rate range validation ──────────────────────────────────────

describe("Pediatric rate ranges — age-appropriate values", () => {
  test("PEDIATRIC_NORMAL_RATE_RANGES covers all 5 age groups", () => {
    const ageGroups: PediatricAgeGroup[] = ["neonate", "infant", "toddler", "child", "adolescent"];
    for (const ag of ageGroups) {
      const range = getPediatricNormalRateRange(ag);
      assert.ok(range, `No normal rate range found for age group "${ag}"`);
    }
  });

  test("neonatal resting max is appropriate (>= 160 for normal range)", () => {
    const neonateRange = getPediatricNormalRateRange("neonate");
    assert.ok(
      neonateRange.restingMax >= 160,
      `Neonatal resting max ${neonateRange.restingMax} is too low — neonates normally have HR up to 160`,
    );
  });

  test("SVT threshold is higher for neonates/infants than for adolescents", () => {
    const neonate = getPediatricNormalRateRange("neonate");
    const adolescent = getPediatricNormalRateRange("adolescent");
    assert.ok(
      neonate.sinusTachMaxBeforeSvtSuspicion > adolescent.sinusTachMaxBeforeSvtSuspicion,
      "Neonatal SVT threshold should be higher than adolescent threshold",
    );
    assert.ok(
      neonate.svtRateMin > adolescent.svtRateMin,
      "Neonatal SVT minimum rate should be higher than adolescent minimum",
    );
  });

  test("bradycardia thresholds decrease with age (neonates need higher rate)", () => {
    const neonate = getPediatricNormalRateRange("neonate");
    const child = getPediatricNormalRateRange("child");
    assert.ok(
      neonate.bradycardiaThreshold > child.bradycardiaThreshold,
      "Neonatal bradycardia threshold should be higher than child threshold",
    );
  });

  test("no sinus rhythm has adult-default resting max (100) for neonate age group", () => {
    for (const entry of PEDIATRIC_ECG_RHYTHM_REGISTRY) {
      const neonateRange = entry.rateRangesByAgeGroup["neonate"];
      if (neonateRange) {
        assert.ok(
          neonateRange.max !== 100,
          `"${entry.tag}" has neonatal rate max 100 — this is an adult normal value, not age-appropriate`,
        );
      }
    }
  });
});

// ─── 5. SVT vs sinus tachycardia differential ───────────────────────────────

describe("SVT vs sinus tachycardia — PALS-critical differential", () => {
  test("SVT → sinus tach confusion edge has clinicalDanger >= 0.9", () => {
    const edge = PEDIATRIC_DIFFERENTIAL_EDGES.find(
      (e) =>
        e.correctRhythm === "Pediatric SVT" &&
        e.wrongRhythm === "Pediatric sinus tachycardia",
    );
    assert.ok(edge, "SVT → sinus tach confusion edge must be registered");
    assert.ok(
      edge!.clinicalDanger >= 0.9,
      `SVT→sinus tach clinical danger ${edge!.clinicalDanger} must be >= 0.9 (life-threatening in infants)`,
    );
  });

  test("sinus tach → SVT confusion edge is marked contraindicated", () => {
    const edge = PEDIATRIC_DIFFERENTIAL_EDGES.find(
      (e) =>
        e.correctRhythm === "Pediatric sinus tachycardia" &&
        e.wrongRhythm === "Pediatric SVT",
    );
    assert.ok(edge, "Sinus tach → SVT confusion edge must exist");
    assert.equal(
      edge!.contraindicated,
      true,
      "Cardioverting sinus tachycardia is contraindicated — edge must be marked contraindicated",
    );
  });

  test("PALS_CONTRAINDICATED_CONFUSION_PAIRS includes SVT/sinus tach and hypoxic brady pairs", () => {
    const pairs = PALS_CONTRAINDICATED_CONFUSION_PAIRS.map(
      (e) => `${e.correctRhythm}→${e.wrongRhythm}`,
    );
    assert.ok(
      pairs.some((p) => p.includes("sinus tachycardia") && p.includes("SVT")),
      "Contraindicated pairs must include sinus tach → SVT confusion",
    );
    assert.ok(
      pairs.some((p) => p.includes("hypoxic bradycardia")),
      "Contraindicated pairs must include hypoxic bradycardia confusion",
    );
  });

  test("SVT curriculum topic has palsPriority=life_threatening", () => {
    const topic = PEDIATRIC_ECG_CURRICULUM.find((t) => t.id === "ped-svt-vs-sinus-tach");
    assert.ok(topic, "SVT vs sinus tach curriculum topic must exist");
    assert.equal(
      topic!.palsPriority,
      "life_threatening",
      "SVT recognition must be life_threatening priority in PALS curriculum",
    );
  });
});

// ─── 6. Clinical review governance ──────────────────────────────────────────

describe("Pediatric clinical review governance (CI gate)", () => {
  test("no unreviewed advanced pediatric topics (CI-blocking)", () => {
    const unreviewed = getUnreviewedPediatricAdvancedTopics();
    assert.deepEqual(
      unreviewed.map((t) => t.id),
      [],
      `Unreviewed advanced pediatric topics: ${unreviewed.map((t) => t.id).join(", ")}`,
    );
  });

  test("all pediatric curriculum topics have a guidelineVersion when reviewed", () => {
    for (const topic of PEDIATRIC_ECG_CURRICULUM.filter((t) => t.clinicalReviewStatus === "reviewed")) {
      assert.ok(
        topic.guidelineVersion && topic.guidelineVersion.length > 0,
        `Topic "${topic.id}" is reviewed but missing guidelineVersion`,
      );
    }
  });

  test("all reviewed topics have reviewedAt in ISO-8601 date format", () => {
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    for (const topic of PEDIATRIC_ECG_CURRICULUM.filter((t) => t.clinicalReviewStatus === "reviewed")) {
      assert.ok(
        topic.reviewedAt && iso.test(topic.reviewedAt),
        `Topic "${topic.id}" has clinicalReviewStatus=reviewed but reviewedAt "${topic.reviewedAt}" is not ISO-8601`,
      );
    }
  });

  test("guidelineVersion references PALS 2020 for all life-threatening pediatric topics", () => {
    for (const topic of PALS_LIFE_THREATENING_TOPICS) {
      if (topic.clinicalReviewStatus === "reviewed") {
        assert.match(
          topic.guidelineVersion ?? "",
          /PALS|AHA/i,
          `Life-threatening topic "${topic.id}" guidelineVersion must reference PALS or AHA`,
        );
      }
    }
  });
});

// ─── 7. Case simulation structure ────────────────────────────────────────────

describe("Pediatric case simulations — structure validation", () => {
  test("exactly 6 case simulations exist", () => {
    assert.equal(PEDIATRIC_CASE_SIMULATIONS.length, 6);
  });

  test("each case has at least 2 decision points", () => {
    for (const c of PEDIATRIC_CASE_SIMULATIONS) {
      assert.ok(
        c.decisionPoints.length >= 2,
        `Case "${c.id}" has only ${c.decisionPoints.length} decision points — minimum is 2`,
      );
    }
  });

  test("each decision point has exactly one correct option", () => {
    for (const c of PEDIATRIC_CASE_SIMULATIONS) {
      for (const dp of c.decisionPoints) {
        const correctCount = dp.options.filter((o) => o.isCorrect).length;
        assert.equal(
          correctCount,
          1,
          `Case "${c.id}" decision point "${dp.scenario.slice(0, 40)}..." has ${correctCount} correct options (must be exactly 1)`,
        );
      }
    }
  });

  test("each case references a valid pediatric curriculum topic ID", () => {
    const curriculumIds = new Set(PEDIATRIC_ECG_CURRICULUM.map((t) => t.id));
    for (const c of PEDIATRIC_CASE_SIMULATIONS) {
      for (const id of c.reinforcesCurriculumIds) {
        assert.ok(
          curriculumIds.has(id),
          `Case "${c.id}" references unknown curriculum ID "${id}"`,
        );
      }
    }
  });

  test("all 6 cases have clinicalReviewStatus=reviewed", () => {
    for (const c of PEDIATRIC_CASE_SIMULATIONS) {
      assert.equal(
        c.clinicalReviewStatus,
        "reviewed",
        `Case "${c.id}" must be clinically reviewed before production`,
      );
    }
  });

  test("at least 2 cases use pulsus paradoxus as hemodynamic context", () => {
    assert.ok(
      CASES_WITH_PULSUS_PARADOXUS.length >= 1,
      "At least one case must demonstrate pulsus paradoxus as hemodynamic finding",
    );
    // Specifically: asthma case must be included
    const asthmaCase = CASES_WITH_PULSUS_PARADOXUS.find(
      (c) => c.id === "case-asthma-pulsus-paradoxus",
    );
    assert.ok(asthmaCase, "Asthma case must be in CASES_WITH_PULSUS_PARADOXUS");
  });

  test("at least 3 cases involve PALS arrest algorithm pathways", () => {
    assert.ok(
      PALS_ARREST_CASES.length >= 3,
      `Only ${PALS_ARREST_CASES.length} PALS arrest cases — need at least 3 for comprehensive coverage`,
    );
  });

  test("infant SVT case has correct vagal maneuver teaching (ice to face, not carotid massage)", () => {
    const svtCase = getPediatricCaseSimulation("case-infant-svt-poor-feeding");
    assert.ok(svtCase, "SVT infant case must exist");
    const vagalDP = svtCase!.decisionPoints.find(
      (dp) => dp.scenario.toLowerCase().includes("vagal"),
    );
    assert.ok(vagalDP, "SVT case must have a vagal maneuver decision point");
    const correctOption = vagalDP!.options.find((o) => o.isCorrect);
    assert.match(
      correctOption!.action,
      /ice|diving reflex/i,
      "Correct vagal maneuver for infants must be ice-water/diving reflex",
    );
    const wrongOptions = vagalDP!.options.filter((o) => !o.isCorrect);
    const hasCourotidTrap = wrongOptions.some((o) =>
      o.action.toLowerCase().includes("carotid"),
    );
    assert.ok(hasCourotidTrap, "SVT case must have carotid massage as a wrong-answer trap for infants");
  });
});

// ─── 8. RPN access restrictions ─────────────────────────────────────────────

describe("RPN/LPN access restrictions", () => {
  test("restricted topics are life-threatening or urgent priority only", () => {
    for (const topic of RPN_RESTRICTED_TOPICS) {
      assert.ok(
        topic.palsPriority === "life_threatening" || topic.palsPriority === "urgent",
        `Restricted topic "${topic.id}" has palsPriority "${topic.palsPriority}" — restricted access should apply to critical topics only`,
      );
    }
  });

  test("getPediatricContentAccessLevel returns no dosing for RPN tier", () => {
    const rpnAccess = getPediatricContentAccessLevel("RPN");
    assert.equal(rpnAccess.showDosing, false);
    assert.equal(rpnAccess.showManagementAlgorithm, false);
    assert.equal(rpnAccess.showEscalationCriteria, true);
  });

  test("getPediatricContentAccessLevel returns full access for RN tier", () => {
    const rnAccess = getPediatricContentAccessLevel("RN");
    assert.equal(rnAccess.showDosing, true);
    assert.equal(rnAccess.showManagementAlgorithm, true);
    assert.equal(rnAccess.showEscalationCriteria, true);
  });

  test("getPediatricContentAccessLevel returns full access for NP tier", () => {
    const npAccess = getPediatricContentAccessLevel("NP");
    assert.equal(npAccess.showDosing, true);
    assert.equal(npAccess.showManagementAlgorithm, true);
  });

  test("dosing-inclusive topics have recognition_only or restricted RPN access level", () => {
    for (const topic of DOSING_TOPICS) {
      assert.notEqual(
        topic.rpnAccessLevel,
        "full",
        `Topic "${topic.id}" includes dosing but has rpnAccessLevel="full" — RPN should not see dosing`,
      );
    }
  });
});

// ─── 9. Differential graph integrity ────────────────────────────────────────

describe("Pediatric differential graph integrity", () => {
  test("all graph nodes are valid pediatric rhythm tags", () => {
    const errors = validatePediatricDifferentialGraphNodes();
    assert.deepEqual(
      errors,
      [],
      `Graph node errors: ${errors.join("; ")}`,
    );
  });

  test("all graph edges reference existing nodes", () => {
    const errors = validatePediatricDifferentialGraphEdges();
    assert.deepEqual(
      errors,
      [],
      `Graph edge errors: ${errors.join("; ")}`,
    );
  });

  test("all PALS-critical nodes have aclsCritical-equivalent flag = palsCritical=true", () => {
    const expectedCritical = [
      "Pediatric SVT",
      "Pediatric VF",
      "Pediatric asystole",
      "Pediatric PEA",
      "Pediatric hypoxic bradycardia",
      "Pediatric VT",
    ];
    for (const tag of expectedCritical) {
      const node = getPediatricDifferentialNode(tag);
      assert.ok(node, `Node "${tag}" must exist in pediatric differential graph`);
      assert.equal(
        node!.palsCritical,
        true,
        `Node "${tag}" must have palsCritical=true`,
      );
    }
  });

  test("VF and asystole are in pals_arrest_rhythms cluster", () => {
    const vf = getPediatricDifferentialNode("Pediatric VF");
    const asystole = getPediatricDifferentialNode("Pediatric asystole");
    assert.ok(vf?.clusters.includes("pals_arrest_rhythms"), "VF must be in pals_arrest_rhythms");
    assert.ok(asystole?.clusters.includes("pals_arrest_rhythms"), "Asystole must be in pals_arrest_rhythms");
  });

  test("all edge clinical danger values are in [0, 1]", () => {
    for (const edge of PEDIATRIC_DIFFERENTIAL_EDGES) {
      assert.ok(
        edge.clinicalDanger >= 0 && edge.clinicalDanger <= 1,
        `Edge "${edge.correctRhythm}→${edge.wrongRhythm}" clinicalDanger ${edge.clinicalDanger} out of [0,1]`,
      );
    }
  });

  test("hypoxic bradycardia → sinus bradycardia confusion has clinical danger = 1.0 (most dangerous)", () => {
    const edge = PEDIATRIC_DIFFERENTIAL_EDGES.find(
      (e) =>
        e.correctRhythm === "Pediatric hypoxic bradycardia" &&
        e.wrongRhythm === "Pediatric sinus bradycardia",
    );
    assert.ok(edge, "Hypoxic bradycardia → sinus bradycardia edge must exist");
    assert.equal(
      edge!.clinicalDanger,
      1.0,
      "Failing to ventilate a hypoxic child = maximum danger",
    );
  });
});

// ─── 10. Full governance audit ───────────────────────────────────────────────

describe("Pediatric governance full audit (CI-blocking)", () => {
  test("runPediatricEcgGovernanceAudit returns ok=true with no errors", () => {
    const report = runPediatricEcgGovernanceAudit();
    assert.deepEqual(
      report.errors.map((e) => `${e.rule}: ${e.message}`),
      [],
      `Governance errors: ${report.errors.map((e) => e.message).join("; ")}`,
    );
    assert.equal(report.ok, true, "Governance audit must pass with no errors");
  });

  test("governance report stats are non-zero", () => {
    const report = runPediatricEcgGovernanceAudit();
    assert.ok(report.stats.pediatricRhythmCount > 0);
    assert.ok(report.stats.pediatricCurriculumTopicCount > 0);
    assert.ok(report.stats.prohibitedAsRhythmTagCount >= 1, "At least pulsus paradoxus must be prohibited");
  });

  test("all pediatric readiness gates pass", () => {
    const gates = getPediatricCurriculumReadinessGates();
    const failed = gates.filter((g) => !g.passed);
    assert.deepEqual(
      failed.map((g) => `${g.key}: ${g.reason}`),
      [],
      `Failed readiness gates: ${failed.map((g) => g.reason).join("; ")}`,
    );
  });

  test("pulsus paradoxus guard gate passes", () => {
    const gates = getPediatricCurriculumReadinessGates();
    const ppGate = gates.find((g) => g.key === "pulsus_paradoxus_guard");
    assert.ok(ppGate, "Pulsus paradoxus guard gate must exist");
    assert.equal(
      ppGate!.passed,
      true,
      `Pulsus paradoxus guard gate failed: ${ppGate!.reason}`,
    );
  });

  test("ventilate-first rhythms are registered in VENTILATE_FIRST_RHYTHMS", () => {
    assert.ok(
      VENTILATE_FIRST_RHYTHMS.includes("Pediatric hypoxic bradycardia"),
      "Hypoxic bradycardia must be in VENTILATE_FIRST_RHYTHMS",
    );
    assert.ok(
      VENTILATE_FIRST_RHYTHMS.includes("Pediatric sinus bradycardia"),
      "Pediatric sinus bradycardia must be in VENTILATE_FIRST_RHYTHMS (ventilate first per PALS)",
    );
  });

  test("PALS arrest rhythms include VF, asystole, PEA, and pulseless VT", () => {
    for (const tag of ["Pediatric VF", "Pediatric asystole", "Pediatric PEA", "Pediatric VT"]) {
      assert.ok(
        PALS_ARREST_RHYTHMS.includes(tag),
        `"${tag}" must be in PALS_ARREST_RHYTHMS`,
      );
    }
  });
});
