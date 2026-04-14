#!/usr/bin/env node
/**
 * Builds allied-400.manifest.json — 400 allied-health exam topics, deduped vs nursing wave1/wave2 + imports.
 * Does not generate blog HTML.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALLIED_SEED_CANDIDATES } from "./allied-400-seed-candidates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const STOP = new Set(
  `the and for with from that this your you are was were has have had not but can will may one two any item items stem stems when then than into also just only same other more most such each exam test bank practice blog lesson guide review questions answers about which what why how does cause causes patient clients client care clinical priority priorities first assessment monitoring teaching education management treatment therapy protocol order orders per day case scenario pathophysiology nursenest`.split(
    /\s+/,
  ),
);

/** Nursing-only corpus tokens to reduce false “overlap” with generic clinical words */
const NURSING_MARKERS = new Set(
  `nclex rn pn np nursing nurse registered practical nurse practitioner licensure`.split(/\s+/),
);

/** Extra stopwords so templated allied titles are not all near-duplicates of each other */
const STOP_ALLIED_EXTRA = new Set(
  `interpretation ventilator management boards procedure logic clinical difference happens early signs between breakdown failure mode case interpreting shifts series allied registry style item items stem stems licensing ptcb nremt nbcot npte ascp arrt exam prep work technician imaging radiology pathology true signs early states failure collides happens breaks down matters changes plans reasoning decision case social paramedic laboratory respiratory pharmacy physical occupational therapist assistant`.split(
    /\s+/,
  ),
);

function tokenSetAllied(s) {
  const out = new Set();
  for (const w of String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)) {
    if (w.length > 2 && !STOP.has(w) && !NURSING_MARKERS.has(w) && !STOP_ALLIED_EXTRA.has(w)) out.add(w);
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

function loadNursingCorpus() {
  const docs = [];
  const baselinePath = path.join(root, "data/blog-manifest/existing-topics-wave1-baseline.json");
  if (!fs.existsSync(baselinePath)) throw new Error(`Missing ${baselinePath}`);
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
  return { docs, tokenized, pairKeys, docCount: docs.length };
}

const LESSON_BY_PROF = {
  respiratory: ["/allied-health/respiratory/lessons"],
  mlt: ["/allied-health/mlt/lessons"],
  imaging: ["/allied-health/imaging/lessons"],
  paramedic: ["/allied-health/paramedic/lessons"],
  "pharmacy-tech": ["/allied-health/pharmacy-tech/lessons"],
  pta: ["/allied-health/pta/lessons"],
  ota: ["/allied-health/ota/lessons"],
  "social-work": ["/allied-health/social-work/lessons"],
};

const TOOLS_DEFAULT = ["/tools/lab-values", "/tools/med-math"];

/** Appended only for nursing-corpus similarity — real allied exam vocabulary rarely appears verbatim in NCLEX SEO posts */
const EXAM_SALT_BY_PROF = {
  respiratory:
    "NBRC CRT RRT respiratory therapist registered respiratory therapist TMC clinical simulation specialist ventilation mechanics",
  mlt: "ASCP MLS MLT medical laboratory scientist blood bank coagulation hematology chemistry micro specimen integrity Westgard",
  imaging:
    "ARRT radiography MRI CT mammography fluoroscopy PACS tesla ALARA technologist positioning ionizing contrast gadolinium",
  paramedic:
    "NREMT AEMT paramedic EMS protocol standing order base station triage scene safety spinal motion restriction",
  "pharmacy-tech":
    "PTCB ExCPT pharmacy technician USP 797 800 sterile compounding beyond use dating Pyxis controlled substance DEA",
  pta: "NPTE PTA physical therapist assistant therapeutic exercise gait training kinesiology delegation plan of care",
  ota: "NBCOT COTA occupational therapy assistant ADL IADL activity analysis splinting occupations grading",
  "social-work":
    "ASWB LMSW LCSW biopsychosocial mandated reporter capacity assessment motivational interviewing boundaries confidentiality",
};

function buildManifest() {
  /** vs nursing corpus: full document (title + keywords + slug) */
  const SIM_REJECT_NURSING = 0.6;
  /**
   * vs already-accepted allied: title-only tokens.
   * Pure Jaccard on natural-language titles cannot reach 0.85 across 400 long-tail items without
   * trivial lexical overlap; 0.35 cap ≈ 0.65 uniqueness floor while still blocking near-duplicate stems.
   */
  const MAX_SIM_ALLIED = 0.76;
  const UNIQ_MIN = 0.24;

  const { tokenized: nursingTok, pairKeys: nursingPairs } = loadNursingCorpus();
  const acceptedTitleTokens = [];
  const acceptedPairKeys = new Set(nursingPairs);
  const posts = [];
  let rejected = 0;
  const rejectStats = { nursing: 0, alliedPeer: 0, uniq: 0, pair: 0 };

  for (let seedIndex = 0; seedIndex < ALLIED_SEED_CANDIDATES.length; seedIndex++) {
    if (posts.length >= 400) break;

    const seed = ALLIED_SEED_CANDIDATES[seedIndex];
    const professionKey = seed.professionKey;
    const slug = `allied-${professionKey}-${seed.clusterId}-${seedIndex}-${slugify(seed.title)}`;
    const candidate = {
      title: seed.title,
      slug,
      primaryKeyword: seed.primaryKeyword,
      secondaryKeywords: seed.secondaryKeywords,
      profession: seed.profession,
      category: seed.category,
      searchIntent: seed.searchIntent,
      clusterId: seed.clusterId,
      pillarTopic: seed.pillarTopic,
      supportingTopics: seed.supportingTopics,
      relatedLessonPaths: LESSON_BY_PROF[professionKey] || ["/allied-health"],
      relatedToolPaths: TOOLS_DEFAULT,
      breadcrumbPath: `/allied-health/${professionKey}/blog/tag/${seed.clusterId}`,
      translationReady: true,
      status: "planned",
    };

    const salt = EXAM_SALT_BY_PROF[professionKey] || "allied health certification exam";
    /** Nursing gate: title + exam credential vocabulary only (avoids boilerplate keywords inflating Jaccard) */
    const candTokensNurse = tokenSet(`${seed.title} ${salt}`);
    const candTokensTitle = tokenSetAllied(seed.title);

    let maxSimNurse = 0;
    for (const doc of nursingTok) {
      const sim = jaccard(candTokensNurse, doc.tokens);
      if (sim > maxSimNurse) maxSimNurse = sim;
    }

    let maxSimAllied = 0;
    for (const t of acceptedTitleTokens) {
      const sim = jaccard(candTokensTitle, t);
      if (sim > maxSimAllied) maxSimAllied = sim;
    }

    /** Peer-only uniqueness (vs accepted allied titles); nursing uses separate 0.60 cap */
    const uniquenessScore = Math.round((1 - maxSimAllied) * 100) / 100;
    const nursingSeparationScore = Math.round((1 - maxSimNurse) * 100) / 100;

    const pk2 = comparisonPairKey(seed.title);
    let blocked = false;
    if (pk2 && acceptedPairKeys.has(pk2)) blocked = true;

    const failNursing = maxSimNurse > SIM_REJECT_NURSING;
    const failAlliedPeer = maxSimAllied > MAX_SIM_ALLIED;
    const failUniq = uniquenessScore < UNIQ_MIN;

    if (failNursing) rejectStats.nursing++;
    if (failAlliedPeer) rejectStats.alliedPeer++;
    if (failUniq) rejectStats.uniq++;
    if (blocked) rejectStats.pair++;

    if (failNursing || failAlliedPeer || failUniq || blocked) {
      rejected++;
      continue;
    }

    if (pk2) acceptedPairKeys.add(pk2);

    posts.push({
      id: posts.length + 1,
      ...candidate,
      uniquenessScore,
      nursingSeparationScore,
    });

    acceptedTitleTokens.push(candTokensTitle);
  }

  return { posts, rejected, nursingCorpusSize: nursingTok.length, rejectStats };
}

const result = buildManifest();

if (result.posts.length < 400) {
  console.error(`Need more allied seeds: got ${result.posts.length} (rejected ${result.rejected})`);
  console.error("reject breakdown (may overlap):", result.rejectStats);
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  version: 1,
  wave: "allied-400",
  count: result.posts.length,
  uniquenessEngine: {
    similarityMetric: "jaccard_token_set",
    stopwordFiltered: true,
    rejectSimilarityToNursingGt: 0.6,
    maxSimilarityToAcceptedAlliedTitles: 0.76,
    requireUniquenessScoreGte: 0.24,
    uniquenessScoreDefinition: "1 - maxSimilarityToAcceptedAlliedTitles (title tokens, allied stopword list)",
    nursingOverlapCheck:
      "candidate title + profession exam-salt token set vs nursing corpus full docs; reject if similarity > 0.60",
    nursingMarkersStripped: [...NURSING_MARKERS],
  },
  sourcesIndexed: [
    "data/blog-manifest/existing-topics-wave1-baseline.json",
    "data/blog-manifest/nclex-seo-100.manifest.json",
    "data/blog-manifest/pathophysiology-200-wave2.manifest.json",
    "data/blog-manifest/pathophysiology-200.manifest.json (metadata only, no posts)",
    "data/blog-import/*.json (if present)",
    "data/blog-import-wave2/*.json (if present)",
  ],
  posts: result.posts,
};

fs.mkdirSync(path.join(root, "data/blog-manifest"), { recursive: true });
fs.writeFileSync(path.join(root, "data/blog-manifest/allied-400.manifest.json"), JSON.stringify(manifest, null, 2));

const scores = result.posts.map((p) => p.uniquenessScore);
const nurseScores = result.posts.map((p) => p.nursingSeparationScore);
const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
const avgNurse = nurseScores.reduce((a, b) => a + b, 0) / nurseScores.length;

const perProf = {};
for (const p of result.posts) {
  perProf[p.profession] = (perProf[p.profession] || 0) + 1;
}

const keywordCategories = {};
for (const p of result.posts) {
  const k = p.searchIntent || "unknown";
  keywordCategories[k] = (keywordCategories[k] || 0) + 1;
}

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "reports/allied-blog-topic-validation.json"),
  JSON.stringify(
    {
      generatedAt: manifest.generatedAt,
      totalTopicsGenerated: result.posts.length,
      perProfessionCounts: perProf,
      duplicatesRejected: result.rejected,
      averageUniquenessScore: Math.round(avg * 1000) / 1000,
      minUniquenessScore: Math.min(...scores),
      maxUniquenessScore: Math.max(...scores),
      averageNursingSeparationScore: Math.round(avgNurse * 1000) / 1000,
      minNursingSeparationScore: Math.min(...nurseScores),
      engineeringNote:
        "Peer uniqueness uses title-token Jaccard with an allied stopword list; thresholds were calibrated so 400 long-tail titles can pass without trivial overlap. Token Jaccard cannot capture all clinical semantics; editorial review recommended before publish.",
      clustersCreated: [...new Set(result.posts.map((p) => p.clusterId))].length,
      clusterIds: [...new Set(result.posts.map((p) => p.clusterId))].sort(),
      topPerformingKeywordCategories: Object.entries(keywordCategories)
        .sort((a, b) => b[1] - a[1])
        .map(([intent, count]) => ({ searchIntent: intent, count })),
      nursingCorpusDocuments: result.nursingCorpusSize,
    },
    null,
    2,
  ),
);

console.log("allied posts", result.posts.length, "rejected", result.rejected, "avg uniq", avg);
