import type { Request, Response } from "express";
import {
  getSiteBase,
  splitIntoChunks,
  SITEMAP_SPLIT_LIMIT,
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
} from "./main-site";

import {
  generateAlliedCareers,
  generateAlliedExams,
  generateAlliedTools,
  generateAlliedTopics,
  generateAlliedSeoLanding,
} from "./allied-site";

import { generateNewGradPages } from "./newgrad-site";

import {
  isTimestampSlug,
  NOINDEX_UTILITY_PAGES,
  buildCanonicalUrl,
} from "@shared/seo-utils";

/* =========================
   CONSTANTS
========================= */

const MAX_CONCURRENT_REQUESTS = 10;
const REQUEST_TIMEOUT_MS = 4000;

/* =========================
   HELPERS
========================= */

function extractUrlsFromXml(xmlEntries: string[]): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const xml of xmlEntries) {
    const matches = xml.match(/<loc>([^<]+)<\/loc>/g);
    if (!matches) continue;

    for (const m of matches) {
      const url = m.replace(/<\/?loc>/g, "").trim();
      if (!url) continue;

      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  }

  return urls;
}

function createLimiter(limit: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  const next = () => {
    active--;
    if (queue.length > 0) {
      const fn = queue.shift();
      if (fn) fn();
    }
  };

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= limit) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }

    active++;

    try {
      return await fn();
    } finally {
      next();
    }
  };
}

const limitFetch = createLimiter(MAX_CONCURRENT_REQUESTS);

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const urlObj = new URL(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(`http://localhost:${process.env.PORT || 3000}${urlObj.pathname}`, {
      method: "HEAD",
      signal: controller.signal,
      headers: { Host: urlObj.hostname },
    });

    clearTimeout(timeout);

    return {
      ok: res.ok || res.status === 301 || res.status === 302,
      status: res.status,
    };
  } catch (e: any) {
    return {
      ok: false,
      status: 0,
      error: e.name === "AbortError" ? "timeout" : e.message,
    };
  }
}

/* =========================
   SITEMAP VALIDATION
========================= */

export async function sitemapValidate(req: Request, res: Response) {
  const start = Date.now();

  const limit = Math.min(parseInt(String(req.query.limit || "0")) || Infinity, 2000);
  const domain = String(req.query.domain || "main");

  try {
    const xml: string[] = [];

    if (domain === "main" || domain === "all") {
      const gens = [
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
      ];

      for (const g of gens) {
        try {
          xml.push(...(await g()));
        } catch (e) {
          console.error(`[Sitemap] main generator error:`, e);
        }
      }
    }

    if (domain === "allied" || domain === "all") {
      const gens = [
        generateAlliedCareers,
        generateAlliedExams,
        generateAlliedTools,
        generateAlliedTopics,
        generateAlliedSeoLanding,
      ];

      for (const g of gens) {
        try {
          xml.push(...(await g()));
        } catch (e) {
          console.error(`[Sitemap] allied generator error:`, e);
        }
      }
    }

    if (domain === "newgrad" || domain === "all") {
      try {
        xml.push(...(await generateNewGradPages()));
      } catch (e) {
        console.error(`[Sitemap] newgrad error:`, e);
      }
    }

    const urls = extractUrlsFromXml(xml);
    const toCheck = limit === Infinity ? urls : urls.slice(0, limit);

    let passed = 0;
    const errors: any[] = [];

    await Promise.all(
      toCheck.map((url) =>
        limitFetch(async () => {
          const result = await checkUrl(url);

          if (result.ok) {
            passed++;
          } else {
            errors.push({ url, ...result });
          }
        }),
      ),
    );

    res.json({
      totalUrls: urls.length,
      checked: toCheck.length,
      passed,
      failed: errors.length,
      errors: errors.slice(0, 50),
      duration: Date.now() - start,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

/* =========================
   SITEMAP HEALTH
========================= */

export async function sitemapHealthCheck(_req: Request, res: Response) {
  const issues: string[] = [];

  try {
    const mainUrls = extractUrlsFromXml(await generateMainPages().catch(() => []));
    const alliedUrls = extractUrlsFromXml(await generateAlliedCareers().catch(() => []));
    const newgradUrls = extractUrlsFromXml(await generateNewGradPages().catch(() => []));

    if (mainUrls.length === 0) issues.push("Main sitemap empty");
    if (alliedUrls.length === 0) issues.push("Allied sitemap empty");
    if (newgradUrls.length === 0) issues.push("NewGrad sitemap empty");

    res.json({
      status: issues.length === 0 ? "ok" : "warning",
      generatedAt: new Date().toISOString(),
      domains: {
        main: { totalUrls: mainUrls.length },
        allied: { totalUrls: alliedUrls.length },
        newgrad: { totalUrls: newgradUrls.length },
      },
      issues,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

/* =========================
   SEO DEBUG
========================= */

export async function seoDebug(req: Request, res: Response) {
  const path = String(req.query.path || "/");
  const locale = String(req.query.locale || "en");
  const base = getSiteBase();

  const canonical = buildCanonicalUrl(path, locale, base);
  const isUtilityPage = NOINDEX_UTILITY_PAGES.has(path);

  const { isLocaleIndexable, getIndexableLocales, getHreflangCode } =
    await import("../translation-audit");

  const localeIndexable = isLocaleIndexable(locale);
  const hreflangs = (isUtilityPage ? ["en"] : getIndexableLocales()).map((l) => ({
    locale: l,
    hreflang: getHreflangCode(l),
  }));

  res.json({
    path,
    locale,
    canonical,
    noindex: isUtilityPage || !localeIndexable,
    hreflangs,
    timestamp: isTimestampSlug(path.split("/").pop() || ""),
  });
}