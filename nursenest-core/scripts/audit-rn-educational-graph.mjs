#!/usr/bin/env node
/**
 * RN educational knowledge graph audit — orphans, canonical drift, glossary, remediation caps.
 * Run: node nursenest-core/scripts/audit-rn-educational-graph.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const srcRoot = path.join(appRoot, "src");

function walkTsFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walkTsFiles(p, out);
    } else if (/\.(ts|tsx|mjs)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

function scanLegacyRpnHrefs() {
  const files = walkTsFiles(srcRoot);
  const hits = [];
  const re = /\/canada\/rpn\/rex-pn/g;
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    const matches = text.match(re);
    if (matches?.length) hits.push({ file: path.relative(appRoot, f), count: matches.length });
  }
  return hits.sort((a, b) => b.count - a.count);
}

function countGlossaryTerms() {
  const reg = fs.readFileSync(path.join(srcRoot, "lib/seo/nursing-glossary-registry.ts"), "utf8");
  const slugs = [...reg.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return { count: slugs.length, slugs };
}

function countMechanismStatuses() {
  const reg = fs.readFileSync(path.join(srcRoot, "lib/seo/nursing-mechanism-clusters.ts"), "utf8");
  const published = (reg.match(/status:\s*"published"/g) ?? []).length;
  const planned = (reg.match(/status:\s*"planned"/g) ?? []).length;
  const draft = (reg.match(/status:\s*"draft"/g) ?? []).length;
  return { published, planned, draft };
}

function countInterpretationStatuses() {
  const reg = fs.readFileSync(path.join(srcRoot, "lib/clinical-interpretation/clinical-interpretation-registry.ts"), "utf8");
  const published = (reg.match(/status:\s*"published"/g) ?? []).length;
  const draft = (reg.match(/status:\s*"draft"/g) ?? []).length;
  const figma = (reg.match(/status:\s*"figma_pending"/g) ?? []).length;
  return { published, draft, figma_pending: figma };
}

const legacyRpn = scanLegacyRpnHrefs();
const glossary = countGlossaryTerms();
const mechanisms = countMechanismStatuses();
const interpretation = countInterpretationStatuses();

const report = {
  generatedAt: new Date().toISOString(),
  glossary,
  mechanisms,
  clinicalInterpretation: interpretation,
  legacyCanadaRpnRexPn: {
    fileCount: legacyRpn.length,
    topFiles: legacyRpn.slice(0, 15),
  },
  recommendations: [
    glossary.count < 200
      ? `Glossary at ${glossary.count} terms — expand via editorial batches toward 200+ with governance gates.`
      : "Glossary at target scale — maintain uniqueness audits.",
    legacyRpn.length > 0
      ? `Migrate ${legacyRpn.length} files still referencing /canada/rpn/rex-pn.`
      : "No legacy /canada/rpn/rex-pn hrefs in src.",
    "Remediation V2: mechanism → lessons → interpretation → prioritize → flashcards → CAT.",
    "Wire longitudinal weak-topic signals into buildTopicHubLearningGraph for personalized sequencing.",
  ],
};

const outPath = path.join(appRoot, "reports", "RN-EDUCATIONAL-GRAPH-AUDIT.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log(`\nWrote ${outPath}`);
