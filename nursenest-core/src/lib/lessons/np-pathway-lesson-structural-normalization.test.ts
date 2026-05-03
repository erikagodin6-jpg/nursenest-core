/**
 * NP structural gate mechanical completion (internal links + refs + scenario signal).
 *
 * Run: `npx tsx --test src/lib/lessons/np-pathway-lesson-structural-normalization.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCatalogLessonRawBySlug,
  getCatalogPathwayLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  evaluatePathwayLessonStructuralGate,
  lessonSectionsHaveMeaningfulClinicalContent,
  lessonSectionsHaveMeaningfulClinicalContentLegacy,
} from "@/lib/lessons/pathway-lesson-premium";
import { categorizeNpStructuralIssue } from "@/lib/lessons/np-pathway-lesson-structural-normalization";

describe("NP premium structural completion", () => {
  it("classifies internal-link gate copy into internal_links bucket", () => {
    assert.equal(
      categorizeNpStructuralIssue(
        "Related / internal study flow: include at least 3 internal links using [anchor](LESSON:slug) or [anchor](/path) in the lesson body (often in the Next steps section).",
      ),
      "internal_links",
    );
  });

  it("makes a previously failing CNPLE hypertension row publicComplete + meaningful", () => {
    const raw = getCatalogLessonRawBySlug(
      "ca-np-cnple",
      "np-hypertension-diagnosis-and-guideline-based-management",
    );
    assert.ok(raw, "expected catalog raw row for np hypertension slug");
    const rec = normalizeLesson(raw, "ca-np-cnple");
    const gate = evaluatePathwayLessonStructuralGate(rec);
    assert.equal(gate.publicComplete, true, gate.issues.join(" | "));
    assert.equal(
      lessonSectionsHaveMeaningfulClinicalContentLegacy(rec.sections),
      true,
      "legacy meaningful baseline for NP hypertension row",
    );
    assert.equal(
      lessonSectionsHaveMeaningfulClinicalContent(rec.sections),
      true,
      "upgraded meaningful-clinical pillars for NP hypertension row",
    );
  });

  it("makes a previously failing US FNP coronary row publicComplete", () => {
    const raw = getCatalogLessonRawBySlug(
      "us-np-fnp",
      "np-coronary-artery-disease-risk-stratification-and-management",
    );
    assert.ok(raw);
    const rec = normalizeLesson(raw, "us-np-fnp");
    const gate = evaluatePathwayLessonStructuralGate(rec);
    assert.equal(gate.publicComplete, true, gate.issues.join(" | "));
  });

  it(
    "raises NP publicComplete coverage to the expansion target (catalog merge)",
    { timeout: 360_000 },
    () => {
      let publicCompleteMeaningfulNew = 0;
      let publicCompleteMeaningfulLegacy = 0;
      let structuralFailures = 0;
      const issueTally = new Map<string, number>();

      for (const pathwayId of ["ca-np-cnple", "us-np-fnp"] as const) {
        const lessons = getCatalogPathwayLessonsSync(pathwayId);
        for (const lesson of lessons) {
          const gate = evaluatePathwayLessonStructuralGate(lesson);
          if (!gate.publicComplete) {
            structuralFailures += 1;
            for (const iss of gate.issues) issueTally.set(iss, (issueTally.get(iss) ?? 0) + 1);
            continue;
          }
          if (lessonSectionsHaveMeaningfulClinicalContentLegacy(lesson.sections)) {
            publicCompleteMeaningfulLegacy += 1;
          }
          if (lessonSectionsHaveMeaningfulClinicalContent(lesson.sections)) {
            publicCompleteMeaningfulNew += 1;
          }
        }
      }

      const topIssues = [...issueTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

      assert.ok(
        publicCompleteMeaningfulLegacy >= 700,
        `expected >=700 publicComplete+legacy-meaningful NP lessons, got ${publicCompleteMeaningfulLegacy}; structuralFailures=${structuralFailures}; topIssues=${JSON.stringify(topIssues)}`,
      );
      assert.ok(
        publicCompleteMeaningfulNew >= 1,
        `expected at least one publicComplete+upgraded-meaningful NP lesson for smoke coverage, got ${publicCompleteMeaningfulNew}; legacy=${publicCompleteMeaningfulLegacy}; delta=${publicCompleteMeaningfulNew - publicCompleteMeaningfulLegacy}`,
      );
      assert.ok(
        structuralFailures <= 50,
        `expected <=50 residual structural failures, got ${structuralFailures}; topIssues=${JSON.stringify(topIssues)}`,
      );
    },
  );
});
