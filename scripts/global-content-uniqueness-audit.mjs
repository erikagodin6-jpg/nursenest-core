#!/usr/bin/env node
/**
 * Unifies blog/topic manifests into global uniqueness audit + master authority map.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const APP_ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_DIR = path.join(APP_ROOT, "data/blog-manifest");
const REPORTS_DIR = path.join(APP_ROOT, "reports");
const BLOG_IMPORT_WAVE2 = path.join(APP_ROOT, "data/blog-import-wave2");
const REPLIT_SEO = path.join(APP_ROOT, "data/replit-exports/seo_articles.json");

const STOP = new Set(
  `a an the and or for to of in on at by with from vs versus is are was were be been being it this that these those as if into about over after before between both but nor not only same such than then too very when while which who whom whose will with without your our their its his her she he they them we you i me my mine us can could should would may might must shall do does did done having have has had get got getting go going went come came take took make made see saw know knew think thought say said use used find found give gave work worked seem seemed feel felt try tried leave left call called keep kept let begin began show showed hear heard play played run ran move moved live lived believe believe stand stood own sit sat meet met include included continue continued set learn learned understand understood watch watch follow following stop stopped create created speak spoke read allow allows add added spend spent grow grew open opens walk walked win won offer offered remember love consider appears buy bought wait die died send sent build built stay fall fell cut reach kill remains suggest raise pass sell decide return explain develop carry drive break received agree support hit produce eat cover catch draw choose die died fight save serve end kill`.split(
    /\s+/,
  ),
);

function normTitle(s) {
  return String(s || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normKw(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s) {
  return new Set(
    normTitle(s)
      .split(" ")
      .filter((t) => t.length > 1 && !STOP.has(t)),
  );
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadPostsFromManifest(filePath, pillar, sourceLabel) {
  const data = readJson(filePath);
  if (!data) return [];
  const posts = data.posts || data.items || [];
  const out = [];
  for (const p of posts) {
    const slug = p.slug || p.id || "";
    const title = p.title || p.name || "";
    const pk = p.primaryKeyword || p.targetKeyword || p.keywords?.[0] || "";
    const sec = Array.isArray(p.secondaryKeywords) ? p.secondaryKeywords : [];
    const clusterId =
      p.clusterId || p.sourceClusterId || p.cluster_id || p.source_cluster_id || null;
    const pillarTopic = p.pillarTopic || p.pillar_topic || null;
    const pathway = p.pathway || p.career_track || null;
    const uniq = typeof p.uniquenessScore === "number" ? p.uniquenessScore : null;
    const pub =
      typeof p.publicationPriority === "number"
        ? p.publicationPriority
        : p.publicationPriority?.rank ?? p.publicationPriority?.wave ?? null;
    const trans =
      typeof p.translationPriority === "number"
        ? p.translationPriority
        : p.translationPriority === "high"
          ? 1
          : p.translationPriority === "medium"
            ? 2
            : 3;
    out.push({
      source: sourceLabel,
      pillar,
      slug,
      title,
      primaryKeyword: pk,
      secondaryKeywords: sec,
      clusterId,
      pillarTopic,
      pathway,
      uniquenessScore: uniq,
      publicationPriority: pub,
      translationPriority: trans,
      searchIntent: p.searchIntent || p.intentType || null,
    });
  }
  return out;
}

function loadNclex100() {
  const data = readJson(path.join(MANIFEST_DIR, "nclex-seo-100.manifest.json"));
  if (!data?.posts) return [];
  return data.posts.map((p) => ({
    source: "nclex-seo-100.manifest.json",
    pillar: "nursing_pathophysiology_exam_seo",
    slug: p.slug,
    title: p.title,
    primaryKeyword: p.primaryKeyword,
    secondaryKeywords: [],
    clusterId: `nclex-seo-wave-${p.publicationPriority?.wave ?? 1}`,
    pillarTopic: p.category || "NCLEX SEO",
    pathway: "RN",
    uniquenessScore: null,
    publicationPriority: p.publicationPriority?.rank ?? 99,
    translationPriority: p.translationPriority === "high" ? 1 : 2,
    searchIntent: p.intentType,
  }));
}

function loadBatch01Titles() {
  const data = readJson(path.join(MANIFEST_DIR, "batch-01/batch-01-import-ready.json"));
  if (!data?.posts) return [];
  return data.posts.map((p) => ({
    source: "batch-01-import-ready.json",
    pillar: "new_grad_transition_nclex_drafts",
    slug: p.slug,
    title: p.title,
    primaryKeyword: p.targetKeyword || "",
    secondaryKeywords: [],
    clusterId: "batch-01-nclex-seo-drafts",
    pillarTopic: p.category || "Batch 01",
    pathway: p.exam || "RN",
    uniquenessScore: null,
    publicationPriority: 1,
    translationPriority: 2,
    searchIntent: p.intent,
  }));
}

function loadBlogImportWave2() {
  if (!fs.existsSync(BLOG_IMPORT_WAVE2)) return [];
  const files = fs.readdirSync(BLOG_IMPORT_WAVE2).filter((f) => f.endsWith(".json"));
  const out = [];
  for (const f of files) {
    const data = readJson(path.join(BLOG_IMPORT_WAVE2, f));
    if (!data) continue;
    out.push({
      source: `blog-import-wave2/${f}`,
      pillar: "nursing_pathophysiology",
      slug: data.slug,
      title: data.breadcrumb?.[data.breadcrumb.length - 1]?.name || data.slug,
      primaryKeyword: data.keywords?.[0] || "",
      secondaryKeywords: (data.keywords || []).slice(1),
      clusterId: data.clusterId,
      pillarTopic: data.pillarTopic,
      pathway: data.pathway,
      uniquenessScore: null,
      publicationPriority: 5,
      translationPriority: 3,
      searchIntent: null,
    });
  }
  return out;
}

function loadReplitAllied() {
  const data = readJson(REPLIT_SEO);
  if (!Array.isArray(data)) return [];
  return data.slice(0, 200).map((r, i) => ({
    source: "replit-exports/seo_articles.json",
    pillar: "allied_health_seo_drafts",
    slug: String(r.slug || `replit-${i}`),
    title: r.title || "",
    primaryKeyword: r.target_keyword || "",
    secondaryKeywords: [],
    clusterId: r.cluster_id || "replit-unclustered",
    pillarTopic: r.career_track || "allied",
    pathway: "ALLIED",
    uniquenessScore: null,
    publicationPriority: r.published_at ? 1 : 9,
    translationPriority: 3,
    searchIntent: r.search_intent,
  }));
}

function main() {
  const missingFiles = [];
  const requested = [
    "pathophysiology-200.manifest.json",
    "pathophysiology-200-wave2.manifest.json",
    "allied-400.manifest.json",
    "newgrad-400.manifest.json",
  ];
  for (const f of requested) {
    if (!fs.existsSync(path.join(MANIFEST_DIR, f))) missingFiles.push(`data/blog-manifest/${f}`);
  }

  const all = [];

  all.push(
    ...loadPostsFromManifest(
      path.join(MANIFEST_DIR, "pathophysiology-200.manifest.json"),
      "nursing_pathophysiology",
      "pathophysiology-200.manifest.json",
    ),
  );
  all.push(
    ...loadPostsFromManifest(
      path.join(MANIFEST_DIR, "pathophysiology-200-wave2.manifest.json"),
      "nursing_pathophysiology",
      "pathophysiology-200-wave2.manifest.json",
    ),
  );
  all.push(...loadNclex100());
  all.push(...loadBatch01Titles());
  all.push(...loadBlogImportWave2());
  all.push(...loadReplitAllied());

  const globalTopicSet = new Set();
  const globalKeywordSet = new Set();
  const globalClusterSet = new Set();

  for (const row of all) {
    if (row.title) globalTopicSet.add(normTitle(row.title));
    if (row.primaryKeyword) globalKeywordSet.add(normKw(row.primaryKeyword));
    for (const s of row.secondaryKeywords || []) globalKeywordSet.add(normKw(s));
    if (row.clusterId) globalClusterSet.add(String(row.clusterId));
  }

  const bySlug = new Map();
  const byNormTitle = new Map();
  const duplicates = [];
  for (const row of all) {
    const ns = row.slug ? String(row.slug).toLowerCase().trim() : "";
    const nt = normTitle(row.title);
    if (ns) {
      if (bySlug.has(ns) && bySlug.get(ns).source !== row.source) {
        duplicates.push({
          kind: "duplicate_slug_across_sources",
          slug: ns,
          a: bySlug.get(ns),
          b: { source: row.source, title: row.title },
        });
      } else if (bySlug.has(ns)) {
        duplicates.push({
          kind: "duplicate_slug_same_source_listed_twice",
          slug: ns,
          source: row.source,
        });
      } else bySlug.set(ns, { source: row.source, title: row.title });
    }
    if (nt) {
      const key = nt;
      if (byNormTitle.has(key)) {
        const prev = byNormTitle.get(key);
        if (prev !== row.source) {
          duplicates.push({
            kind: "duplicate_normalized_title",
            normalizedTitle: key,
            sources: [prev, row.source],
          });
        }
      } else byNormTitle.set(key, row.source);
    }
  }

  const nearDupThreshold = 0.65;
  const nearDuplicates = [];
  const tokenCache = new Map();
  function tok(x) {
    if (!tokenCache.has(x)) tokenCache.set(x, tokens(x.title));
    return tokenCache.get(x);
  }

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.source === b.source && a.slug === b.slug) continue;
      const sim = jaccard(tok(a), tok(b));
      if (sim >= nearDupThreshold) {
        nearDuplicates.push({
          similarity: Number(sim.toFixed(3)),
          a: { source: a.source, title: a.title, slug: a.slug },
          b: { source: b.source, title: b.title, slug: b.slug },
        });
      }
    }
  }

  const kwToSources = new Map();
  for (const row of all) {
    const k = normKw(row.primaryKeyword);
    if (!k || k.length < 6) continue;
    if (!kwToSources.has(k)) kwToSources.set(k, []);
    kwToSources.get(k).push({ source: row.source, title: row.title, slug: row.slug });
  }
  const keywordCannibalization = [];
  for (const [k, arr] of kwToSources) {
    if (arr.length > 1) {
      const sources = [...new Set(arr.map((x) => x.source))];
      if (sources.length > 1)
        keywordCannibalization.push({ primaryKeyword: k, count: arr.length, posts: arr });
    }
  }
  keywordCannibalization.sort((a, b) => b.count - a.count);

  const clusterCounts = new Map();
  const clusterPillars = new Map();
  for (const row of all) {
    const c = row.clusterId || "uncategorized";
    clusterCounts.set(c, (clusterCounts.get(c) || 0) + 1);
    if (!clusterPillars.has(c)) clusterPillars.set(c, new Map());
    const pm = clusterPillars.get(c);
    pm.set(row.pillar, (pm.get(row.pillar) || 0) + 1);
  }
  const clusterOverlapRisks = [...clusterCounts.entries()]
    .filter(([id, n]) => n > 15 || id.includes("nclex-seo-wave"))
    .map(([clusterId, postCount]) => {
      const pm = clusterPillars.get(clusterId) || new Map();
      const pillars = [...pm.entries()].sort((x, y) => y[1] - x[1]);
      return { clusterId, postCount, pillarMix: Object.fromEntries(pillars) };
    })
    .sort((a, b) => b.postCount - a.postCount);

  const pillars = [
    "nursing_pathophysiology",
    "allied_health",
    "new_grad_transition",
    "post_licensure_unit_life",
  ];
  const coverage = {};
  for (const p of pillars) coverage[p] = all.filter((x) => x.pillar.includes(p.split("_")[0]) || x.pillar === p).length;

  const gaps = [];
  if (missingFiles.length) gaps.push({ gap: "missing_manifest_files", files: missingFiles });
  gaps.push({
    gap: "allied_400_manifest_absent",
    note: "Use replit seo_articles + future allied-400.manifest.json to reach 400-topic breadth.",
  });
  gaps.push({
    gap: "newgrad_400_manifest_absent",
    note: "Batch-01 + nclex-seo partially cover; dedicated newgrad-400.manifest.json not found.",
  });
  gaps.push({
    gap: "post_licensure_unit_life",
    note: "No dedicated manifest; risk overlap if NCLEX comparison posts expand into nurse practice without separate cluster IDs.",
  });

  const overlapByPillar = {};
  for (const row of all) {
    const p = row.pillar;
    overlapByPillar[p] = (overlapByPillar[p] || 0) + 1;
  }
  let maxPillar = null;
  let maxN = 0;
  for (const [p, n] of Object.entries(overlapByPillar)) {
    if (n > maxN) {
      maxN = n;
      maxPillar = p;
    }
  }

  const sourceToPillar = new Map();
  for (const row of all) {
    if (!sourceToPillar.has(row.source)) sourceToPillar.set(row.source, row.pillar);
  }
  const pillarNearDup = {};
  function pillarOfSource(src) {
    return sourceToPillar.get(src) || "unknown";
  }
  for (const nd of nearDuplicates) {
    const pa = pillarOfSource(nd.a.source);
    const pb = pillarOfSource(nd.b.source);
    pillarNearDup[pa] = (pillarNearDup[pa] || 0) + 1;
    if (pa !== pb) pillarNearDup[pb] = (pillarNearDup[pb] || 0) + 1;
  }
  let overlapRiskPillar = null;
  let overlapRiskScore = 0;
  for (const [p, c] of Object.entries(pillarNearDup)) {
    const vol = overlapByPillar[p] || 1;
    const risk = c / vol;
    if (risk > overlapRiskScore) {
      overlapRiskScore = risk;
      overlapRiskPillar = p;
    }
  }

  const wave2Clusters = all.filter((x) => x.source.includes("wave2") && x.clusterId);
  const seenPub = new Set();
  const pubOrder = [...all]
    .filter((x) => x.publicationPriority !== null && x.publicationPriority !== undefined)
    .sort((a, b) => {
      const sa = a.source.includes("nclex-seo-100") ? 0 : a.source.includes("batch-01") ? 1 : 2;
      const sb = b.source.includes("nclex-seo-100") ? 0 : b.source.includes("batch-01") ? 1 : 2;
      if (sa !== sb) return sa - sb;
      return Number(a.publicationPriority) - Number(b.publicationPriority);
    })
    .filter((x) => {
      if (!x.slug || seenPub.has(x.slug)) return false;
      seenPub.add(x.slug);
      return true;
    })
    .slice(0, 40);

  const clusterMeta = new Map();
  for (const row of all) {
    const cid = row.clusterId || "uncategorized";
    if (!clusterMeta.has(cid)) {
      clusterMeta.set(cid, {
        clusterId: cid,
        pillarTopic: row.pillarTopic,
        supporting: new Set(),
        audience: new Set(),
        scores: [],
      });
    }
    const m = clusterMeta.get(cid);
    if (row.title) m.supporting.add(row.title.slice(0, 120));
    if (row.pathway) m.audience.add(row.pathway);
    if (typeof row.uniquenessScore === "number") m.scores.push(row.uniquenessScore);
  }

  const masterAuthority = [];
  for (const [cid, m] of clusterMeta) {
    const pillarCounts = {};
    for (const row of all) {
      if ((row.clusterId || "uncategorized") !== cid) continue;
      pillarCounts[row.pillar] = (pillarCounts[row.pillar] || 0) + 1;
    }
    const pillar = Object.entries(pillarCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "nursing_pathophysiology";
    const avgUniq = m.scores.length ? m.scores.reduce((a, b) => a + b, 0) / m.scores.length : 0.75;
    const postCount = clusterCounts.get(cid) || 0;
    const seoPriority = Math.min(5, Math.max(1, Math.round(1 + postCount / 25)));
    const conversionPriority = Math.min(5, Math.max(1, Math.round(3 + (avgUniq - 0.7) * 10)));
    const publicationPriority = Math.min(5, Math.max(1, Math.round(5 - postCount / 40)));
    const translationPriority = cid.includes("nclex") ? 2 : 3;

    masterAuthority.push({
      pillar,
      clusterId: cid,
      pillarTopic: m.pillarTopic || cid.replace(/^cluster-/, "").replace(/-/g, " "),
      supportingTopics: [...m.supporting].slice(0, 12),
      audience: [...m.audience].join(", ") || "RN, PN, NP, new grad",
      uniquenessScore: Number(avgUniq.toFixed(2)),
      seoPriority,
      conversionPriority,
      publicationPriority,
      translationPriority,
    });
  }
  masterAuthority.sort((a, b) => a.publicationPriority - b.publicationPriority || b.uniquenessScore - a.uniquenessScore);

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });

  const uniqueSlugs = new Set(all.map((x) => x.slug).filter(Boolean));
  const mirrorPairs = duplicates.filter(
    (d) =>
      d.kind === "duplicate_slug_across_sources" &&
      ((d.a?.source === "pathophysiology-200.manifest.json" &&
        d.b?.source === "pathophysiology-200-wave2.manifest.json") ||
        (d.b?.source === "pathophysiology-200.manifest.json" &&
          d.a?.source === "pathophysiology-200-wave2.manifest.json")),
  );

  const clustersFirst = [...clusterOverlapRisks]
    .filter((c) => !String(c.clusterId).startsWith("nclex-seo-wave"))
    .slice(0, 12)
    .map((c) => c.clusterId);

  const auditJson = {
    generatedAt: new Date().toISOString(),
    sourcesLoaded: [...new Set(all.map((x) => x.source))],
    missingRequestedManifests: missingFiles,
    globalSets: {
      topicCount: globalTopicSet.size,
      keywordCount: globalKeywordSet.size,
      clusterCount: globalClusterSet.size,
      uniqueSlugCount: uniqueSlugs.size,
    },
    interpretation: {
      pathophysiology200Wave2MirrorDuplicateSlugs: mirrorPairs.length,
      note: "pathophysiology-200.manifest.json is sourced from wave2; keep a single authority file in production planning to avoid double-counting.",
    },
    duplicateCount: duplicates.length,
    nearDuplicatePairs: nearDuplicates.length,
    keywordCannibalizationCases: keywordCannibalization.length,
    duplicates: duplicates.slice(0, 200),
    nearDuplicates: nearDuplicates.slice(0, 150),
    keywordCannibalization: keywordCannibalization.slice(0, 80),
    clusterOverlapRisks: clusterOverlapRisks.slice(0, 60),
    pillarVolume: overlapByPillar,
    highestVolumePillar: maxPillar,
    nearDuplicateLoadByPillar: pillarNearDup,
    highestNearDuplicateOverlapRiskPillar: overlapRiskPillar,
    substantiveOverlapRiskPillar:
      "nursing_pathophysiology — largest blended corpus (pathophysiology manifests + NCLEX SEO + wave2 JSON) and highest cluster concentration; dedupe pathophysiology-200 vs wave2 before planning.",
    overlapRiskNote:
      "Per-pillar near-duplicate ratio can be skewed when a pillar has few posts (e.g. batch-01). Prefer substantiveOverlapRiskPillar for editorial priority.",
    topicGaps: gaps,
    recommendedPublishOrder: pubOrder.map((x, i) => ({
      rank: i + 1,
      source: x.source,
      slug: x.slug,
      title: x.title?.slice(0, 100),
      publicationPriority: x.publicationPriority,
    })),
    clustersRecommendedAfterNclexWave1: clustersFirst,
  };

  fs.writeFileSync(path.join(REPORTS_DIR, "global-content-uniqueness-audit.json"), JSON.stringify(auditJson, null, 2));

  const md = [];
  md.push(`# Global content uniqueness audit`);
  md.push(``);
  md.push(`Generated: ${auditJson.generatedAt}`);
  md.push(``);
  md.push(`## Summary`);
  md.push(`- **Total topic records scanned:** ${all.length}`);
  md.push(`- **Unique normalized titles:** ${globalTopicSet.size}`);
  md.push(`- **Unique normalized keywords:** ${globalKeywordSet.size}`);
  md.push(`- **Unique cluster IDs:** ${globalClusterSet.size}`);
  md.push(`- **Exact duplicate records (slug/title collisions):** ${duplicates.length}`);
  md.push(
    `  - *Mirror duplicates (pathophysiology-200 vs wave2 only):* **${mirrorPairs.length}** — treat as one corpus.`,
  );
  md.push(`- **Unique slugs across all sources:** ${uniqueSlugs.size}`);
  md.push(`- **Near-duplicate title pairs (Jaccard ≥ ${nearDupThreshold}):** ${nearDuplicates.length}`);
  md.push(`- **Primary-keyword cannibalization groups (cross-source):** ${keywordCannibalization.length}`);
  md.push(`- **Missing manifests:** ${missingFiles.length ? missingFiles.join(", ") : "none"}`);
  md.push(``);
  md.push(`## Pillar volume (proxy for overlap surface area)`);
  for (const [k, v] of Object.entries(overlapByPillar).sort((a, b) => b[1] - a[1])) {
    md.push(`- **${k}:** ${v}`);
  }
  md.push(``);
  md.push(`## Cluster concentration (overlap risk)`);
  for (const c of clusterOverlapRisks.slice(0, 25)) {
    md.push(`- **${c.clusterId}** — ${c.postCount} posts`);
  }
  md.push(``);
  md.push(`## Recommended publish order (first 25)`);
  for (const p of auditJson.recommendedPublishOrder.slice(0, 25)) {
    md.push(`${p.rank}. [${p.source}] ${p.title}`);
  }
  md.push(``);
  md.push(`## Topic gaps`);
  for (const g of gaps) {
    md.push(`- ${JSON.stringify(g)}`);
  }

  md.push(``);
  md.push(`## Clusters to schedule after NCLEX wave-1 SEO (high-yield systems)`);
  for (const id of clustersFirst) {
    md.push(`- **${id}**`);
  }

  fs.writeFileSync(path.join(REPORTS_DIR, "global-content-uniqueness-audit.md"), md.join("\n"));

  fs.writeFileSync(
    path.join(MANIFEST_DIR, "master-topic-authority-map.json"),
    JSON.stringify(
      {
        version: 1,
        generatedAt: new Date().toISOString(),
        description:
          "Cluster-level authority map for coordinated publishing; scores are heuristic from corpus size and avg uniqueness where available.",
        clusters: masterAuthority,
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify(
      {
        records: all.length,
        duplicates: duplicates.length,
        nearDuplicatePairs: nearDuplicates.length,
        keywordCannibalization: keywordCannibalization.length,
        reports: [
          "reports/global-content-uniqueness-audit.json",
          "reports/global-content-uniqueness-audit.md",
          "data/blog-manifest/master-topic-authority-map.json",
        ],
      },
      null,
      2,
    ),
  );
}

main();
