import type { Request, Response, NextFunction } from "express";
import { getCanonicalRoute } from "@shared/careers";

declare global {
  namespace Express {
    interface Request {
      isAllied?: boolean;
      isNewGrad?: boolean;
    }
  }
}

const ALLIED_CAREER_SLUGS = new Set([
  "rrt", "paramedic", "pharmacy-tech", "mlt", "imaging",
  "occupational-therapy", "physical-therapy",
]);

const PROFESSION_HUB_SLUGS = new Set([
  "rrt", "social-work", "psychotherapy", "addictions",
  "occupational-therapy", "physical-therapy",
]);

const ALLIED_SLUGS = new Set([
  ...ALLIED_CAREER_SLUGS,
  ...PROFESSION_HUB_SLUGS,
  "pharmacy-technician",
  "critical-care", "emergency-nursing", "perioperative",
  "oncology-nursing", "pediatric-cert", "psychotherapist",
  "social-worker", "addictions-counsellor",
  "allied-health",
  "medical-lab-tech",
]);

const NURSING_ONLY_PATHS = [
  "/lessons", "/lesson/", "/anatomy", "/pre-nursing",
  "/med-math", "/lab-values", "/clinical-clarity",
  "/medication-mastery", "/case-simulation",
  "/nclex-rn-practice", "/nclex-pn-practice", "/rex-pn",
  "/np-exam-hub", "/pathways", "/lectures",
  "/onboarding-plan", "/diagnostic-assessment",
];

const ALLIED_ONLY_PATHS = ["/careers", "/admin/allied"];

const LEGACY_FEATURE_TO_CANONICAL: Record<string, string> = {
  diagnostic: "diagnostic",
  qbank: "qbank",
};

const LEGACY_CAREER_FEATURES = new Set([
  "diagnostic", "qbank", "mock-exams", "dashboard",
  "study-plan", "flashcards", "sims", "tools",
]);

export function isAlliedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/:\d+$/, "");
  return h.startsWith("allied.") || h === "allied.localhost" || h === "allied.nursenest.ca";
}

export function isNewGradHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/:\d+$/, "");
  return h.startsWith("newgrad.") || h === "newgrad.localhost" || h === "newgrad.nursenest.ca";
}

export function getNursingHost(req: Request): string {
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  if (process.env.NODE_ENV !== "production") return `${proto}://localhost:5000`;
  return "https://www.nursenest.ca";
}

export function getAlliedHost(req: Request): string {
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  if (process.env.NODE_ENV !== "production") return `${proto}://localhost:5000`;
  return "https://www.nursenest.ca";
}

export function alliedDetectionMiddleware(req: Request, _res: Response, next: NextFunction) {
  const host = req.get("x-forwarded-host") || req.get("host") || "";
  req.isAllied = isAlliedHost(host);
  req.isNewGrad = isNewGradHost(host);
  next();
}

export function alliedLegacyRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.isAllied) return next();

  if (req.path.startsWith("/api") || req.path.startsWith("/assets") ||
      req.path.startsWith("/vite-hmr") || req.path.startsWith("/healthz") ||
      req.path.startsWith("/sitemap") || req.path.startsWith("/robots") ||
      /\.\w{2,5}($|\?)/.test(req.path)) {
    return next();
  }

  const segments = req.path.split("/").filter(Boolean);
  if (segments.length === 0) return next();

  const firstSeg = segments[0];
  const secondSeg = segments[1] || "";

  const CLUSTER_SUBTYPES = new Set(["lessons", "practice-questions", "flashcards", "mock-exam", "mock-exams", "study-guide"]);
  if (PROFESSION_HUB_SLUGS.has(firstSeg) && (segments.length === 1 || CLUSTER_SUBTYPES.has(secondSeg))) {
    return next();
  }

  if (ALLIED_CAREER_SLUGS.has(firstSeg)) {
    const canonical = getCanonicalRoute(firstSeg);

    if (canonical === `/${firstSeg}`) {
      return next();
    }

    if (secondSeg === "questions") {
      return next();
    }

    if (segments.length === 1) {
      return res.redirect(301, canonical);
    }

    if (secondSeg && LEGACY_CAREER_FEATURES.has(secondSeg)) {
      if (LEGACY_FEATURE_TO_CANONICAL[secondSeg]) {
        return res.redirect(301, `/${secondSeg}?career=${firstSeg}`);
      }
      return res.redirect(301, `${canonical}/${secondSeg}`);
    }

    return res.redirect(301, canonical);
  }

  const ALTERNATE_SLUG_REDIRECTS: Record<string, string> = {
    "respiratory-therapy": "/allied-health/rrt",
    "medical-lab-tech": "/allied-health/mlt",
  };
  if (segments.length === 1 && ALTERNATE_SLUG_REDIRECTS[firstSeg]) {
    return res.redirect(301, ALTERNATE_SLUG_REDIRECTS[firstSeg]);
  }

  return next();
}

export function hostRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/api") || req.path.startsWith("/assets") ||
      req.path.startsWith("/vite-hmr") || req.path.startsWith("/healthz") ||
      req.path.startsWith("/sitemap") || req.path.startsWith("/robots") ||
      /\.\w{2,5}($|\?)/.test(req.path)) {
    return next();
  }

  if (req.isAllied) {
    const mainHost = getNursingHost(req);
    const pathWithoutLocale = req.path.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
    const localePart = req.path !== pathWithoutLocale ? req.path.slice(0, req.path.length - pathWithoutLocale.length) : "";
    const newPath = pathWithoutLocale === "/" ? "/allied-health" : `/allied-health${pathWithoutLocale}`;
    const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(301, `${mainHost}${localePart}${newPath}${qs}`);
  }

  next();
}

export function generateAlliedSitemap(baseUrl: string): string {
  const canonicalCareerRoutes = [
    "/allied-health/rrt", "/allied-health/paramedic", "/allied-health/pharmacy-technician", "/allied-health/mlt", "/allied-health/imaging",
    "/allied-health/social-work", "/allied-health/psychotherapy", "/allied-health/addictions", "/allied-health/occupational-therapy",
    "/allied-health/physical-therapy",
  ];

  const careerSubPages = ["mock-exams", "dashboard", "flashcards", "study-plan", "sims", "tools"];

  const seoLandingPages = [
    "pharmacy-technician-practice-questions",
    "pharmacy-technician-mock-exam",
    "pharmacy-technician-study-guide",
    "rrt-practice-questions",
    "rrt-mock-exam",
    "rrt-study-guide",
    "social-worker-exam-prep",
    "social-worker-career-guide",
    "social-worker-study-guide",
    "social-worker-practice-questions",
    "psychotherapist-exam-prep",
    "psychotherapist-career-guide",
    "psychotherapist-study-guide",
    "psychotherapist-practice-questions",
    "addictions-counsellor-exam-prep",
    "addictions-counsellor-career-guide",
    "addictions-counsellor-study-guide",
    "addictions-counsellor-practice-questions",
    "occupational-therapy-exam-prep",
    "occupational-therapy-career-guide",
    "occupational-therapy-study-guide",
    "occupational-therapy-practice-questions",
  ];

  const drugClassSlugs = [
    "ace-inhibitors", "beta-blockers", "statins", "antibiotics",
    "antidiabetic-drugs", "antidepressants", "antihistamines",
  ];

  const urls: string[] = [];
  const now = new Date().toISOString().split("T")[0];

  urls.push(`<url><loc>${baseUrl}/allied-health</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${now}</lastmod></url>`);
  urls.push(`<url><loc>${baseUrl}/allied-health/careers</loc><changefreq>monthly</changefreq><priority>0.9</priority><lastmod>${now}</lastmod></url>`);
  urls.push(`<url><loc>${baseUrl}/allied-health/diagnostic</loc><changefreq>weekly</changefreq><priority>0.9</priority><lastmod>${now}</lastmod></url>`);
  urls.push(`<url><loc>${baseUrl}/allied-health/qbank</loc><changefreq>weekly</changefreq><priority>0.9</priority><lastmod>${now}</lastmod></url>`);

  for (const route of canonicalCareerRoutes) {
    urls.push(`<url><loc>${baseUrl}${route}</loc><changefreq>weekly</changefreq><priority>0.9</priority><lastmod>${now}</lastmod></url>`);
    for (const sub of careerSubPages) {
      urls.push(`<url><loc>${baseUrl}${route}/${sub}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${now}</lastmod></url>`);
    }
  }

  for (const page of seoLandingPages) {
    urls.push(`<url><loc>${baseUrl}/allied-health/${page}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  }

  const otNamespacedPages = [
    "allied-health/occupational-therapist/question-bank",
    "allied-health/occupational-therapist/mock-exams",
    "allied-health/occupational-therapist/study-plan",
  ];
  for (const page of otNamespacedPages) {
    urls.push(`<url><loc>${baseUrl}/${page}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  }

  const careerGuidePages = [
    "allied-health/how-to-become-a-paramedic",
    "allied-health/how-to-become-a-respiratory-therapist",
    "allied-health/how-to-become-a-medical-lab-technologist",
    "allied-health/how-to-become-a-radiologic-technologist",
    "allied-health/how-to-become-a-social-worker",
    "allied-health/how-to-become-a-psychotherapist",
    "allied-health/how-to-become-an-addictions-counselor",
    "allied-health/how-to-become-an-occupational-therapist",
    "allied-health/how-to-become-a-pharmacy-technician",
  ];
  for (const page of careerGuidePages) {
    urls.push(`<url><loc>${baseUrl}/${page}</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${now}</lastmod></url>`);
  }

  const examPrepPages = [
    "allied-health/paramedic-exam-prep",
    "allied-health/rrt-exam-prep",
    "allied-health/mlt-exam-prep",
    "allied-health/radiography-exam-prep",
    "allied-health/social-work-exam-prep",
    "allied-health/psychotherapy-exam-prep",
    "allied-health/addictions-counselling-exam-prep",
    "allied-health/occupational-therapy-exam-prep",
    "allied-health/physical-therapy-exam-prep",
  ];
  for (const page of examPrepPages) {
    urls.push(`<url><loc>${baseUrl}/${page}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  }

  urls.push(`<url><loc>${baseUrl}/allied-health/pharmacy-technician/drug-classes</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  for (const slug of drugClassSlugs) {
    urls.push(`<url><loc>${baseUrl}/allied-health/pharmacy-technician/drug-classes/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${now}</lastmod></url>`);
  }
  urls.push(`<url><loc>${baseUrl}/allied-health/pharmacy-technician/practice-exam-questions</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  const alliedHealthProfessions = [
    "respiratory-therapy", "paramedic", "pharmacy-technician", "medical-lab-technologist",
    "medical-imaging", "occupational-therapy", "physical-therapy", "social-work",
    "psychotherapy", "addictions-counselling",
  ];
  for (const prof of alliedHealthProfessions) {
    urls.push(`<url><loc>${baseUrl}/allied-health/${prof}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export async function generateAlliedSitemapAsync(baseUrl: string): Promise<string> {
  const staticXml = generateAlliedSitemap(baseUrl);
  const urls: string[] = [];

  try {
    const { pool: dbPool } = require("./storage");
    const paramedicTables: Record<string, string> = {
      paramedic_topic_pages: "/paramedic/topic",
      paramedic_category_pages: "/paramedic/category",
      paramedic_glossary_entries: "/paramedic/glossary",
      paramedic_comparison_pages: "/paramedic/compare",
      paramedic_study_guides: "/paramedic/study-guide",
    };
    for (const [tbl, prefix] of Object.entries(paramedicTables)) {
      try {
        const result = await dbPool.query(
          `SELECT slug, updated_at FROM ${tbl} WHERE status = 'published' AND content_domain = 'paramedic' AND (is_noindex IS NULL OR is_noindex = false)`
        );
        for (const row of result.rows) {
          const lm = new Date(row.updated_at).toISOString().split("T")[0];
          urls.push(`<url><loc>${baseUrl}${prefix}/${row.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${lm}</lastmod></url>`);
        }
      } catch {}
    }
  } catch {}

  try {
    const { pool: dbPoolParamedic } = require("./storage");
    const result = await dbPoolParamedic.query(
      `SELECT DISTINCT subtopic
       FROM allied_questions
       WHERE career_type = 'paramedic' AND COALESCE(subtopic, '') <> ''`,
    ).catch(() => ({ rows: [] as any[] }));
    const topicSlugs = new Set<string>();
    for (const r of result.rows) {
      const raw = String(r.subtopic || "");
      if (!raw) continue;
      const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (slug) topicSlugs.add(slug);
    }
    if (topicSlugs.size > 0) {
      const now = new Date().toISOString().split("T")[0];
      urls.push(`<url><loc>${baseUrl}/paramedic/questions</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
      for (const slug of topicSlugs) {
        urls.push(`<url><loc>${baseUrl}/paramedic/questions/${slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority><lastmod>${now}</lastmod></url>`);
      }
    }
  } catch {
    // Non-blocking sitemap enhancement; keep static sitemap on failure.
  }

  const encyclopediaProfessions = [
    "paramedic", "respiratory-therapy", "mlt", "imaging",
    "social-work", "psychotherapy", "addictions", "occupational-therapy",
    "physical-therapy",
  ];
  for (const prof of encyclopediaProfessions) {
    const now2 = new Date().toISOString().split("T")[0];
    urls.push(`<url><loc>${baseUrl}/${prof}-encyclopedia</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${now2}</lastmod></url>`);
  }

  try {
    const { pool: dbPool2 } = require("./storage");
    const programmaticResult = await dbPool2.query(
      `SELECT slug, updated_at FROM programmatic_pages WHERE status = 'published' ORDER BY updated_at DESC`
    ).catch(() => ({ rows: [] as any[] }));
    for (const row of programmaticResult.rows) {
      const lm = row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      urls.push(`<url><loc>${baseUrl}/${row.slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority><lastmod>${lm}</lastmod></url>`);
    }
  } catch {}

  try {
    const { pool: dbPoolQ } = require("./storage");
    const sources = [
      { key: "rrt", careerType: "rrt" },
      { key: "mlt", careerType: "mlt" },
      { key: "imaging", careerType: "imaging" },
    ];
    for (const source of sources) {
      const result = await dbPoolQ.query(
        `SELECT DISTINCT subtopic
         FROM allied_questions
         WHERE career_type = $1 AND COALESCE(subtopic, '') <> ''`,
        [source.careerType],
      ).catch(() => ({ rows: [] as any[] }));
      if (result.rows.length === 0) continue;
      const slugSet = new Set<string>();
      for (const row of result.rows) {
        const topic = String(row.subtopic || "");
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug) slugSet.add(slug);
      }
      if (slugSet.size === 0) continue;
      const now = new Date().toISOString().split("T")[0];
      urls.push(`<url><loc>${baseUrl}/${source.key}/questions</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
      for (const slug of slugSet) {
        urls.push(`<url><loc>${baseUrl}/${source.key}/questions/${slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority><lastmod>${now}</lastmod></url>`);
      }
    }
  } catch {
    // Non-blocking sitemap enhancement.
  }

  try {
    const { pool: dbPool3 } = require("./storage");
    const articlesResult = await dbPool3.query(
      `SELECT slug, profession_slug, updated_at FROM allied_health_articles WHERE status = 'published' ORDER BY published_at DESC`
    );
    for (const row of articlesResult.rows) {
      const lm = row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      urls.push(`<url><loc>${baseUrl}/allied-health/${row.profession_slug}/${row.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${lm}</lastmod></url>`);
    }
  } catch {}

  try {
    const { pool: dbPool4 } = require("./storage");
    const alliedArticles = await dbPool4.query(
      `SELECT slug, career_track, updated_at FROM seo_articles WHERE site_context = 'allied' AND status = 'published' ORDER BY published_at DESC`
    ).catch(() => ({ rows: [] as any[] }));
    const careerTrackToProfSlug: Record<string, string> = {
      "respiratory-therapy": "respiratory-therapy",
      "paramedic": "paramedic",
      "pharmacy-tech": "pharmacy-technician",
      "medical-lab-technologist": "medical-lab-technologist",
      "medical-imaging": "medical-imaging",
      "occupational-therapy": "occupational-therapy",
      "physical-therapy": "physical-therapy",
      "social-work": "social-work",
      "psychotherapy": "psychotherapy",
      "addictions-counselling": "addictions-counselling",
    };
    for (const row of alliedArticles.rows) {
      const profSlug = careerTrackToProfSlug[row.career_track] || row.career_track;
      const artSlug = row.slug.includes("/") ? row.slug.split("/").pop() : row.slug;
      const lm = row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      urls.push(`<url><loc>${baseUrl}/allied-health/${profSlug}/${artSlug}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${lm}</lastmod></url>`);
    }
  } catch {}

  if (urls.length === 0) return staticXml;

  return staticXml.replace("</urlset>", urls.join("\n") + "\n</urlset>");
}

export function generateNewGradSitemap(baseUrl: string): string {
  const now = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  urls.push(`<url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${now}</lastmod></url>`);

  const hubPages = [
    { path: "/interview-lab", priority: "0.9", freq: "weekly" },
    { path: "/resume-builder", priority: "0.9", freq: "weekly" },
    { path: "/cover-letter", priority: "0.9", freq: "weekly" },
    { path: "/first-90-days", priority: "0.9", freq: "monthly" },
    { path: "/clinical-confidence", priority: "0.9", freq: "weekly" },
    { path: "/pricing", priority: "0.8", freq: "monthly" },
  ];

  for (const page of hubPages) {
    urls.push(`<url><loc>${baseUrl}${page.path}</loc><changefreq>${page.freq}</changefreq><priority>${page.priority}</priority><lastmod>${now}</lastmod></url>`);
  }

  const seoPages = [
    "new-grad-rn-interview-questions",
    "new-grad-rn-resume-guide",
    "new-grad-rn-cover-letter-examples",
    "first-90-days-as-a-new-nurse",
    "new-grad-rn-clinical-confidence",
    "new-grad-rn-job-search-guide",
    "new-nurse-orientation-survival-guide",
    "nursing-interview-behavioral-questions",
    "nursing-interview-clinical-scenarios",
    "new-grad-nurse-salary-guide",
    "nursing-specialties-for-new-grads",
    "night-shift-survival-guide-new-nurse",
    "preceptor-relationship-guide-new-nurse",
    "new-grad-rn-time-management",
    "imposter-syndrome-new-nurse",
    "new-grad-rn-skills-checklist",
  ];

  for (const slug of seoPages) {
    urls.push(`<url><loc>${baseUrl}/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${now}</lastmod></url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}
