#!/usr/bin/env node
/**
 * Production cleanup: de-salt titles, natural phrasing, slugs from publish titles only,
 * revalidate vs nursing + allied + wave2 + imports using publish-facing text (no slot tokens).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NEWGRAD_SEED_CANDIDATES } from "./newgrad-400-seed-candidates.mjs";
import { buildPublishTitle } from "./lib/newgrad-clean-titles.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const MANIFEST_PATH = path.join(root, "data/blog-manifest/newgrad-400.manifest.json");
const REPORT_PATH = path.join(root, "reports/newgrad-topic-validation.json");

const STOP = new Set(
  `the and for with from that this your you are was were has have had not but can will may one two any item items stem stems when then than into also just only same other more most such each exam test bank practice blog lesson guide review questions answers about which what why how does cause causes patient clients client care clinical priority priorities first assessment monitoring teaching education management treatment therapy protocol order orders per day case scenario pathophysiology nursenest`.split(
    /\s+/,
  ),
);

const NURSING_MARKERS = new Set(
  `nclex rn pn np nursing nurse registered practical nurse practitioner licensure`.split(/\s+/),
);

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

function tokenSetPublishTitle(s) {
  return tokenSet(s);
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

function keywordArray(j) {
  const k = j.keywords;
  if (Array.isArray(k)) return k;
  if (typeof k === "string") return k.split(/[,;]/).map((x) => x.trim()).filter(Boolean);
  return [];
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function loadExistingCorpus() {
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
  }));
  return { tokenized, docCount: docs.length };
}

const NEWGRAD_SALT =
  "first year nurse residency orientation preceptor transition to practice new graduate new grad shift report";

/** Aligned with scripts/build-newgrad-400-manifest.mjs (Jaccard on title tokens vs peers). */
const MAX_SIM_EXISTING = 0.65;
const MAX_PEER_SIM = 0.835;
const UNIQ_MIN = 0.165;

function publishKeywordFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function buildSlug(audience, title, usedSlugs) {
  let base = slugify(title);
  let slug = `newgrad-${audience}-${base}`;
  if (slug.length > 120) slug = slug.slice(0, 120);
  let n = 2;
  while (usedSlugs.has(slug)) {
    const extra = slugify(`${title} ${n}`);
    slug = `newgrad-${audience}-${extra}`.slice(0, 120);
    n++;
  }
  usedSlugs.add(slug);
  return slug;
}

function validateAgainstCorpus(title, audience, existingTok) {
  const cand = tokenSet(`${title} ${NEWGRAD_SALT} ${audience}`);
  let maxEx = 0;
  for (const doc of existingTok) {
    const sim = jaccard(cand, doc.tokens);
    if (sim > maxEx) maxEx = sim;
  }
  return maxEx;
}

function validatePeer(title, acceptedTitles) {
  const t = tokenSetPublishTitle(title);
  let maxP = 0;
  for (const prev of acceptedTitles) {
    const sim = jaccard(t, prev);
    if (sim > maxP) maxP = sim;
  }
  return maxP;
}

function hasForbiddenTokens(s) {
  return /\((?:slot|allied|trans)\d+\)/i.test(s) || /\b(?:slot|allied|trans)\d{4,}\b/i.test(s);
}

function main() {
  const prior = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const originalCount = prior.posts?.length ?? 0;

  const { tokenized: existingTok } = loadExistingCorpus();
  const usedSlugs = new Set();
  const acceptedPeerTokens = [];
  const seenPublishTitles = new Set();
  const posts = [];
  const beforeAfterSamples = [];
  let pillarSuffixApplied = 0;
  let titleDisambiguationSuffixes = 0;
  let variantBumps = 0;

  for (let i = 0; i < 400; i++) {
    const seed = NEWGRAD_SEED_CANDIDATES[i];
    const id = i + 1;

    let chosenTitle = null;
    let maxEx = 0;
    let maxPeer = 0;
    let uniq = 0;
    let winningVariant = 0;

    const tryCandidate = (t, variantIdx) => {
      const ex = validateAgainstCorpus(t, seed.audience, existingTok);
      const peer = validatePeer(t, acceptedPeerTokens);
      const u = Math.round((1 - peer) * 100) / 100;
      const gatesOk = ex <= MAX_SIM_EXISTING && peer <= MAX_PEER_SIM && u >= UNIQ_MIN;
      return { t, ex, peer, u, gatesOk, variantIdx };
    };

    for (let v = 0; v < 96; v++) {
      const base = buildPublishTitle(seed, id, v);
      const r = tryCandidate(base, v);
      if (r.gatesOk && !seenPublishTitles.has(r.t)) {
        chosenTitle = r.t;
        maxEx = r.ex;
        maxPeer = r.peer;
        uniq = r.u;
        winningVariant = v;
        break;
      }
    }

    if (!chosenTitle) {
      const pillar = (seed.supportingTopics && seed.supportingTopics[0]) || seed.pillarTopic;
      for (let v = 0; v < 96; v++) {
        const base = buildPublishTitle(seed, id, v);
        const suffixed = `${base} — ${pillar}`;
        const r = tryCandidate(suffixed, v);
        if (r.gatesOk && !seenPublishTitles.has(r.t)) {
          chosenTitle = r.t;
          maxEx = r.ex;
          maxPeer = r.peer;
          uniq = r.u;
          winningVariant = v;
          pillarSuffixApplied++;
          break;
        }
      }
    }

    if (!chosenTitle) {
      const extras = [seed.pillarTopic, ...(seed.supportingTopics || [])].filter(Boolean);
      outer: for (const ex of extras) {
        for (let v = 0; v < 96; v++) {
          const base = buildPublishTitle(seed, id, v);
          const suffixed = `${base} — ${ex}`;
          const r = tryCandidate(suffixed, v);
          if (r.gatesOk && !seenPublishTitles.has(r.t)) {
            chosenTitle = r.t;
            maxEx = r.ex;
            maxPeer = r.peer;
            uniq = r.u;
            winningVariant = v;
            titleDisambiguationSuffixes++;
            break outer;
          }
        }
      }
    }

    if (!chosenTitle) {
      throw new Error(`cleanup: could not resolve title for seed index ${i} id ${id}`);
    }

    variantBumps += winningVariant;

    const title = chosenTitle;
    seenPublishTitles.add(title);
    acceptedPeerTokens.push(tokenSetPublishTitle(title));

    const slug = buildSlug(seed.audience, title, usedSlugs);
    const primaryKeyword = publishKeywordFromTitle(title);

    posts.push({
      id,
      title,
      slug,
      primaryKeyword,
      secondaryKeywords: seed.secondaryKeywords,
      audience: seed.audience,
      audienceLabel: seed.audienceLabel,
      unit: seed.unit ?? null,
      category: seed.category,
      searchIntent: seed.searchIntent,
      clusterId: seed.clusterId,
      pillarTopic: seed.pillarTopic,
      supportingTopics: seed.supportingTopics,
      relatedLessonPaths:
        seed.audience === "nursing"
          ? ["/us/rn/nclex-rn/lessons", "/blog"]
          : seed.audience === "allied"
            ? ["/allied-health", "/blog"]
            : ["/blog", "/us/rn/nclex-rn/lessons"],
      relatedToolPaths: ["/tools/lab-values", "/tools/med-math"],
      breadcrumbPath: `/blog/new-grad/${seed.clusterId}`,
      translationReady: true,
      status: "planned",
      uniquenessScore: uniq,
      existingSeparationScore: Math.round((1 - maxEx) * 100) / 100,
      maxSimilarityToExistingCorpus: Math.round(maxEx * 1000) / 1000,
      maxSimilarityToPublishPeerTitles: Math.round(maxPeer * 1000) / 1000,
    });

    if (beforeAfterSamples.length < 15 && seed.title !== title) {
      beforeAfterSamples.push({ before: seed.title, after: title });
    }
  }

  const finalCount = posts.length;
  const dupTitles = (() => {
    const m = new Map();
    for (const p of posts) m.set(p.title, (m.get(p.title) || 0) + 1);
    return [...m.entries()].filter(([, c]) => c > 1);
  })();

  let forbiddenHits = 0;
  for (const p of posts) {
    if (hasForbiddenTokens(p.title) || hasForbiddenTokens(p.slug) || hasForbiddenTokens(p.primaryKeyword)) {
      forbiddenHits++;
    }
  }

  const slugSet = new Set(posts.map((p) => p.slug));
  const slugCollision = slugSet.size !== posts.length;

  const manifest = {
    generatedAt: new Date().toISOString(),
    version: 2,
    wave: "newgrad-400",
    count: finalCount,
    distribution: { newGradNursing: 200, newGradAllied: 150, transitionCareer: 50 },
    cleanupPipeline: {
      originalRowCount: originalCount,
      cleanedRowCount: finalCount,
      publishTitleSource: "scripts/lib/newgrad-clean-titles.mjs + validation in cleanup-and-validate-newgrad-manifest.mjs",
      forbiddenTokenScan: { slotAlliedTransPattern: String.raw`\((?:slot|allied|trans)\d+\)|\b(?:slot|allied|trans)\d{4,}\b`, violations: forbiddenHits },
    },
    uniquenessEngine: {
      similarityMetric: "jaccard_token_set",
      publishValidation: true,
      rejectSimilarityToExistingCorpusGt: MAX_SIM_EXISTING,
      maxSimilarityToAcceptedPublishTitles: MAX_PEER_SIM,
      requireUniquenessScoreGte: UNIQ_MIN,
      uniquenessScoreDefinition: "1 - max Jaccard similarity of publish title token set to prior accepted publish titles in this manifest",
      existingCorpusCheck: "tokenSet(publishTitle + transition salt + audience) vs full docs in baseline + wave2 + allied-400 + imports",
      note: "v2: salted seed tokens removed from publish fields. Peer/corpus gates match build-newgrad-400-manifest.mjs. See report for pillar/suffix disambiguators (no alternate-seed replacements unless added later).",
    },
    sourcesIndexed: prior.sourcesIndexed || [],
    posts,
  };

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const scores = posts.map((p) => p.uniquenessScore);
  const ex = posts.map((p) => p.existingSeparationScore);
  const byAudience = { nursing: 0, allied: 0, transition: 0 };
  const byUnit = {};
  for (const p of posts) {
    byAudience[p.audience] = (byAudience[p.audience] || 0) + 1;
    const u = p.unit || "n/a (role or career)";
    byUnit[u] = (byUnit[u] || 0) + 1;
  }

  const report = {
    generatedAt: manifest.generatedAt,
    pass:
      finalCount === 400 &&
      forbiddenHits === 0 &&
      !slugCollision &&
      dupTitles.length === 0,
    originalRowCount: originalCount,
    cleanedRowCount: finalCount,
    duplicatesAfterCleanup: dupTitles.length,
    duplicateTitleList: dupTitles,
    replacementsCreated: 0,
    alternateSeedReplacements: 0,
    pillarSuffixAppliedToPassGates: pillarSuffixApplied,
    extraTitleDisambiguationSuffixes: titleDisambiguationSuffixes,
    variantTemplateBumps: variantBumps,
    averageUniquenessScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 1000) / 1000,
    minUniquenessScore: Math.min(...scores),
    maxUniquenessScore: Math.max(...scores),
    averageExistingSeparationScore: Math.round((ex.reduce((a, b) => a + b, 0) / ex.length) * 1000) / 1000,
    minExistingSeparationScore: Math.min(...ex),
    audienceDistribution: byAudience,
    unitCoverageTop: Object.entries(byUnit)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([unit, count]) => ({ unit, count })),
    clusterCount: new Set(posts.map((p) => p.clusterId)).size,
    existingCorpusDocuments: existingTok.length,
    titleRewriteSamples: beforeAfterSamples,
    verification: {
      forbiddenTokenViolationsInPublishFields: forbiddenHits,
      slugCollision,
      sampleGrammarReviewNote: "Spot-check at least 50 titles in manifest JSON for readability.",
    },
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log("--- newgrad cleanup ---");
  console.log("original rows:", originalCount, "final rows:", finalCount);
  console.log("forbidden slot/allied/trans hits:", forbiddenHits);
  console.log("slug collision:", slugCollision);
  console.log("duplicate titles:", dupTitles.length);
  console.log("pillar suffix (gates):", pillarSuffixApplied, "extra disambiguation suffixes:", titleDisambiguationSuffixes);
  console.log("variant bumps:", variantBumps);
  console.log("PASS:", report.pass);
}

main();
