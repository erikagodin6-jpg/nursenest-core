import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadStudyInventoryWithFailover } from "@/lib/learner/study-inventory-failover";

describe("loadStudyInventoryWithFailover", () => {
  it("returns primary ok when primary succeeds", async () => {
    const r = await loadStudyInventoryWithFailover({
      surface: "lessons",
      primary: async () => ({ n: 2 }),
      secondary: null,
      isEmpty: (d) => d.n === 0,
    });
    assert.equal(r.source_used, "primary");
    assert.equal(r.final_outcome, "ok");
    assert.equal(r.data.n, 2);
  });

  it("uses secondary and marks degraded_snapshot when primary throws and secondary succeeds", async () => {
    const r = await loadStudyInventoryWithFailover({
      surface: "flashcards",
      primary: async () => {
        throw new Error("primary down");
      },
      secondary: async () => ({ n: 1 }),
      isEmpty: (d) => d.n === 0,
    });
    assert.equal(r.source_used, "secondary");
    assert.equal(r.final_outcome, "degraded_snapshot");
    assert.equal(r.data.n, 1);
    assert.match(r.failover_reason ?? "", /primary down/);
  });

  it("throws when primary and secondary both fail", async () => {
    await assert.rejects(
      loadStudyInventoryWithFailover({
        surface: "practice_exams",
        primary: async () => {
          throw new Error("a");
        },
        secondary: async () => {
          throw new Error("b");
        },
        isEmpty: () => false,
      }),
      /a|b/,
    );
  });

  it("reports empty when primary returns empty shape", async () => {
    const r = await loadStudyInventoryWithFailover({
      surface: "lessons",
      primary: async () => ({ items: [] as string[] }),
      secondary: null,
      isEmpty: (d) => d.items.length === 0,
    });
    assert.equal(r.final_outcome, "empty");
  });
});
