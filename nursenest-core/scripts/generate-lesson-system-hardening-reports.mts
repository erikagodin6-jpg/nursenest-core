import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderLessonSystemHardeningReports } from "../src/lib/lessons/lesson-system-inventory-audit";

const docsDir = join(process.cwd(), "docs");
mkdirSync(docsDir, { recursive: true });

const reports = renderLessonSystemHardeningReports();
for (const [filename, content] of Object.entries(reports)) {
  writeFileSync(join(docsDir, filename), `${content.trimEnd()}\n`, "utf8");
}

console.log(`Generated ${Object.keys(reports).length} lesson hardening reports in docs/`);
