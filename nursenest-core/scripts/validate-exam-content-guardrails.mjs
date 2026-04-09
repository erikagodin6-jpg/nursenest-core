#!/usr/bin/env node
/**
 * Build-time guardrails: fail if pathway-scoped catalog slices contain forbidden cross-exam phrases.
 * Does not replace runtime checks — extend rules as new countries/exams ship.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "src/content/pathway-lessons/catalog.json");

function sliceCatalog(text, startKey, endKey) {
  const start = text.indexOf(`"${startKey}":`);
  const end = text.indexOf(`"${endKey}":`, start + 1);
  if (start === -1) throw new Error(`Start key ${startKey} not found`);
  if (end === -1) throw new Error(`End key ${endKey} not found after ${startKey}`);
  return text.slice(start, end);
}

const rules = [
  {
    name: "ca-rpn-rex-pn must not contain US NCLEX-PN exam framing",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bNCLEX-PN\b/i, /\bNCLEX_PN\b/i],
  },
  {
    name: "us-lpn-nclex-pn must not contain Canadian REx-PN exam name as the learner exam",
    slice: ["us-lpn-nclex-pn", "us-np-fnp"],
    forbidden: [/\bREx-PN\b/i, /\bREX_PN\b/i],
  },
];

function main() {
  const text = fs.readFileSync(catalogPath, "utf8");
  const failures = [];

  for (const rule of rules) {
    const [a, b] = rule.slice;
    let segment;
    try {
      segment = sliceCatalog(text, a, b);
    } catch (e) {
      failures.push(`${rule.name}: ${e.message}`);
      continue;
    }
    for (const re of rule.forbidden) {
      if (re.test(segment)) {
        failures.push(`${rule.name}: matched ${re}`);
      }
    }
  }

  if (failures.length) {
    console.error("validate-exam-content-guardrails: FAILED\n", failures.join("\n"));
    process.exit(1);
  }
  console.log("validate-exam-content-guardrails: OK");
}

main();
