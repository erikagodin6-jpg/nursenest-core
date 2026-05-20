import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { buildSitemapIndexXmlForOrigin } from "@/lib/seo/sitemap-index-children";
import {
  extractLocStringsFromXml,
  formatSitemapSegmentationReportMarkdown,
  isForbiddenSeoMarketingPath,
  MAX_SEGMENT_PAGE_LOCS,
  runSitemapSegmentationValidation,
  SEGMENT_LOC_WARNING_THRESHOLD,
  validateSitemapPageLoc,
  validateSitemapXmlWellFormed,
} from "@/lib/seo/sitemap-segment-validator";

const ORIGIN = CANONICAL_PRODUCTION_ORIGIN.replace(/\/$/, "");

test("validateSitemapXmlWellFormed accepts minimal urlset", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${ORIGIN}/</loc></url>
</urlset>`;
  const r = validateSitemapXmlWellFormed(xml);
  assert.equal(r.ok, true);
});

test("extractLocStringsFromXml extracts loc tags", () => {
  const xml = `<loc>${ORIGIN}/a</loc>\n<loc>${ORIGIN}/b</loc>`;
  assert.deepEqual(extractLocStringsFromXml(xml), [`${ORIGIN}/a`, `${ORIGIN}/b`]);
});

test("isForbiddenSeoMarketingPath blocks /seo and /seo/... only", () => {
  assert.equal(isForbiddenSeoMarketingPath("/seo"), true);
  assert.equal(isForbiddenSeoMarketingPath("/seo/foo"), true);
  assert.equal(isForbiddenSeoMarketingPath("/about"), false);
});

test("validateSitemapPageLoc rejects /app and /admin URLs", () => {
  const r1 = validateSitemapPageLoc(`${ORIGIN}/app/lessons`, ORIGIN);
  assert.ok(r1, "expected failure for /app");
  const r2 = validateSitemapPageLoc(`${ORIGIN}/admin`, ORIGIN);
  assert.ok(r2, "expected failure for /admin");
});

test("validateSitemapPageLoc rejects /seo path", () => {
  const r = validateSitemapPageLoc(`${ORIGIN}/seo/experiment`, ORIGIN);
  assert.ok(r && r.reason === "forbidden_seo_path", r?.reason);
});

test("runSitemapSegmentationValidation with mock routes — duplicate loc across segments fails", async () => {
  const common = `${ORIGIN}/dup-page`;
  const smallUrlset = (n: string) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${n}</loc><lastmod>2020-01-01</lastmod></url>
</urlset>`;
  const indexXml = buildSitemapIndexXmlForOrigin(ORIGIN);
  const mock = {
    "sitemap.xml": async () => ({
      GET: async () => new Response(indexXml, { status: 200 }),
    }),
  };
  for (const f of [
    "sitemap-core.xml",
    "sitemap-blog.xml",
    "sitemap-pathways.xml",
    "sitemap-lessons.xml",
    "sitemap-localized.xml",
    "sitemap-clinical-modules.xml",
    "sitemap-allied.xml",
    "sitemap-new-grad.xml",
  ] as const) {
    (mock as Record<string, () => Promise<{ GET: (r: Request) => Promise<Response> }>>)[f] = async () => ({
      GET: async () => new Response(smallUrlset(common), { status: 200 }),
    });
  }
  const report = await runSitemapSegmentationValidation({ origin: ORIGIN, routeGetters: mock });
  assert.ok(report.errors.some((e) => e.startsWith("duplicate_page_locs_across_segments")));
});

test("formatSitemapSegmentationReportMarkdown includes segment table", () => {
  const report = {
    origin: ORIGIN,
    budgetMsPerSegment: 1000,
    index: {
      generationMs: 1,
      xmlOk: true,
      childUrlsFromXml: [],
      approvedChildUrls: [],
      childSetMatchesApproved: true,
    },
    segments: [
      {
        filename: "sitemap-core.xml",
        label: "core",
        generationMs: 5,
        pageLocCount: 10,
        invalidLocCount: 0,
        invalidSamples: [],
        overBudget: false,
        nearOrOver48k: "ok" as const,
        xmlOk: true,
      },
    ],
    duplicatePageLocs: [],
    totalInvalidPageLocOccurrences: 0,
    errors: [],
    warnings: [],
  };
  const md = formatSitemapSegmentationReportMarkdown(report);
  assert.match(md, /sitemap-core/);
  assert.match(md, /10/);
});

test("segment constants are within spec (48k cap, 40k warn)", () => {
  assert.equal(MAX_SEGMENT_PAGE_LOCS, 48_000);
  assert.equal(SEGMENT_LOC_WARNING_THRESHOLD, 40_000);
});
