import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: [] });

const PATHWAY = "ca-np-cnple";

// Check what idx_examq_pool_adaptive covers
const allExamIdxs = await p.$queryRaw<{indexname: string, indexdef: string}[]>`
  SELECT indexname, indexdef FROM pg_indexes
  WHERE tablename = 'exam_questions' AND indexname LIKE '%adapt%'
` as {indexname: string, indexdef: string}[];
console.log("Adaptive-related indexes:", JSON.stringify(allExamIdxs, null, 2));

const RUNS = 5;
const times: number[] = [];

console.log("\nMeasuring CAT cold-query latency AFTER index (5 runs)...");
for (let i = 0; i < RUNS; i++) {
  const t0 = Date.now();
  const rows = await p.examQuestion.findMany({
    where: { studyLinkPathwayId: PATHWAY, isAdaptiveEligible: true, status: "published" },
    select: { id: true, stem: true, difficulty: true, bodySystem: true, cognitiveLevel: true },
    take: 150
  });
  const ms = Date.now() - t0;
  times.push(ms);
  console.log(`  run ${i+1}: ${ms}ms (rows=${rows.length})`);
}
const avg = Math.round(times.reduce((s,t)=>s+t,0)/RUNS);
const min = Math.min(...times);
const max = Math.max(...times);
console.log(`\nAFTER: avg=${avg}ms min=${min}ms max=${max}ms`);
console.log(JSON.stringify({ phase: "after", avg, min, max, runs: times }));

// Also check EXPLAIN for the new index being used
const explain = await p.$queryRaw`
  EXPLAIN (FORMAT TEXT) SELECT id, stem, difficulty, body_system, cognitive_level
  FROM exam_questions
  WHERE study_link_pathway_id = 'ca-np-cnple'
    AND is_adaptive_eligible = true
    AND status = 'published'
  LIMIT 150
` as {["QUERY PLAN"]: string}[];
const plan = explain.map(r => r["QUERY PLAN"]).join("\n");
console.log("\nQuery plan:\n" + plan);

await p.$disconnect();
