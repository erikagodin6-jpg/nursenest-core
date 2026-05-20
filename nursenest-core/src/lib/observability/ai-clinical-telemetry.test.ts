/**
 * Run: `node --import tsx --test src/lib/observability/ai-clinical-telemetry.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  logAiTutorFallbackUsed,
  logAiTutorRecommendationMs,
  logSimulationTickMs,
} from "@/lib/observability/ai-clinical-telemetry";

describe("ai-clinical-telemetry", () => {
  it("emits structured events without throwing", () => {
    assert.doesNotThrow(() =>
      logAiTutorRecommendationMs({
        durationMs: 12,
        pathwayId: "nclex-rn",
        providerKind: "stub",
        recommendationCount: 1,
      }),
    );
    assert.doesNotThrow(() =>
      logAiTutorFallbackUsed({ pathwayId: "nclex-rn", providerKind: "stub" }),
    );
    assert.doesNotThrow(() =>
      logSimulationTickMs({ simulationId: "sim_1", pathwayId: "nclex-rn", tickMs: 5 }),
    );
  });
});
