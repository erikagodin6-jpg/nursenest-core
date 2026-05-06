import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
/** `nursenest-core/` app package root. */
const appRoot = join(here, "../../..");
/** Monorepo root (parent of `nursenest-core/`). */
const repoRoot = join(appRoot, "..");

const auditRunner = join(appRoot, "src/lib/legacy-feature-inventory/audit-legacy-feature-inventory.mjs");
const configSrc = join(appRoot, "src/lib/legacy-feature-inventory/legacy-feature-inventory-config.mjs");
const writersSrc = join(appRoot, "src/lib/legacy-feature-inventory/legacy-feature-inventory-writers.mjs");
const configMirror = join(repoRoot, "scripts/lib/legacy-feature-inventory-config.mjs");
const writersMirror = join(repoRoot, "scripts/lib/legacy-feature-inventory-writers.mjs");
const rootWrapper = join(repoRoot, "scripts/audit-legacy-feature-inventory.mjs");
const pkgJson = join(appRoot, "package.json");

describe("legacy feature inventory audit tool", () => {
  it("audit runner + config + writers exist under src/lib", () => {
    assert.ok(existsSync(auditRunner), auditRunner);
    assert.ok(existsSync(configSrc), configSrc);
    assert.ok(existsSync(writersSrc), writersSrc);
  });

  it("repo scripts/lib mirrors + root wrapper exist (contract with monorepo layout)", () => {
    assert.ok(existsSync(configMirror), configMirror);
    assert.ok(existsSync(writersMirror), writersMirror);
    assert.ok(existsSync(rootWrapper), rootWrapper);
  });

  it("nursenest-core package.json defines audit:legacy-features", () => {
    assert.ok(existsSync(pkgJson));
    const raw = readFileSync(pkgJson, "utf8");
    assert.match(raw, /"audit:legacy-features"\s*:\s*"node src\/lib\/legacy-feature-inventory\/audit-legacy-feature-inventory\.mjs"/);
  });

  it("running the audit (--smoke) produces JSON + markdown reports with required fields", () => {
    const r = spawnSync(process.execPath, [auditRunner, "--smoke"], {
      cwd: appRoot,
      encoding: "utf8",
      stdio: "pipe",
    });
    if (r.status !== 0) {
      throw new Error(`audit failed: ${r.stderr || r.stdout}`);
    }

    const jsonPath = join(repoRoot, "reports", "legacy-feature-inventory.json");
    const mdPath = join(repoRoot, "reports", "legacy-feature-inventory.md");
    const gapPath = join(repoRoot, "reports", "legacy-feature-gap-map.md");
    assert.ok(existsSync(jsonPath), jsonPath);
    assert.ok(existsSync(mdPath), mdPath);
    assert.ok(existsSync(gapPath), gapPath);

    const data = JSON.parse(readFileSync(jsonPath, "utf8")) as {
      generatedAt?: string;
      scanLimits?: { smoke?: boolean };
      summary?: { totalItems?: number; byCategory?: Record<string, number> };
      items?: Array<{
        category?: string;
        migrationStatus?: string;
        recommendedAction?: string;
        priority?: string;
        title?: string;
        id?: string;
      }>;
    };

    assert.ok(data.generatedAt && String(data.generatedAt).length > 8);
    assert.equal(data.scanLimits?.smoke, true);
    assert.ok(data.summary && typeof data.summary.totalItems === "number");
    assert.ok(Array.isArray(data.items) && data.items.length > 0);

    const requiredKeys: (keyof (typeof data.items)[0])[] = [
      "category",
      "migrationStatus",
      "recommendedAction",
      "priority",
    ];
    for (const it of data.items) {
      for (const k of requiredKeys) {
        assert.ok(it[k] != null && String(it[k]).length > 0, `${k} missing on ${it.id ?? it.title}`);
      }
    }

    const blob = JSON.stringify(data).toLowerCase();
    assert.match(blob, /med.?math|med_math/);
    assert.match(blob, /medication.?mastery|medication_mastery/);
    assert.match(blob, /osce/);
    assert.match(blob, /med-math-tool|tools\/med-math/);
  });
});
