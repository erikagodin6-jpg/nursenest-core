import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import {
  runFullTranslationAudit,
  getAuditDashboardData,
  getAuditDetail,
  updateAuditOverride,
  bulkUpdateAudits,
  exportAuditData,
  getStaleTranslations,
  getFlaggedContent,
  quickEditTranslation,
} from "./translation-audit-engine";
import { getIndexableLocales, isLocaleIndexable, getHreflangCode, auditAllLocales, getTranslationThreshold } from "./translation-audit";
import { getSiteBase } from "./sitemap";

import { SUPPORTED_LOCALES } from "@shared/locales";

const KNOWN_ROUTES = [
  "/", "/lessons", "/flashcards", "/pricing", "/start-free", "/anatomy",
  "/med-math", "/lab-values", "/mock-exams", "/clinical-clarity", "/blog",
  "/pre-nursing", "/question-of-the-day", "/question-bank", "/lectures",
  "/nursing", "/nursing-specialties", "/faq", "/about", "/contact",
  "/terms", "/privacy", "/nclex-rn-practice-questions", "/nclex-pn-practice-questions",
  "/rex-pn-practice-questions", "/np-exam-practice-questions", "/free-practice",
  "/practice-questions", "/glossary", "/medication-mastery", "/medical-imaging",
];

export function registerTranslationAuditRoutes(app: Express) {
  app.get("/api/admin/hreflang-audit", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const siteBase = getSiteBase();
      const indexableLocales = getIndexableLocales();
      const results: any[] = [];
      let totalChecked = 0;
      let totalValid = 0;
      let totalBroken = 0;
      const brokenLinks: any[] = [];

      for (const route of KNOWN_ROUTES) {
        const basePath = route === "/" ? "" : route;

        for (const locale of SUPPORTED_LOCALES) {
          const hreflangCode = getHreflangCode(locale);
          const url = `${siteBase}/${locale}${basePath}`;
          const isIndexable = isLocaleIndexable(locale);
          const selfCanonical = url;

          const hreflangs = SUPPORTED_LOCALES.filter(l => indexableLocales.includes(l)).map(l => ({
            lang: getHreflangCode(l),
            href: `${siteBase}/${l}${basePath}`,
          }));
          hreflangs.push({ lang: "x-default", href: `${siteBase}/en${basePath}` });

          totalChecked++;

          const allHreflangsValid = hreflangs.every(h => {
            const hLocale = SUPPORTED_LOCALES.find(l => getHreflangCode(l) === h.lang);
            return hLocale ? indexableLocales.includes(hLocale) || h.lang === "x-default" : h.lang === "x-default";
          });

          if (allHreflangsValid) {
            totalValid++;
          } else {
            totalBroken++;
            brokenLinks.push({ url, reason: "hreflang references non-indexable locale" });
          }

          results.push({
            url,
            locale,
            hreflangCode,
            isIndexable,
            canonical: selfCanonical,
            hreflangs,
            valid: allHreflangsValid,
          });
        }
      }

      res.json({
        totalRoutes: KNOWN_ROUTES.length,
        totalLocales: SUPPORTED_LOCALES.length,
        totalChecked,
        totalValid,
        totalBroken,
        indexableLocales,
        brokenLinks,
        coveragePercent: totalChecked > 0 ? Math.round((totalValid / totalChecked) * 100) : 0,
        results,
      });
    } catch (e: any) {
      console.error("[HreflangAudit] Error:", e);
      res.status(500).json({ error: "Failed to run hreflang audit" });
    }
  });

  app.get("/api/admin/seo-health-report", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const siteBase = getSiteBase();
      const indexableLocales = getIndexableLocales();
      const threshold = getTranslationThreshold();
      const localeAudits = auditAllLocales("/");

      const pagesPerLanguage: Record<string, number> = {};
      const hreflangCoverage: Record<string, { total: number; covered: number; percent: number }> = {};
      const missingTranslations: Record<string, number> = {};
      const canonicalIssues: any[] = [];

      for (const locale of SUPPORTED_LOCALES) {
        pagesPerLanguage[locale] = KNOWN_ROUTES.length;
        const audit = localeAudits.find(a => a.locale === locale);

        if (audit) {
          missingTranslations[locale] = audit.totalKeys - audit.translatedKeys;
          hreflangCoverage[locale] = {
            total: KNOWN_ROUTES.length,
            covered: audit.isIndexable ? KNOWN_ROUTES.length : 0,
            percent: audit.isIndexable ? 100 : 0,
          };
        } else if (locale === "en") {
          missingTranslations[locale] = 0;
          hreflangCoverage[locale] = {
            total: KNOWN_ROUTES.length,
            covered: KNOWN_ROUTES.length,
            percent: 100,
          };
        }
      }

      for (const route of KNOWN_ROUTES) {
        const basePath = route === "/" ? "" : route;
        for (const locale of SUPPORTED_LOCALES) {
          const expectedCanonical = `${siteBase}/${locale}${basePath}`;
          const isIndexable = isLocaleIndexable(locale);
          if (!isIndexable) {
            canonicalIssues.push({
              url: expectedCanonical,
              locale,
              issue: "noindex_locale",
              detail: `Locale ${locale} is below the ${threshold}% translation threshold`,
            });
          }
        }
      }

      const overallCoverage = Object.values(hreflangCoverage).reduce((sum, h) => sum + h.percent, 0) / SUPPORTED_LOCALES.length;

      res.json({
        generatedAt: new Date().toISOString(),
        siteBase,
        translationThreshold: threshold,
        indexableLocales,
        totalLocales: SUPPORTED_LOCALES.length,
        totalRoutes: KNOWN_ROUTES.length,
        pagesPerLanguage,
        hreflangCoverage,
        overallHreflangCoveragePercent: Math.round(overallCoverage),
        missingTranslations,
        totalMissingTranslations: Object.values(missingTranslations).reduce((s, n) => s + n, 0),
        canonicalIssuesCount: canonicalIssues.length,
        canonicalIssues: canonicalIssues.slice(0, 50),
        localeAuditSummary: localeAudits.map(a => ({
          locale: a.locale,
          percentage: a.percentage,
          translatedKeys: a.translatedKeys,
          totalKeys: a.totalKeys,
          readiness: a.readiness,
          isIndexable: a.isIndexable,
        })),
      });
    } catch (e: any) {
      console.error("[SEOHealthReport] Error:", e);
      res.status(500).json({ error: "Failed to generate SEO health report" });
    }
  });
  app.post("/api/admin/translation-audit/run", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const threshold = Math.max(0, Math.min(100, parseInt(String(req.body.indexingThreshold)) || 95));
      const result = await runFullTranslationAudit(threshold);
      res.json(result);
    } catch (e: any) {
      console.error("[TranslationAudit] Run error:", e);
      res.status(500).json({ error: "Failed to run translation audit" });
    }
  });

  app.get("/api/admin/translation-audit/dashboard", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filters = {
        locale: req.query.locale as string | undefined,
        contentType: req.query.contentType as string | undefined,
        status: req.query.status as string | undefined,
        sitemapEligible: req.query.sitemapEligible === "true" ? true : req.query.sitemapEligible === "false" ? false : undefined,
        noindex: req.query.noindex === "true" ? true : req.query.noindex === "false" ? false : undefined,
        search: req.query.search as string | undefined,
        limit: parseInt(String(req.query.limit)) || 50,
        offset: parseInt(String(req.query.offset)) || 0,
      };

      const data = await getAuditDashboardData(filters);
      res.json(data);
    } catch (e: any) {
      console.error("[TranslationAudit] Dashboard error:", e);
      res.status(500).json({ error: "Failed to load dashboard data" });
    }
  });

  app.get("/api/admin/translation-audit/export/:format", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const format = req.params.format === "json" ? "json" : "csv";
      const filters = {
        locale: req.query.locale as string | undefined,
        contentType: req.query.contentType as string | undefined,
        status: req.query.status as string | undefined,
      };

      const data = await exportAuditData(format, filters);

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=translation-audit-${Date.now()}.csv`);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=translation-audit-${Date.now()}.json`);
      }

      res.send(data);
    } catch (e: any) {
      console.error("[TranslationAudit] Export error:", e);
      res.status(500).json({ error: "Failed to export audit data" });
    }
  });

  app.post("/api/admin/translation-audit/bulk", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { ids, action } = req.body;
      const validActions = ["mark_draft", "mark_ready", "remove_sitemap", "apply_noindex"];
      if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500) {
        return res.status(400).json({ error: "ids must be a non-empty array (max 500)" });
      }
      if (!action || !validActions.includes(action)) {
        return res.status(400).json({ error: `action must be one of: ${validActions.join(", ")}` });
      }

      const updated = await bulkUpdateAudits(ids, action);
      res.json({ ok: true, updated });
    } catch (e: any) {
      console.error("[TranslationAudit] Bulk error:", e);
      res.status(500).json({ error: "Failed to perform bulk action" });
    }
  });

  app.get("/api/admin/translation-audit/stale", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filters = {
        locale: req.query.locale as string | undefined,
        contentType: req.query.contentType as string | undefined,
        limit: parseInt(String(req.query.limit)) || 50,
        offset: parseInt(String(req.query.offset)) || 0,
      };

      const data = await getStaleTranslations(filters);
      res.json(data);
    } catch (e: any) {
      console.error("[TranslationAudit] Stale error:", e);
      res.status(500).json({ error: "Failed to load stale translations" });
    }
  });

  app.get("/api/admin/translation-audit/flagged", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filters = {
        locale: req.query.locale as string | undefined,
        limit: parseInt(String(req.query.limit)) || 50,
        offset: parseInt(String(req.query.offset)) || 0,
      };

      const data = await getFlaggedContent(filters);
      res.json(data);
    } catch (e: any) {
      console.error("[TranslationAudit] Flagged error:", e);
      res.status(500).json({ error: "Failed to load flagged content" });
    }
  });

  app.post("/api/admin/translation-audit/quick-edit", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, contentId, fieldName, languageCode, translatedText } = req.body;

      if (!contentType || !contentId || !fieldName || !languageCode || !translatedText) {
        return res.status(400).json({ error: "Missing required fields: contentType, contentId, fieldName, languageCode, translatedText" });
      }

      if (typeof translatedText !== "string" || translatedText.trim().length === 0) {
        return res.status(400).json({ error: "translatedText must be a non-empty string" });
      }

      const result = await quickEditTranslation({
        contentType,
        contentId,
        fieldName,
        languageCode,
        translatedText: translatedText.trim(),
      });

      res.json({ ok: true, translation: result });
    } catch (e: any) {
      console.error("[TranslationAudit] Quick-edit error:", e);
      res.status(500).json({ error: "Failed to save translation" });
    }
  });

  app.get("/api/admin/translation-audit/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const detail = await getAuditDetail(req.params.id);
      if (!detail) {
        return res.status(404).json({ error: "Audit not found" });
      }
      res.json(detail);
    } catch (e: any) {
      console.error("[TranslationAudit] Detail error:", e);
      res.status(500).json({ error: "Failed to load audit detail" });
    }
  });

  app.patch("/api/admin/translation-audit/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { sitemapEligible, noindex, adminOverride, status } = req.body;
      const result = await updateAuditOverride(req.params.id, { sitemapEligible, noindex, adminOverride, status });
      res.json(result);
    } catch (e: any) {
      console.error("[TranslationAudit] Override error:", e);
      res.status(500).json({ error: "Failed to update audit override" });
    }
  });
}
