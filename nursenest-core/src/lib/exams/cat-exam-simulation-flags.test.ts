import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { isCatExamSimulationFeatureEnabled, pathwaySupportsCatExamSimulation } from "@/lib/exams/cat-exam-simulation";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";

const saved = {
  CAT_EXAM_SIMULATION_ENABLED: process.env.CAT_EXAM_SIMULATION_ENABLED,
  NEXT_PUBLIC_CAT_EXAM_SIMULATION: process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION,
};

afterEach(() => {
  if (saved.CAT_EXAM_SIMULATION_ENABLED === undefined) delete process.env.CAT_EXAM_SIMULATION_ENABLED;
  else process.env.CAT_EXAM_SIMULATION_ENABLED = saved.CAT_EXAM_SIMULATION_ENABLED;
  if (saved.NEXT_PUBLIC_CAT_EXAM_SIMULATION === undefined) delete process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION;
  else process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION = saved.NEXT_PUBLIC_CAT_EXAM_SIMULATION;
});

describe("isCatExamSimulationFeatureEnabled", () => {
  it("is on when CAT_EXAM_SIMULATION_ENABLED=1", () => {
    delete process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION;
    process.env.CAT_EXAM_SIMULATION_ENABLED = "1";
    assert.equal(isCatExamSimulationFeatureEnabled(), true);
  });

  it("is on when NEXT_PUBLIC_CAT_EXAM_SIMULATION=true", () => {
    delete process.env.CAT_EXAM_SIMULATION_ENABLED;
    process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION = "true";
    assert.equal(isCatExamSimulationFeatureEnabled(), true);
  });

  it("is off when neither env is set", () => {
    delete process.env.CAT_EXAM_SIMULATION_ENABLED;
    delete process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION;
    assert.equal(isCatExamSimulationFeatureEnabled(), false);
  });
});

describe("exam_sim_disabled contract", () => {
  it("matches POST /api/practice-tests 403 code", () => {
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.exam_sim_disabled, "exam_sim_disabled");
  });
});

describe("pathwaySupportsCatExamSimulation", () => {
  it("allows NCLEX-PN for exam simulation (same engine family as RN)", () => {
    const pn = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pn, "catalog must include LPN pathway id");
    assert.equal(pathwaySupportsCatExamSimulation(pn), true);
  });

  it("allows null pathway (server defaults NCLEX-RN US pool)", () => {
    assert.equal(pathwaySupportsCatExamSimulation(null), true);
  });
});
