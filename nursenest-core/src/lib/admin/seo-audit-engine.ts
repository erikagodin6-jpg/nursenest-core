import "server-only";

import { listStaticBlogPostsForIndex } from "@/lib/blog/static-blog-posts";
import { getAllProgrammaticSlugs, isProgrammaticSeoSlug } from "@/lib/seo/programmatic-registry-slugs";
import type { PrismaClient } from "@prisma/client";

export type SeoAuditContext = {
  blogSlugs: Set<string>;
  staticBlogSlugs: Set<string>;
  lessonSlugs: Set<string>;
  pathwayLessonSlugs: Set<string>;
  programmaticSlugs: Set<string>;
};

export async function buildSeoAuditContext(prisma: PrismaClient): Promise<SeoAuditContext> {
  const [blogRows, lessonRows, pathwayRows] = await Promise.all([
    prisma.blogPost.findMany({ select: { slug: true } }),
    prisma.contentItem.findMany({ where: { type: "lesson" }, select: { slug: true } }),
    prisma.pathwayLesson.findMany({ select: { slug: true } }),
  ]);

  return {
    blogSlugs: new Set(blogRows.map((r) => r.slug)),
    staticBlogSlugs: new Set(listStaticBlogPostsForIndex().map((p) => p.slug)),
    lessonSlugs: new Set(lessonRows.map((r) => r.slug)),
    pathwayLessonSlugs: new Set(pathwayRows.map((r) => r.slug)),
    programmaticSlugs: new Set(getAllProgrammaticSlugs()),
  };
}

/** Root-relative paths that always resolve in Core marketing (hubs). */
const KNOWN_TOP_LEVEL = new Set([
  "",
  "lessons",
  "blog",
  "pricing",
  "signup",
  "login",
  "flashcards",
  "practice-exams",
  "question-bank",
  "tools",
  "faq",
  "pre-nursing",
  "for-institutions",
  "case-studies",
  "us",
  "canada",
  "allied-health",
  "allied-health-exam-prep",
  "np-exam-practice-questions",
  "cnple-practice-questions",
  "rex-pn-practice-questions",
  "nclex-pn-practice-questions",
  "nclex-rn-practice-questions",
]);

export function extractRootRelativeHrefs(html: string): string[] {
  const out: string[] = [];
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1]?.trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
    if (raw.startsWith("//")) continue;
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      try {
        const u = new URL(raw);
        if (u.pathname && u.pathname !== "/") out.push(u.pathname + (u.search || ""));
        else if (u.pathname === "/") out.push("/");
      } catch {
        /* ignore */
      }
      continue;
    }
    if (raw.startsWith("/")) out.push(raw.split("#")[0] ?? raw);
  }
  return out;
}

export function countInternalAnchors(html: string): number {
  let n = 0;
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1]?.trim() ?? "";
    if (raw.startsWith("/") && !raw.startsWith("//")) n++;
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      try {
        const u = new URL(raw);
        if (u.pathname.startsWith("/") && !u.pathname.startsWith("//")) n++;
      } catch {
        /* */
      }
    }
  }
  return n;
}

export type PathCheck = { path: string; status: "ok" | "warn" | "broken"; detail: string };

export function validateInternalPath(pathnameWithQuery: string, ctx: SeoAuditContext): PathCheck {
  const path = pathnameWithQuery.split("?")[0]?.split("#")[0] ?? "";
  if (!path || path === "/") return { path: pathnameWithQuery, status: "ok", detail: "Home" };

  const segments = path.split("/").filter(Boolean);
  const first = segments[0] ?? "";

  if (first === "app" || first === "api" || first === "admin") {
    return { path: pathnameWithQuery, status: "warn", detail: "App/API/admin path in content (usually avoid in public copy)" };
  }

  if (first === "blog") {
    const slug = segments[1];
    if (!slug) return { path: pathnameWithQuery, status: "ok", detail: "Blog index" };
    if (ctx.blogSlugs.has(slug) || ctx.staticBlogSlugs.has(slug)) {
      return { path: pathnameWithQuery, status: "ok", detail: "Blog slug found" };
    }
    return { path: pathnameWithQuery, status: "broken", detail: `No blog post or static post for slug “${slug}”` };
  }

  if (KNOWN_TOP_LEVEL.has(first)) {
    if (segments.length === 1) return { path: pathnameWithQuery, status: "ok", detail: "Known hub" };
    if ((first === "us" || first === "canada") && segments.includes("lessons") && segments.length >= 5) {
      const li = segments.indexOf("lessons");
      const lessonSlug = segments[li + 1];
      if (lessonSlug && !ctx.pathwayLessonSlugs.has(lessonSlug)) {
        return {
          path: pathnameWithQuery,
          status: "warn",
          detail: `Lesson slug “${lessonSlug}” not found on pathway lessons (may be catalog-only or typo)`,
        };
      }
      return { path: pathnameWithQuery, status: "ok", detail: "Pathway lesson-shaped URL" };
    }
    return { path: pathnameWithQuery, status: "ok", detail: "Marketing path" };
  }

  if (segments.length === 1 && isProgrammaticSeoSlug(segments[0]!)) {
    return { path: pathnameWithQuery, status: "ok", detail: "Programmatic SEO page" };
  }

  if (ctx.programmaticSlugs.has(first) && segments.length === 1) {
    return { path: pathnameWithQuery, status: "ok", detail: "Programmatic slug" };
  }

  return {
    path: pathnameWithQuery,
    status: "warn",
    detail: "Could not verify automatically — check manually",
  };
}

export type MetadataIssue = "seoTitle" | "seoDescription" | "excerpt";

export type MetadataRow = {
  kind: "blog";
  id: string;
  slug: string;
  title: string;
  postStatus: string;
  issues: MetadataIssue[];
  editHref: string;
  publicHref: string;
};

export type LessonMetaRow = {
  kind: "lesson";
  id: string;
  slug: string;
  title: string;
  status: string | null;
  issues: Array<"seoTitle" | "seoDescription" | "summary">;
  editHref: string;
};

export type PathwayMetaRow = {
  kind: "pathway_lesson";
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  locale: string;
  issues: Array<"seoTitle" | "seoDescription">;
};

export async function loadMetadataAudit(prisma: PrismaClient): Promise<{
  blogs: MetadataRow[];
  lessons: LessonMetaRow[];
  pathwayLessons: PathwayMetaRow[];
}> {
  const blogs = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    take: 400,
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
    },
  });

  const blogRows: MetadataRow[] = [];
  for (const p of blogs) {
    const issues: MetadataIssue[] = [];
    if (!p.seoTitle?.trim()) issues.push("seoTitle");
    if (!p.seoDescription?.trim()) issues.push("seoDescription");
    if (!p.excerpt?.trim()) issues.push("excerpt");
    if (issues.length === 0) continue;
    blogRows.push({
      kind: "blog",
      id: p.id,
      slug: p.slug,
      title: p.title,
      postStatus: String(p.postStatus),
      issues,
      editHref: `/admin/blog/control-panel?id=${encodeURIComponent(p.id)}`,
      publicHref: `/blog/${encodeURIComponent(p.slug)}`,
    });
  }

  const lessons = await prisma.contentItem.findMany({
    where: { type: "lesson" },
    orderBy: { updatedAt: "desc" },
    take: 400,
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      seoTitle: true,
      seoDescription: true,
      summary: true,
    },
  });

  const lessonRows: LessonMetaRow[] = [];
  for (const l of lessons) {
    const issues: Array<"seoTitle" | "seoDescription" | "summary"> = [];
    if (!l.seoTitle?.trim()) issues.push("seoTitle");
    if (!l.seoDescription?.trim()) issues.push("seoDescription");
    if (!l.summary?.trim()) issues.push("summary");
    if (issues.length === 0) continue;
    lessonRows.push({
      kind: "lesson",
      id: l.id,
      slug: l.slug,
      title: l.title,
      status: l.status,
      issues,
      editHref: `/admin/lessons/${encodeURIComponent(l.id)}`,
    });
  }

  const pls = await prisma.pathwayLesson.findMany({
    orderBy: { updatedAt: "desc" },
    take: 400,
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      locale: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  const pathwayRows: PathwayMetaRow[] = [];
  for (const p of pls) {
    const issues: Array<"seoTitle" | "seoDescription"> = [];
    if (!p.seoTitle?.trim()) issues.push("seoTitle");
    if (!p.seoDescription?.trim()) issues.push("seoDescription");
    if (issues.length === 0) continue;
    pathwayRows.push({
      kind: "pathway_lesson",
      id: p.id,
      pathwayId: p.pathwayId,
      slug: p.slug,
      title: p.title,
      locale: p.locale,
      issues,
    });
  }

  return { blogs: blogRows, lessons: lessonRows, pathwayLessons: pathwayRows };
}

export type SlugCollision = {
  slug: string;
  locations: Array<{ type: string; id: string; label: string; href: string }>;
};

export async function loadSlugCollisions(prisma: PrismaClient): Promise<SlugCollision[]> {
  const map = new Map<string, Array<{ type: string; id: string; label: string; href: string }>>();

  const blogs = await prisma.blogPost.findMany({ select: { id: true, slug: true, title: true } });
  for (const b of blogs) {
    const arr = map.get(b.slug) ?? [];
    arr.push({
      type: "blog",
      id: b.id,
      label: b.title.slice(0, 80),
      href: `/admin/blog/control-panel?id=${encodeURIComponent(b.id)}`,
    });
    map.set(b.slug, arr);
  }

  const lessons = await prisma.contentItem.findMany({
    where: { type: "lesson" },
    select: { id: true, slug: true, title: true },
  });
  for (const l of lessons) {
    const arr = map.get(l.slug) ?? [];
    arr.push({
      type: "lesson",
      id: l.id,
      label: l.title.slice(0, 80),
      href: `/admin/lessons/${encodeURIComponent(l.id)}`,
    });
    map.set(l.slug, arr);
  }

  const collisions: SlugCollision[] = [];
  for (const [slug, locations] of map) {
    if (locations.length > 1) collisions.push({ slug, locations });
  }
  collisions.sort((a, b) => b.locations.length - a.locations.length || a.slug.localeCompare(b.slug));
  return collisions;
}

export type WeakLinkRow = {
  kind: "blog";
  id: string;
  slug: string;
  title: string;
  postStatus: string;
  internalAnchors: number;
  relatedPaths: number;
  reasons: string[];
  editHref: string;
};

export async function loadWeakInternalLinking(prisma: PrismaClient): Promise<WeakLinkRow[]> {
  const rows = await prisma.blogPost.findMany({
    where: { postStatus: { in: ["PUBLISHED", "SCHEDULED"] } },
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      body: true,
      relatedLessonPaths: true,
    },
  });

  const out: WeakLinkRow[] = [];
  for (const p of rows) {
    const internalAnchors = countInternalAnchors(p.body);
    const relatedPaths = p.relatedLessonPaths?.length ?? 0;
    const reasons: string[] = [];
    if (internalAnchors < 2) reasons.push(`Few in-body internal links (${internalAnchors})`);
    if (relatedPaths === 0) reasons.push("No relatedLessonPaths");
    if (reasons.length === 0) continue;
    out.push({
      kind: "blog",
      id: p.id,
      slug: p.slug,
      title: p.title,
      postStatus: p.postStatus,
      internalAnchors,
      relatedPaths,
      reasons,
      editHref: `/admin/blog/control-panel?id=${encodeURIComponent(p.id)}`,
    });
  }
  return out;
}

export type BrokenLinkRow = {
  sourceKind: "blog" | "lesson";
  sourceId: string;
  sourceLabel: string;
  href: string;
  status: PathCheck["status"];
  detail: string;
  editHref: string;
};

export async function loadBrokenInternalLinks(prisma: PrismaClient, ctx: SeoAuditContext): Promise<BrokenLinkRow[]> {
  const issues: BrokenLinkRow[] = [];

  const blogs = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    take: 120,
    select: { id: true, title: true, slug: true, body: true },
  });

  for (const b of blogs) {
    const hrefs = extractRootRelativeHrefs(b.body);
    const seen = new Set<string>();
    for (const h of hrefs) {
      if (seen.has(h)) continue;
      seen.add(h);
      const check = validateInternalPath(h, ctx);
      if (check.status === "broken") {
        issues.push({
          sourceKind: "blog",
          sourceId: b.id,
          sourceLabel: `${b.title.slice(0, 60)} (${b.slug})`,
          href: h,
          status: check.status,
          detail: check.detail,
          editHref: `/admin/blog/control-panel?id=${encodeURIComponent(b.id)}`,
        });
      }
    }
  }

  const lessons = await prisma.contentItem.findMany({
    where: { type: "lesson" },
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: { id: true, title: true, slug: true, content: true, summary: true },
  });

  for (const l of lessons) {
    const text = `${typeof l.summary === "string" ? l.summary : ""}\n${JSON.stringify(l.content)}`;
    const hrefs = extractRootRelativeHrefs(text);
    const seen = new Set<string>();
    for (const h of hrefs) {
      if (seen.has(h)) continue;
      seen.add(h);
      const check = validateInternalPath(h, ctx);
      if (check.status === "broken") {
        issues.push({
          sourceKind: "lesson",
          sourceId: l.id,
          sourceLabel: `${l.title.slice(0, 60)} (${l.slug})`,
          href: h,
          status: check.status,
          detail: check.detail,
          editHref: `/admin/lessons/${encodeURIComponent(l.id)}`,
        });
      }
    }
  }

  return issues.slice(0, 200);
}

export type OpportunityRow = {
  id: string;
  slug: string;
  title: string;
  exam: string | null;
  hints: string[];
  editHref: string;
};

export async function loadLinkOpportunities(prisma: PrismaClient): Promise<OpportunityRow[]> {
  const rows = await prisma.blogPost.findMany({
    where: { postStatus: { in: ["PUBLISHED", "SCHEDULED"] } },
    orderBy: { updatedAt: "desc" },
    take: 150,
    select: {
      id: true,
      slug: true,
      title: true,
      exam: true,
      body: true,
      relatedLessonPaths: true,
    },
  });

  const out: OpportunityRow[] = [];
  for (const p of rows) {
    const hints: string[] = [];
    const paths = p.relatedLessonPaths?.length ?? 0;
    if (p.exam?.trim() && paths === 0) {
      hints.push("Exam is set but relatedLessonPaths is empty — add pathway lesson links in the control panel.");
    }
    if (countInternalAnchors(p.body) === 0 && p.body.length > 400) {
      hints.push("Long body with no root-relative <a href> links — add internal links to lessons, hubs, or tools.");
    }
    if (hints.length > 0) {
      out.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        exam: p.exam,
        hints,
        editHref: `/admin/blog/control-panel?id=${encodeURIComponent(p.id)}`,
      });
    }
  }
  return out;
}
