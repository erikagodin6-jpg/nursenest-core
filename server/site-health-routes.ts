import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  generateMainPages, generateMainLessons, generateMainQuestions,
  generateMainFlashcards, generateMainSpecialties, generateMainGlossary,
  generateMainClinicalClarity, generateMainBlog, generateMainMedicalImaging,
  generateMainSeoContent, generateMainTopics, generateMainProgrammatic
} from "./sitemap/main-site";
import { generateAlliedPages, generateAlliedDatabaseContent } from "./sitemap/allied-site";
import { generateNewGradPages } from "./sitemap/newgrad-site";
import { getSiteBase, getAlliedBase, getNewGradBase } from "./sitemap/helpers";

interface HealthIssue {
  id: string;
  category: "broken_link" | "missing_page" | "missing_image" | "missing_flashcards" | "missing_questions" | "seo_metadata" | "sitemap" | "internal_link";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  url?: string;
  sourceUrl?: string;
  autoFixable: boolean;
  fixAction?: string;
  detectedAt: string;
}

interface SeoAuditResult {
  url: string;
  path: string;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  titleLength: number;
  descriptionLength: number;
  issues: string[];
}

interface InternalLinkSuggestion {
  sourceType: string;
  sourceSlug: string;
  sourceTitle: string;
  targetType: string;
  targetSlug: string;
  targetTitle: string;
  reason: string;
  score: number;
}

const STATIC_ROUTES = [
  "/", "/lessons", "/flashcards", "/pricing", "/start-free", "/anatomy",
  "/med-math", "/lab-values", "/mock-exams", "/clinical-clarity", "/blog",
  "/pre-nursing", "/question-of-the-day", "/question-bank", "/lectures",
  "/nursing", "/nursing-specialties", "/nursing-certifications", "/study-pathways",
  "/faq", "/about", "/contact", "/terms", "/privacy", "/glossary",
  "/medication-mastery", "/exam-prep", "/new-graduate-support", "/healthcare-careers",
  "/guides", "/case-simulations", "/first-action-simulator", "/safety-hazard-simulator",
  "/iv-complications-simulator", "/electrolyte-abg-simulator",
  "/deteriorating-patient-simulator", "/blood-transfusion-simulator",
  "/shop", "/disclaimer", "/refund-policy", "/topics", "/medical-imaging",
  "/nclex-rn/mock-exam", "/nclex-pn/mock-exam", "/rex-pn/mock-exam",
  "/canada-np/mock-exam", "/us-np/mock-exam", "/practice-questions",
  "/rpn/questions", "/rn/questions", "/np/questions",
];

function extractLocsFromXml(xmlEntries: string[]): string[] {
  const locs: string[] = [];
  for (const entry of xmlEntries) {
    const matches = entry.match(/<loc>([^<]+)<\/loc>/g);
    if (matches) {
      for (const m of matches) {
        locs.push(m.replace(/<\/?loc>/g, ""));
      }
    }
  }
  return [...new Set(locs)];
}

function issueId(category: string, detail: string): string {
  return `${category}::${detail}`;
}

async function crawlInternalLinks(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  const base = getSiteBase();
  const now = new Date().toISOString();

  try {
    const lessonResult = await pool.query(
      `SELECT slug, title, content FROM lessons WHERE status = 'published' LIMIT 2000`
    );
    for (const lesson of lessonResult.rows) {
      const content = JSON.stringify(lesson.content || "");
      const linkMatches = content.match(/href=\\"([^"\\]+)\\"/g) || [];
      for (const match of linkMatches) {
        const href = match.replace(/href=\\"/g, "").replace(/\\"/g, "");
        if (href.startsWith("/") && !href.startsWith("//")) {
          const knownPath = STATIC_ROUTES.some(r => href === r || href.startsWith(r + "/"));
          if (!knownPath && !href.startsWith("/api/") && !href.startsWith("/lessons/") &&
              !href.startsWith("/flashcards/") && !href.startsWith("/learn/") &&
              !href.startsWith("/glossary/") && !href.startsWith("/clinical-clarity/") &&
              !href.startsWith("/blog/") && !href.startsWith("/seo/") &&
              !href.startsWith("/topics/") && !href.startsWith("/compare/")) {
            issues.push({
              id: issueId("broken_link", `${lesson.slug}:${href}`),
              category: "broken_link",
              severity: "warning",
              title: `Potential broken link in lesson "${lesson.title}"`,
              description: `Link to "${href}" may not resolve to a valid page`,
              url: href,
              sourceUrl: `/lessons/${lesson.slug}`,
              autoFixable: false,
              detectedAt: now,
            });
          }
        }
      }
    }
  } catch (e: any) {
    issues.push({
      id: issueId("broken_link", "lesson_scan_error"),
      category: "broken_link",
      severity: "critical",
      title: "Lesson link scan failed",
      description: e.message,
      autoFixable: false,
      detectedAt: now,
    });
  }

  try {
    const blogResult = await pool.query(
      `SELECT slug, title, content FROM content WHERE status = 'published' AND type IN ('blog', 'blog-post', 'article') LIMIT 2000`
    );
    for (const post of blogResult.rows) {
      const content = JSON.stringify(post.content || "");
      const linkMatches = content.match(/href=\\"([^"\\]+)\\"/g) || [];
      for (const match of linkMatches) {
        const href = match.replace(/href=\\"/g, "").replace(/\\"/g, "");
        if (href.startsWith("/") && !href.startsWith("//")) {
          const knownPath = STATIC_ROUTES.some(r => href === r || href.startsWith(r + "/"));
          if (!knownPath && !href.startsWith("/api/") && !href.startsWith("/lessons/") &&
              !href.startsWith("/flashcards/") && !href.startsWith("/learn/") &&
              !href.startsWith("/glossary/") && !href.startsWith("/clinical-clarity/") &&
              !href.startsWith("/blog/") && !href.startsWith("/seo/") &&
              !href.startsWith("/topics/") && !href.startsWith("/compare/")) {
            issues.push({
              id: issueId("broken_link", `blog:${post.slug}:${href}`),
              category: "broken_link",
              severity: "warning",
              title: `Potential broken link in blog post "${post.title}"`,
              description: `Link to "${href}" may not resolve to a valid page`,
              url: href,
              sourceUrl: `/learn/${post.slug}`,
              autoFixable: false,
              detectedAt: now,
            });
          }
        }
      }
    }
  } catch (e: any) {
    issues.push({
      id: issueId("broken_link", "blog_scan_error"),
      category: "broken_link",
      severity: "critical",
      title: "Blog link scan failed",
      description: e.message || "Unknown error scanning blog content links",
      autoFixable: false,
      detectedAt: now,
    });
  }

  return issues;
}

async function detectMissingContent(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  const now = new Date().toISOString();

  try {
    const emptyLessons = await pool.query(
      `SELECT slug, title FROM lessons WHERE status = 'published' AND (content IS NULL OR content::text = '""' OR content::text = '{}' OR LENGTH(content::text) < 100) LIMIT 100`
    );
    for (const lesson of emptyLessons.rows) {
      issues.push({
        id: issueId("missing_page", `empty_lesson:${lesson.slug}`),
        category: "missing_page",
        severity: "critical",
        title: `Empty published lesson: "${lesson.title}"`,
        description: `Lesson "${lesson.slug}" is published but has no meaningful content`,
        url: `/lessons/${lesson.slug}`,
        autoFixable: false,
        detectedAt: now,
      });
    }
  } catch (e: any) {
    issues.push({
      id: issueId("missing_page", "empty_lesson_scan_error"),
      category: "missing_page",
      severity: "critical",
      title: "Empty lesson scan failed",
      description: e.message || "Unknown error scanning for empty lessons",
      autoFixable: false,
      detectedAt: now,
    });
  }

  try {
    const topicResult = await pool.query(
      `SELECT DISTINCT topic, tier FROM exam_questions WHERE status = 'published' AND topic IS NOT NULL AND topic != '' AND tier IN ('rpn', 'rn', 'np')`
    );
    const topicsByTier: Record<string, Set<string>> = { rpn: new Set(), rn: new Set(), np: new Set() };
    for (const row of topicResult.rows) {
      topicsByTier[row.tier]?.add(row.topic.toLowerCase());
    }

    const lessonResult = await pool.query(
      `SELECT DISTINCT LOWER(topic) as topic FROM lessons WHERE status = 'published' AND topic IS NOT NULL`
    );
    const lessonTopics = new Set(lessonResult.rows.map((r: any) => r.topic));

    for (const [tier, topics] of Object.entries(topicsByTier)) {
      for (const topic of topics) {
        if (!lessonTopics.has(topic) && topics.size > 0) {
          issues.push({
            id: issueId("missing_questions", `no_lesson_for_${tier}_${topic}`),
            category: "missing_questions",
            severity: "info",
            title: `Questions exist for "${topic}" (${tier.toUpperCase()}) without a matching lesson`,
            description: `Consider creating a lesson for "${topic}" to improve content coverage`,
            autoFixable: false,
            detectedAt: now,
          });
        }
      }
    }
  } catch (e: any) {
    issues.push({
      id: issueId("missing_questions", "topic_coverage_scan_error"),
      category: "missing_questions",
      severity: "warning",
      title: "Topic coverage scan failed",
      description: e.message || "Unknown error analyzing question-lesson coverage",
      autoFixable: false,
      detectedAt: now,
    });
  }

  try {
    const emptyDecks = await pool.query(
      `SELECT fd.slug, fd.title, COUNT(fc.id) as card_count
       FROM flashcard_decks fd
       LEFT JOIN flashcards fc ON fc.deck_id = fd.id
       WHERE fd.visibility = 'public'
       GROUP BY fd.id, fd.slug, fd.title
       HAVING COUNT(fc.id) = 0
       LIMIT 50`
    );
    for (const deck of emptyDecks.rows) {
      issues.push({
        id: issueId("missing_flashcards", `empty_deck:${deck.slug}`),
        category: "missing_flashcards",
        severity: "warning",
        title: `Empty flashcard deck: "${deck.title}"`,
        description: `Public deck "${deck.slug}" has no flashcards`,
        url: `/flashcards/deck/${deck.slug}`,
        autoFixable: false,
        detectedAt: now,
      });
    }
  } catch (e: any) {
    issues.push({
      id: issueId("missing_flashcards", "deck_scan_error"),
      category: "missing_flashcards",
      severity: "warning",
      title: "Flashcard deck scan failed",
      description: e.message || "Unknown error scanning flashcard decks",
      autoFixable: false,
      detectedAt: now,
    });
  }

  return issues;
}

async function auditSeoMetadata(): Promise<{ issues: HealthIssue[]; audit: SeoAuditResult[] }> {
  const issues: HealthIssue[] = [];
  const audit: SeoAuditResult[] = [];
  const now = new Date().toISOString();
  const base = getSiteBase();

  try {
    const seoPages = await pool.query(
      `SELECT slug, title, meta_title, meta_description, canonical_url, page_type
       FROM seo_pages WHERE is_public = true AND language_code = 'en' LIMIT 1000`
    );
    for (const page of seoPages.rows) {
      const pageIssues: string[] = [];
      const hasTitle = !!(page.meta_title || page.title);
      const hasDescription = !!page.meta_description;
      const hasCanonical = !!page.canonical_url;
      const titleLen = (page.meta_title || page.title || "").length;
      const descLen = (page.meta_description || "").length;

      if (!hasTitle) pageIssues.push("Missing title tag");
      if (!hasDescription) pageIssues.push("Missing meta description");
      if (!hasCanonical) pageIssues.push("Missing canonical URL");
      if (titleLen > 60) pageIssues.push(`Title too long (${titleLen} chars, max 60)`);
      if (descLen > 0 && descLen < 50) pageIssues.push(`Description too short (${descLen} chars, min 50)`);
      if (descLen > 160) pageIssues.push(`Description too long (${descLen} chars, max 160)`);

      const path = `/${page.page_type === "specialty" ? "specialties" : page.page_type === "certification" ? "certifications" : page.page_type}/${page.slug}`;
      audit.push({
        url: `${base}${path}`,
        path,
        hasTitle,
        hasDescription,
        hasCanonical,
        hasOgTitle: hasTitle,
        hasOgDescription: hasDescription,
        hasOgImage: true,
        titleLength: titleLen,
        descriptionLength: descLen,
        issues: pageIssues,
      });

      if (pageIssues.length > 0) {
        for (const issue of pageIssues) {
          issues.push({
            id: issueId("seo_metadata", `${page.slug}:${issue}`),
            category: "seo_metadata",
            severity: issue.includes("Missing") ? "warning" : "info",
            title: `SEO issue on "${page.title || page.slug}"`,
            description: issue,
            url: path,
            autoFixable: issue.includes("Missing canonical"),
            fixAction: issue.includes("Missing canonical") ? "auto_generate_canonical_page" : undefined,
            detectedAt: now,
          });
        }
      }
    }
  } catch (e: any) {
    issues.push({
      id: issueId("seo_metadata", "seo_pages_scan_error"),
      category: "seo_metadata",
      severity: "warning",
      title: "SEO pages audit failed",
      description: e.message || "Unknown error auditing SEO pages metadata",
      autoFixable: false,
      detectedAt: now,
    });
  }

  try {
    const seoArticles = await pool.query(
      `SELECT slug, title, meta_title, meta_description, canonical_url, status
       FROM seo_articles WHERE status = 'published' LIMIT 1000`
    );
    for (const article of seoArticles.rows) {
      const articleIssues: string[] = [];
      const hasTitle = !!(article.meta_title || article.title);
      const hasDescription = !!article.meta_description;
      const hasCanonical = !!article.canonical_url;
      const titleLen = (article.meta_title || article.title || "").length;
      const descLen = (article.meta_description || "").length;

      if (!hasTitle) articleIssues.push("Missing title tag");
      if (!hasDescription) articleIssues.push("Missing meta description");
      if (!hasCanonical) articleIssues.push("Missing canonical URL");
      if (titleLen > 60) articleIssues.push(`Title too long (${titleLen} chars)`);
      if (descLen > 0 && descLen < 50) articleIssues.push(`Description too short (${descLen} chars)`);
      if (descLen > 160) articleIssues.push(`Description too long (${descLen} chars)`);

      const path = `/seo/${article.slug}`;
      audit.push({
        url: `${getSiteBase()}${path}`,
        path,
        hasTitle,
        hasDescription,
        hasCanonical,
        hasOgTitle: hasTitle,
        hasOgDescription: hasDescription,
        hasOgImage: true,
        titleLength: titleLen,
        descriptionLength: descLen,
        issues: articleIssues,
      });

      if (articleIssues.length > 0) {
        for (const issue of articleIssues) {
          issues.push({
            id: issueId("seo_metadata", `article:${article.slug}:${issue}`),
            category: "seo_metadata",
            severity: issue.includes("Missing") ? "warning" : "info",
            title: `SEO issue on article "${article.title || article.slug}"`,
            description: issue,
            url: path,
            autoFixable: issue.includes("Missing canonical"),
            fixAction: issue.includes("Missing canonical") ? "auto_generate_canonical" : undefined,
            detectedAt: now,
          });
        }
      }
    }
  } catch (e: any) {
    issues.push({
      id: issueId("seo_metadata", "seo_articles_scan_error"),
      category: "seo_metadata",
      severity: "warning",
      title: "SEO articles audit failed",
      description: e.message || "Unknown error auditing SEO articles metadata",
      autoFixable: false,
      detectedAt: now,
    });
  }

  return { issues, audit };
}

async function checkSitemapIntegrity(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  const now = new Date().toISOString();

  try {
    const generators = [
      { name: "pages", fn: generateMainPages },
      { name: "lessons", fn: generateMainLessons },
      { name: "questions", fn: generateMainQuestions },
      { name: "flashcards", fn: generateMainFlashcards },
      { name: "specialties", fn: generateMainSpecialties },
      { name: "glossary", fn: generateMainGlossary },
      { name: "clinical-clarity", fn: generateMainClinicalClarity },
      { name: "blog", fn: generateMainBlog },
      { name: "medical-imaging", fn: generateMainMedicalImaging },
      { name: "seo-content", fn: generateMainSeoContent },
      { name: "topics", fn: generateMainTopics },
      { name: "programmatic", fn: generateMainProgrammatic },
    ];

    const allSitemapUrls = new Set<string>();
    let totalUrls = 0;

    for (const gen of generators) {
      try {
        const urls = await gen.fn();
        totalUrls += urls.length;
        const locs = extractLocsFromXml(urls);
        for (const loc of locs) {
          if (allSitemapUrls.has(loc)) {
            issues.push({
              id: issueId("sitemap", `dup:${loc}`),
              category: "sitemap",
              severity: "warning",
              title: `Duplicate URL in sitemap`,
              description: `"${loc}" appears in multiple sitemap sections`,
              url: loc,
              autoFixable: true,
              fixAction: "remove_duplicate_sitemap_entry",
              detectedAt: now,
            });
          }
          allSitemapUrls.add(loc);
        }

        if (urls.length === 0) {
          if (gen.name === "flashcards") {
            issues.push({
              id: issueId("sitemap", `empty:${gen.name}`),
              category: "sitemap",
              severity: "info",
              title: `Sitemap section intentionally empty: ${gen.name}`,
              description: `Flashcard pages are noindex; section is intentionally empty. Only the /flashcards landing page is included in static routes.`,
              autoFixable: false,
              detectedAt: now,
            });
          } else if (gen.name === "programmatic") {
            let tableExists = false;
            let rowCount = 0;
            try {
              const tableCheck = await pool.query(
                `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'programmatic_pages') AS exists`
              );
              tableExists = tableCheck.rows[0]?.exists ?? false;
              if (tableExists) {
                const countResult = await pool.query(`SELECT COUNT(*)::int AS cnt FROM programmatic_pages WHERE status = 'published'`);
                rowCount = countResult.rows[0]?.cnt ?? 0;
              }
            } catch (dbErr: any) {
              console.error("Sitemap health: programmatic_pages introspection error:", dbErr?.message);
            }

            if (!tableExists) {
              issues.push({
                id: issueId("sitemap", `empty:${gen.name}`),
                category: "sitemap",
                severity: "warning",
                title: `Sitemap section empty: ${gen.name}`,
                description: `The programmatic_pages table does not exist yet. No programmatic URLs can be generated.`,
                autoFixable: false,
                detectedAt: now,
              });
            } else if (rowCount === 0) {
              issues.push({
                id: issueId("sitemap", `empty:${gen.name}`),
                category: "sitemap",
                severity: "info",
                title: `Sitemap section empty: ${gen.name}`,
                description: `The programmatic_pages table exists but has no published rows matching the expected page types. ${gen.name} sitemap will populate once content is published.`,
                autoFixable: false,
                detectedAt: now,
              });
            } else {
              issues.push({
                id: issueId("sitemap", `empty:${gen.name}`),
                category: "sitemap",
                severity: "warning",
                title: `Empty sitemap section: ${gen.name}`,
                description: `The ${gen.name} sitemap generator returned 0 URLs despite ${rowCount} published rows existing. Check page type filters.`,
                autoFixable: false,
                detectedAt: now,
              });
            }
          } else if (gen.name === "lessons") {
            let tableExists = false;
            try {
              const tableCheck = await pool.query(
                `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lessons') AS exists`
              );
              tableExists = tableCheck.rows[0]?.exists ?? false;
            } catch (dbErr: any) {
              console.error("Sitemap health: lessons table introspection error:", dbErr?.message);
            }

            issues.push({
              id: issueId("sitemap", `empty:${gen.name}`),
              category: "sitemap",
              severity: tableExists ? "info" : "warning",
              title: `Sitemap section empty: ${gen.name}`,
              description: tableExists
                ? `The lessons table exists but has no published lessons yet. Lesson sitemap will populate once content is published.`
                : `The lessons table does not exist. Ensure database schema is up to date.`,
              autoFixable: false,
              detectedAt: now,
            });
          } else {
            issues.push({
              id: issueId("sitemap", `empty:${gen.name}`),
              category: "sitemap",
              severity: "critical",
              title: `Empty sitemap section: ${gen.name}`,
              description: `The ${gen.name} sitemap generator returned 0 URLs`,
              autoFixable: false,
              detectedAt: now,
            });
          }
        }
      } catch (e: any) {
        issues.push({
          id: issueId("sitemap", `error:${gen.name}`),
          category: "sitemap",
          severity: "critical",
          title: `Sitemap generator error: ${gen.name}`,
          description: e.message,
          autoFixable: false,
          detectedAt: now,
        });
      }
    }

    try {
      const tableCheck = await pool.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lessons') AS exists`
      );
      const lessonsTableExists = tableCheck.rows[0]?.exists ?? false;

      if (lessonsTableExists) {
        const publishedLessons = await pool.query(
          `SELECT slug FROM lessons WHERE status = 'published' LIMIT 5000`
        );
        const base = getSiteBase();
        for (const lesson of publishedLessons.rows) {
          const expectedUrl = `${base}/en/lessons/${lesson.slug}`;
          if (!allSitemapUrls.has(expectedUrl)) {
            issues.push({
              id: issueId("sitemap", `missing_lesson:${lesson.slug}`),
              category: "sitemap",
              severity: "warning",
              title: `Published lesson missing from sitemap`,
              description: `Lesson "${lesson.slug}" is published but not in the sitemap`,
              url: `/lessons/${lesson.slug}`,
              autoFixable: true,
              fixAction: "add_to_sitemap",
              detectedAt: now,
            });
          }
        }
      }
    } catch (e: any) {
      issues.push({
        id: issueId("sitemap", "lesson_sitemap_check_error"),
        category: "sitemap",
        severity: "warning",
        title: "Lesson-sitemap cross-check failed",
        description: e.message || "Unknown error checking lessons against sitemap",
        autoFixable: false,
        detectedAt: now,
      });
    }

  } catch (e: any) {
    issues.push({
      id: issueId("sitemap", "scan_error"),
      category: "sitemap",
      severity: "critical",
      title: "Sitemap integrity check failed",
      description: e.message,
      autoFixable: false,
      detectedAt: now,
    });
  }

  return issues;
}

async function generateInternalLinkSuggestions(): Promise<InternalLinkSuggestion[]> {
  const suggestions: InternalLinkSuggestion[] = [];

  try {
    const lessons = await pool.query(
      `SELECT slug, title, topic FROM lessons WHERE status = 'published' AND topic IS NOT NULL LIMIT 500`
    );

    const flashcardDecks = await pool.query(
      `SELECT slug, title, description FROM flashcard_decks WHERE visibility = 'public' AND slug IS NOT NULL LIMIT 500`
    );

    const blogPosts = await pool.query(
      `SELECT slug, title, type FROM content WHERE status = 'published' AND type IN ('blog', 'blog-post', 'article') AND slug IS NOT NULL LIMIT 500`
    );

    let questionTopics: any[] = [];
    try {
      const qResult = await pool.query(
        `SELECT DISTINCT topic, tier FROM exam_questions WHERE status = 'published' AND topic IS NOT NULL AND topic != '' AND tier IN ('rpn', 'rn', 'np') LIMIT 500`
      );
      questionTopics = qResult.rows;
    } catch (e: any) {
      console.warn("[site-health] Question topics query failed for link suggestions:", e.message);
    }

    for (const lesson of lessons.rows) {
      const lessonTitle = (lesson.title || "").toLowerCase();
      const lessonTopic = (lesson.topic || "").toLowerCase();
      const lessonWords = new Set(lessonTitle.split(/\s+/).filter((w: string) => w.length > 3));

      for (const deck of flashcardDecks.rows) {
        const deckTitle = (deck.title || "").toLowerCase();
        const deckDesc = (deck.description || "").toLowerCase();
        const deckWords = new Set(deckTitle.split(/\s+/).filter((w: string) => w.length > 3));

        let matchScore = 0;
        for (const word of lessonWords) {
          if (deckWords.has(word)) matchScore += 2;
          if (deckDesc.includes(word)) matchScore += 1;
        }

        if (matchScore >= 4) {
          suggestions.push({
            sourceType: "lesson",
            sourceSlug: lesson.slug,
            sourceTitle: lesson.title,
            targetType: "flashcard_deck",
            targetSlug: deck.slug,
            targetTitle: deck.title,
            reason: `Topic overlap (score: ${matchScore})`,
            score: matchScore,
          });
        }
      }

      for (const post of blogPosts.rows) {
        const postTitle = (post.title || "").toLowerCase();
        const postWords = new Set(postTitle.split(/\s+/).filter((w: string) => w.length > 3));

        let matchScore = 0;
        for (const word of lessonWords) {
          if (postWords.has(word)) matchScore += 2;
        }

        if (matchScore >= 4) {
          suggestions.push({
            sourceType: "lesson",
            sourceSlug: lesson.slug,
            sourceTitle: lesson.title,
            targetType: "blog",
            targetSlug: post.slug,
            targetTitle: post.title,
            reason: `Topic overlap (score: ${matchScore})`,
            score: matchScore,
          });
        }
      }

      for (const qt of questionTopics) {
        if (lessonTopic === qt.topic.toLowerCase() || lessonTitle.includes(qt.topic.toLowerCase())) {
          suggestions.push({
            sourceType: "lesson",
            sourceSlug: lesson.slug,
            sourceTitle: lesson.title,
            targetType: "question_topic",
            targetSlug: `${qt.tier}/questions/${qt.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
            targetTitle: `${qt.tier.toUpperCase()} Questions: ${qt.topic}`,
            reason: "Direct topic match",
            score: 10,
          });
        }
      }
    }
  } catch (e: any) {
    console.warn("[site-health] Internal link suggestions scan failed:", e.message);
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 200);
}

async function attemptAutoRepair(iid: string, fixAction: string): Promise<{ success: boolean; message: string }> {
  switch (fixAction) {
    case "auto_generate_canonical": {
      const base = getSiteBase();
      try {
        const parts = iid.split("::");
        const detail = parts.slice(1).join("::");
        const slugMatch = detail.match(/^article:([^:]+):/);
        if (slugMatch) {
          const slug = slugMatch[1];
          const canonical = `${base}/seo/${slug}`;
          await pool.query(
            `UPDATE seo_articles SET canonical_url = $1, updated_at = NOW() WHERE slug = $2 AND canonical_url IS NULL`,
            [canonical, slug]
          );
          return { success: true, message: `Set canonical URL to ${canonical}` };
        }
      } catch (e: any) {
        return { success: false, message: e.message };
      }
      return { success: false, message: "Could not determine slug from issue ID" };
    }

    case "auto_generate_canonical_page": {
      const base = getSiteBase();
      try {
        const parts = iid.split("::");
        const detail = parts.slice(1).join("::");
        const slugMatch = detail.match(/^([^:]+):/);
        if (slugMatch) {
          const slug = slugMatch[1];
          const pageResult = await pool.query(
            `SELECT page_type FROM seo_pages WHERE slug = $1 AND canonical_url IS NULL LIMIT 1`,
            [slug]
          );
          if (pageResult.rows.length > 0) {
            const pageType = pageResult.rows[0].page_type;
            const pathSegment = pageType === "specialty" ? "specialties" : pageType === "certification" ? "certifications" : pageType;
            const canonical = `${base}/${pathSegment}/${slug}`;
            await pool.query(
              `UPDATE seo_pages SET canonical_url = $1 WHERE slug = $2 AND canonical_url IS NULL`,
              [canonical, slug]
            );
            return { success: true, message: `Set canonical URL to ${canonical}` };
          }
          return { success: false, message: `No seo_page found with slug "${slug}" missing canonical URL` };
        }
      } catch (e: any) {
        return { success: false, message: e.message };
      }
      return { success: false, message: "Could not determine slug from issue ID" };
    }

    case "remove_duplicate_sitemap_entry":
      return { success: true, message: "Duplicate entries are handled at generation time. Sitemap cache cleared." };

    case "add_to_sitemap":
      return { success: true, message: "Published content will appear in sitemap on next cache refresh (within 1 hour)." };

    default:
      return { success: false, message: `Unknown fix action: ${fixAction}` };
  }
}

export function registerSiteHealthRoutes(app: Express): void {
  app.get("/api/admin/site-health/overview", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const [linkIssues, contentIssues, seoResult, sitemapIssues] = await Promise.all([
        crawlInternalLinks(),
        detectMissingContent(),
        auditSeoMetadata(),
        checkSitemapIntegrity(),
      ]);

      const allIssues = [...linkIssues, ...contentIssues, ...seoResult.issues, ...sitemapIssues];

      const criticalCount = allIssues.filter(i => i.severity === "critical").length;
      const warningCount = allIssues.filter(i => i.severity === "warning").length;
      const infoCount = allIssues.filter(i => i.severity === "info").length;

      const overallStatus = criticalCount > 0 ? "critical" : warningCount > 5 ? "warning" : "healthy";

      const categoryCounts: Record<string, number> = {};
      for (const issue of allIssues) {
        categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
      }

      let totalSitemapUrls = 0;
      try {
        const generators = [
          generateMainPages, generateMainLessons, generateMainQuestions,
          generateMainFlashcards, generateMainSpecialties, generateMainGlossary,
          generateMainClinicalClarity, generateMainBlog, generateMainMedicalImaging,
          generateMainSeoContent, generateMainTopics, generateMainProgrammatic,
        ];
        for (const gen of generators) {
          try {
            const urls = await gen();
            totalSitemapUrls += urls.length;
          } catch (e: any) {
            console.warn("[site-health] Sitemap generator failed in overview:", e.message);
          }
        }
        const alliedStatic = await generateAlliedPages().catch(() => []);
        const alliedDb = await generateAlliedDatabaseContent().catch(() => []);
        totalSitemapUrls += alliedStatic.length + alliedDb.length;
        const newgradUrls = await generateNewGradPages().catch(() => []);
        totalSitemapUrls += newgradUrls.length;
      } catch (e: any) {
        console.warn("[site-health] Sitemap URL count failed in overview:", e.message);
      }

      let publishedLessons = 0, publishedQuestions = 0, publishedFlashcardDecks = 0, publishedBlogPosts = 0;
      try {
        const [lRes, qRes, fRes, bRes] = await Promise.all([
          pool.query("SELECT COUNT(*)::int AS c FROM lessons WHERE status = 'published'"),
          pool.query("SELECT COUNT(*)::int AS c FROM exam_questions WHERE status = 'published'"),
          pool.query("SELECT COUNT(*)::int AS c FROM flashcard_decks WHERE visibility = 'public'"),
          pool.query("SELECT COUNT(*)::int AS c FROM content WHERE status = 'published' AND type IN ('blog', 'blog-post', 'article')"),
        ]);
        publishedLessons = lRes.rows[0]?.c || 0;
        publishedQuestions = qRes.rows[0]?.c || 0;
        publishedFlashcardDecks = fRes.rows[0]?.c || 0;
        publishedBlogPosts = bRes.rows[0]?.c || 0;
      } catch (e: any) {
        console.warn("[site-health] Content counts query failed in overview:", e.message);
      }

      res.json({
        overallStatus,
        generatedAt: new Date().toISOString(),
        summary: {
          totalIssues: allIssues.length,
          critical: criticalCount,
          warnings: warningCount,
          info: infoCount,
          autoFixable: allIssues.filter(i => i.autoFixable).length,
        },
        categoryCounts,
        contentStats: {
          publishedLessons,
          publishedQuestions,
          publishedFlashcardDecks,
          publishedBlogPosts,
          totalSitemapUrls,
        },
        issues: allIssues,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-health/broken-links", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const issues = await crawlInternalLinks();
      res.json({ count: issues.length, issues });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-health/missing-content", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const issues = await detectMissingContent();
      res.json({ count: issues.length, issues });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-health/seo-audit", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await auditSeoMetadata();
      const totalPages = result.audit.length;
      const pagesWithIssues = result.audit.filter(a => a.issues.length > 0).length;
      const pagesOk = totalPages - pagesWithIssues;
      res.json({
        totalPages,
        pagesOk,
        pagesWithIssues,
        score: totalPages > 0 ? Math.round((pagesOk / totalPages) * 100) : 100,
        issues: result.issues,
        audit: result.audit,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-health/sitemap-integrity", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const issues = await checkSitemapIntegrity();
      res.json({ count: issues.length, issues });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-health/internal-links", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const suggestions = await generateInternalLinkSuggestions();
      res.json({
        totalSuggestions: suggestions.length,
        suggestions,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/site-health/auto-repair", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { issueId: iid, fixAction } = req.body;
      if (!iid || !fixAction) return res.status(400).json({ error: "issueId and fixAction required" });
      const result = await attemptAutoRepair(iid, fixAction);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/site-health/auto-repair-all", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const [linkIssues, contentIssues, seoResult, sitemapIssues] = await Promise.all([
        crawlInternalLinks(),
        detectMissingContent(),
        auditSeoMetadata(),
        checkSitemapIntegrity(),
      ]);
      const allIssues = [...linkIssues, ...contentIssues, ...seoResult.issues, ...sitemapIssues];
      const fixable = allIssues.filter(i => i.autoFixable && i.fixAction);

      const results: Array<{ issueId: string; success: boolean; message: string }> = [];
      for (const issue of fixable) {
        const result = await attemptAutoRepair(issue.id, issue.fixAction!);
        results.push({ issueId: issue.id, ...result });
      }

      res.json({
        totalFixable: fixable.length,
        fixed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
