/**
 * Run: `npx tsx --test src/lib/admin/system-status-derive.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  configDetailsLookSafe,
  deriveContentHealthStatus,
  deriveQueueHealthStatus,
} from "@/lib/admin/system-status-derive";

describe("deriveQueueHealthStatus", () => {
  it("degrades when lesson batch stuck count > 0", () => {
    assert.equal(
      deriveQueueHealthStatus({ stuckLessonBatchGenerating: 2, prismaWarningCount: 0 }),
      "degraded",
    );
  });

  it("degrades when prisma warnings present", () => {
    assert.equal(
      deriveQueueHealthStatus({ stuckLessonBatchGenerating: 0, prismaWarningCount: 1 }),
      "degraded",
    );
  });

  it("healthy when no stuck rows and no warnings", () => {
    assert.equal(
      deriveQueueHealthStatus({ stuckLessonBatchGenerating: 0, prismaWarningCount: 0 }),
      "healthy",
    );
  });
});

describe("deriveContentHealthStatus", () => {
  it("degrades in production when both lesson and question totals are zero", () => {
    assert.equal(
      deriveContentHealthStatus({
        lessonCount: 0,
        questionCount: 0,
        prismaWarningCount: 0,
        nodeEnv: "production",
      }),
      "degraded",
    );
  });

  it("healthy in development with zero counts", () => {
    assert.equal(
      deriveContentHealthStatus({
        lessonCount: 0,
        questionCount: 0,
        prismaWarningCount: 0,
        nodeEnv: "development",
      }),
      "healthy",
    );
  });

  it("degrades when prisma warnings", () => {
    assert.equal(
      deriveContentHealthStatus({
        lessonCount: 10,
        questionCount: 10,
        prismaWarningCount: 1,
        nodeEnv: "production",
      }),
      "degraded",
    );
  });
});

describe("configDetailsLookSafe", () => {
  it("rejects obvious secret patterns", () => {
    assert.equal(configDetailsLookSafe({ key: "sk_live_abc123" }), false);
    assert.equal(configDetailsLookSafe({ url: "postgresql://u:secretpass@host/db" }), false);
  });

  it("accepts boolean presence maps", () => {
    assert.equal(
      configDetailsLookSafe({
        authSecretPresent: true,
        openaiIntegrationKeyPresent: false,
      }),
      true,
    );
  });
});
