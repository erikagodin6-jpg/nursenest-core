import type { Express, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./storage";
import { importClientDataAbsolute } from "./client-data-import";

const __dirnameContentHealth =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
import { storage } from "./storage";
import { requireAdmin } from "./admin-auth";
import { emitStructuredLog } from "./log-sink";
import { loadLessonData, isPlaceholder, classifyLessonStatus } from "./lesson-content-api";

const TIMESTAMP_SUFFIX_RE = /^.+-\d{13}$/;

const PLACEHOLDER_TITLE_PATTERNS = [
  /unable to complete/i,
  /placeholder/i,
  /coming soon/i,
  /\[draft\]/i,
  /untitled/i,
  /test publish/i,
];

function countContentWords(content: any): number {
  if (!content) return 0;
  let text = "";
  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    text = content.map((block: any) => {
      if (typeof block === "string") return block;
      const parts: string[] = [];
      if (block.heading) parts.push(block.heading);
      if (block.text) parts.push(block.text);
      if (block.content) parts.push(typeof block.content === "string" ? block.content : JSON.stringify(block.content));
      if (block.items && Array.isArray(block.items)) {
        parts.push(block.items.map((i: any) => typeof i === "string" ? i : i?.text || "").join(" "));
      }
      return parts.join(" ");
    }).join(" ");
  } else {
    text = JSON.stringify(content);
  }
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function isPlaceholderTitle(title: string): boolean {
  for (const pattern of PLACEHOLDER_TITLE_PATTERNS) {
    if (pattern.test(title)) return true;
  }
  return false;
}

let _internalLinkMap: Record<string, any[]> | null = null;

async function getInternalLinkMap(): Promise<Record<string, any[]>> {
  if (_internalLinkMap) return _internalLinkMap;
  try {
    const mod = await importClientDataAbsolute(
      path.resolve(__dirnameContentHealth, "../client/src/data/internal-links"),
    );
    _internalLinkMap = mod.internalLinkMap || {};
  } catch {
    _internalLinkMap = {};
  }
  return _internalLinkMap!;
}

function getLessonInternalLinkCount(linkMap: Record<string, any[]>, slug: string): number {
  const key = slug.replace(/^\/lessons\//, "");
  const links = linkMap[key];
  return links ? links.length : 0;
}

function hasInternalLinksPointingTo(linkMap: Record<string, any[]>, slug: string): boolean {
  const targetPath = `/lessons/${slug}`;
  for (const links of Object.values(linkMap)) {
    for (const link of links) {
      if (link.target === targetPath || link.target.endsWith(`/${slug}`)) {
        return true;
      }
    }
  }
  return false;
}

export function registerContentHealthRoutes(app: Express) {
  app.get("/api/admin/content-health", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const lessonData = await loadLessonData();
      const linkMap = await getInternalLinkMap();
      const staticLessons: any[] = [];

      for (const [id, lesson] of Object.entries(lessonData)) {
        const l = lesson as any;
        const status = classifyLessonStatus(l);
        const cellularLen = l.cellular?.content?.length || 0;
        const totalText = [
          l.cellular?.content || "",
          ...(l.riskFactors || []),
          ...(l.nursingActions || []),
          ...(l.pearls || []),
          ...(l.diagnostics || []),
          ...(l.management || []),
        ].join(" ");
        const wordCount = totalText.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;

        staticLessons.push({
          id,
          title: typeof l.title === "object" ? (l.title.en || l.title) : (l.title || id),
          wordCount,
          isPlaceholder: status === "placeholder",
          isWeak: status === "weak",
          isComplete: status === "complete",
          status,
          hasInternalLinks: hasInternalLinksPointingTo(linkMap, id),
          outboundLinkCount: getLessonInternalLinkCount(linkMap, id),
          hasTimestampSuffix: TIMESTAMP_SUFFIX_RE.test(id),
          belowThreshold: wordCount < 1000,
          medCount: Array.isArray(l.medications) ? l.medications.length : 0,
          hasQuiz: Array.isArray(l.quiz) && l.quiz.length > 0,
        });
      }

      let dbLessons: any[] = [];
      try {
        const dbResult = await pool.query(
          `SELECT id, title, slug, tier, status, 
                  LENGTH(COALESCE(content::text, '')) as content_length,
                  published_at, updated_at
           FROM content_items 
           WHERE type = 'lesson' 
           ORDER BY updated_at DESC NULLS LAST`
        );
        dbLessons = dbResult.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          tier: row.tier,
          status: row.status,
          contentLength: parseInt(row.content_length || "0"),
          hasTimestampSuffix: TIMESTAMP_SUFFIX_RE.test(row.slug || ""),
          isPlaceholderTitle: isPlaceholderTitle(row.title || ""),
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        }));
      } catch {}

      let dbBlogPosts: any[] = [];
      try {
        const blogTypes = ["blog", "blog-post", "article"];
        const publishedContent = await storage.getPublishedContent();
        dbBlogPosts = publishedContent
          .filter((item) => blogTypes.includes(item.type || ""))
          .map((item) => {
            const contentLen = JSON.stringify(item.content || "").length;
            const wordCount = countContentWords(item.content);
            return {
              slug: item.slug,
              title: item.title,
              wordCount,
              contentLength: contentLen,
              hasTimestampSuffix: TIMESTAMP_SUFFIX_RE.test(item.slug || ""),
              isPlaceholderTitle: isPlaceholderTitle(item.title || ""),
              isThinContent: contentLen < 5000,
              publishedAt: item.publishedAt,
            };
          });
      } catch {}

      const summary = {
        totalStaticLessons: staticLessons.length,
        completeLessons: staticLessons.filter(l => l.isComplete).length,
        placeholderLessons: staticLessons.filter(l => l.isPlaceholder).length,
        weakLessons: staticLessons.filter(l => l.isWeak).length,
        belowThresholdLessons: staticLessons.filter(l => l.belowThreshold).length,
        timestampDuplicates: [...staticLessons.filter(l => l.hasTimestampSuffix), ...dbLessons.filter(l => l.hasTimestampSuffix)],
        noInternalLinks: staticLessons.filter(l => !l.hasInternalLinks).length,
        dbLessonCount: dbLessons.length,
        dbBlogPostCount: dbBlogPosts.length,
        thinBlogPosts: dbBlogPosts.filter(b => b.isThinContent).length,
        placeholderBlogPosts: dbBlogPosts.filter(b => b.isPlaceholderTitle).length,
      };

      res.json({
        summary,
        staticLessons: staticLessons
          .sort((a, b) => a.wordCount - b.wordCount),
        dbLessons: dbLessons.filter(l => l.hasTimestampSuffix || l.isPlaceholderTitle),
        flaggedBlogPosts: dbBlogPosts.filter(b => b.isThinContent || b.isPlaceholderTitle || b.hasTimestampSuffix),
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      emitStructuredLog(
        {
          level: "error",
          type: "content_health_failure",
          route: "GET /api/admin/content-health",
          message: msg,
        },
        "error",
      );
      console.error("[ContentHealth] Error:", msg);
      res.status(500).json({
        error: "Failed to generate content health report",
        code: "CONTENT_HEALTH_ERROR",
      });
    }
  });
}
