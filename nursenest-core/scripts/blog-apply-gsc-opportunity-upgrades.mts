/**
 * Apply GSC opportunity upgrades from `data/blog-content/gsc-opportunity-upgrades.json`.
 *
 * Default is DRY-RUN (no writes). Use `--apply` after review to persist.
 * Override file with `--manifest=data/blog-content/other.json`.
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./lib/prisma-script-client";
import {
  applyBodyFragmentsIdempotent,
  buildPrismaUpdateData,
  buildUpdatePreview,
  parseManifestFile,
  validateDisabledRowWarnings,
  validateEnabledManifestRow,
  verifyPostAfterApply,
  type DbPostSnapshot,
  type ManifestUpgrade,
  type UpdatePreview,
  type ValidatedManifestRow,
} from "@/lib/blog/gsc-opportunity-upgrades-apply";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

type RowOutcome = "applied" | "skipped" | "failed";

type RowResult = {
  slug: string;
  outcome: RowOutcome;
  reason?: string;
  preview?: UpdatePreview;
  verifyErrors?: string[];
};

function parseArgs(argv: string[]) {
  let manifestRel = "data/blog-content/gsc-opportunity-upgrades.json";
  let apply = false;
  for (const a of argv) {
    if (a === "--apply") apply = true;
    if (a === "--help" || a === "-h") return { help: true as const };
    if (a.startsWith("--manifest=")) manifestRel = a.slice("--manifest=".length);
  }
  return { help: false as const, manifestPath: path.join(__dirname, "..", manifestRel), apply };
}

function helpText(): string {
  return `GSC opportunity upgrades — manifest-driven blog patches.

Default: DRY-RUN (no database writes). Use --apply only after reviewing output.

Usage:
  npx tsx scripts/blog-apply-gsc-opportunity-upgrades.mts [options]

Options:
  --dry-run       Dry-run (default when --apply is omitted)
  --apply         Persist updates for eligible rows
  --manifest=REL  Path relative to nursenest-core (default: data/blog-content/gsc-opportunity-upgrades.json)
  --help, -h      Show this help
`;
}

const SELECT_POST = {
  id: true,
  title: true,
  body: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
  relatedLessonPaths: true,
  tags: true,
  targetKeyword: true,
  keywordCluster: true,
} as const;

function toSnapshot(row: {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  relatedLessonPaths: string[];
  tags: string[];
  targetKeyword: string | null;
  keywordCluster: string | null;
}): DbPostSnapshot {
  return { ...row };
}

function pad(s: string, w: number): string {
  const t = s.length > w ? `${s.slice(0, w - 1)}…` : s;
  return t.padEnd(w);
}

function printRowReport(p: UpdatePreview) {
  const seoT = p.seoTitleWillChange ? "yes" : "no";
  const seoD = p.seoDescriptionWillChange ? "yes" : "no";
  const ex = p.excerptWillChange ? "yes" : "no";
  console.info(`  ─ ${p.slug}`);
  console.info(`    postId:          ${p.postId ?? "(none)"}`);
  console.info(`    current title:   ${p.currentTitle.slice(0, 120)}${p.currentTitle.length > 120 ? "…" : ""}`);
  console.info(`    new title:       ${p.newTitle ?? "(unchanged)"}`);
  console.info(`    seoTitle change: ${seoT} | seoDescription change: ${seoD} | excerpt change: ${ex}`);
  console.info(`    lead block:      ${p.leadInsert} | cluster block: ${p.clusterInsert}`);
  console.info(`    paths to add:    ${p.pathsToAdd.length ? p.pathsToAdd.join(", ") : "(none)"}`);
  console.info(`    tags to add:     ${p.tagsToAdd.length ? p.tagsToAdd.join(", ") : "(none)"}`);
  console.info(`    decision:        ${p.decision}${p.skipReason ? ` (${p.skipReason})` : ""}`);
  if (p.decision === "apply") console.info(`    prisma keys:     ${p.prismaKeys.join(", ")}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.info(helpText());
    await prisma.$disconnect();
    return;
  }
  const { manifestPath, apply } = args;

  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (e) {
    console.error("Invalid JSON:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const parsed = parseManifestFile(parsedJson);
  if (!parsed.ok) {
    console.error(`Manifest parse error: ${parsed.error}`);
    process.exit(1);
  }

  const { manifest } = parsed;
  const upgrades = manifest.upgrades;
  const totalRows = upgrades.length;
  const rowResults: RowResult[] = [];

  if (manifest.instructions) console.info(manifest.instructions);
  console.info("");
  console.info(`[gsc-blog-upgrades] mode=${apply ? "APPLY" : "DRY-RUN"} manifest=${manifestPath}`);
  console.info(`[gsc-blog-upgrades] total manifest rows: ${totalRows}`);

  for (let i = 0; i < upgrades.length; i++) {
    const w = validateDisabledRowWarnings(upgrades[i], i);
    for (const line of w) console.warn(`[manifest-warn] ${line}`);
  }

  const enabledIndices: number[] = [];
  for (let i = 0; i < upgrades.length; i++) {
    const u = upgrades[i] as ManifestUpgrade;
    if (u.enabled === true) enabledIndices.push(i);
  }

  console.info(`[gsc-blog-upgrades] enabled rows (candidates): ${enabledIndices.length}`);
  console.info("");

  for (const i of enabledIndices) {
    const u = upgrades[i] as ManifestUpgrade;
    const slugRaw = u.slug ?? "";
    const validated = validateEnabledManifestRow(u, i);
    if (!validated.ok) {
      const slug = slugRaw.trim() || "(empty)";
      rowResults.push({
        slug,
        outcome: "skipped",
        reason: validated.reasons.join("; "),
      });
      console.info(`[row ${i + 1}] SKIP ${slug}`);
      console.info(`  reasons: ${validated.reasons.join("; ")}`);
      continue;
    }

    const manifestRow: ValidatedManifestRow = validated.row;
    const slug = manifestRow.slugNorm;

    const rows = await prisma.blogPost.findMany({
      where: { slug },
      select: SELECT_POST,
      take: 2,
    });

    let resolution: "unique" | "not_found" | "ambiguous";
    if (rows.length === 0) resolution = "not_found";
    else if (rows.length > 1) resolution = "ambiguous";
    else resolution = "unique";

    const post = rows[0] ? toSnapshot(rows[0]) : null;
    const preview = buildUpdatePreview(slug, post, manifestRow, resolution);

    printRowReport(preview);

    if (preview.decision === "skip") {
      rowResults.push({ slug, outcome: "skipped", reason: preview.skipReason, preview });
      console.info("");
      continue;
    }

    if (!apply) {
      rowResults.push({ slug, outcome: "skipped", reason: "dry_run", preview });
      console.info("");
      continue;
    }

    const data = buildPrismaUpdateData(post!, manifestRow);
    const keys = Object.keys(data).filter((k) => (data as Record<string, unknown>)[k] !== undefined);
    if (keys.length === 0) {
      rowResults.push({ slug, outcome: "skipped", reason: "no_prisma_fields", preview });
      console.info("");
      continue;
    }

    try {
      await prisma.blogPost.update({ where: { id: post!.id }, data });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      rowResults.push({ slug, outcome: "failed", reason: `db_update:${msg}`, preview });
      console.error(`  DB ERROR: ${msg}`);
      console.info("");
      continue;
    }

    const reloaded = await prisma.blogPost.findUnique({
      where: { id: post!.id },
      select: SELECT_POST,
    });
    if (!reloaded) {
      rowResults.push({ slug, outcome: "failed", reason: "reload_failed", preview });
      console.error("  VERIFY ERROR: post missing after update");
      console.info("");
      continue;
    }

    const snap = toSnapshot(reloaded);
    const verify = verifyPostAfterApply(slug, snap, manifestRow);
    if (!verify.ok) {
      rowResults.push({ slug, outcome: "failed", reason: "verify_failed", preview, verifyErrors: verify.errors });
      console.error(`  VERIFY FAILED: ${verify.errors.join("; ")}`);
      console.info("");
      continue;
    }

    rowResults.push({ slug, outcome: "applied", preview });
    console.info(`  ✓ Applied and verified (postId=${snap.id})`);
    console.info(`    final title: ${verify.snapshot.title.slice(0, 100)}${verify.snapshot.title.length > 100 ? "…" : ""}`);
    console.info(
      `    markers: lead×${verify.snapshot.leadMarkerCount} cluster×${verify.snapshot.clusterMarkerCount}`,
    );
    console.info("");
  }

  const applied = rowResults.filter((r) => r.outcome === "applied").length;
  const skipped = rowResults.filter((r) => r.outcome === "skipped").length;
  const failed = rowResults.filter((r) => r.outcome === "failed").length;
  const disabled = totalRows - enabledIndices.length;

  console.info("═".repeat(72));
  console.info("SUMMARY");
  console.info(`  total manifest rows:     ${totalRows}`);
  console.info(`  disabled / inactive:   ${disabled}`);
  console.info(`  enabled (considered):    ${enabledIndices.length}`);
  console.info(`  applied:                 ${applied}`);
  console.info(`  skipped:                 ${skipped}`);
  console.info(`  failed:                  ${failed}`);
  console.info("");
  console.info(pad("slug", 36) + pad("outcome", 10) + "reason / notes");
  console.info("-".repeat(72));
  for (const r of rowResults) {
    console.info(pad(r.slug, 36) + pad(r.outcome, 10) + (r.reason ?? ""));
  }
  if (rowResults.length === 0 && enabledIndices.length === 0) {
    console.info("(no enabled rows)");
  }
  console.info("═".repeat(72));

  if (failed > 0) process.exitCode = 1;

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
