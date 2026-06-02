#!/usr/bin/env node
/**
 * Client bundles must not import @/content/pathway-lessons/* (even allowlisted JSON duplicates server payload).
 * Run from repository root: node scripts/ci/check-no-client-pathway-json.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const srcRoot = path.join(repoRoot, "nursenest-core", "src");

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else if (name.isFile() && name.name.endsWith(".tsx")) acc.push(full);
  }
}

function isClientComponent(text) {
  const head = text.slice(0, 4000);
  return /^\s*["']use client["'];?/m.test(head);
}

const files = [];
walk(srcRoot, files);

let bad = 0;
for (const fp of files) {
  const text = fs.readFileSync(fp, "utf8");
  if (!isClientComponent(text)) continue;
  if (!text.includes("@/content/pathway-lessons/")) continue;
  const rel = path.relative(repoRoot, fp).replace(/\\/g, "/");
  console.error(
    `::error:: check-no-client-pathway-json: client component imports pathway-lessons in ${rel} — load via server component or API`,
  );
  bad += 1;
}

if (bad) process.exit(1);
console.log("check-no-client-pathway-json: OK");
