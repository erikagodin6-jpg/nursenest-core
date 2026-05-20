#!/usr/bin/env node
/**
 * Lesson Duplicate Audit (v3 — token-fingerprint with false-positive filters)
 *
 * Excludes:
 *  - Numbered review series (e.g. "Cardiovascular: Review 11") — intentional spaced repetition
 *  - Cross-tier variants (RN vs RPN vs NP same topic) — expected and intentional
 *  - Lessons with canonicalLessonId set (already deprecated/merged)
 *
 * Exit code 0 = no actionable duplicates, 1 = duplicates found above threshold.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");

// ── Normalization ──────────────────────────────────────────────────────────
const STRIP_SUFFIXES = [
  " management", " treatment", " treatments", " nursing care", " nursing management",
  " care", " nursing", " interventions", " assessment", " exacerbation",
  " complications", " overview", " review", " basics", " fundamentals",
  " introduction", " intro", " pathophysiology", " education", " pharmacology",
  " medications", " therapy", " and management", " & management",
];
const STRIP_PREFIXES = [
  "nursing care for ", "nursing management of ", "management of ",
  "treatment of ", "care of the ", "care of ",
];
// stopwords to ignore when building fingerprint
const STOPWORDS = new Set([
  "a","an","the","and","or","of","for","in","to","with","is","are","was",
  "be","by","on","at","as","its","it","from","this","that","these","those",
  "rn","pn","rpn","np","nclex","rex","fnp","cnple","allied","specific","canada","us",
]);

function normalizeTitle(title) {
  let t = title.toLowerCase().trim();
  // Strip scope prefix: "NP: ...", "(RN) ...", "RN - ..."
  t = t.replace(/^\s*(rn|rpn|pn|np|allied)\s*[:\-]\s*/i, "");
  t = t.replace(/\s*\((rn|rpn|pn|np|allied|nclex|specific|canada|us|np-specific)\)\s*/gi, " ").trim();
  // Strip prefixes
  for (const p of STRIP_PREFIXES) {
    if (t.startsWith(p)) { t = t.slice(p.length); break; }
  }
  // Strip suffixes (repeat until stable)
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of STRIP_SUFFIXES) {
      if (t.endsWith(s)) { t = t.slice(0, t.length - s.length).trim(); changed = true; break; }
    }
  }
  return t.replace(/[:\-&,\/]+$/, "").trim();
}

// Fingerprint: sorted significant tokens (3+ chars, not stopwords)
function fingerprint(normalized) {
  return normalized
    .split(/[\s\/\-&,:()]+/)
    .map(w => w.replace(/[^a-z0-9]/g, ""))
    .filter(w => w.length >= 3 && !STOPWORDS.has(w))
    .sort()
    .join("|");
}

// Jaccard similarity on word sets
function jaccard(a, b) {
  const wa = new Set(a.split("|").filter(Boolean));
  const wb = new Set(b.split("|").filter(Boolean));
  if (wa.size === 0 && wb.size === 0) return 1;
  const inter = [...wa].filter(w => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union === 0 ? 1 : inter / union;
}

// ── Load all catalog files ─────────────────────────────────────────────────
function loadAllLessons() {
  const files = fs.readdirSync(CATALOG_DIR).filter(f =>
    f.endsWith(".json") &&
    !f.includes("master-map") && !f.includes("import-state") &&
    !f.includes("aliases") && !f.includes("checklist") &&
    !f.includes("generated-indexes")
  );

  const lessons = [];
  for (const file of files) {
    const fullPath = path.join(CATALOG_DIR, file);
    let raw;
    try { raw = JSON.parse(fs.readFileSync(fullPath, "utf8")); }
    catch (e) { console.error(`Parse error ${file}: ${e.message}`); continue; }

    const extractLesson = (lesson, pathwayId) => {
      if (!lesson.slug || !lesson.title) return;
      // Skip already-deprecated lessons (already handled)
      if (lesson.canonicalLessonId || lesson.deprecatedAt) return;
      // Skip numbered spaced-repetition review lessons (false positive)
      if (/:\s*review\s+\d+\s*$/i.test(lesson.title.trim())) return;
      if (lesson.isReviewLesson) return;
      lessons.push({
        slug: lesson.slug,
        title: lesson.title,
        topic: lesson.topic || "",
        topicSlug: lesson.topicSlug || "",
        bodySystem: lesson.bodySystem || "",
        pathwayId,
        catalogFile: file,
        sectionCount: Array.isArray(lesson.sections) ? lesson.sections.length : 0,
        sectionKinds: Array.isArray(lesson.sections) ? lesson.sections.map(s => s.kind).join(",") : "",
        seoTitle: lesson.seoTitle || "",
        alliedProfessionKey: lesson.alliedProfessionKey || null,
        audienceTiers: lesson.audienceTiers || [],
      });
    };

    if (raw.pathways) {
      for (const [pwId, pw] of Object.entries(raw.pathways)) {
        const arr = pw.lessons || pw;
        if (Array.isArray(arr)) arr.forEach(l => extractLesson(l, pwId));
      }
    } else if (Array.isArray(raw.lessons)) {
      raw.lessons.forEach(l => extractLesson(l, path.basename(file, ".json")));
    } else if (Array.isArray(raw)) {
      raw.forEach(l => extractLesson(l, path.basename(file, ".json")));
    }
  }
  return lessons;
}

// ── Tier classification ────────────────────────────────────────────────────
function classifyTier(lesson) {
  const pw = lesson.pathwayId.toLowerCase();
  if (pw.startsWith("np-") || pw.includes("-np-") || pw.includes("np-")) return "NP";
  if (pw.startsWith("rpn") || pw.includes("rex-pn") || pw.includes("nclex-pn")) return "RPN/PN";
  if (lesson.alliedProfessionKey) return "Allied";
  return "RN";
}

// ── Detect duplicates via fingerprint grouping + cross-group fuzzy ─────────
function detectDuplicates(lessons) {
  // Add normalized title and fingerprint to each lesson
  const enriched = lessons.map(l => ({
    ...l,
    normalized: normalizeTitle(l.title),
    fp: fingerprint(normalizeTitle(l.title)),
    tier: classifyTier(l),
  }));

  // Group 1: exact fingerprint match
  const byFp = new Map();
  for (const l of enriched) {
    if (!l.fp) continue;
    if (!byFp.has(l.fp)) byFp.set(l.fp, []);
    byFp.get(l.fp).push(l);
  }

  const clusters = [];
  const consumedSlugs = new Set(); // track lessons already in a cluster

  // Fingerprint-exact groups
  for (const [fp, group] of byFp.entries()) {
    if (group.length < 2) continue;
    // Deduplicate by pathwayId+slug
    const seen = new Set();
    const deduped = group.filter(l => {
      const k = `${l.pathwayId}::${l.slug}`;
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    if (deduped.length < 2) continue;

    for (const l of deduped) consumedSlugs.add(`${l.pathwayId}::${l.slug}`);
    clusters.push({ fp, matchType: "exact_fingerprint", similarity: 1.0, lessons: deduped });
  }

  // Group 2: partial overlap — share at least 1 significant token, same bodySystem, jaccard ≥ 0.45
  // Build an inverted index: token → [lessons]
  const tokenIndex = new Map();
  for (const l of enriched) {
    for (const tok of l.fp.split("|").filter(Boolean)) {
      if (!tokenIndex.has(tok)) tokenIndex.set(tok, []);
      tokenIndex.get(tok).push(l);
    }
  }

  const candidatePairs = new Set();
  for (const [, group] of tokenIndex.entries()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        if (a.fp === b.fp) continue; // already handled above
        // Same body system required
        if (a.bodySystem && b.bodySystem && a.bodySystem !== b.bodySystem) continue;
        const pairKey = [a.pathwayId + "::" + a.slug, b.pathwayId + "::" + b.slug].sort().join("|||");
        candidatePairs.add(pairKey);
      }
    }
  }

  // Evaluate candidate pairs
  const fuzzyGroups = new Map(); // fp1:::fp2 → lessons[]
  for (const pair of candidatePairs) {
    const [keyA, keyB] = pair.split("|||");
    const la = enriched.find(l => `${l.pathwayId}::${l.slug}` === keyA);
    const lb = enriched.find(l => `${l.pathwayId}::${l.slug}` === keyB);
    if (!la || !lb) continue;

    const sim = jaccard(la.fp, lb.fp);
    if (sim < 0.45) continue;

    // Merge into existing cluster or create new
    const clusterKey = [la.fp, lb.fp].sort().join("|||");
    if (!fuzzyGroups.has(clusterKey)) fuzzyGroups.set(clusterKey, { lessons: [], similarity: sim });
    const cg = fuzzyGroups.get(clusterKey);
    cg.similarity = Math.max(cg.similarity, sim);
    for (const l of [la, lb]) {
      if (!cg.lessons.find(x => x.pathwayId === l.pathwayId && x.slug === l.slug)) {
        cg.lessons.push(l);
      }
    }
  }

  for (const [key, cg] of fuzzyGroups.entries()) {
    if (cg.lessons.length < 2) continue;
    // Skip if all lessons already in an exact cluster
    const allConsumed = cg.lessons.every(l => consumedSlugs.has(`${l.pathwayId}::${l.slug}`));
    if (allConsumed) continue;
    // Add a label from the normalized titles
    const titles = [...new Set(cg.lessons.map(l => l.normalized))].join(" / ");
    clusters.push({ fp: titles, matchType: "fuzzy_token", similarity: cg.similarity, lessons: cg.lessons });
  }

  // Finalize clusters: sort lessons by section count desc, assign canonical
  for (const c of clusters) {
    c.lessons.sort((a, b) => b.sectionCount - a.sectionCount);
    c.canonical = c.lessons[0];
    c.toMerge = c.lessons.slice(1);
  }

  // Sort by lesson count desc
  clusters.sort((a, b) => b.lessons.length - a.lessons.length || a.fp.localeCompare(b.fp));
  return clusters;
}

// ── Risk assessment ────────────────────────────────────────────────────────
function assessRisk(cluster) {
  const tiers = new Set(cluster.lessons.map(l => l.tier));
  const n = cluster.lessons.length;
  if (tiers.size > 1 && n > 2) return "HIGH";
  if (tiers.size > 1) return "MEDIUM";
  if (n > 3) return "HIGH";
  if (n > 2) return "MEDIUM";
  return "LOW";
}

// ── Route builder ──────────────────────────────────────────────────────────
function lessonRoute(lesson) {
  const ROUTE_MAP = {
    "ca-rn-nclex-rn": "/canada/rn/nclex-rn/lessons",
    "us-rn-nclex-rn": "/us/rn/nclex-rn/lessons",
    "ca-rpn-rex-pn": "/canada/pn/rex-pn/lessons",
    "us-rn-nclex-pn": "/us/lpn/nclex-pn/lessons",
    "np-us-np-fnp": "/us/np/fnp/lessons",
    "np-ca-np-cnple": "/canada/np/cnple/lessons",
  };
  const base = ROUTE_MAP[lesson.pathwayId] || `/${lesson.pathwayId}/lessons`;
  return `${base}/${lesson.slug}`;
}

// ── Main ───────────────────────────────────────────────────────────────────
function main() {
  console.log("Loading lessons...");
  const allLessons = loadAllLessons();
  console.log(`Loaded ${allLessons.length} total lessons.`);

  const byPathway = {};
  for (const l of allLessons) byPathway[l.pathwayId] = (byPathway[l.pathwayId] || 0) + 1;

  console.log("Detecting duplicates (token-fingerprint method)...");
  const t0 = Date.now();
  const clusters = detectDuplicates(allLessons);
  console.log(`Found ${clusters.length} clusters in ${Date.now() - t0}ms.\n`);

  const highRisk = clusters.filter(c => assessRisk(c) === "HIGH");
  const medRisk  = clusters.filter(c => assessRisk(c) === "MEDIUM");
  const lowRisk  = clusters.filter(c => assessRisk(c) === "LOW");

  // ── Console summary ──────────────────────────────────────────────────────
  console.log("=".repeat(72));
  console.log("LESSON DUPLICATE AUDIT REPORT");
  console.log("=".repeat(72));
  console.log(`Total lessons:           ${allLessons.length}`);
  console.log(`Total pathways:          ${Object.keys(byPathway).length}`);
  console.log(`Duplicate clusters:      ${clusters.length}`);
  console.log(`  HIGH risk:             ${highRisk.length}`);
  console.log(`  MEDIUM risk:           ${medRisk.length}`);
  console.log(`  LOW risk:              ${lowRisk.length}`);
  console.log("");
  console.log("Lessons by pathway:");
  for (const [pw, n] of Object.entries(byPathway).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${pw.padEnd(45)} ${n}`);
  }
  console.log("");

  // Print top clusters
  const TOP = Math.min(clusters.length, 80);
  console.log(`\nTop ${TOP} duplicate clusters:\n`);
  for (const c of clusters.slice(0, TOP)) {
    const risk = assessRisk(c);
    const tiers = [...new Set(c.lessons.map(l => l.tier))].join(",");
    console.log(`[${risk}] "${c.fp}" (${Math.round(c.similarity*100)}% sim, ${c.lessons.length} lessons, tiers: ${tiers})`);
    console.log(`  ✓ CANONICAL: [${c.canonical.pathwayId}] ${c.canonical.title} (${c.canonical.sectionCount} sec)`);
    for (const m of c.toMerge) {
      console.log(`  → MERGE:     [${m.pathwayId}] ${m.title} (${m.sectionCount} sec, tier: ${m.tier})`);
    }
    console.log("");
  }

  // ── Write JSON report ────────────────────────────────────────────────────
  const outDir = path.join(__dirname, "../.claude/audits");
  fs.mkdirSync(outDir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    totalLessons: allLessons.length,
    totalPathways: Object.keys(byPathway).length,
    lessonsByPathway: byPathway,
    duplicateClusters: clusters.length,
    riskSummary: { HIGH: highRisk.length, MEDIUM: medRisk.length, LOW: lowRisk.length },
    clusters: clusters.map(c => {
      const risk = assessRisk(c);
      return {
        cluster: c.fp,
        matchType: c.matchType,
        similarity: Math.round(c.similarity * 100),
        risk,
        lessonCount: c.lessons.length,
        tiers: [...new Set(c.lessons.map(l => l.tier))],
        bodySystems: [...new Set(c.lessons.map(l => l.bodySystem).filter(Boolean))],
        topics: [...new Set(c.lessons.map(l => l.topic).filter(Boolean))],
        canonical: {
          slug: c.canonical.slug,
          title: c.canonical.title,
          pathwayId: c.canonical.pathwayId,
          tier: c.canonical.tier,
          sectionCount: c.canonical.sectionCount,
          route: lessonRoute(c.canonical),
        },
        toMerge: c.toMerge.map(m => ({
          slug: m.slug,
          title: m.title,
          pathwayId: m.pathwayId,
          tier: m.tier,
          sectionCount: m.sectionCount,
          route: lessonRoute(m),
        })),
      };
    }),
  };

  const jsonPath = path.join(outDir, "lesson-duplicate-audit.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // ── Write Markdown report ────────────────────────────────────────────────
  const lines = [
    "# Lesson Duplicate Audit Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    `- **Total lessons scanned:** ${report.totalLessons}`,
    `- **Total pathways:** ${report.totalPathways}`,
    `- **Duplicate clusters found:** ${report.duplicateClusters}`,
    `- **HIGH risk:** ${highRisk.length}`,
    `- **MEDIUM risk:** ${medRisk.length}`,
    `- **LOW risk:** ${lowRisk.length}`,
    "",
    "## Lessons by Pathway",
    "",
    ...Object.entries(byPathway).sort((a,b) => b[1]-a[1]).map(([pw,n]) => `- \`${pw}\`: ${n} lessons`),
    "",
    "## Canonical Lesson Rules",
    "",
    "- **Default:** one disease/condition = one comprehensive canonical lesson per tier",
    "- **Separate lessons allowed only when:** genuinely distinct scope (e.g. NP prescribing vs RN assessment, acute exacerbation vs chronic management, pediatric vs adult, ECG interpretation vs cardiac disease)",
    "- **Do NOT create:** standalone 'Management', 'Treatment', 'Care' lessons unless scope-distinct",
    "",
    "## Duplicate Clusters",
    "",
  ];

  for (const c of report.clusters) {
    lines.push(`### [${c.risk}] ${c.cluster}`);
    lines.push(`| Field | Value |`);
    lines.push(`|---|---|`);
    lines.push(`| Match type | ${c.matchType} |`);
    lines.push(`| Similarity | ${c.similarity}% |`);
    lines.push(`| Lessons | ${c.lessonCount} |`);
    lines.push(`| Tiers | ${c.tiers.join(", ")} |`);
    lines.push(`| Body systems | ${c.bodySystems.join(", ")} |`);
    lines.push(`| Topics | ${c.topics.join(", ")} |`);
    lines.push("");
    lines.push(`**✓ CANONICAL (keep):** \`${c.canonical.slug}\` — *${c.canonical.title}* (${c.canonical.sectionCount} sections)`);
    lines.push(`Route: \`${c.canonical.route}\``);
    lines.push("");
    if (c.toMerge.length > 0) {
      lines.push("**→ Merge into canonical:**");
      for (const m of c.toMerge) {
        lines.push(`- \`${m.slug}\` [\`${m.pathwayId}\`] — *${m.title}* (${m.sectionCount} sections, tier: ${m.tier})`);
        lines.push(`  Route: \`${m.route}\``);
      }
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  const mdPath = path.join(outDir, "lesson-duplicate-audit.md");
  fs.writeFileSync(mdPath, lines.join("\n"));

  console.log(`\nJSON report → ${jsonPath}`);
  console.log(`MD report  → ${mdPath}`);

  // ── CI gate: fail if within-same-pathway duplicates exceed threshold ──────
  // Cross-pathway (CA vs US, RN vs NP) are architectural decisions, not CI failures.
  // Only within-pathway semantic duplicates with HIGH risk fail the build.
  const withinPathwayHigh = clusters.filter(c => {
    if (assessRisk(c) !== "HIGH") return false;
    const pathways = new Set([c.canonical.pathwayId, ...c.toMerge.map(m => m.pathwayId)]);
    return pathways.size === 1; // all lessons in same pathway
  });

  if (withinPathwayHigh.length > 0) {
    console.error(
      `\n✗ CI GATE FAILED: ${withinPathwayHigh.length} HIGH-risk within-pathway duplicate clusters.`
    );
    console.error("  Resolve by merging into canonical lessons or adding to APPROVED_MERGES in canonical-lesson-rules.ts.\n");
    process.exit(1);
  }

  console.log("\n✓ CI gate passed — no unresolved within-pathway HIGH-risk duplicates.");
}

main();
