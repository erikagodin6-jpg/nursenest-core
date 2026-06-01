import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: [] });
const NP = ["us-np-fnp","us-np-agpcnp","us-np-whnp","us-np-pmhnp","ca-np-cnple","us-np-pnp-pc"];
const r = {};
for (const pw of NP) {
  const [q,fc,les] = await Promise.all([
    p.examQuestion.count({ where: { studyLinkPathwayId: pw } }),
    p.flashcard.count({ where: { deck: { pathwayId: pw } } }),
    p.pathwayLesson.count({ where: { pathwayId: pw } }),
  ]);
  r[pw] = {q, fc, les};
}
const [totQ, totFC] = await Promise.all([p.examQuestion.count(), p.flashcard.count()]);
console.log(JSON.stringify({ perPathway: r, totals: { q: totQ, fc: totFC } }, null, 2));
await p.$disconnect();
