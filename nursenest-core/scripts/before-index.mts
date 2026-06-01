import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: [] });

const PATHWAY = "ca-np-cnple";
const RUNS = 5;
const times: number[] = [];

console.log("Measuring CAT cold-query latency BEFORE index (5 runs)...");
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
console.log(`\nBEFORE: avg=${avg}ms min=${min}ms max=${max}ms`);
console.log(JSON.stringify({ phase: "before", avg, min, max, runs: times }));
await p.$disconnect();
