#!/usr/bin/env npx tsx
/**
 * Bounded JSON report: which registry pathways are DB-backed vs catalog vs empty.
 * Does not dump lesson bodies. Requires DATABASE_URL for DB counts (omit for catalog-only view).
 */
import "../src/lib/db/env-bootstrap";
import { buildRegistryPathwayLessonSourceReport } from "@/lib/lessons/pathway-lesson-registry-source";

async function main() {
  const report = await buildRegistryPathwayLessonSourceReport();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
