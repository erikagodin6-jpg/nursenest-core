import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CNPLE_LOFT_SIMULATION_SESSION_COPY,
  DEFAULT_LOFT_SIMULATION_SESSION_COPY,
  resolveLoftSimulationSessionCopy,
} from "@/components/student/loft-simulation-session-copy";

describe("LOFT simulation session copy", () => {
  it("uses simulation wording instead of adaptive CAT wording", () => {
    assert.equal(DEFAULT_LOFT_SIMULATION_SESSION_COPY.simulationTitle.includes("simulation"), true);
    assert.equal(DEFAULT_LOFT_SIMULATION_SESSION_COPY.remainingQuestionsLabel, "Remaining questions");
    assert.equal(DEFAULT_LOFT_SIMULATION_SESSION_COPY.reviewFlaggedLabel, "Review flagged questions");
  });

  it("does not leak adaptive CAT terminology into LOFT copy", () => {
    const serialized = JSON.stringify(DEFAULT_LOFT_SIMULATION_SESSION_COPY).toLowerCase();

    assert.equal(serialized.includes("adaptive"), false);
    assert.equal(serialized.includes("ability estimate"), false);
    assert.equal(serialized.includes("difficulty adapting"), false);
  });

  it("provides CNPLE-specific simulation framing", () => {
    assert.equal(CNPLE_LOFT_SIMULATION_SESSION_COPY.simulationTitle, "CNPLE simulation");
    assert.equal(CNPLE_LOFT_SIMULATION_SESSION_COPY.simulationSubtitle.includes("NP licensing simulation"), true);
  });

  it("resolves CNPLE exam codes to CNPLE simulation copy", () => {
    assert.equal(resolveLoftSimulationSessionCopy({ examCode: "cnple" }).simulationTitle, "CNPLE simulation");
    assert.equal(resolveLoftSimulationSessionCopy({ examCode: "CNPLE" }).simulationTitle, "CNPLE simulation");
  });

  it("falls back to default simulation copy for non-CNPLE exams", () => {
    assert.equal(
      resolveLoftSimulationSessionCopy({ examCode: "nclex-rn" }).simulationTitle,
      "Linear simulation",
    );
  });
});
