/**
 * Writes reports/content-source-of-truth-audit.json and .md from CONTENT_REGISTRY.
 * Run: npm run content:source-of-truth:reports
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CONTENT_REGISTRY,
  CONTENT_REGISTRY_IDS,
  listRegistryEntries,
} from "../src/lib/content-source-of-truth/content-registry";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const reportsDir = join(root, "reports");
mkdirSync(reportsDir, { recursive: true });

const stamp = new Date().toISOString();
const entries = listRegistryEntries();

const auditJson = {
  generatedAt: stamp,
  contentTypes: CONTENT_REGISTRY_IDS.map((id) => ({
    id,
    ...CONTENT_REGISTRY[id],
    allowedImportSources: [...CONTENT_REGISTRY[id].allowedImportSources],
  })),
  legacyStoresSample: [
    "client/src/data/** (legacy Vite/monolith — migration sources)",
    "client/src/pages/** (legacy pages — not Next learner SoT)",
    "@legacy-client/** (bundled legacy — gated or migration only)",
    "src/content/pathway-lessons/*.json (catalog merge — DB wins when present)",
    "src/content/pathway-lessons/generated-indexes (build artifacts)",
  ],
  notes:
    "Live vs orphaned requires route-level audit; this artifact captures registry contracts. Expand with repo-wide inventory in follow-up.",
};

writeFileSync(join(reportsDir, "content-source-of-truth-audit.json"), `${JSON.stringify(auditJson, null, 2)}\n`, "utf8");

const mdLines = [
  "# Content source-of-truth audit (generated)",
  "",
  `Generated: ${stamp} (\`npm run content:source-of-truth:reports\`)`,
  "",
  "## Registry summary",
  "",
  "| id | verification | canonical storage | admin edit | learner read | legacy OK | generated OK |",
  "|---|----|----|----|----|----|----|",
];

for (const e of entries) {
  mdLines.push(
    `| ${e.id} | ${e.verificationStatus} | ${(e.canonicalStorageModel ?? "—").replace(/\|/g, "\\|")} | ${(e.adminEditRoute ?? "—").replace(/\|/g, "\\|")} | ${(e.learnerReadRoutePattern ?? "—").replace(/\|/g, "\\|")} | ${e.legacyFallbackAllowed} | ${e.generatedFolderAllowed} |`,
  );
}

mdLines.push(
  "",
  "## Legacy / generated inventory (high level)",
  "",
  ...auditJson.legacyStoresSample.map((s) => `- ${s}`),
  "",
  "## Next steps",
  "",
  "- Run domain migrations (OSCE, med-math, simulators MCQs) into canonical tables.",
  "- Add Playwright proofs for admin PATCH → public/learner HTML where status is PARTIAL.",
  "",
);

writeFileSync(join(reportsDir, "content-source-of-truth-audit.md"), mdLines.join("\n"), "utf8");
console.info("[content:source-of-truth:reports] wrote reports/content-source-of-truth-audit.{json,md}");
