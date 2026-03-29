#!/usr/bin/env node
/**
 * Discover image objects in DigitalOcean Spaces (S3 API), categorize by filename,
 * and regenerate src/lib/marketing-assets.generated.ts + scripts/marketing-assets-report.json
 *
 * Env: SPACES_KEY, SPACES_SECRET, SPACES_REGION, SPACES_BUCKET
 * Optional: SPACES_PREFIX (key prefix), SPACES_ENDPOINT, MARKETING_CDN_BASE (public URL override)
 *
 * On failure or --fallback-only, writes screenshot URLs on the public Spaces host (same paths as legacy /screenshots/).
 */

import "dotenv/config";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_TS = path.join(ROOT, "src/lib/marketing-assets.generated.ts");
const OUT_REPORT = path.join(__dirname, "marketing-assets-report.json");
const CATALOG_PATH = path.join(ROOT, "src/config/marketing-cdn.catalog.json");

const IMAGE_EXT = /\.(png|jpe?g|webp|svg)$/i;

function loadMarketingCdnCatalog() {
  const raw = fsSync.readFileSync(CATALOG_PATH, "utf8");
  return JSON.parse(raw);
}

const marketingCdnCatalog = loadMarketingCdnCatalog();

/** Public CDN hostname for nursenest-images (DigitalOcean Spaces, tor1). Single source: marketing-cdn.catalog.json */
const DEFAULT_MARKETING_CDN_BASE =
  marketingCdnCatalog.digitalOceanSpaces.nursenestImages.publicBaseUrl;

const LEGACY_SCREENSHOT_STEMS = Object.fromEntries(
  Object.entries(marketingCdnCatalog.homepageScreenshots.slotToLegacyStem).map(([k, v]) => [
    k,
    { stem: v.stem, w: v.width, h: v.height },
  ]),
);

const SCREENSHOT_SEMANTICS = {
  screenshot2: ["progress", "performance", "adaptive", "analytics", "readiness", "dashboard"],
  screenshot9: ["case", "clinical", "judgment", "ngn", "study", "patient"],
  screenshotTest: ["question", "practice", "exam", "quiz", "bank"],
  screenshot6: ["flashcard", "deck", "card", "spaced"],
  screenshot11: ["plan", "weekly", "study-plan", "schedule"],
  screenshot3: ["category", "domain", "weak", "breakdown"],
  screenshot5: ["session", "score", "trend", "percentile", "analytics"],
  screenshot10: ["compare", "improvement", "growth", "track", "history"],
};

const CATEGORY_TESTS = {
  LOGO_PRIMARY: (k) => /logo/i.test(k),
  HERO_DASHBOARD_POOL: (k) => /hero|dashboard/i.test(k),
  HERO_REPORT_CARD_SCREENSHOT: (k) => /report|analytics/i.test(k) && !/logo/i.test(k),
  PRICING_SCREENSHOT: (k) => /pricing/i.test(k),
  MOBILE_APP_SCREENSHOT: (k) =>
    /mobile/i.test(k) || /(^|[^a-z])app([^a-z]|$)/i.test(k),
  FLASHCARDS_SCREENSHOT: (k) => /flashcard/i.test(k),
  CAT_EXAM_SCREENSHOT: (k) =>
    /(^|[^a-z])cat([^a-z]|$)/i.test(k) || /(^|[^a-z])exam([^a-z]|$)/i.test(k),
  PROGRESS_DASHBOARD_SCREENSHOT: (k) => /progress|performance/i.test(k),
};

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) return null;
  return String(v).trim();
}

function publicUrl(base, key) {
  const b = base.replace(/\/$/, "");
  const enc = key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${b}/${enc}`;
}

/** Logical stem without responsive / thumb suffix */
function fileStem(key) {
  let file = key.split("/").pop() || key;
  file = file.replace(/-(?:thumb-)?(\d+)w\.(png|jpe?g|webp|svg)$/i, "");
  file = file.replace(/-full\.(png|jpe?g|webp|svg)$/i, "");
  file = file.replace(/\.(png|jpe?g|webp|svg)$/i, "");
  return file;
}

function variantWidth(key) {
  const file = key.split("/").pop() || "";
  const m = file.match(/-(\d+)w\./i);
  if (m) return Number(m[1]);
  const m2 = file.match(/(\d+)x(\d+)/i);
  if (m2) return Number(m2[1]) * Number(m2[2]);
  if (/[-.]full\./i.test(file)) return 4000;
  return 0;
}

function scoreObject(o) {
  const px = variantWidth(o.Key);
  const t = o.LastModified ? new Date(o.LastModified).getTime() : 0;
  return { px, size: o.Size || 0, t, key: o.Key };
}

function compareScore(a, b) {
  if (b.px !== a.px) return b.px - a.px;
  if (b.size !== a.size) return b.size - a.size;
  return b.t - a.t;
}

function clusterByStem(objects) {
  const map = new Map();
  for (const o of objects) {
    const stem = fileStem(o.Key);
    if (!map.has(stem)) map.set(stem, []);
    map.get(stem).push(o);
  }
  return map;
}

function pickBestObject(objects) {
  if (!objects.length) return null;
  return [...objects].sort((a, b) => compareScore(scoreObject(a), scoreObject(b)))[0];
}

function buildResponsiveBundle(clusterObjects, baseUrl, defaultW, defaultH) {
  const sorted = [...clusterObjects].sort(
    (a, b) => variantWidth(a.Key) - variantWidth(b.Key),
  );
  const variants = sorted.filter((o) => /-\d+w\.(png|jpe?g|webp|svg)$/i.test(o.Key));
  const full = sorted.find((o) => /-full\.(png|jpe?g|webp|svg)$/i.test(o.Key));
  const thumbs = sorted.filter((o) => /-thumb-\d+w\./i.test(o.Key));

  let srcSet = "";
  if (variants.length) {
    srcSet = variants
      .map((o) => `${publicUrl(baseUrl, o.Key)} ${variantWidth(o.Key)}w`)
      .join(", ");
    if (full) {
      srcSet += `, ${publicUrl(baseUrl, full.Key)} ${defaultW}w`;
    }
  } else if (clusterObjects.length === 1) {
    const o = clusterObjects[0];
    srcSet = `${publicUrl(baseUrl, o.Key)} 1x`;
  }

  const fallbackObj =
    variants.find((o) => variantWidth(o.Key) === 768) ||
    variants[Math.floor(variants.length / 2)] ||
    pickBestObject(clusterObjects);
  const fallback = fallbackObj ? publicUrl(baseUrl, fallbackObj.Key) : "";

  let thumbSrcSet = "";
  let thumbFallback = "";
  if (thumbs.length) {
    thumbSrcSet = thumbs
      .map((o) => `${publicUrl(baseUrl, o.Key)} ${variantWidth(o.Key)}w`)
      .join(", ");
    thumbFallback = publicUrl(
      baseUrl,
      thumbs.find((o) => variantWidth(o.Key) === 160)?.Key || thumbs[0].Key,
    );
  } else if (fallback) {
    thumbSrcSet = `${fallback} 160w`;
    thumbFallback = fallback;
  }

  return {
    srcSet,
    thumbSrcSet,
    fallback,
    thumbFallback,
    width: defaultW,
    height: defaultH,
  };
}

function legacyScreenshotBundle(stem, w, h) {
  const base = `${DEFAULT_MARKETING_CDN_BASE}/screenshots/${stem}`;
  return {
    srcSet: `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w, ${base}-full.webp ${w}w`,
    thumbSrcSet: `${base}-thumb-160w.webp 160w, ${base}-thumb-240w.webp 240w`,
    fallback: `${base}-768w.webp`,
    thumbFallback: `${base}-thumb-160w.webp`,
    width: w,
    height: h,
  };
}

function escapeTs(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
}

async function listAllObjects(client, bucket, prefix) {
  const keys = [];
  let ContinuationToken;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix || undefined,
        ContinuationToken,
      }),
    );
    for (const o of res.Contents || []) {
      if (o.Key && !o.Key.endsWith("/")) keys.push(o);
    }
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

function filterImages(objects) {
  return objects.filter((o) => IMAGE_EXT.test(o.Key));
}

function candidatesForTest(objects, testFn) {
  return objects.filter((o) => testFn(o.Key));
}

function bestStemCluster(objects, testFn, clusters, excludeStems = new Set()) {
  const cand = candidatesForTest(objects, testFn).filter(
    (o) => !excludeStems.has(fileStem(o.Key)),
  );
  if (!cand.length) return null;
  const stems = new Set(cand.map((o) => fileStem(o.Key)));
  let best = null;
  let bestScore = -1;
  for (const stem of stems) {
    const group = clusters.get(stem) || [];
    const sc = pickBestObject(group);
    if (!sc) continue;
    const s = scoreObject(sc);
    const stemScore = s.px * 10 + s.size;
    if (stemScore > bestScore) {
      bestScore = stemScore;
      best = { stem, objects: group };
    }
  }
  return best;
}

function mainHeroCarouselClusters(objects, clusters, limit = 4, excludeStems = new Set()) {
  const cand = candidatesForTest(objects, CATEGORY_TESTS.HERO_DASHBOARD_POOL).filter(
    (o) => !excludeStems.has(fileStem(o.Key)),
  );
  const stems = [...new Set(cand.map((o) => fileStem(o.Key)))];
  const scored = stems
    .map((stem) => {
      const group = clusters.get(stem) || [];
      const sc = pickBestObject(group);
      return { stem, group, score: sc ? scoreObject(sc).px * 10 + scoreObject(sc).size : 0 };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.group);
}

function matchScreenshotSlot(slotKey, objects, clusters, usedStems) {
  const terms = SCREENSHOT_SEMANTICS[slotKey] || [];
  const matches = [];
  for (const o of objects) {
    const lower = o.Key.toLowerCase();
    if (!terms.some((t) => lower.includes(t))) continue;
    const stem = fileStem(o.Key);
    if (usedStems.has(stem)) continue;
    matches.push(o);
  }
  if (!matches.length) return null;
  const stemGroups = new Map();
  for (const o of matches) {
    const st = fileStem(o.Key);
    if (!stemGroups.has(st)) stemGroups.set(st, []);
    stemGroups.get(st).push(o);
  }
  let bestStem = null;
  let bestScore = -1;
  for (const [st, grp] of stemGroups) {
    const sc = pickBestObject(grp);
    const s = scoreObject(sc);
    const stemScore = s.px * 10 + s.size;
    if (stemScore > bestScore) {
      bestScore = stemScore;
      bestStem = st;
    }
  }
  if (!bestStem) return null;
  usedStems.add(bestStem);
  return clusters.get(bestStem) || [];
}

function emitTs({
  baseUrl,
  logoUrl,
  logoSrcSet,
  heroDashboardUrl,
  heroDashboardSrcSet,
  heroReport,
  pricing,
  mobile,
  flashcards,
  catExam,
  progressDash,
  heroCarousel,
  screenshotBundles,
  todos,
  unmatchedKeys,
}) {
  const lines = [];
  lines.push(
    "/** Auto-generated by scripts/generate-marketing-assets.mjs — do not edit by hand. Homepage hero: `src/config/home-hero-carousel.ts`. */",
  );
  lines.push("");
  lines.push(`export const MARKETING_CDN_BASE = "${escapeTs(baseUrl)}";`);
  lines.push("");
  lines.push("export type MarketingResponsiveImage = {");
  lines.push("  src: string;");
  lines.push("  srcSet?: string;");
  lines.push("};");
  lines.push("");
  lines.push("export type MarketingScreenshotBundle = {");
  lines.push("  srcSet: string;");
  lines.push("  thumbSrcSet: string;");
  lines.push("  fallback: string;");
  lines.push("  thumbFallback: string;");
  lines.push("  width: number;");
  lines.push("  height: number;");
  lines.push("};");
  lines.push("");
  const str = (v) => (v == null ? "null" : JSON.stringify(v));
  lines.push(`export const LOGO_PRIMARY: string | null = ${str(logoUrl)};`);
  lines.push(`export const LOGO_PRIMARY_SRCSET: string | null = ${str(logoSrcSet)};`);
  lines.push(`export const HERO_DASHBOARD_SCREENSHOT: string | null = ${str(heroDashboardUrl)};`);
  lines.push(`export const HERO_DASHBOARD_SCREENSHOT_SRCSET: string | null = ${str(heroDashboardSrcSet)};`);
  lines.push(`export const HERO_REPORT_CARD_SCREENSHOT: string | null = ${str(heroReport?.fallback ?? null)};`);
  lines.push(`export const HERO_REPORT_CARD_SCREENSHOT_SRCSET: string | null = ${str(heroReport?.srcSet || null)};`);
  lines.push(`export const PRICING_SCREENSHOT: string | null = ${str(pricing?.fallback ?? null)};`);
  lines.push(`export const PRICING_SCREENSHOT_SRCSET: string | null = ${str(pricing?.srcSet || null)};`);
  lines.push(`export const MOBILE_APP_SCREENSHOT: string | null = ${str(mobile?.fallback ?? null)};`);
  lines.push(`export const MOBILE_APP_SCREENSHOT_SRCSET: string | null = ${str(mobile?.srcSet || null)};`);
  lines.push(`export const FLASHCARDS_SCREENSHOT: string | null = ${str(flashcards?.fallback ?? null)};`);
  lines.push(`export const FLASHCARDS_SCREENSHOT_SRCSET: string | null = ${str(flashcards?.srcSet || null)};`);
  lines.push(`export const CAT_EXAM_SCREENSHOT: string | null = ${str(catExam?.fallback ?? null)};`);
  lines.push(`export const CAT_EXAM_SCREENSHOT_SRCSET: string | null = ${str(catExam?.srcSet || null)};`);
  lines.push(`export const PROGRESS_DASHBOARD_SCREENSHOT: string | null = ${str(progressDash?.fallback ?? null)};`);
  lines.push(`export const PROGRESS_DASHBOARD_SCREENSHOT_SRCSET: string | null = ${str(progressDash?.srcSet || null)};`);
  lines.push("");
  lines.push(
    "// Homepage hero: `src/config/home-hero-carousel.ts` (screenshot1.webp–screenshot15.webp on DigitalOcean Spaces).",
  );
  lines.push("");
  lines.push(`export const MARKETING_SCREENSHOT_SOURCES: Record<string, MarketingScreenshotBundle> = ${JSON.stringify(screenshotBundles, null, 2)};`);
  lines.push("");
  lines.push(`export const MARKETING_ASSETS_TODOS: readonly string[] = ${JSON.stringify(todos, null, 2)} as const;`);
  lines.push(`export const MARKETING_ASSETS_UNMATCHED_KEYS: readonly string[] = ${JSON.stringify(unmatchedKeys, null, 2)} as const;`);
  lines.push("");
  return lines.join("\n") + "\n";
}

async function writeLegacyOnly(reason) {
  const B = DEFAULT_MARKETING_CDN_BASE;
  const heroCarousel = Array.from({ length: 15 }, (_, i) => {
    const n = i + 1;
    const url = `${B}/screenshots/screenshot${n}.webp`;
    return { srcSet: `${url} 1200w`, fallback: url };
  });
  const screenshotBundles = {};
  for (const [k, v] of Object.entries(LEGACY_SCREENSHOT_STEMS)) {
    screenshotBundles[k] = legacyScreenshotBundle(v.stem, v.w, v.h);
  }
  const ts = emitTs({
    baseUrl: DEFAULT_MARKETING_CDN_BASE,
    logoUrl: null,
    logoSrcSet: null,
    heroDashboardUrl: heroCarousel[0]?.fallback ?? null,
    heroDashboardSrcSet: heroCarousel[0]?.srcSet ?? null,
    heroReport: null,
    pricing: null,
    mobile: null,
    flashcards: null,
    catExam: null,
    progressDash: null,
    heroCarousel,
    screenshotBundles,
    todos: [
      reason ||
        "Screenshot URLs use public Spaces host; run with SPACES_* to discover objects and refresh bundles.",
    ],
    unmatchedKeys: [],
  });
  await fs.writeFile(OUT_TS, ts, "utf8");
  await fs.writeFile(
    OUT_REPORT,
    JSON.stringify(
      {
        mode: "legacy_fallback",
        reason,
        generatedAt: new Date().toISOString(),
        todos: [reason],
        unmatchedKeys: [],
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Wrote ${OUT_TS} (legacy fallback)`);
}

async function main() {
  const fallbackOnly = process.argv.includes("--fallback-only");
  const key = requireEnv("SPACES_KEY");
  const secret = requireEnv("SPACES_SECRET");
  const region = requireEnv("SPACES_REGION");
  const bucket = requireEnv("SPACES_BUCKET");

  if (fallbackOnly || !key || !secret || !region || !bucket) {
    await writeLegacyOnly(
      !key || !secret || !region || !bucket
        ? "Missing SPACES_* credentials — wrote Spaces-hosted screenshot fallback map."
        : "--fallback-only",
    );
    return;
  }

  const endpoint =
    process.env.SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;
  const prefix = (process.env.SPACES_PREFIX || "").replace(/^\//, "");
  const cdnBase =
    (process.env.MARKETING_CDN_BASE || "").replace(/\/$/, "") ||
    (bucket === "nursenest-images" && region === "tor1"
      ? DEFAULT_MARKETING_CDN_BASE
      : `https://${bucket}.${region}.digitaloceanspaces.com`);

  const client = new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  });

  let all;
  try {
    all = await listAllObjects(client, bucket, prefix);
  } catch (e) {
    console.error("ListObjects failed:", e);
    await writeLegacyOnly(String(e?.message || e));
    return;
  }

  const images = filterImages(all);
  const clusters = clusterByStem(images);
  const todos = [];
  const assignedStems = new Set();

  function matchesAnyMarketingPattern(k) {
    const lower = k.toLowerCase();
    return (
      /logo/.test(lower) ||
      /hero|dashboard/.test(lower) ||
      /report|analytics/.test(lower) ||
      /pricing/.test(lower) ||
      /mobile/.test(lower) ||
      /flashcard/.test(lower) ||
      /(^|[^a-z])cat([^a-z]|$)/.test(lower) ||
      /(^|[^a-z])exam([^a-z]|$)/.test(lower) ||
      /progress|performance/.test(lower) ||
      /(^|[^a-z])app([^a-z]|$)/.test(lower)
    );
  }

  const unmatchedKeys = images
    .filter((o) => !matchesAnyMarketingPattern(o.Key))
    .map((o) => o.Key);

  const logoCluster = bestStemCluster(images, CATEGORY_TESTS.LOGO_PRIMARY, clusters, new Set());
  let logoUrl = null;
  let logoSrcSet = null;
  if (logoCluster) {
    const b = buildResponsiveBundle(logoCluster.objects, cdnBase, 512, 512);
    logoUrl = b.fallback || publicUrl(cdnBase, pickBestObject(logoCluster.objects).Key);
    logoSrcSet = b.srcSet || null;
    assignedStems.add(logoCluster.stem);
  } else {
    todos.push("LOGO_PRIMARY: no object matched filename pattern 'logo'.");
  }

  const heroClusters = mainHeroCarouselClusters(images, clusters, 4, assignedStems);
  const heroCarousel = heroClusters.map((grp) => {
    const b = buildResponsiveBundle(grp, cdnBase, 1200, 750);
    assignedStems.add(fileStem(grp[0].Key));
    return { srcSet: b.srcSet, fallback: b.fallback };
  });

  while (heroCarousel.length < 4) {
    todos.push(`HERO_CAROUSEL: only ${heroCarousel.length} hero/dashboard stems found; padded with legacy slide.`);
    const padIdx = heroCarousel.length;
    const legacy = [
      "screenshottest_1773379293573",
      "screenshot6_1773379293573",
      "screenshot5_1773379293573",
      "screenshot2_1773379293573",
    ][padIdx];
    const base = `${DEFAULT_MARKETING_CDN_BASE}/screenshots/${legacy}`;
    heroCarousel.push({
      srcSet: `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w`,
      fallback: `${base}-768w.webp`,
    });
  }

  const heroDashboardUrl = heroCarousel[0]?.fallback ?? null;
  const heroDashboardSrcSet = heroCarousel[0]?.srcSet ?? null;

  function slotBundle(testKey, dims) {
    const testFn = CATEGORY_TESTS[testKey];
    const bc = bestStemCluster(images, testFn, clusters, assignedStems);
    if (!bc) {
      todos.push(`${testKey}: no matching object.`);
      return null;
    }
    assignedStems.add(bc.stem);
    return buildResponsiveBundle(bc.objects, cdnBase, dims.w, dims.h);
  }

  const heroReport = slotBundle("HERO_REPORT_CARD_SCREENSHOT", { w: 2400, h: 1400 });
  const pricing = slotBundle("PRICING_SCREENSHOT", { w: 1400, h: 900 });
  const mobile = slotBundle("MOBILE_APP_SCREENSHOT", { w: 800, h: 1600 });
  const flashcards = slotBundle("FLASHCARDS_SCREENSHOT", { w: 2200, h: 1400 });
  const catExam = slotBundle("CAT_EXAM_SCREENSHOT", { w: 2200, h: 1200 });
  const progressDash = slotBundle("PROGRESS_DASHBOARD_SCREENSHOT", { w: 2600, h: 1500 });

  const screenshotBundles = {};
  const usedStems = new Set(assignedStems);
  for (const slotKey of Object.keys(LEGACY_SCREENSHOT_STEMS)) {
    const grp = matchScreenshotSlot(slotKey, images, clusters, usedStems);
    const meta = LEGACY_SCREENSHOT_STEMS[slotKey];
    if (grp && grp.length) {
      usedStems.add(fileStem(grp[0].Key));
      screenshotBundles[slotKey] = buildResponsiveBundle(grp, cdnBase, meta.w, meta.h);
    } else {
      todos.push(
        `Screenshot slot "${slotKey}": no semantic filename match — using legacy stem ${meta.stem} (TODO: upload labeled assets).`,
      );
      screenshotBundles[slotKey] = legacyScreenshotBundle(meta.stem, meta.w, meta.h);
    }
  }

  const ts = emitTs({
    baseUrl: cdnBase,
    logoUrl,
    logoSrcSet,
    heroDashboardUrl,
    heroDashboardSrcSet,
    heroReport,
    pricing,
    mobile,
    flashcards,
    catExam,
    progressDash,
    heroCarousel,
    screenshotBundles,
    todos,
    unmatchedKeys,
  });

  await fs.writeFile(OUT_TS, ts, "utf8");
  await fs.writeFile(
    OUT_REPORT,
    JSON.stringify(
      {
        mode: "discovered",
        baseUrl: cdnBase,
        bucket,
        prefix: prefix || null,
        generatedAt: new Date().toISOString(),
        counts: { totalObjects: all.length, images: images.length },
        todos,
        unmatchedKeys,
        slots: {
          LOGO_PRIMARY: logoUrl,
          HERO_DASHBOARD_SCREENSHOT: heroDashboardUrl,
          HERO_REPORT_CARD_SCREENSHOT: heroReport?.fallback,
          PRICING_SCREENSHOT: pricing?.fallback,
          MOBILE_APP_SCREENSHOT: mobile?.fallback,
          FLASHCARDS_SCREENSHOT: flashcards?.fallback,
          CAT_EXAM_SCREENSHOT: catExam?.fallback,
          PROGRESS_DASHBOARD_SCREENSHOT: progressDash?.fallback,
        },
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Wrote ${OUT_TS}`);
  console.log(`Report: ${OUT_REPORT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
