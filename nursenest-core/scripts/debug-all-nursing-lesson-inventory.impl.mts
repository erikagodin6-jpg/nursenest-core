/**
 * Nursing lesson inventory: raw vs hub-effective counts, duplicates, topic distributions.
 * Run via: node scripts/debug-all-nursing-lesson-inventory.mjs (cwd: nursenest-core)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getCatalogLessonsRaw,
  getEffectiveCatalogLessonsForPathwaySync,
  pathwayHasBundledCatalogLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.resolve(__dirname, "..");
const REPORTS = path.join(CORE, "reports");

const PATHWAYS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "us-np-fnp",
  "ca-np-cnple",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

function conceptKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(nursing|nclex|rn|pn|basics|essentials|review|integrated|lesson)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicatesByKey(items: string[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const t of items) {
    const k = t.trim();
    if (!k) continue;
    const arr = m.get(k) ?? [];
    arr.push(k);
    m.set(k, arr);
  }
  const out = new Map<string, string[]>();
  for (const [k, arr] of m) {
    if (arr.length > 1) out.set(k, arr);
  }
  return out;
}

type PathwayReport = {
  pathwayId: string;
  rawCatalogCount: number;
  effectiveHubVisibleCount: number;
  uniqueCompositeIds: number;
  uniqueSlugs: number;
  topicsUsed: string[];
  topicSlugsUsed: string[];
  bodySystemsUsed: string[];
  hasNoBundledLessons: boolean;
};

const slugGlobal = new Map<string, { pathwayId: string; title: string }[]>();

function runPathway(pathwayId: string): PathwayReport {
  const raw = getCatalogLessonsRaw(pathwayId);
  const hasBundled = pathwayHasBundledCatalogLessonsSync(pathwayId);

  for (const r of raw) {
    const slug = (r.slug ?? "").trim();
    if (!slug) continue;
    const title = typeof r.title === "string" ? r.title : "";
    const list = slugGlobal.get(slug) ?? [];
    list.push({ pathwayId, title });
    slugGlobal.set(slug, list);
  }

  const topicsUsed = [...new Set(raw.map((r) => (typeof r.topic === "string" ? r.topic : "").trim()).filter(Boolean))].sort();
  const topicSlugsUsed = [...new Set(raw.map((r) => (typeof r.topicSlug === "string" ? r.topicSlug : "").trim()).filter(Boolean))].sort();
  const bodySystemsUsed = [...new Set(raw.map((r) => (typeof r.bodySystem === "string" ? r.bodySystem : "").trim()).filter(Boolean))].sort();

  const composite = raw
    .map((r) => {
      const slug = (r.slug ?? "").trim();
      return slug ? `${pathwayId}::${slug}` : "";
    })
    .filter(Boolean);

  return {
    pathwayId,
    rawCatalogCount: raw.length,
    effectiveHubVisibleCount: getEffectiveCatalogLessonsForPathwaySync(pathwayId).length,
    uniqueCompositeIds: new Set(composite).size,
    uniqueSlugs: new Set(raw.map((r) => (r.slug ?? "").trim()).filter(Boolean)).size,
    topicsUsed,
    topicSlugsUsed,
    bodySystemsUsed,
    hasNoBundledLessons: !hasBundled && raw.length === 0,
  };
}

function slugCollisionReport(): { slug: string; entries: { pathwayId: string; title: string }[] }[] {
  const out: { slug: string; entries: { pathwayId: string; title: string }[] }[] = [];
  for (const [slug, entries] of slugGlobal) {
    if (entries.length < 2) continue;
    const titles = new Set(entries.map((e) => e.title));
    if (titles.size > 1) {
      out.push({ slug, entries });
    }
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function main(): void {
  slugGlobal.clear();
  fs.mkdirSync(REPORTS, { recursive: true });

  const pathways = [...PATHWAYS];
  const byPathway: PathwayReport[] = pathways.map(runPathway);

  const md: string[] = [];
  md.push("# Nursing lesson inventory");
  md.push("");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push("");
  md.push("## Per pathway");
  md.push("");
  md.push(
    "| Pathway | Raw rows | Hub-effective | Unique slugs (raw) | Bundled? | Topics (count) | TopicSlugs (count) |",
  );
  md.push("|---------|----------|---------------|-------------------|------------|----------------|-------------------|");
  for (const p of byPathway) {
    md.push(
      `| ${p.pathwayId} | ${p.rawCatalogCount} | ${p.effectiveHubVisibleCount} | ${p.uniqueSlugs} | ${p.hasNoBundledLessons ? "no" : "yes"} | ${p.topicsUsed.length} | ${p.topicSlugsUsed.length} |`,
    );
  }
  md.push("");

  for (const p of byPathway) {
    md.push(`### ${p.pathwayId}`);
    md.push("");
    if (p.hasNoBundledLessons) {
      md.push("_No bundled catalog lessons for this pathway (may still use DB-published lessons at runtime)._");
      md.push("");
    }
    md.push(`- **Raw catalog count**: ${p.rawCatalogCount}`);
    md.push(`- **Effective hub-visible** (\`getEffectiveCatalogLessonsForPathwaySync\`): ${p.effectiveHubVisibleCount}`);
    md.push(`- **Composite IDs** (\`pathway::slug\`): ${p.uniqueCompositeIds}`);
    md.push(`- **Unique slugs (raw merged list)**: ${p.uniqueSlugs}`);
    md.push("");
    md.push("#### topic values");
    md.push("");
    md.push(p.topicsUsed.map((t) => `- ${mdEscape(t)}`).join("\n") || "_none_");
    md.push("");
    md.push("#### topicSlug values");
    md.push("");
    md.push(p.topicSlugsUsed.map((t) => `- \`${mdEscape(t)}\``).join("\n") || "_none_");
    md.push("");
    md.push("#### bodySystem values");
    md.push("");
    md.push(p.bodySystemsUsed.map((t) => `- ${mdEscape(t)}`).join("\n") || "_none_");
    md.push("");

    const eff = getEffectiveCatalogLessonsForPathwaySync(p.pathwayId);
    const tMap = duplicatesByKey(eff.map((l) => l.title));
    md.push("#### Duplicate titles (effective list)");
    md.push("");
    const td = [...tMap.entries()];
    if (td.length === 0) md.push("_None_");
    else {
      for (const [title, arr] of td) {
        md.push(`- **${mdEscape(title)}** (${arr.length}): ${eff.filter((l) => l.title === title).map((l) => l.slug).join(", ")}`);
      }
    }
    md.push("");

    md.push("#### Duplicate clinical concept keys (normalized title, effective)");
    md.push("");
    const ck = new Map<string, typeof eff>();
    for (const l of eff) {
      const k = conceptKey(l.title);
      if (k.length < 10) continue;
      const arr = ck.get(k) ?? [];
      arr.push(l);
      ck.set(k, arr);
    }
    const ckDup = [...ck.entries()].filter(([, arr]) => arr.length > 1);
    if (ckDup.length === 0) md.push("_None over threshold (key length ≥ 10)_");
    else {
      for (const [k, arr] of ckDup.slice(0, 40)) {
        md.push(`- \`${mdEscape(k)}\`: ${arr.map((l) => `\`${l.slug}\` (${mdEscape(l.title)})`).join("; ")}`);
      }
      if (ckDup.length > 40) md.push(`- _…${ckDup.length - 40} more_`);
    }
    md.push("");
  }

  md.push("## Cross-pathway slug reuse (same slug, different titles)");
  md.push("");
  const collisions = slugCollisionReport();
  if (collisions.length === 0) md.push("_None detected._");
  else {
    for (const c of collisions) {
      md.push(`- **${c.slug}**`);
      for (const e of c.entries) {
        md.push(`  - ${e.pathwayId}: ${mdEscape(e.title)}`);
      }
    }
  }

  const jsonOut = {
    generatedAt: new Date().toISOString(),
    pathways: byPathway,
    crossPathwaySlugTitleMismatches: collisions,
    canonicalNote:
      "Lesson identity in catalog is `slug` per pathway; composite id is `pathwayId::slug`. Hub visibility uses structural publicComplete + exam/country context filters.",
  };

  fs.writeFileSync(path.join(REPORTS, "nursing-lesson-inventory.json"), JSON.stringify(jsonOut, null, 2), "utf8");
  fs.writeFileSync(path.join(REPORTS, "nursing-lesson-inventory.md"), md.join("\n"), "utf8");

  const GAP_NEEDLES = [
    { id: "chest-pain-triage", label: "Chest Pain Triage", re: /\bchest pain\b.*\btriage\b|\btriage\b.*\bchest pain\b/i },
    { id: "ventricular-tachycardia", label: "Ventricular Tachycardia", re: /\bventricular tachycardia\b|\bvtach\b/i },
    { id: "pacemaker-management", label: "Pacemaker Management", re: /\bpacemaker\b/i },
    { id: "postoperative-complications", label: "Postoperative Complications", re: /\bpost[- ]?op\b.*\bcomplicat|\bpostoperative complications\b/i },
    { id: "pain-assessment", label: "Pain Assessment", re: /\bpain assessment\b|\bpain scale\b/i },
    { id: "delirium-dementia", label: "Delirium vs Dementia", re: /\bdelirium\b.*\bdementia\b|\bdementia\b.*\bdelirium\b/i },
    { id: "lithium-toxicity", label: "Lithium Toxicity", re: /\blithium\b.*\btoxicit|\blithium toxicity\b/i },
    { id: "serotonin-nms", label: "Serotonin Syndrome / NMS", re: /\bserotonin syndrome\b|\bneuroleptic malignant\b/i },
    { id: "croup-epiglottitis", label: "Croup vs Epiglottitis", re: /\bcroup\b.*\bepiglottitis\b|\bepiglottitis\b.*\bcroup\b/i },
    { id: "labor-stages", label: "Labor Stages", re: /\blabor stages\b|\bstage (?:1|2|3) (?:of )?labor\b/i },
    { id: "magnesium-sulfate-toxicity", label: "Magnesium Sulfate Toxicity", re: /\bmagnesium sulfate\b.*\btoxicit/i },
    { id: "newborn-hypoglycemia", label: "Newborn Hypoglycemia", re: /\bnewborn\b.*\bhypoglycem|\bhypoglycem.*\bnewborn\b/i },
    { id: "blood-product-admin", label: "Blood Product Administration", re: /\bblood product\b|\btransfusion administration\b/i },
    { id: "clabsi-prevention", label: "Central Line Infection Prevention", re: /\bclabsi\b|\bcentral line\b.*\binfection\b/i },
    { id: "parkland", label: "Burns: Parkland Formula", re: /\bparkland\b/i },
    { id: "traction-cast", label: "Traction & Cast Care", re: /\btraction\b.*\bcast\b|\bcast care\b/i },
    { id: "ckd", label: "Chronic Kidney Disease", re: /\bchronic kidney disease\b/i },
    { id: "cirrhosis-ascites", label: "Cirrhosis & Ascites", re: /\bcirrhosis\b.*\bascites\b|\bascites\b.*\bcirrhosis\b/i },
    { id: "gi-tube-aspiration", label: "GI Tube Placement & Aspiration Risk", re: /\baspiration risk\b.*\b(tube|ng)\b|\bng tube\b.*\bplacement\b/i },
  ] as const;

  const gapLines: string[] = ["# Nursing lesson gap scan", "", `Generated: ${new Date().toISOString()}`, "", "High-yield checklist vs **effective** catalog lesson titles (all nursing pathways).", ""];
  for (const g of GAP_NEEDLES) {
    const hits: { pathwayId: string; slug: string; title: string }[] = [];
    for (const pid of pathways) {
      for (const l of getEffectiveCatalogLessonsForPathwaySync(pid)) {
        if (g.re.test(l.title) || g.re.test(l.seoTitle ?? "")) {
          hits.push({ pathwayId: pid, slug: l.slug, title: l.title });
        }
      }
    }
    gapLines.push(`## ${g.label}`);
    gapLines.push("");
    if (hits.length === 0) {
      gapLines.push("_No effective catalog lesson title matched — consider adding content if a template exists elsewhere._");
    } else {
      for (const h of hits) {
        gapLines.push(`- \`${h.pathwayId}\` / \`${h.slug}\`: ${mdEscape(h.title)}`);
      }
    }
    gapLines.push("");
  }
  fs.writeFileSync(path.join(REPORTS, "nursing-lesson-gap-report.md"), gapLines.join("\n"), "utf8");

  console.log(`Wrote ${path.relative(CORE, path.join(REPORTS, "nursing-lesson-inventory.md"))}`);
  console.log(`Wrote ${path.relative(CORE, path.join(REPORTS, "nursing-lesson-inventory.json"))}`);
  console.log(`Wrote ${path.relative(CORE, path.join(REPORTS, "nursing-lesson-gap-report.md"))}`);

  console.log("\nSummary:\n");
  for (const p of byPathway) {
    console.log(
      `${p.pathwayId}: raw=${p.rawCatalogCount} effective=${p.effectiveHubVisibleCount} bundled=${p.hasNoBundledLessons ? "EMPTY" : "ok"}`,
    );
  }
}

void main();
