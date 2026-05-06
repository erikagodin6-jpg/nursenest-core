import { getExamPathwayById } from "@/lib/exam-pathways";
import { marketingPathwayLessonDetailPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import {
  getEffectiveCatalogLessonsForPathwaySync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  getPathwayLessonForMarketingHubVerify,
  listPathwayLessonSlugBatch,
} from "@/lib/lessons/pathway-lesson-loader";

const PATHWAY_ID = "ca-rpn-rex-pn";
const PAGE_SIZE = 2000;

type Args = {
  siteUrl: string | null;
  checkDirectRoutes: boolean;
};

function parseArgs(argv: string[]): Args {
  let siteUrl = process.env.RPN_LESSON_SITE_URL ?? process.env.NN_PUBLIC_SITE_ORIGIN ?? null;
  let checkDirectRoutes = false;
  for (const raw of argv) {
    if (raw.startsWith("--site-url=")) siteUrl = raw.slice("--site-url=".length);
    if (raw === "--check-direct-routes") checkDirectRoutes = true;
  }
  siteUrl = siteUrl?.trim() ? siteUrl.trim().replace(/\/$/, "") : null;
  return { siteUrl, checkDirectRoutes };
}

function fail(message: string, detail?: unknown): never {
  console.error(`[verify-rpn-lessons-visible] FAIL: ${message}`);
  if (detail !== undefined) console.error(JSON.stringify(detail, null, 2));
  process.exit(1);
}

function diffMissing(expected: string[], actual: Set<string>): string[] {
  return expected.filter((slug) => !actual.has(slug));
}

async function collectRuntimePublicSlugs(): Promise<Set<string>> {
  const out = new Set<string>();
  for (let skip = 0; ; skip += PAGE_SIZE) {
    const batch = await listPathwayLessonSlugBatch(PATHWAY_ID, skip, PAGE_SIZE, "en", {
      restrictToPublicMarketingSurface: true,
    });
    for (const row of batch) out.add(row.slug);
    if (batch.length < PAGE_SIZE) break;
  }
  return out;
}

function slugsFromHtml(html: string): Set<string> {
  const out = new Set<string>();
  const re = /\/canada\/pn\/rex-pn\/lessons\/([^"'?#<>\s/]+)/g;
  for (const match of html.matchAll(re)) {
    try {
      out.add(decodeURIComponent(match[1]));
    } catch {
      out.add(match[1]);
    }
  }
  return out;
}

async function fetchOk(url: string): Promise<Response> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`);
  }
  return res;
}

async function collectSiteListSlugs(siteUrl: string): Promise<Set<string>> {
  const pathway = getExamPathwayById(PATHWAY_ID);
  if (!pathway) fail(`missing pathway definition for ${PATHWAY_ID}`);
  const indexPath = marketingPathwayLessonsIndexPath(pathway);
  const url = `${siteUrl}${indexPath}?pageSize=${PAGE_SIZE}`;
  const res = await fetchOk(url);
  const html = await res.text();
  return slugsFromHtml(html);
}

async function verifyDirectRoutes(siteUrl: string, slugs: string[]): Promise<void> {
  const pathway = getExamPathwayById(PATHWAY_ID);
  if (!pathway) fail(`missing pathway definition for ${PATHWAY_ID}`);
  const failures: Array<{ slug: string; error: string }> = [];
  for (const slug of slugs) {
    const href = marketingPathwayLessonDetailPath(pathway, slug);
    if (!href) {
      failures.push({ slug, error: "could_not_build_href" });
      continue;
    }
    try {
      await fetchOk(`${siteUrl}${href}`);
    } catch (e) {
      failures.push({ slug, error: e instanceof Error ? e.message : String(e) });
    }
  }
  if (failures.length > 0) {
    fail("one or more RPN lesson direct routes did not return 2xx", failures.slice(0, 50));
  }
}

const args = parseArgs(process.argv.slice(2));
const filesystemLessons = getEffectiveCatalogLessonsForPathwaySync(PATHWAY_ID);
const expectedSlugs = filesystemLessons.map((lesson) => lesson.slug).sort();
if (expectedSlugs.length === 0) fail("filesystem effective catalog has zero RPN lessons");

const runtimeSlugs = await collectRuntimePublicSlugs();
const missingFromRuntime = diffMissing(expectedSlugs, runtimeSlugs);
if (missingFromRuntime.length > 0) {
  fail("runtime public slug batch is missing filesystem lessons; if DATABASE_URL has stale PathwayLesson rows, seed/upsert the merged catalog", {
    filesystemCount: expectedSlugs.length,
    runtimeCount: runtimeSlugs.size,
    missing: missingFromRuntime.slice(0, 80),
  });
}

const unresolved = [];
for (const slug of expectedSlugs) {
  const detail = await getPathwayLessonForMarketingHubVerify(PATHWAY_ID, slug, "en");
  if (!detail?.structuralQuality?.publicComplete) unresolved.push(slug);
}
if (unresolved.length > 0) {
  fail("runtime detail resolver could not load public-complete RPN lessons", unresolved.slice(0, 80));
}

if (args.siteUrl) {
  const siteSlugs = await collectSiteListSlugs(args.siteUrl);
  const missingFromSite = diffMissing(expectedSlugs, siteSlugs);
  if (missingFromSite.length > 0) {
    fail("site lesson list HTML is missing filesystem/runtime RPN lessons", {
      siteUrl: args.siteUrl,
      filesystemCount: expectedSlugs.length,
      siteListCount: siteSlugs.size,
      missing: missingFromSite.slice(0, 80),
    });
  }
  if (args.checkDirectRoutes) {
    await verifyDirectRoutes(args.siteUrl, expectedSlugs);
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      pathwayId: PATHWAY_ID,
      filesystemEffectiveCount: expectedSlugs.length,
      runtimePublicCount: runtimeSlugs.size,
      siteUrl: args.siteUrl,
      checkedSiteList: Boolean(args.siteUrl),
      checkedDirectRoutes: Boolean(args.siteUrl && args.checkDirectRoutes),
    },
    null,
    2,
  ),
);
