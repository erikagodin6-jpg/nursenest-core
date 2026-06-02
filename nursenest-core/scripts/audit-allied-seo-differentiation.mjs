#!/usr/bin/env node
/**
 * Audit allied bundled catalog for duplicate slugs, titles, meta descriptions, and intro bodies.
 * Writes reports/allied-seo-differentiation.md and exits 1 if any gate fails.
 *
 * Usage (from nursenest-core package root): node scripts/audit-allied-seo-differentiation.mjs
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const CATALOG = path.join(PKG_ROOT, "src/content/pathway-lessons/allied-bundled-catalog.json");
const OUT_DIR = path.join(PKG_ROOT, "reports");
const OUT_FILE = path.join(OUT_DIR, "allied-seo-differentiation.md");

const ALLIED_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"];

function normalizeText(s) {
  return String(s ?? "")
    .replace(/\*\*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function wordSet(s) {
  return new Set(
    normalizeText(s)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  const uni = new Set([...a, ...b]).size;
  return uni ? inter / uni : 0;
}

function introFromLesson(lesson) {
  const sections = lesson.sections;
  if (!Array.isArray(sections) || sections.length === 0) return "";
  const hit =
    sections.find((s) => s.kind === "introduction") ??
    sections.find((s) => s.id === "introduction") ??
    sections[0];
  const body = hit?.body;
  return typeof body === "string" ? body : "";
}

function mdEscape(s) {
  return String(s).replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 200);
}

async function main() {
  const raw = JSON.parse(await readFile(CATALOG, "utf8"));
  const pathways = raw.pathways ?? {};

  /** @type {Array<{ pathwayId: string; slug: string; title: string; seoTitle: string; seoDescription: string; intro: string }>} */
  const flat = [];
  const duplicateSlugs = [];

  for (const pathwayId of ALLIED_PATHWAY_IDS) {
    const rows = pathways[pathwayId];
    if (!Array.isArray(rows)) continue;
    const counts = new Map();
    for (const lesson of rows) {
      const slug = lesson.slug;
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    for (const [slug, n] of counts) {
      if (n > 1) duplicateSlugs.push({ pathwayId, slug, count: n });
    }
    for (const lesson of rows) {
      if (!lesson.slug) continue;
      flat.push({
        pathwayId,
        slug: lesson.slug,
        title: lesson.title ?? "",
        seoTitle: lesson.seoTitle ?? "",
        seoDescription: lesson.seoDescription ?? "",
        intro: introFromLesson(lesson),
      });
    }
  }

  const titleKey = (L) => normalizeText(L.seoTitle || L.title);
  const titleGroups = new Map();
  for (const L of flat) {
    const k = titleKey(L);
    if (!k) continue;
    if (!titleGroups.has(k)) titleGroups.set(k, []);
    titleGroups.get(k).push(L);
  }
  const distinctSlugCount = (arr) => new Set(arr.map((x) => x.slug)).size;

  const duplicateTitles = [...titleGroups.entries()].filter(
    ([, arr]) => arr.length > 1 && distinctSlugCount(arr) > 1,
  );

  const descGroups = new Map();
  for (const L of flat) {
    const k = normalizeText(L.seoDescription);
    if (!k) continue;
    if (!descGroups.has(k)) descGroups.set(k, []);
    descGroups.get(k).push(L);
  }
  /** Same metadata on different lesson slugs (US/CA mirrors share slug — excluded). */
  const duplicateDescriptions = [...descGroups.entries()].filter(
    ([, arr]) => arr.length > 1 && distinctSlugCount(arr) > 1,
  );

  const introNormGroups = new Map();
  for (const L of flat) {
    const k = normalizeText(L.intro.slice(0, 4000));
    if (k.length < 40) continue;
    if (!introNormGroups.has(k)) introNormGroups.set(k, []);
    introNormGroups.get(k).push(L);
  }
  const duplicateIntros = [...introNormGroups.entries()].filter(
    ([, arr]) => arr.length > 1 && distinctSlugCount(arr) > 1,
  );

  const nearDup = [];
  const introRich = flat.filter((L) => L.intro.length > 80);
  for (let i = 0; i < introRich.length; i++) {
    const wi = wordSet(introRich[i].intro.slice(0, 600));
    if (wi.size < 12) continue;
    for (let j = i + 1; j < introRich.length; j++) {
      if (introRich[i].slug === introRich[j].slug) continue;
      const wj = wordSet(introRich[j].intro.slice(0, 600));
      if (wj.size < 12) continue;
      const jac = jaccard(wi, wj);
      if (jac >= 0.92) {
        nearDup.push({ a: introRich[i], b: introRich[j], jaccard: jac });
      }
    }
  }

  const mirrorMetaDupes = [...descGroups.entries()].filter(
    ([, arr]) => arr.length > 1 && distinctSlugCount(arr) === 1,
  ).length;

  const fail =
    duplicateSlugs.length > 0 ||
    duplicateTitles.length > 0 ||
    duplicateDescriptions.length > 0 ||
    duplicateIntros.length > 0 ||
    nearDup.length > 0;

  let md = `# Allied SEO differentiation audit\n\n`;
  md += `Source: \`src/content/pathway-lessons/allied-bundled-catalog.json\`  \n`;
  md += `Pathways: ${ALLIED_PATHWAY_IDS.join(", ")}\n\n`;
  md += `## Runtime differentiation\n\n`;
  md += `Marketing lesson pages on allied core pathways apply \`buildAlliedAwareLessonPublicSeoSurface()\` when \`alliedProfessionKey\` is set on the lesson row (metadata, H1, JSON-LD headline/description, and \`about: Occupation\`). Catalog-only rows without that field rely on distinct titles/descriptions in JSON.\n\n`;
  md += `## Summary\n\n`;
  md += `| Check | Count |\n|---|--:|\n`;
  md += `| Duplicate slugs (within a pathway list) | ${duplicateSlugs.length} |\n`;
  md += `| Duplicate normalized titles (different slugs) | ${duplicateTitles.length} |\n`;
  md += `| Duplicate meta descriptions (different slugs; US/CA mirrors excluded) | ${duplicateDescriptions.length} |\n`;
  md += `| Duplicate lesson intros (different slugs) | ${duplicateIntros.length} |\n`;
  md += `| Near-duplicate intros (different slugs; Jaccard ≥ 0.92) | ${nearDup.length} |\n\n`;
  md += `**Gate:** ${fail ? "**FAIL** — fix duplicates below or bypass catalog issues before shipping." : "**PASS**"}\n\n`;
  md += `## Informational\n\n`;
  md += `- **US/CA mirrored lessons** (same slug, identical meta — excluded from duplicate gates): ${mirrorMetaDupes} description groups.\n\n`;

  md += `## Duplicate slugs\n\n`;
  if (!duplicateSlugs.length) md += `_None._\n\n`;
  else {
    md += `| Pathway | Slug | Count |\n|---|---|--:|\n`;
    for (const r of duplicateSlugs) {
      md += `| ${r.pathwayId} | ${r.slug} | ${r.count} |\n`;
    }
    md += `\n`;
  }

  md += `## Duplicate titles\n\n`;
  if (!duplicateTitles.length) md += `_None._\n\n`;
  else {
    for (const [k, arr] of duplicateTitles.slice(0, 40)) {
      md += `- **${mdEscape(k)}** → ${arr.map((x) => `\`${x.pathwayId}/${x.slug}\``).join(", ")}\n`;
    }
    if (duplicateTitles.length > 40) md += `\n_…truncated (${duplicateTitles.length} groups total)_\n`;
    md += `\n`;
  }

  md += `## Duplicate meta descriptions\n\n`;
  if (!duplicateDescriptions.length) md += `_None._\n\n`;
  else {
    for (const [k, arr] of duplicateDescriptions.slice(0, 40)) {
      md += `- **${mdEscape(k)}** → ${arr.map((x) => `\`${x.pathwayId}/${x.slug}\``).join(", ")}\n`;
    }
    if (duplicateDescriptions.length > 40) md += `\n_…truncated (${duplicateDescriptions.length} groups total)_\n`;
    md += `\n`;
  }

  md += `## Duplicate intros (exact normalized)\n\n`;
  if (!duplicateIntros.length) md += `_None._\n\n`;
  else {
    for (const [, arr] of duplicateIntros.slice(0, 25)) {
      md += `- ${arr.map((x) => `\`${x.pathwayId}/${x.slug}\``).join(", ")}\n`;
    }
    if (duplicateIntros.length > 25) md += `\n_…truncated (${duplicateIntros.length} groups total)_\n`;
    md += `\n`;
  }

  md += `## Near-duplicate intros\n\n`;
  if (!nearDup.length) md += `_None._\n\n`;
  else {
    md += `| Jaccard | Lesson A | Lesson B |\n|---:|---|---|\n`;
    for (const { a, b, jaccard: jac } of nearDup.slice(0, 60)) {
      md += `| ${jac.toFixed(3)} | ${a.pathwayId}/${a.slug} | ${b.pathwayId}/${b.slug} |\n`;
    }
    if (nearDup.length > 60) md += `\n_…truncated (${nearDup.length} pairs total)_\n`;
    md += `\n`;
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, md, "utf8");
  console.log(`Wrote ${path.relative(PKG_ROOT, OUT_FILE)}`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
