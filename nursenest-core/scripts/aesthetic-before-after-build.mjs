#!/usr/bin/env node
/**
 * Build "after" mockups, side-by-side comparisons, and the review markdown from
 * real captures under docs/screenshots/aesthetic-before-after/before/.
 *
 * - "after" images are ALWAYS derived from the corresponding before PNG (sharp).
 * - safe-readability-pass: mild contrast/brightness (token-safe intent, not a redesign).
 * - document-only-banner: original pixels preserved; bottom strip states Figma / no fake layout mockup.
 *
 *   node scripts/aesthetic-before-after-build.mjs
 *
 * Prerequisite: run `npm run aesthetic-before-after:capture` first.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const ROOT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-before-after");
const BEFORE = path.join(ROOT, "before");
const AFTER = path.join(ROOT, "after");
const COMP = path.join(ROOT, "comparisons");
const MANIFEST = path.join(ROOT, "capture-manifest.json");
const REPORT = path.join(REPO_ROOT, "docs", "reports", "aesthetic-before-after-review.md");

const FILENAME_RE = /^before-(.+)-(ocean|blossom|midnight)-(desktop|mobile)\.png$/;

async function safeReadabilityPass(inputPath, outputPath) {
  await sharp(inputPath)
    .ensureAlpha()
    .linear(1.045, -(255 * 0.018))
    .modulate({ brightness: 1.012, saturation: 1.025 })
    .png({ compressionLevel: 9, effort: 7 })
    .toFile(outputPath);
}

async function documentOnlyBanner(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata();
  const w = meta.width ?? 1280;
  const h0 = meta.height ?? 900;
  const bannerH = Math.max(64, Math.round(Math.min(96, w * 0.06)));
  const svg = Buffer.from(
    `<svg width="${w}" height="${bannerH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <text x="16" y="${Math.round(bannerH * 0.62)}" font-family="system-ui,Segoe UI,sans-serif" font-size="${Math.min(20, Math.round(bannerH * 0.28))}" fill="#f8fafc">
        Layout / hierarchy: document in review — no synthetic full-page mockup (Figma-first)
      </text>
    </svg>`,
  );
  const banner = await sharp(svg).png().toBuffer();
  await sharp(inputPath)
    .extend({ bottom: bannerH, background: { r: 15, g: 23, b: 42 } })
    .composite([{ input: banner, left: 0, top: h0 }])
    .png({ compressionLevel: 9, effort: 7 })
    .toFile(outputPath);
}

async function sideBySide(beforePath, afterPath, outPath) {
  const targetW = 720;
  const leftBuf = await sharp(beforePath)
    .resize({ width: targetW, fit: "inside", background: { r: 255, g: 255, b: 255 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();
  const rightBuf = await sharp(afterPath)
    .resize({ width: targetW, fit: "inside", background: { r: 255, g: 255, b: 255 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  const m1 = await sharp(leftBuf).metadata();
  const m2 = await sharp(rightBuf).metadata();
  const h1 = m1.height ?? 1;
  const h2 = m2.height ?? 1;
  const H = Math.max(h1, h2);
  const gap = 28;
  const labelH = 52;
  const totalW = targetW * 2 + gap;
  const totalH = H + labelH;

  const padLeft = await sharp(leftBuf)
    .extend({ bottom: H - h1, background: { r: 248, g: 250, b: 252 } })
    .toBuffer();
  const padRight = await sharp(rightBuf)
    .extend({ bottom: H - h2, background: { r: 248, g: 250, b: 252 } })
    .toBuffer();

  const labelSvg = Buffer.from(
    `<svg width="${totalW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <text x="20" y="34" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#0f172a">Before (captured)</text>
      <text x="${20 + targetW + gap}" y="34" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#0f172a">After (from capture)</text>
    </svg>`,
  );
  const labelPng = await sharp(labelSvg).png().toBuffer();

  await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 3,
      background: { r: 248, g: 250, b: 252 },
    },
  })
    .composite([
      { input: labelPng, left: 0, top: 0 },
      { input: padLeft, left: 0, top: labelH },
      { input: padRight, left: targetW + gap, top: labelH },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

function loadManifest() {
  if (!existsSync(MANIFEST)) return null;
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return null;
  }
}

function inferFromFilename(name) {
  const m = name.match(FILENAME_RE);
  if (!m) return null;
  return { pageId: m[1], theme: m[2], viewport: m[3], file: name };
}

/** Best-effort route when a PNG exists on disk but was not listed in capture-manifest.json. */
function routeGuessFromPageId(pageId) {
  const map = {
    home: "/",
    "rt-hub": "/allied/respiratory",
    "mlt-hub": "/allied/mlt",
    dashboard: "/app",
    "lessons-hub": "/app/lessons",
    "flashcards-hub": "/app/flashcards",
    "practice-hub": "/app/practice-tests",
    "cat-hub": "/app/practice-tests (CAT)",
    "report-card": "/app/account/report",
    "account-settings": "/app/account/settings",
    "lesson-detail": "/app/lessons/…",
  };
  return map[pageId] ?? "(unknown — see capture-manifest.json)";
}

function inferredRowFromPng(beforePath) {
  const name = path.basename(beforePath);
  const inf = inferFromFilename(name);
  if (!inf) return null;
  const beforeRelPath = path.relative(REPO_ROOT, beforePath).split(path.sep).join("/");
  const marketing = ["home", "rt-hub", "mlt-hub"].includes(inf.pageId);
  return {
    pageId: inf.pageId,
    route: routeGuessFromPageId(inf.pageId),
    theme: inf.theme,
    viewport: inf.viewport,
    beforeRelPath,
    beforePath,
    mockupStrategy: "document-only-banner",
    severity: "moderate",
    recommendations: [
      "PNG present on disk but missing from capture-manifest.json (interrupted or parallel capture). Re-run `npm run aesthetic-before-after:capture` for full heuristics.",
      marketing
        ? "Treat marketing spacing/hierarchy recommendations as Figma-first unless scoped to tokens only."
        : "Treat learner shell hierarchy recommendations as Figma-first unless scoped to tokens only.",
    ],
    figmaApprovalRequired: true,
    implementationRisk: "medium",
    likelyAffectedFiles: marketing
      ? ["nursenest-core/src/app/(marketing)/**", "nursenest-core/src/app/semantic-status-tokens.css"]
      : ["nursenest-core/src/app/(student)/app/(learner)/**", "nursenest-core/src/app/semantic-status-tokens.css"],
    notes: "Inferred from filename — manifest row missing; metadata may be incomplete.",
    contrastHint: null,
    docOverflowPx: 0,
    capturedAt: new Date().toISOString(),
  };
}

async function main() {
  mkdirSync(AFTER, { recursive: true });
  mkdirSync(COMP, { recursive: true });
  mkdirSync(path.dirname(REPORT), { recursive: true });

  if (!existsSync(BEFORE)) {
    console.error("[before-after] Missing before/ — run npm run aesthetic-before-after:capture");
    process.exit(1);
  }

  const manifestJson = loadManifest();
  const rows = [];
  const seenBasenames = new Set();

  if (manifestJson?.captures?.length) {
    for (const c of manifestJson.captures) {
      const beforePath = path.join(REPO_ROOT, c.beforeRelPath);
      if (!existsSync(beforePath)) {
        console.warn("[before-after] skip missing", c.beforeRelPath);
        continue;
      }
      rows.push({ ...c, beforePath });
      seenBasenames.add(path.basename(beforePath));
    }
    // Merge: any before-*.png on disk not listed in manifest (e.g. partial / parallel capture).
    for (const name of readdirSync(BEFORE)) {
      if (!name.endsWith(".png") || !name.startsWith("before-")) continue;
      if (seenBasenames.has(name)) continue;
      const beforePath = path.join(BEFORE, name);
      const inferred = inferredRowFromPng(beforePath);
      if (!inferred) continue;
      console.warn("[before-after] manifest merge: adding disk-only", name);
      rows.push(inferred);
      seenBasenames.add(name);
    }
  } else {
    for (const name of readdirSync(BEFORE)) {
      if (!name.endsWith(".png")) continue;
      const inf = inferFromFilename(name);
      if (!inf) continue;
      const beforePath = path.join(BEFORE, name);
      rows.push({
        pageId: inf.pageId,
        route: "(unknown — re-run capture to write capture-manifest.json)",
        theme: inf.theme,
        viewport: inf.viewport,
        beforeRelPath: path.relative(REPO_ROOT, beforePath).split(path.sep).join("/"),
        beforePath,
        mockupStrategy: "document-only-banner",
        severity: "moderate",
        recommendations: ["Re-run capture to regenerate capture-manifest.json with heuristics."],
        figmaApprovalRequired: true,
        implementationRisk: "medium",
        likelyAffectedFiles: ["(see capture run)"],
        notes: "Manifest missing — inferred from filename only.",
        contrastHint: null,
        docOverflowPx: 0,
      });
    }
  }

  if (rows.length === 0) {
    console.error("[before-after] No before PNGs found.");
    process.exit(1);
  }

  const reportRows = [];

  for (const row of rows) {
    const afterFile = `after-${row.pageId}-${row.theme}-${row.viewport}.png`;
    const afterAbs = path.join(AFTER, afterFile);
    const compFile = `compare-${row.pageId}-${row.theme}-${row.viewport}.png`;
    const compAbs = path.join(COMP, compFile);

    const strategy = row.mockupStrategy || "document-only-banner";
    if (strategy === "safe-readability-pass") {
      await safeReadabilityPass(row.beforePath, afterAbs);
    } else {
      await documentOnlyBanner(row.beforePath, afterAbs);
    }

    await sideBySide(row.beforePath, afterAbs, compAbs);

    const beforeRel = row.beforeRelPath ?? path.relative(REPO_ROOT, row.beforePath).split(path.sep).join("/");
    const afterRel = path.relative(REPO_ROOT, afterAbs).split(path.sep).join("/");
    const compRel = path.relative(REPO_ROOT, compAbs).split(path.sep).join("/");

    reportRows.push({
      ...row,
      afterRel,
      compRel,
      beforeRel,
    });
  }

  const md = [];
  md.push("# Aesthetic before / after — real-site review");
  md.push("");
  md.push(`**Generated:** ${new Date().toISOString()}`);
  md.push("");
  md.push("## Rules used in this pass");
  md.push("");
  md.push("| Rule | Policy |");
  md.push("|------|--------|");
  md.push("| Before frames | Playwright full-page screenshots of the real NurseNest app (local/staging/prod per `PLAYWRIGHT_BASE_URL`). |");
  md.push("| After frames | **Always** produced from the matching before PNG via `sharp` — no stock templates, no invented pages. |");
  md.push("| `safe-readability-pass` | Mild global contrast/saturation — **CSS-token intent only**; safe to pilot behind review. |");
  md.push("| `document-only-banner` | **No fake layout mockup** — original capture + footer banner; **Figma** owns hierarchy/section/card reshaping. |");
  md.push("");
  md.push("## Per-capture matrix");
  md.push("");
  md.push(
    "| Page | Route | Theme | Viewport | Severity | Mockup strategy | Figma required? | Impl. risk | Before | After | Compare |",
  );
  md.push("|------|-------|-------|----------|----------|-----------------|-----------------|------------|--------|-------|---------|");
  for (const r of reportRows) {
    const recs = (r.recommendations || []).map((x) => x.replace(/\|/g, "\\|")).join(" **•** ");
    md.push(
      `| ${r.pageId} | \`${String(r.route).slice(0, 48)}\` | ${r.theme} | ${r.viewport} | ${r.severity} | ${r.mockupStrategy} | ${r.figmaApprovalRequired ? "Yes" : "No"} | ${r.implementationRisk} | \`${r.beforeRel}\` | \`${r.afterRel}\` | \`${r.compRel}\` |`,
    );
    md.push(`| | **Recommended changes** | | | | | | | ${recs || "—"} | | |`);
    md.push(
      `| | **Likely files** | | | | | | | ${(r.likelyAffectedFiles || []).join(", ").replace(/\|/g, "\\|")} | | |`,
    );
    md.push(`| | **Notes** | | | | | | | ${String(r.notes || "").replace(/\|/g, "\\|")} | | |`);
    md.push("| | | | | | | | | | | |");
  }
  md.push("");
  md.push("## Implementation guidance (no code shipped in this task)");
  md.push("");
  md.push("- **Safe to implement directly (still require design sign-off for copy):** token-only contrast tweaks, spacing scale alignment (`gap`/`padding` using existing tokens), fixing document overflow roots.");
  md.push("- **Figma approval first:** hero/section rhythm changes, card hierarchy restructures, new module entry treatments, report-card chart semantics beyond token swaps.");
  md.push("");
  md.push("## Regenerate");
  md.push("");
  md.push("```bash");
  md.push("cd nursenest-core");
  md.push("npm run aesthetic-before-after:capture");
  md.push("npm run aesthetic-before-after:build");
  md.push("```");
  md.push("");

  writeFileSync(REPORT, md.join("\n"));
  console.log(`[before-after] wrote ${reportRows.length} after + comparison pairs`);
  console.log(`[before-after] report: ${path.relative(process.cwd(), REPORT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
