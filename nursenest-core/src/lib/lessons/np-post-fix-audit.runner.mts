/**
 * One-shot: post-fix NP structural + meaningful counts (stdout JSON).
 * Run from `nursenest-core/`: `npx tsx src/lib/lessons/np-post-fix-audit.runner.mts`
 */
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  evaluatePathwayLessonStructuralGate,
  lessonSectionsHaveMeaningfulClinicalContent,
} from "@/lib/lessons/pathway-lesson-premium";
import { buildNpStructuralFailureAudit, categorizeNpStructuralIssue } from "@/lib/lessons/np-pathway-lesson-structural-normalization";

const PATHWAYS = ["ca-np-cnple", "us-np-fnp"] as const;

let total = 0;
let publicComplete = 0;
let publicCompleteMeaningful = 0;
const failed: Array<{ slug: string; issues: string[] }> = [];
const issueTally = new Map<string, number>();
const catTally = new Map<string, number>();

for (const pid of PATHWAYS) {
  const lessons = getCatalogPathwayLessonsSync(pid);
  total += lessons.length;
  for (const lesson of lessons) {
    const gate = evaluatePathwayLessonStructuralGate(lesson);
    if (gate.publicComplete) {
      publicComplete += 1;
      if (lessonSectionsHaveMeaningfulClinicalContent(lesson.sections)) {
        publicCompleteMeaningful += 1;
      }
    } else {
      failed.push({ slug: lesson.slug, issues: gate.issues });
      for (const iss of gate.issues) {
        issueTally.set(iss, (issueTally.get(iss) ?? 0) + 1);
        const c = categorizeNpStructuralIssue(iss);
        catTally.set(c, (catTally.get(c) ?? 0) + 1);
      }
    }
  }
}

const audit = buildNpStructuralFailureAudit({ lessons: failed });
const topIssues = [...issueTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
const catPct =
  failed.length > 0
    ? Object.fromEntries([...catTally.entries()].map(([k, v]) => [k, `${((v / failed.length) * 100).toFixed(1)}%`]))
    : {};

// eslint-disable-next-line no-console -- runner
console.log(
  JSON.stringify(
    {
      pathways: PATHWAYS,
      totalLessons: total,
      publicComplete,
      publicCompletePct: `${((publicComplete / total) * 100).toFixed(1)}%`,
      publicCompleteAndMeaningful: publicCompleteMeaningful,
      publicCompleteAndMeaningfulPct: `${((publicCompleteMeaningful / total) * 100).toFixed(1)}%`,
      structuralFailures: failed.length,
      structuralFailurePct: `${((failed.length / total) * 100).toFixed(2)}%`,
      failureCategoryShareAmongFailures: catPct,
      topBlockingIssueStrings: topIssues.map(([issue, count]) => ({ count, issue })),
      auditTop5: audit.topBlockingIssues,
    },
    null,
    2,
  ),
);
