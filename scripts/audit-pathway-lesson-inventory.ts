#!/usr/bin/env npx tsx
/**
 * Audit pathway lesson counts: catalog.json rows vs effective hub list after scoped-gold prepend.
 * Usage: npx tsx scripts/audit-pathway-lesson-inventory.ts [--enforce]
 *   --enforce  exit 1 if any core pathway is below MIN_LAUNCH (default 150)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";

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
] as const;

const MIN_LAUNCH = 150;

const enforce = process.argv.includes("--enforce");

type CatalogJson = { pathways?: Record<string, { lessons?: unknown[] }> };

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error("Missing catalog:", CATALOG);
    process.exit(2);
  }
  const raw = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as CatalogJson;
  const pathways = raw.pathways ?? {};

  let worst: { id: string; gap: number } | null = null;
  console.log(`Pathway lesson inventory (min launch = ${MIN_LAUNCH})`);
  console.log("Counts: catalog rows | effective (catalog + scoped-gold injectables not already in catalog)\n");

  for (const { id, label } of CORE_PATHWAYS) {
    const lessons = pathways[id]?.lessons;
    const catalogN = Array.isArray(lessons) ? lessons.length : 0;
    const merged = prependScopedGoldCatalogLessons(id, (lessons as Parameters<typeof prependScopedGoldCatalogLessons>[1]) ?? []);
    const effectiveN = merged.length;
    const gap = Math.max(0, MIN_LAUNCH - effectiveN);
    const ok = effectiveN >= MIN_LAUNCH;
    if (!ok && (worst == null || gap > worst.gap)) worst = { id, gap };
    console.log(
      `${ok ? "✓" : "✗"} ${id.padEnd(18)} catalog ${String(catalogN).padStart(4)}  effective ${String(effectiveN).padStart(4)}  ${ok ? "meets" : `needs +${gap}`}  (${label})`,
    );
  }

  console.log("");
  if (enforce) {
    if (worst) {
      console.error(`Enforce failed: ${worst.id} short by ${worst.gap} effective lessons (or more).`);
      process.exit(1);
    }
    console.log("All core pathways meet minimum effective count.");
    process.exit(0);
  }
}

main();
