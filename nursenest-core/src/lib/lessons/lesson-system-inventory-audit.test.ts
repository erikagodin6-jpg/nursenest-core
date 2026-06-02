import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLessonSystemHardeningAudit,
  LESSON_SYSTEM_HARDENING_PATHWAY_IDS,
} from "@/lib/lessons/lesson-system-inventory-audit";

describe("lesson system inventory hardening", () => {
  const audit = buildLessonSystemHardeningAudit();

  it("audits every lesson pathway family covered by the hardening pass", () => {
    const auditedPathways = new Set(audit.configuredRows.map((row) => row.pathwayId));
    for (const pathwayId of LESSON_SYSTEM_HARDENING_PATHWAY_IDS) {
      assert.ok(auditedPathways.has(pathwayId), `Missing pathway coverage for ${pathwayId}`);
    }
  });

  it("does not allow visible lesson systems to resolve to zero lessons", () => {
    const visibleZeroRows = audit.zeroResultRows.filter((row) => row.visible);
    assert.deepEqual(
      visibleZeroRows.map((row) => `${row.pathwayId}:${row.systemLabel}`),
      [],
      "Visible lesson systems must never render with zero lessons.",
    );
  });

  it("keeps required shared lesson aliases mapped", () => {
    const rnRows = audit.coverageRows.filter((row) => row.pathwayId === "ca-rn-nclex-rn");
    const renal = rnRows.find((row) => row.routeSlug === "renal");
    const maternity = rnRows.find((row) => row.routeSlug === "maternity");
    const mentalHealth = rnRows.find((row) => row.routeSlug === "mental-health");

    assert.ok(renal, "Renal system row should exist.");
    assert.ok(renal.aliases.includes("renal-and-urinary"), "Renal alias should include renal-and-urinary.");
    assert.ok(
      renal.aliases.includes("fluids-electrolytes-and-acid-base"),
      "Renal alias should include fluids-electrolytes-and-acid-base.",
    );
    assert.ok(maternity, "Maternity system row should exist.");
    assert.ok(maternity.aliases.includes("maternal-and-newborn"), "Maternity alias should include maternal-and-newborn.");
    assert.ok(mentalHealth, "Mental Health system row should exist.");
    assert.ok(mentalHealth.aliases.includes("mental_health"), "Mental Health alias should include underscore spelling.");
  });

  it("does not introduce alias conflicts between visible systems", () => {
    const conflicts = audit.aliasConflictRows.filter((row) => row.conflict);
    assert.deepEqual(
      conflicts.map((row) => `${row.pathwayId}:${row.alias}:${row.systems.join(",")}`),
      [],
      "Aliases must not resolve to multiple visible lesson systems in the same pathway.",
    );
  });

  it("keeps rendered route slugs non-empty and backed by lesson inventory", () => {
    for (const row of audit.coverageRows) {
      assert.ok(row.routeSlug.trim(), `${row.pathwayId}:${row.systemLabel} has an empty route slug.`);
      assert.ok(row.lessonCount > 0, `${row.pathwayId}:${row.systemLabel} has no lessons.`);
      assert.ok(row.databaseMappings.length > 0, `${row.pathwayId}:${row.systemLabel} has no database/catalog mappings.`);
    }
  });
});
