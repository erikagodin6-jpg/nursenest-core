import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: [] });
const NP = ["us-np-fnp","us-np-agpcnp","us-np-whnp","us-np-pmhnp","ca-np-cnple","us-np-pnp-pc"];
const out = {};
for (const pw of NP) {
  const [total, withRationale, withPearl, withDistRationale, withStrategy, lessons, flashcards] = await Promise.all([
    p.examQuestion.count({ where: { studyLinkPathwayId: pw } }),
    p.examQuestion.count({ where: { studyLinkPathwayId: pw, rationale: { not: null } } }),
    p.examQuestion.count({ where: { studyLinkPathwayId: pw, clinicalPearl: { not: null } } }),
    p.examQuestion.count({ where: { studyLinkPathwayId: pw, distractorRationales: { not: null } } }),
    p.examQuestion.count({ where: { studyLinkPathwayId: pw, examStrategy: { not: null } } }),
    p.pathwayLesson.count({ where: { pathwayId: pw } }),
    p.flashcard.count({ where: { deck: { pathwayId: pw } } }),
  ]);
  // Empty lessons (no sections)
  const lessonsNoSections = await p.pathwayLesson.count({
    where: { pathwayId: pw, sections: { equals: null } }
  }).catch(() => -1);
  // Orphaned questions (rationale is null and clinicalPearl is null)
  const orphaned = await p.examQuestion.count({
    where: { studyLinkPathwayId: pw, rationale: null, clinicalPearl: null }
  });
  out[pw] = {
    questions: { total, withRationale, withPearl, withDistRationale, withStrategy, missing_rationale: total - withRationale, missing_pearl: total - withPearl, orphaned },
    lessons, flashcards,
    lessonsNoSections,
    coverage_pct: total > 0 ? { rationale: Math.round(withRationale/total*100), pearl: Math.round(withPearl/total*100), distractor: Math.round(withDistRationale/total*100) } : null
  };
}
console.log(JSON.stringify(out, null, 2));
await p.$disconnect();
