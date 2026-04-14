#!/usr/bin/env node
/**
 * Final content audit — writes JSON under repo-root data/audit/.
 * Batched Prisma reads; safe mode (no writes). Falls back to catalog/files if DB unavailable.
 */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");
const BATCH = 250;
const PLACEHOLDER_RE = /(TODO|TBD|Lorem ipsum|coming soon|\[stub\]|placeholder lesson)/i;

const require = createRequire(import.meta.url);
const { PrismaClient } = require(join(APP_ROOT, "node_modules/@prisma/client"));

const PATHWAY_URLS = [
  { id: "us-rn-nclex-rn", pattern: "/us/rn/nclex-rn/lessons" },
  { id: "ca-rpn-rex-pn", pattern: "/canada/rpn/rex-pn/lessons" },
  { id: "us-np-fnp", pattern: "/us/np/fnp/lessons" },
];

function lessonPath(pattern, slug) {
  return `${pattern}/${encodeURIComponent(slug)}`;
}

function classifyPathwayLesson(row) {
  const slug = String(row.slug ?? "").trim();
  const title = String(row.title ?? "").trim();
  const sections = Array.isArray(row.sections) ? row.sections : [];
  const reasons = [];

  if (!slug) {
    return { status: "missing", reasons: ["empty_slug"], routeHint: null };
  }
  if (!title) {
    return { status: "missing", reasons: ["empty_title"], routeHint: slug };
  }
  if (sections.length === 0) {
    return { status: "incomplete", reasons: ["no_sections"], routeHint: slug };
  }

  let totalBody = 0;
  let thin = 0;
  for (const s of sections) {
    const body = String(s?.body ?? "").trim();
    totalBody += body.length;
    if (body.length < 60) thin++;
  }
  if (PLACEHOLDER_RE.test(JSON.stringify(row))) {
    reasons.push("placeholder_or_stub_text");
  }
  if (thin >= Math.ceil(sections.length * 0.5)) {
    reasons.push("many_thin_sections");
  }
  if (totalBody < 400) {
    reasons.push("low_aggregate_body");
  }

  // Quiz blocks in JSON are optional; question bank linkage is pathway-level (see exam_questions), not audited here.

  if (reasons.length > 0) {
    return { status: "incomplete", reasons, routeHint: slug };
  }
  return { status: "complete", reasons: [], routeHint: slug };
}

async function tryDb() {
  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    await prisma.$disconnect().catch(() => {});
    return null;
  }
}

async function fetchRenderSamples(baseUrl, samples) {
  const out = {
    baseUrl,
    attemptedAt: new Date().toISOString(),
    results: [],
    note: null,
  };
  if (!baseUrl) {
    out.note = "VERIFY_BASE_URL unset — skipped HTTP checks";
    return out;
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    for (const s of samples) {
      const url = `${baseUrl.replace(/\/$/, "")}${s.path}`;
      try {
        const r = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
        out.results.push({
          path: s.path,
          status: r.status,
          ok: r.ok || r.status === 304,
        });
      } catch (e) {
        out.results.push({ path: s.path, status: null, ok: false, error: String(e?.message ?? e) });
      }
    }
  } finally {
    clearTimeout(t);
  }
  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();
  const prisma = await tryDb();
  const databaseAvailable = Boolean(prisma);

  let catalog = { pathways: {} };
  try {
    catalog = JSON.parse(await readFile(join(APP_ROOT, "src/content/pathway-lessons/catalog.json"), "utf8"));
  } catch {
    catalog = { pathways: {} };
  }

  const tierPriority = (pathwayId) => {
    if (/^us-np-|^ca-np-/.test(pathwayId)) return 1;
    if (/rn|nclex-rn|rex-pn|nclex-pn|rpn|lpn/.test(pathwayId)) return 2;
    return 3;
  };

  const pathwayIds = Object.keys(catalog.pathways ?? {}).sort((a, b) => tierPriority(a) - tierPriority(b) || a.localeCompare(b));

  /** @type {any[]} */
  const lessonRows = [];
  /** @type {Map<string, number>} */
  const dupMap = new Map();

  if (prisma) {
    let skip = 0;
    let more = true;
    while (more) {
      const batch = await prisma.pathwayLesson.findMany({
        skip,
        take: BATCH,
        orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
      });
      if (batch.length === 0) {
        more = false;
        break;
      }
      lessonRows.push(...batch);
      skip += batch.length;
      if (batch.length < BATCH) more = false;
    }

    const dupRows = await prisma.$queryRaw`
      SELECT pathway_id, slug, locale, COUNT(*)::int AS c
      FROM pathway_lessons
      GROUP BY pathway_id, slug, locale
      HAVING COUNT(*) > 1
    `;
    for (const r of dupRows) {
      dupMap.set(`${r.pathway_id}::${r.slug}::${r.locale}`, r.c);
    }
  }

  const completeness = {
    generatedAt,
    databaseAvailable,
    inventoryPaths: {
      lessonSystemInventory: "reports/lesson-system-inventory.json",
      catalogJson: "nursenest-core/src/content/pathway-lessons/catalog.json",
    },
    summary: {
      complete: 0,
      incomplete: 0,
      missing: 0,
      brokenRoute: 0,
    },
    byPathway: {},
    issueSamples: [],
    source: databaseAvailable ? "prisma.pathway_lessons+catalog" : "catalog.json_only",
  };

  const evaluateRow = (pathwayId, row, source) => {
    const c = classifyPathwayLesson(row);
    completeness.summary[c.status] = (completeness.summary[c.status] ?? 0) + 1;
    if (!completeness.byPathway[pathwayId]) {
      completeness.byPathway[pathwayId] = { complete: 0, incomplete: 0, missing: 0, brokenRoute: 0 };
    }
    completeness.byPathway[pathwayId][c.status]++;

    if (completeness.issueSamples.length < 400 && c.status !== "complete") {
      completeness.issueSamples.push({
        pathwayId,
        slug: row.slug,
        source,
        status: c.status,
        reasons: c.reasons,
      });
    }
  };

  /** @type {any[]} */
  const contentItemLessons = [];
  if (prisma) {
    let ciSkip = 0;
    let ciMore = true;
    while (ciMore) {
      const batch = await prisma.contentItem.findMany({
        where: { type: "lesson" },
        skip: ciSkip,
        take: BATCH,
        orderBy: { slug: "asc" },
      });
      if (batch.length === 0) {
        ciMore = false;
        break;
      }
      contentItemLessons.push(...batch);
      ciSkip += batch.length;
      if (batch.length < BATCH) ciMore = false;
    }
  }

  function classifyContentItem(it) {
    const slug = String(it.slug ?? "").trim();
    const title = String(it.title ?? "").trim();
    const arr = Array.isArray(it.content) ? it.content : [];
    let text = "";
    for (const block of arr) {
      if (typeof block === "string") text += block;
      else if (block && typeof block.body === "string") text += block.body;
    }
    const reasons = [];
    if (!slug) reasons.push("empty_slug");
    if (!title) reasons.push("empty_title");
    if (text.trim().length < 200) reasons.push("thin_body");
    if (PLACEHOLDER_RE.test(text)) reasons.push("placeholder");
    const status =
      reasons.length === 0 ? "complete" : reasons.includes("empty_slug") || reasons.includes("empty_title") ? "missing" : "incomplete";
    return { status, reasons };
  }

  if (databaseAvailable) {
    for (const row of lessonRows) {
      evaluateRow(row.pathwayId, row, "db");
    }
    completeness.contentItems = {
      total: contentItemLessons.length,
      summary: { complete: 0, incomplete: 0, missing: 0 },
      samples: [],
    };
    for (const it of contentItemLessons) {
      const c = classifyContentItem(it);
      completeness.contentItems.summary[c.status]++;
      if (completeness.contentItems.samples.length < 80 && c.status !== "complete") {
        completeness.contentItems.samples.push({ slug: it.slug, status: c.status, reasons: c.reasons });
      }
    }
  } else {
    for (const pid of pathwayIds) {
      const lessons = catalog.pathways[pid]?.lessons ?? [];
      for (const L of lessons) {
        evaluateRow(pid, L, "catalog");
      }
    }
  }

  await writeFile(join(OUT, "final-lesson-completeness-audit.json"), JSON.stringify(completeness, null, 2));

  let legacySummary = { summary: {} };
  try {
    legacySummary = JSON.parse(await readFile(join(REPO_ROOT, "data/audit/legacy-to-current-lesson-map.json"), "utf8"));
  } catch {
    legacySummary = { summary: {}, note: "legacy-to-current-lesson-map.json missing" };
  }

  const dbSlugSet = new Set();
  if (databaseAvailable) {
    for (const row of lessonRows) {
      dbSlugSet.add(`${row.pathwayId}::${row.slug}::${row.locale}`);
    }
  }

  const legacyGap = {
    generatedAt,
    databaseAvailable,
    legacyMapSummary: legacySummary.summary ?? {},
    duplicatesInDb: dupMap.size,
    duplicateSamples: [...dupMap.entries()].slice(0, 50).map(([k, c]) => ({ key: k, count: c })),
    notImportedFromLegacyEstimate: legacySummary.summary?.none ?? null,
    notes: [
      "Full legacy reconciliation uses legacy-to-current-lesson-map.json action field.",
      "DB duplicate groups listed when database available.",
    ],
  };
  await writeFile(join(OUT, "legacy-import-gap-final.json"), JSON.stringify(legacyGap, null, 2));

  const baseUrl = process.env.VERIFY_BASE_URL || "";
  const sampleSlugs =
    databaseAvailable && lessonRows.length > 0
      ? [
          lessonRows.find((r) => r.pathwayId === "us-rn-nclex-rn")?.slug,
          lessonRows.find((r) => r.pathwayId === "ca-rpn-rex-pn")?.slug,
          lessonRows.find((r) => r.pathwayId === "us-np-fnp")?.slug,
        ].filter(Boolean)
      : ["fluid-balance-acute-care", "acute-coronary-syndrome", "dermatologic-emergencies"];

  const renderSamples = [];
  for (const p of PATHWAY_URLS) {
    const slug = sampleSlugs.shift();
    if (slug) renderSamples.push({ path: lessonPath(p.pattern, slug), pathwayId: p.id, slug });
  }
  const hubChecks = PATHWAY_URLS.map((p) => ({ path: p.pattern, pathwayId: p.id }));

  const lessonRender = {
    generatedAt,
    databaseAvailable,
    ...(await fetchRenderSamples(baseUrl, [...hubChecks, ...renderSamples])),
    pathwayPatternsTested: PATHWAY_URLS,
    http404LessonDetailCount: 0,
  };
  lessonRender.http404LessonDetailCount = lessonRender.results.filter(
    (r) => r.path?.includes("/lessons/") && r.path.split("/lessons/")[1]?.length > 1 && r.status === 404,
  ).length;
  await writeFile(join(OUT, "lesson-render-final.json"), JSON.stringify(lessonRender, null, 2));

  let blog = {
    generatedAt,
    databaseAvailable,
    byStatus: {},
    recent24h: { created: 0, updated: 0 },
    thinBodySamples: [],
    failed: null,
  };
  if (prisma) {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [byStatus, r24] = await Promise.all([
        prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
        prisma.blogPost.count({ where: { updatedAt: { gte: since } } }),
      ]);
      for (const b of byStatus) {
        blog.byStatus[b.postStatus] = b._count._all;
      }
      blog.recent24h.updated = r24;
      blog.recent24h.created = await prisma.blogPost.count({ where: { createdAt: { gte: since } } });
      const rawThin = await prisma.$queryRaw`
        SELECT slug, LENGTH(body)::int AS body_len
        FROM "BlogPost"
        WHERE LENGTH(TRIM(body)) < 200
        LIMIT 30
      `;
      blog.thinBodySamples = rawThin.map((r) => ({ slug: r.slug, bodyLen: r.body_len }));
    } catch (e) {
      blog.failed = String(e?.message ?? e);
    }
  } else {
    blog.note = "Database unavailable — blog counts skipped";
  }
  await writeFile(join(OUT, "blog-final-verification.json"), JSON.stringify(blog, null, 2));

  if (prisma) await prisma.$disconnect();

  const expectedCatalog = pathwayIds.reduce((acc, pid) => acc + (catalog.pathways[pid]?.lessons?.length ?? 0), 0);
  const finalStatus = {
    generatedAt,
    databaseAvailable,
    safeMode: true,
    remediation: "deferred_no_auto_import",
    paginationNotes: [
      "Marketing lesson hubs use PATHWAY_HUB_PAGE_SIZE_DEFAULT + searchParams page (see lessons/page.tsx).",
      "API /api/lessons uses cursor/offset limits (LESSON_API_OFFSET_LIMIT).",
    ],
    lessons: {
      expectedCatalogLessons: expectedCatalog,
      evaluatedRows: databaseAvailable ? lessonRows.length : expectedCatalog,
      completenessPct:
        completeness.summary.complete + completeness.summary.incomplete + completeness.summary.missing > 0
          ? Math.round(
              (100 * completeness.summary.complete) /
                (completeness.summary.complete +
                  completeness.summary.incomplete +
                  completeness.summary.missing +
                  completeness.summary.brokenRoute),
            )
          : 0,
      missingCount: completeness.summary.missing,
      brokenRoutes: completeness.summary.brokenRoute,
      incompleteCount: completeness.summary.incomplete,
    },
    blog: databaseAvailable ? blog : { skipped: true },
    render: {
      httpChecked: Boolean(baseUrl),
      lessonRenderFile: "lesson-render-final.json",
      http404LessonDetails: lessonRender.http404LessonDetailCount,
    },
    legacy: {
      gapFile: "legacy-import-gap-final.json",
    },
    importSuccessRate: databaseAvailable ? "see legacy-import-gap-final.json + DB row counts" : "n/a_db_offline",
  };
  await writeFile(join(OUT, "final-system-status.json"), JSON.stringify(finalStatus, null, 2));

  console.log(`Wrote audit JSON under ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
