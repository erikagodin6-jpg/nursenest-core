#!/usr/bin/env node
/**
 * Prints one topic title per line from reports/patho-pharm-longtail-topic-inventory.md
 * for paste into Admin → Blog draft batch (topicsText). No DB writes.
 *
 * Usage (from repo root):
 *   node nursenest-core/scripts/blog/patho-pharm-inventory-topics.mjs
 *   node nursenest-core/scripts/blog/patho-pharm-inventory-topics.mjs --limit 150
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const invPath = path.join(repoRoot, "reports", "patho-pharm-longtail-topic-inventory.md");

const limitArg = process.argv.find((a) => a === "--limit");
const limit = limitArg ? Number(process.argv[process.argv.indexOf(limitArg) + 1]) : Infinity;

const raw = fs.readFileSync(invPath, "utf8");
const lines = raw.split("\n");
const titles = [];
for (const line of lines) {
  if (!line.startsWith("| ")) continue;
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 3) continue;
  if (cells[1] === "#" || cells[1] === "---:") continue;
  const num = Number(cells[1]);
  if (!Number.isFinite(num)) continue;
  titles.push(cells[2]);
  if (titles.length >= limit) break;
}
for (const t of titles) process.stdout.write(`${t}\n`);
