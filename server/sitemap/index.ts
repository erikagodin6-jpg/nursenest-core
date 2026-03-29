import type { Express, Request, Response } from "express";
import { routeParamString } from "../route-params";
import { SUPPORTED_LOCALES } from "@shared/locales";
import { isEmergencyMode, isCircuitOpen } from "../platform-resilience";
import {
  getSiteBase,
  getNewGradBase,
  todayDate,
  wrapUrlset,
  wrapSitemapIndex,
  sitemapIndexEntry,
  splitIntoChunks,
  SITEMAP_SPLIT_LIMIT,
  SITEMAP_CACHE_TTL,
} from "./helpers";
import {
  generateMainPages,
  generateMainLessons,
  generateMainQuestions,
  generateMainFlashcards,
  generateMainSpecialties,
  generateMainGlossary,
  generateMainMedicalAbbreviations,
  generateMainNursingSkillChecklists,
  generateMainClinicalClarity,
  generateMainBlog,
  generateMainMedicalImaging,
  generateMainSeoContent,
  generateMainTopics,
  generateMainProgrammatic,
  generateSeoContentPages,
  generateExamBlueprintSeoPages,
  generateClinicalSeoPages,
} from "./main-site";
import {
  generateAlliedPages,
  generateAlliedDatabaseContent,
  generateAlliedCareers,
  generateAlliedExams,
  generateAlliedTools,
  generateAlliedTopics,
  generateAlliedSeoLanding,
} from "./allied-site";
import { generateNewGradPages } from "./newgrad-site";
import { generateLanguageSitemap } from "./language-sitemaps";
import { sitemapHealthCheck, sitemapValidate, seoDebug } from "./health";

interface CacheEntry {
  xml: string;
  builtAt: number;
}

interface UrlCacheEntry {
  urls: string[];
  builtAt: number;
}

interface SitemapDef {
  name: string;
  generator: () => Promise<string[]>;
}

const xmlCache = new Map<string, CacheEntry>();
const urlCache = new Map<string, UrlCacheEntry>();

const LANGUAGE_SITEMAP_LOCALES: readonly string[] = SUPPORTED_LOCALES;
const MAX_SITEMAP_CACHE_ENTRIES = 50;
const MAX_URL_CACHE_ENTRIES = 50;

function getCachedXml(key: string): string | null {
  const entry = xmlCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.builtAt >= SITEMAP_CACHE_TTL) return null;
  return entry.xml;
}

function setCachedXml(key: string, xml: string): void {
  xmlCache.set(key, { xml, builtAt: Date.now() });
}

function getCachedUrls(key: string): string[] | null {
  const entry = urlCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.builtAt >= SITEMAP_CACHE_TTL) return null;
  return entry.urls;
}

function setCachedUrls(key: string, urls: string[]): void {
  urlCache.set(key, { urls, builtAt: Date.now() });
}

function sendXml(res: Response, xml: string, cacheHit: boolean): void {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.setHeader("X-Sitemap-Cache", cacheHit ? "HIT" : "MISS");
  res.status(200).send(xml);
}

function sendStaleXml(res: Response, xml: string): void {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.setHeader("X-Sitemap-Cache", "STALE");
  res.status(200).send(xml);
}

function send503Xml(res: Response): void {
  res.setHeader("Retry-After", "600");
  res
    .status(503)
    .send('<?xml version="1.0" encoding="UTF-8"?><error>Service temporarily unavailable</error>');
}

function handleSitemapError(res: Response, cacheKey: string, label: string, error: any): void {
  console.error(`[Sitemap] ${label} error:`, error);
  const stale = xmlCache.get(cacheKey);
  if (stale?.xml) {
    sendStaleXml(res, stale.xml);
    return;
  }
  send503Xml(res);
}

function serveStaleCacheOr503(res: Response, cacheKey: string, label: string): void {
  const stale = xmlCache.get(cacheKey);
  if (stale?.xml) {
    console.warn(`[Sitemap] ${label}: serving stale cache during degraded state`);
    sendStaleXml(res, stale.xml);
    return;
  }

  console.warn(`[Sitemap] ${label}: no cache available, returning 503`);
  send503Xml(res);
}

function isDegradedState(): boolean {
  return isEmergencyMode() || isCircuitOpen("database");
}

async function getGeneratorUrls(def: SitemapDef): Promise<string[]> {
  const cacheKey = `urls-${def.name}`;
  const cached = getCachedUrls(cacheKey);
  if (cached) return cached;

  const urls = await def.generator();
  setCachedUrls(cacheKey, urls);
  return urls;
}

function buildChunkXml(urls: string[], chunkIndex: number): string {
  const chunks = splitIntoChunks(urls, SITEMAP_SPLIT_LIMIT);
  const chunk = chunks[chunkIndex] || [];
  return wrapUrlset(chunk);
}

function parsePageParam(page: string | string[] | undefined): number | null {
  const raw = Array.isArray(page) ? page[0] : page;
  if (raw == null || raw === "") return null;
  const n = parseInt(String(raw), 10);
  if (Number.isNaN(n) || n < 1) return null;
  return n;
}

async function generateAlliedCombined(): Promise<string[]> {
  const [staticUrls, dbUrls] = await Promise.all([
    generateAlliedPages().catch(() => []),
    generateAlliedDatabaseContent().catch(() => []),
  ]);
  return [...staticUrls, ...dbUrls];
}

const mainSitemapDefs: SitemapDef[] = [
  { name: "pages", generator: generateMainPages },
  { name: "lessons", generator: generateMainLessons },
  { name: "questions", generator: generateMainQuestions },
  { name: "flashcards", generator: generateMainFlashcards },
  { name: "specialties", generator: generateMainSpecialties },
  { name: "glossary", generator: generateMainGlossary },
  { name: "medical-abbreviations", generator: generateMainMedicalAbbreviations },
  { name: "nursing-skill-checklists", generator: generateMainNursingSkillChecklists },
  { name: "clinical-clarity", generator: generateMainClinicalClarity },
  { name: "blog", generator: generateMainBlog },
  { name: "medical-imaging", generator: generateMainMedicalImaging },
  { name: "seo-content", generator: generateMainSeoContent },
  { name: "topics", generator: generateMainTopics },
  { name: "programmatic", generator: generateMainProgrammatic },
  { name: "seo-content-pages", generator: generateSeoContentPages },
  { name: "exam-blueprint-seo", generator: generateExamBlueprintSeoPages },
  { name: "clinical-seo", generator: generateClinicalSeoPages },
  { name: "allied-health", generator: generateAlliedCombined },
];

const alliedSitemapDefs: SitemapDef[] = [
  { name: "allied-careers", generator: generateAlliedCareers },
  { name: "allied-exams", generator: generateAlliedExams },
  { name: "allied-tools", generator: generateAlliedTools },
  { name: "allied-topics", generator: generateAlliedTopics },
  { name: "allied-seo-landing", generator: generateAlliedSeoLanding },
];

async function generateChildSitemap(def: SitemapDef, chunkIndex: number): Promise<string> {
  const cacheKey = `child-${def.name}-${chunkIndex}`;
  const cached = getCachedXml(cacheKey);
  if (cached) return cached;

  const urls = await getGeneratorUrls(def);

  if (urls.length === 0 && isDegradedState()) {
    const stale = xmlCache.get(cacheKey);
    if (stale?.xml) return stale.xml;
    throw new Error(`Empty sitemap during degraded state: ${def.name}`);
  }

  const xml = buildChunkXml(urls, chunkIndex);
  setCachedXml(cacheKey, xml);
  return xml;
}

async function buildMainSitemapIndex(): Promise<string> {
  const base = getSiteBase();
  const today = todayDate();
  const entries: string[] = [];

  for (const locale of LANGUAGE_SITEMAP_LOCALES) {
    entries.push(sitemapIndexEntry(`${base}/sitemaps/sitemap-lang-${locale}.xml`, today));
  }

  for (const def of mainSitemapDefs) {
    try {
      const urls = await getGeneratorUrls(def);
      const chunkCount = Math.max(1, Math.ceil(urls.length / SITEMAP_SPLIT_LIMIT));

      for (let i = 0; i < chunkCount; i++) {
        const suffix = chunkCount > 1 ? `-${i + 1}` : "";
        entries.push(
          sitemapIndexEntry(`${base}/sitemaps/sitemap-${def.name}${suffix}.xml`, today),
        );
      }
    } catch (error) {
      console.error(`[Sitemap] Main index count error for ${def.name}:`, error);
      entries.push(sitemapIndexEntry(`${base}/sitemaps/sitemap-${def.name}.xml`, today));
    }
  }

  return wrapSitemapIndex(entries);
}

async function buildAlliedSitemapIndex(): Promise<string> {
  const base = getSiteBase();
  const today = todayDate();
  const entries: string[] = [];

  for (const def of alliedSitemapDefs) {
    try {
      const urls = await getGeneratorUrls(def);
      const chunkCount = Math.max(1, Math.ceil(urls.length / SITEMAP_SPLIT_LIMIT));

      for (let i = 0; i < chunkCount; i++) {
        const suffix = chunkCount > 1 ? `-${i + 1}` : "";
        entries.push(
          sitemapIndexEntry(`${base}/sitemaps/sitemap-${def.name}${suffix}.xml`, today),
        );
      }
    } catch (error) {
      console.error(`[Sitemap] Allied index count error for ${def.name}:`, error);
      entries.push(sitemapIndexEntry(`${base}/sitemaps/sitemap-${def.name}.xml`, today));
    }
  }

  return wrapSitemapIndex(entries);
}

async function buildNewGradSitemapIndex(): Promise<string> {
  const base = getNewGradBase();
  const today = todayDate();
  const urls = await generateNewGradPages().catch(() => []);
  const chunkCount = Math.max(1, Math.ceil(urls.length / SITEMAP_SPLIT_LIMIT));
  const entries: string[] = [];

  for (let i = 0; i < chunkCount; i++) {
    const suffix = chunkCount > 1 ? `-${i + 1}` : "";
    entries.push(
      sitemapIndexEntry(`${base}/sitemaps/sitemap-newgrad-content${suffix}.xml`, today),
    );
  }

  return wrapSitemapIndex(entries);
}

function getRobotsTxt(isNewGrad: boolean, isAllied: boolean): string {
  if (isNewGrad) {
    const newGradBase = getNewGradBase();
    return [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /admin",
      "Disallow: /api/",
      "Disallow: /account",
      "Disallow: /checkout",
      "",
      `Sitemap: ${newGradBase}/sitemap-index.xml`,
      "",
    ].join("\n");
  }

  if (isAllied) {
    const alliedBase = "https://allied.nursenest.ca";
    return [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /admin",
      "Disallow: /api/",
      "Disallow: /login",
      "Disallow: /register",
      "Disallow: /profile",
      "Disallow: /dashboard",
      "Disallow: /account",
      "Disallow: /checkout",
      "Disallow: /trial/",
      "Disallow: /subscription/",
      "Disallow: /upgrade",
      "Disallow: /feedback",
      "Disallow: /diagnostic-assessment",
      "Disallow: /settings",
      "Disallow: /notes",
      "Disallow: /invite",
      "Disallow: /reset-password",
      "Disallow: /verify-email",
      "Disallow: /reports",
      "Disallow: /mock-exams/*/report",
      "Disallow: /*?sort=",
      "Disallow: /*?filter=",
      "Disallow: /*?q=",
      "Disallow: /*?search=",
      "Disallow: /*?page=",
      "Disallow: /*?tab=",
      "",
      "Crawl-delay: 1",
      "",
      `Sitemap: ${alliedBase}/sitemap-index.xml`,
      "",
    ].join("\n");
  }

  const base = getSiteBase();
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /admin",
    "Disallow: /content-editor",
    "Disallow: /api/",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /profile",
    "Disallow: /dashboard",
    "Disallow: /upgrade",
    "Disallow: /subscription/",
    "Disallow: /checkout",
    "Disallow: /account",
    "Disallow: /trial/",
    "Disallow: /diagnostic-assessment",
    "Disallow: /mock-exams/*/report",
    "Disallow: /feedback",
    "Disallow: /settings",
    "Disallow: /notes",
    "Disallow: /invite",
    "Disallow: /reset-password",
    "Disallow: /verify-email",
    "Disallow: /qbank/",
    "Disallow: /reports",
    "Disallow: /*?sort=",
    "Disallow: /*?filter=",
    "Disallow: /*?q=",
    "Disallow: /*?search=",
    "Disallow: /*?page=",
    "Disallow: /*?tab=",
    "Disallow: /*?ref=",
    "",
    "Crawl-delay: 1",
    "",
    `Sitemap: ${base}/sitemap-index.xml`,
    "",
  ].join("\n");
}

function registerChunkedSitemapRoutes(app: Express, defs: SitemapDef[]): void {
  for (const def of defs) {
    app.get(`/sitemaps/sitemap-${def.name}.xml`, async (_req: Request, res: Response) => {
      try {
        const cacheKey = `child-${def.name}-0`;
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);

        const xml = await generateChildSitemap(def, 0);
        return sendXml(res, xml, false);
      } catch (error: any) {
        return handleSitemapError(res, `child-${def.name}-0`, `Sitemap ${def.name}`, error);
      }
    });

    app.get(`/sitemaps/sitemap-${def.name}-:page.xml`, async (req: Request, res: Response) => {
      const pageNum = parsePageParam(req.params.page);
      if (!pageNum) return res.status(404).send("Not found");

      const chunkIndex = pageNum - 1;
      const cacheKey = `child-${def.name}-${chunkIndex}`;

      try {
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);

        const urls = await getGeneratorUrls(def);
        if (urls.length === 0 && isDegradedState()) {
          return serveStaleCacheOr503(res, cacheKey, `Sitemap ${def.name}-${pageNum}`);
        }

        const chunkCount = Math.ceil(urls.length / SITEMAP_SPLIT_LIMIT);
        if (chunkIndex >= chunkCount) return res.status(404).send("Not found");

        const xml = buildChunkXml(urls, chunkIndex);
        setCachedXml(cacheKey, xml);
        return sendXml(res, xml, false);
      } catch (error: any) {
        return handleSitemapError(res, cacheKey, `Sitemap ${def.name}-${pageNum}`, error);
      }
    });
  }
}

export function registerSitemapRoutes(app: Express): void {
  app.get("/robots.txt", (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "public, max-age=300");
    res.type("text/plain").send(getRobotsTxt(!!(req as any).isNewGrad, !!(req as any).isAllied));
  });

  app.get("/sitemap-index.xml", async (req: Request, res: Response) => {
    try {
      let xml: string;
      let cacheKey: string;

      if ((req as any).isNewGrad) {
        cacheKey = "newgrad-index";
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);
        xml = await buildNewGradSitemapIndex();
      } else if ((req as any).isAllied) {
        cacheKey = "allied-index";
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);
        xml = await buildAlliedSitemapIndex();
      } else {
        cacheKey = "main-index";
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);
        xml = await buildMainSitemapIndex();
      }

      setCachedXml(cacheKey, xml);
      return sendXml(res, xml, false);
    } catch (error: any) {
      const indexKey =
        (req as any).isNewGrad ? "newgrad-index" : (req as any).isAllied ? "allied-index" : "main-index";
      return handleSitemapError(res, indexKey, "Sitemap index", error);
    }
  });

  for (const locale of LANGUAGE_SITEMAP_LOCALES) {
    app.get(`/sitemaps/sitemap-lang-${locale}.xml`, async (_req: Request, res: Response) => {
      const cacheKey = `lang-${locale}`;
      try {
        const cached = getCachedXml(cacheKey);
        if (cached) return sendXml(res, cached, true);

        const urls = await generateLanguageSitemap(locale);
        if (urls.length === 0 && isDegradedState()) {
          return serveStaleCacheOr503(res, cacheKey, `Sitemap lang-${locale}`);
        }

        const xml = wrapUrlset(urls);
        setCachedXml(cacheKey, xml);
        return sendXml(res, xml, false);
      } catch (error: any) {
        return handleSitemapError(res, cacheKey, `Sitemap lang-${locale}`, error);
      }
    });
  }

  registerChunkedSitemapRoutes(app, mainSitemapDefs);
  registerChunkedSitemapRoutes(app, alliedSitemapDefs);

  app.get("/sitemaps/sitemap-allied-content.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemaps/sitemap-allied-health.xml");
  });

  app.get("/sitemaps/sitemap-allied-content-:page.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemaps/sitemap-allied-health.xml");
  });

  app.get("/sitemaps/sitemap-newgrad-content.xml", async (_req: Request, res: Response) => {
    const cacheKey = "newgrad-content-0";

    try {
      const cached = getCachedXml(cacheKey);
      if (cached) return sendXml(res, cached, true);

      const urls = await generateNewGradPages();
      if (urls.length === 0 && isDegradedState()) {
        return serveStaleCacheOr503(res, cacheKey, "NewGrad sitemap");
      }

      const xml = wrapUrlset(urls);
      setCachedXml(cacheKey, xml);
      return sendXml(res, xml, false);
    } catch (error: any) {
      return handleSitemapError(res, cacheKey, "NewGrad sitemap", error);
    }
  });

  app.get("/sitemaps/sitemap-newgrad-content-:page.xml", async (req: Request, res: Response) => {
    const pageNum = parsePageParam(req.params.page);
    if (!pageNum) return res.status(404).send("Not found");

    const chunkIndex = pageNum - 1;
    const cacheKey = `newgrad-content-${chunkIndex}`;

    try {
      const cached = getCachedXml(cacheKey);
      if (cached) return sendXml(res, cached, true);

      const urls = await generateNewGradPages();
      if (urls.length === 0 && isDegradedState()) {
        return serveStaleCacheOr503(res, cacheKey, `NewGrad sitemap page ${pageNum}`);
      }

      const chunks = splitIntoChunks(urls, SITEMAP_SPLIT_LIMIT);
      if (chunkIndex >= chunks.length) return res.status(404).send("Not found");

      const xml = wrapUrlset(chunks[chunkIndex] || []);
      setCachedXml(cacheKey, xml);
      return sendXml(res, xml, false);
    } catch (error: any) {
      return handleSitemapError(res, cacheKey, `NewGrad sitemap page ${pageNum}`, error);
    }
  });

  const legacyRedirects: Record<string, string> = {
    "/sitemap.xml": "/sitemap-index.xml",
    "/sitemap_index.xml": "/sitemap-index.xml",
    "/sitemap-content.xml": "/sitemaps/sitemap-seo-content.xml",
  };

  for (const [oldPath, newPath] of Object.entries(legacyRedirects)) {
    app.get(oldPath, (_req: Request, res: Response) => {
      res.redirect(301, newPath);
    });
  }

  app.get("/sitemap-allied.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap-index.xml");
  });

  app.get("/sitemap-newgrad.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap-index.xml");
  });

  app.get("/sitemap-content-:page.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap-index.xml");
  });

  app.get("/sitemap-:lang.xml", (req: Request, res: Response) => {
    const lang = routeParamString(req.params.lang);

    if (LANGUAGE_SITEMAP_LOCALES.includes(lang)) {
      return res.redirect(301, "/sitemap-index.xml");
    }

    const programmaticTypes = [
      "study-guides",
      "exam-tips",
      "clinical-scenarios",
      "practice-questions",
      "question-details",
      "flashcard-details",
    ];

    if (programmaticTypes.includes(lang)) {
      return res.redirect(301, "/sitemaps/sitemap-programmatic.xml");
    }

    return res.status(404).send("Not found");
  });

  app.get("/sitemal.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap-index.xml");
  });

  app.get("/image-sitemap.xml", (_req: Request, res: Response) => {
    res.status(404).send("Not found");
  });

  app.get("/api/admin/sitemap-health", sitemapHealthCheck);

  app.get("/api/admin/sitemap-validate", async (req, res) => {
    try {
      const { requireAdmin } = await import("../admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      sitemapValidate(req, res);
    } catch {
      res.status(401).json({ error: "Admin authentication required" });
    }
  });

  app.get("/api/seo-debug", async (req, res) => {
    try {
      const { requireAdmin } = await import("../admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      seoDebug(req, res);
    } catch {
      res.status(401).json({ error: "Admin authentication required" });
    }
  });
}

export function pruneSitemapCache(underPressure: boolean): void {
  const now = Date.now();
  const ttl = underPressure ? 60_000 : SITEMAP_CACHE_TTL;

  for (const [key, entry] of xmlCache) {
    if (now - entry.builtAt > ttl) {
      xmlCache.delete(key);
    }
  }

  for (const [key, entry] of urlCache) {
    if (now - entry.builtAt > ttl) {
      urlCache.delete(key);
    }
  }

  if (xmlCache.size > MAX_SITEMAP_CACHE_ENTRIES) {
    const oldest = Array.from(xmlCache.entries()).sort((a, b) => a[1].builtAt - b[1].builtAt);
    const removeCount = xmlCache.size - MAX_SITEMAP_CACHE_ENTRIES;
    for (const [key] of oldest.slice(0, removeCount)) {
      xmlCache.delete(key);
    }
  }

  if (urlCache.size > MAX_URL_CACHE_ENTRIES) {
    const oldest = Array.from(urlCache.entries()).sort((a, b) => a[1].builtAt - b[1].builtAt);
    const removeCount = urlCache.size - MAX_URL_CACHE_ENTRIES;
    for (const [key] of oldest.slice(0, removeCount)) {
      urlCache.delete(key);
    }
  }
}

export { getSiteBase } from "./helpers";