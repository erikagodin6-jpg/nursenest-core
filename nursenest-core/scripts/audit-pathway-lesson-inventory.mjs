#!/usr/bin/env node
/**
 * Audit pathway lesson counts from catalog.json against launch targets.
 * Usage: node scripts/audit-pathway-lesson-inventory.mjs [--enforce]
 *   --enforce  exit 1 if any core pathway is below MIN_LAUNCH (default 150)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");

const CORE_PATHWAYS = [
  { id: "us-rn-nclex-rn", label: "US RN (NCLEX-RN)" },
  { id: "ca-rn-nclex-rn", label: "Canada RN (NCLEX-RN)" },
  { id: "us-lpn-nclex-pn", label: "US LPN (NCLEX-PN)" },
  { id: "ca-rpn-rex-pn", label: "Canada RPN (REx-PN)" },
  { id: "us-np-fnp", label: "US NP (FNP)" },
  { id: "ca-np-cnple", label: "Canada NP (CNPLE)" },
];

const MIN_LAUNCH = 150;

const enforce = process.argv.includes("--enforce");

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error("Missing catalog:", CATALOG);
    process.exit(2);
  }
  const raw = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  const pathways = raw.pathways ?? {};

  let worst = null;
  console.log(`Pathway lesson inventory (min launch = ${MIN_LAUNCH})\n`);

  for (const { id, label } of CORE_PATHWAYS) {
    const lessons = pathways[id]?.lessons;
    const n = Array.isArray(lessons) ? lessons.length : 0;
    const gap = Math.max(0, MIN_LAUNCH - n);
    const ok = n >= MIN_LAUNCH;
    if (!ok && (worst == null || gap > worst.gap)) worst = { id, gap };
    console.log(
      `${ok ? "✓" : "✗"} ${id.padEnd(18)} ${String(n).padStart(4)} lessons  ${ok ? "meets" : `needs +${gap}`}  (${label})`,
    );
  }

  console.log("");
  if (enforce) {
    if (worst) {
      console.error(`Enforce failed: ${worst.id} short by ${worst.gap} (or more).`);
      process.exit(1);
    }
    console.log("All core pathways meet minimum.");
    process.exit(0);
  }
}

main();
