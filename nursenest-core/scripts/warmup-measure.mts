import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: [] });

const PATHWAY = "ca-np-cnple";

// Warm up the connection and buffer cache with a cheap query first
await p.examQuestion.count({ where: { studyLinkPathwayId: PATHWAY } });

console.log("Connection warm. Running 8 timed measurements...");
const times: number[] = [];
for (let i = 0; i < 8; i++) {
  const t0 = Date.now();
  await p.examQuestion.findMany({
    where: { studyLinkPathwayId: PATHWAY, isAdaptiveEligible: true, status: "published" },
    select: { id: true, difficulty: true, bodySystem: true, cognitiveLevel: true },
    take: 150
  });
  const ms = Date.now() - t0;
  times.push(ms);
  console.log(`  run ${i+1}: ${ms}ms`);
}
const avg = Math.round(times.reduce((s,t)=>s+t,0)/times.length);
const min = Math.min(...times);
const max = Math.max(...times);
const p95 = times.sort((a,b)=>a-b)[Math.floor(times.length * 0.95)]!;
console.log(`\nWarm: avg=${avg}ms p95=${p95}ms min=${min}ms max=${max}ms`);
console.log(JSON.stringify({ warm_avg: avg, warm_p95: p95, warm_min: min, warm_max: max }));

await p.$disconnect();
