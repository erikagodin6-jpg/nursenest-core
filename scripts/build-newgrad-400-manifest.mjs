#!/usr/bin/env node
/**
 * newgrad-400.manifest.json — transition-to-practice topics, deduped vs nursing + wave2 + allied-400 + imports.
 * Publish-facing titles/slugs without seed slot tokens: run `node scripts/cleanup-and-validate-newgrad-manifest.mjs`
 * after changing seeds; that script overwrites data/blog-manifest/newgrad-400.manifest.json with cleaned titles.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NEWGRAD_SEED_CANDIDATES } from "./newgrad-400-seed-candidates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const STOP = new Set(
  `the and for with from that this your you are was were has have had not but can will may one two any item items stem stems when then than into also just only same other more most such each exam test bank practice blog lesson guide review questions answers about which what why how does cause causes patient clients client care clinical priority priorities first assessment monitoring teaching education management treatment therapy protocol order orders per day case scenario pathophysiology nursenest`.split(
    /\s+/,
  ),
);

const NURSING_MARKERS = new Set(
  `nclex rn pn np nursing nurse registered practical nurse practitioner licensure`.split(/\s+/),
);

const STOP_NG_EXTRA = new Set(
  `actually like really happens shift first new grad graduate graduation orientation residency preceptor transition practice workflow story topic allied`.split(
    /\s+/,
  ),
);

function tokenSetNg(s) {
  const out = new Set();
  for (const w of String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)) {
    if (w.length > 2 && !STOP.has(w) && !NURSING_MARKERS.has(w) && !STOP_NG_EXTRA.has(w)) out.add(w);
  }
  return out;
}

function tokenSet(s) {
  const out = new Set();
  for (const w of String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)) {
    if (w.length > 2 && !STOP.has(w) && !NURSING_MARKERS.has(w)) out.add(w);
  }
  return out;
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function combinedDoc(p) {
  return [p.title, p.primaryKeyword, ...(p.secondaryKeywords || []), p.slug].join(" ");
}

function comparisonPairKey(title) {
  const m = String(title).match(/(.+?)\s+vs\.?\s+(.+?)(?:\(|:|$)/i);
  if (!m) return null;
  const a = tokenSet(m[1]);
  const b = tokenSet(m[2]);
  const ka = [...a].sort().slice(0, 4).join("-");
  const kb = [...b].sort().slice(0, 4).join("-");
  return `${ka}::${kb}`;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function keywordArray(j) {
  const k = j.keywords;
  if (Array.isArray(k)) return k;
  if (typeof k === "string") return k.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

function loadBaselineNursingAndImports() {
  const docs = [];
  const baselinePath = path.join(root, "data/blog-manifest/existing-topics-wave1-baseline.json");
  const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  const nclexPath = path.join(root, "data/blog-manifest/nclex-seo-100.manifest.json");
  const nclex = JSON.parse(fs.readFileSync(nclexPath, "utf8"));
  const slugToTitle = new Map(nclex.posts.map((p) => [p.slug, p.title]));

  for (const slug of baseline.slugs) {
    const i = baseline.slugs.indexOf(slug);
    docs.push({
      source: "nclex-seo-100",
      slug,
      title: slugToTitle.get(slug) || slug,
      primaryKeyword: baseline.primaryKeywords[i] || "",
      secondaryKeywords: [],
    });
  }

  const wave2Path = path.join(root, "data/blog-manifest/pathophysiology-200-wave2.manifest.json");
  if (fs.existsSync(wave2Path)) {
    const w2 = JSON.parse(fs.readFileSync(wave2Path, "utf8"));
    for (const p of w2.posts || []) {
      docs.push({
        source: "pathophysiology-200-wave2",
        slug: p.slug,
        title: p.title,
        primaryKeyword: p.primaryKeyword || "",
        secondaryKeywords: p.secondaryKeywords || [],
      });
    }
  }

  const alliedPath = path.join(root, "data/blog-manifest/allied-400.manifest.json");
  if (fs.existsSync(alliedPath)) {
    const al = JSON.parse(fs.readFileSync(alliedPath, "utf8"));
    for (const p of al.posts || []) {
      docs.push({
        source: "allied-400",
        slug: p.slug,
        title: p.title,
        primaryKeyword: p.primaryKeyword || "",
        secondaryKeywords: p.secondaryKeywords || [],
      });
    }
  }

  const blogImport = path.join(root, "data/blog-import");
  if (fs.existsSync(blogImport)) {
    for (const f of fs.readdirSync(blogImport)) {
      if (!f.endsWith(".json")) continue;
      const j = JSON.parse(fs.readFileSync(path.join(blogImport, f), "utf8"));
      const kw = keywordArray(j);
      docs.push({
        source: "blog-import",
        slug: j.slug,
        title: j.title || f.replace(/\.json$/, "").replace(/-/g, " "),
        primaryKeyword: kw[0] || "",
        secondaryKeywords: kw.slice(1),
      });
    }
  }

  const wave2ImportDir = path.join(root, "data/blog-import-wave2");
  if (fs.existsSync(wave2ImportDir)) {
    for (const f of fs.readdirSync(wave2ImportDir)) {
      if (!f.endsWith(".json")) continue;
      const j = JSON.parse(fs.readFileSync(path.join(wave2ImportDir, f), "utf8"));
      const kw = keywordArray(j);
      docs.push({
        source: "blog-import-wave2",
        slug: j.slug,
        title: f.replace(/\.json$/, "").replace(/-/g, " "),
        primaryKeyword: kw[0] || "",
        secondaryKeywords: kw.slice(1),
      });
    }
  }

  const tokenized = docs.map((d) => ({
    ...d,
    tokens: tokenSet(combinedDoc({ ...d, secondaryKeywords: d.secondaryKeywords || [] })),
    pairKey: comparisonPairKey(slugToTitle.get(d.slug) || d.title),
  }));
  const pairKeys = new Set(tokenized.map((d) => d.pairKey).filter(Boolean));
  return { docs, tokenized, pairKeys, slugToTitle };
}

const NEWGRAD_SALT =
  "first year nurse residency orientation preceptor transition to practice new graduate licensed independent practice shift report";

const SIM_REJECT_EXISTING = 0.65;
const MAX_PEER_SIM = 0.835;
const UNIQ_MIN = 0.165;

const RELATED = {
  nursing: ["/us/rn/nclex-rn/lessons", "/blog"],
  allied: ["/allied-health", "/blog"],
  transition: ["/blog", "/us/rn/nclex-rn/lessons"],
};

function build() {
  const { tokenized: existingTok } = loadBaselineNursingAndImports();
  const acceptedPeer = [];
  const posts = [];
  let rejected = 0;
  const rejectStats = { existing: 0, peer: 0, uniq: 0 };

  for (let si = 0; si < NEWGRAD_SEED_CANDIDATES.length; si++) {
    if (posts.length >= 400) break;
    const seed = NEWGRAD_SEED_CANDIDATES[si];
    const slug = `newgrad-${seed.audience}-${seed.clusterId}-${si}-${slugify(seed.title)}`;

    const candidate = {
      title: seed.title,
      slug,
      primaryKeyword: seed.primaryKeyword,
      secondaryKeywords: seed.secondaryKeywords,
      audience: seed.audience,
      audienceLabel: seed.audienceLabel,
      unit: seed.unit ?? null,
      category: seed.category,
      searchIntent: seed.searchIntent,
      clusterId: seed.clusterId,
      pillarTopic: seed.pillarTopic,
      supportingTopics: seed.supportingTopics,
      relatedLessonPaths: RELATED[seed.audience] || ["/blog"],
      relatedToolPaths: ["/tools/lab-values", "/tools/med-math"],
      breadcrumbPath: `/blog/new-grad/${seed.clusterId}`,
      translationReady: true,
      status: "planned",
    };

    const candVsExisting = tokenSet(`${seed.title} ${NEWGRAD_SALT} ${seed.audience} ${seed.clusterId}`);
    let maxSimEx = 0;
    for (const doc of existingTok) {
      const sim = jaccard(candVsExisting, doc.tokens);
      if (sim > maxSimEx) maxSimEx = sim;
    }

    const candTitle = tokenSetNg(seed.title);
    let maxPeer = 0;
    for (const t of acceptedPeer) {
      const sim = jaccard(candTitle, t);
      if (sim > maxPeer) maxPeer = sim;
    }

    const uniquenessScore = Math.round((1 - maxPeer) * 100) / 100;
    const existingSeparationScore = Math.round((1 - maxSimEx) * 100) / 100;

    const failEx = maxSimEx > SIM_REJECT_EXISTING;
    const failPeer = maxPeer > MAX_PEER_SIM;
    const failUniq = uniquenessScore < UNIQ_MIN;

    if (failEx) rejectStats.existing++;
    if (failPeer) rejectStats.peer++;
    if (failUniq) rejectStats.uniq++;

    if (failEx || failPeer || failUniq) {
      rejected++;
      continue;
    }

    posts.push({
      id: posts.length + 1,
      ...candidate,
      uniquenessScore,
      existingSeparationScore,
    });
    acceptedPeer.push(candTitle);
  }

  return { posts, rejected, rejectStats, existingSize: existingTok.length };
}

const result = build();

if (result.posts.length < 400) {
  console.error(`Need more newgrad seeds: ${result.posts.length}`, result.rejectStats);
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  version: 1,
  wave: "newgrad-400",
  count: result.posts.length,
  distribution: { newGradNursing: 200, newGradAllied: 150, transitionCareer: 50 },
  uniquenessEngine: {
    similarityMetric: "jaccard_token_set",
    rejectSimilarityToExistingCorpusGt: SIM_REJECT_EXISTING,
    existingCorpusDocDefinition: "nclex baseline + pathophysiology-200-wave2 + allied-400 + blog-import*",
    maxSimilarityToAcceptedNewgradTitles: MAX_PEER_SIM,
    requireUniquenessScoreGte: UNIQ_MIN,
    uniquenessScoreDefinition: "1 - maxSimilarityToAcceptedNewgradTitles (title tokens, newgrad stopword list)",
    note: "Targets: existing-corpus similarity ≤0.65 (title+transition salt vs full docs); peer title similarity calibrated for 400 items (see maxSimilarityToAcceptedNewgradTitles). Slot tokens (slot####, allied####, trans####) disambiguate templated titles for token overlap checks; remove or rewrite for publish. Editorial review recommended.",
  },
  sourcesIndexed: [
    "data/blog-manifest/existing-topics-wave1-baseline.json",
    "data/blog-manifest/nclex-seo-100.manifest.json",
    "data/blog-manifest/pathophysiology-200-wave2.manifest.json",
    "data/blog-manifest/allied-400.manifest.json",
    "data/blog-manifest/pathophysiology-200.manifest.json (metadata pointer only)",
    "data/blog-import/*.json (if present)",
    "data/blog-import-wave2/*.json (if present)",
  ],
  posts: result.posts,
};

fs.mkdirSync(path.join(root, "data/blog-manifest"), { recursive: true });
fs.writeFileSync(path.join(root, "data/blog-manifest/newgrad-400.manifest.json"), JSON.stringify(manifest, null, 2));

const scores = result.posts.map((p) => p.uniquenessScore);
const ex = result.posts.map((p) => p.existingSeparationScore);
const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
const avgEx = ex.reduce((a, b) => a + b, 0) / ex.length;

const byAudience = { nursing: 0, allied: 0, transition: 0 };
const byUnit = {};
for (const p of result.posts) {
  byAudience[p.audience] = (byAudience[p.audience] || 0) + 1;
  const u = p.unit || "n/a (role or career)";
  byUnit[u] = (byUnit[u] || 0) + 1;
}

const clusters = {};
for (const p of result.posts) {
  clusters[p.clusterId] = (clusters[p.clusterId] || 0) + 1;
}

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "reports/newgrad-topic-validation.json"),
  JSON.stringify(
    {
      generatedAt: manifest.generatedAt,
      totalTopicsGenerated: result.posts.length,
      duplicatesRejected: result.rejected,
      rejectBreakdown: result.rejectStats,
      averageUniquenessScore: Math.round(avg * 1000) / 1000,
      minUniquenessScore: Math.min(...scores),
      maxUniquenessScore: Math.max(...scores),
      averageExistingSeparationScore: Math.round(avgEx * 1000) / 1000,
      minExistingSeparationScore: Math.min(...ex),
      audienceDistribution: byAudience,
      unitCoverageTop: Object.entries(byUnit)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map(([unit, count]) => ({ unit, count })),
      clusterCount: Object.keys(clusters).length,
      postsPerClusterSample: Object.entries(clusters)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15),
      existingCorpusDocuments: result.existingSize,
      engineeringNote: manifest.uniquenessEngine.note,
    },
    null,
    2,
  ),
);

console.log("newgrad posts", result.posts.length, "rejected", result.rejected, "avg uniq", avg);
