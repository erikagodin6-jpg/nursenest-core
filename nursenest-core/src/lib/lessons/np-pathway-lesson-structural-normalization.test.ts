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
    assert.equal(lessonSectionsHaveMeaningfulClinicalContent(rec.sections), true);
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
      let publicCompleteMeaningful = 0;
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
          if (lessonSectionsHaveMeaningfulClinicalContent(lesson.sections)) {
            publicCompleteMeaningful += 1;
          }
        }
      }

      const topIssues = [...issueTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

      assert.ok(
        publicCompleteMeaningful >= 700,
        `expected >=700 publicComplete+meaningful NP lessons, got ${publicCompleteMeaningful}; structuralFailures=${structuralFailures}; topIssues=${JSON.stringify(topIssues)}`,
      );
      assert.ok(
        structuralFailures <= 50,
        `expected <=50 residual structural failures, got ${structuralFailures}; topIssues=${JSON.stringify(topIssues)}`,
      );
    },
  );
});
