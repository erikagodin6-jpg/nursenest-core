#!/usr/bin/env npx tsx
import "../src/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATHWAYS = [
  { id: "us-np-fnp",    tag: "pathway:us-np-fnp" },
  { id: "us-np-agpcnp", tag: "pathway:us-np-agpcnp" },
  { id: "us-np-pmhnp",  tag: "pathway:us-np-pmhnp" },
  { id: "us-np-whnp",   tag: "pathway:us-np-whnp" },
  { id: "us-np-pnp-pc", tag: "pathway:us-np-pnp-pc" },
];

// Phrases that signal generic/template rationales
const GENERIC_SIGNALS = [
  "np-level care requires",
  "choose the plan that confirms the diagnosis",
  "safest answer is the one that changes",
  "cannot-miss differential",
  "np must integrate diagnostic probability",
  "because the NP must connect",
  "prescribing is a diagnostic and monitoring decision",
];

// Required rationale components for a quality rationale
function scoreRationale(rationale: string | null): {
  score: number;
  issues: string[];
} {
  if (!rationale || rationale.trim().length === 0) return { score: 0, issues: ["MISSING"] };
  const r = rationale.toLowerCase();
  const issues: string[] = [];

  if (rationale.length < 80)   issues.push("TOO_SHORT");
  if (rationale.length < 200)  issues.push("BRIEF");

  const genericCount = GENERIC_SIGNALS.filter(s => r.includes(s.toLowerCase())).length;
  if (genericCount >= 3) issues.push("GENERIC_TEMPLATE");
  else if (genericCount >= 1) issues.push("PARTIALLY_GENERIC");

  // Should mention why correct AND why wrong
  const hasWhyCorrect  = r.includes("correct") || r.includes("because") || r.includes("demonstrates");
  const hasWhyWrong    = r.includes("incorrect") || r.includes("wrong") || r.includes("tempting") || r.includes("trap") || r.includes("miss");
  const hasClinical    = r.includes("clinical") || r.includes("patient") || r.includes("diagnos") || r.includes("prescrib");
  const hasExamContext = r.includes("np") || r.includes("practitioner") || r.includes("board") || r.includes("exam");

  if (!hasWhyCorrect) issues.push("MISSING_WHY_CORRECT");
  if (!hasWhyWrong)   issues.push("MISSING_WHY_WRONG");
  if (!hasClinical)   issues.push("MISSING_CLINICAL_CONTEXT");
  if (!hasExamContext) issues.push("MISSING_EXAM_RELEVANCE");

  const score = Math.max(0, 100 - issues.length * 15);
  return { score, issues };
}

console.log("=== NP RATIONALE QUALITY AUDIT ===\n");

for (const pw of PATHWAYS) {
  const rows = await prisma.examQuestion.findMany({
    where: { tags: { has: pw.tag }, status: "published" },
    select: { id: true, rationale: true, correctAnswerExplanation: true, distractorRationales: true, questionFormat: true },
  });

  let missing = 0, tooShort = 0, brief = 0, genericTemplate = 0, partiallyGeneric = 0;
  let missingWhyCorrect = 0, missingWhyWrong = 0, missingClinical = 0, scoreSum = 0;
  const issueMap = new Map<string, number>();

  for (const r of rows) {
    const { score, issues } = scoreRationale(r.rationale);
    scoreSum += score;
    for (const issue of issues) {
      issueMap.set(issue, (issueMap.get(issue) ?? 0) + 1);
      if (issue === "MISSING") missing++;
      if (issue === "TOO_SHORT") tooShort++;
      if (issue === "BRIEF") brief++;
      if (issue === "GENERIC_TEMPLATE") genericTemplate++;
      if (issue === "PARTIALLY_GENERIC") partiallyGeneric++;
      if (issue === "MISSING_WHY_CORRECT") missingWhyCorrect++;
      if (issue === "MISSING_WHY_WRONG") missingWhyWrong++;
      if (issue === "MISSING_CLINICAL_CONTEXT") missingClinical++;
    }
  }

  const n = rows.length;
  const avgScore = n > 0 ? (scoreSum / n).toFixed(1) : "N/A";

  console.log(`${pw.id} (${n} questions):`);
  console.log(`  Avg quality score:         ${avgScore}/100`);
  console.log(`  Missing rationale:         ${missing} (${pct(missing,n)}%)`);
  console.log(`  Too short (<80 chars):     ${tooShort} (${pct(tooShort,n)}%)`);
  console.log(`  Brief (<200 chars):        ${brief} (${pct(brief,n)}%)`);
  console.log(`  Generic template:          ${genericTemplate} (${pct(genericTemplate,n)}%)`);
  console.log(`  Partially generic:         ${partiallyGeneric} (${pct(partiallyGeneric,n)}%)`);
  console.log(`  Missing why-correct:       ${missingWhyCorrect} (${pct(missingWhyCorrect,n)}%)`);
  console.log(`  Missing why-wrong:         ${missingWhyWrong} (${pct(missingWhyWrong,n)}%)`);
  console.log(`  Missing clinical context:  ${missingClinical} (${pct(missingClinical,n)}%)`);

  // Sample 3 questions per quality tier
  const samples = rows
    .map(r => ({ r, s: scoreRationale(r.rationale) }))
    .sort((a, b) => a.s.score - b.s.score)
    .slice(0, 3);
  console.log(`  Lowest-scored samples:`);
  for (const { r, s } of samples) {
    console.log(`    [${r.id}] score=${s.score} issues=${s.issues.join(",")}`);
    console.log(`    rationale="${(r.rationale ?? "").slice(0, 120)}..."`);
  }
  console.log();
}

function pct(n: number, total: number): string {
  return total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";
}

await prisma.$disconnect();
