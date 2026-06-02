#!/usr/bin/env npx tsx
/**
 * Writes `reports/new-grad-hub-program.md` at the **repository root** (sibling of `nursenest-core/`).
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/write-new-grad-hub-report.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildNewGradHubProgramMarkdown } from "../src/lib/new-grad/new-grad-hub-report-markdown";

const HERE = dirname(fileURLToPath(import.meta.url));
/** `nursenest-core/` package root (Next app). */
const PKG_ROOT = resolve(HERE, "..");
/** Monorepo / workspace root (parent of the Next package). */
const REPO_ROOT = resolve(PKG_ROOT, "..");
const OUT = join(REPO_ROOT, "reports", "new-grad-hub-program.md");

const md = buildNewGradHubProgramMarkdown({ generatedAtIso: new Date().toISOString() });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md, "utf8");
// eslint-disable-next-line no-console
console.log(`Wrote ${OUT}`);
