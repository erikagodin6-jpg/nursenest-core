import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import { prisma } from "@/lib/db";

type RefreshOptions = {
  limit?: number;
  dryRun?: boolean;
};

type RefreshResult = {
  totalConsidered: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  updatedIds: string[];
  failures: Array<{ id: string; slug: string; error: string }>;
};

const REFRESH_MARKER = "<!-- nn:content-refresh-v1 -->";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function hasRefreshMarker(body: string): boolean {
  return body.includes(REFRESH_MARKER);
}

function buildClinicalInsightsSection(title: string, exam: string | null): string {
  const examLabel = exam?.trim() || "your exam blueprint";
  return `
<section aria-labelledby="clinical-insights">
  <h2 id="clinical-insights">Clinical insights</h2>
  <p>${title} becomes easier to retain when you anchor details to bedside priorities: safety first, trend recognition second, and escalation timing third.</p>
  <p>Use this framework while reviewing ${examLabel}: identify immediate risk cues, decide the first nursing action, and justify why alternatives are lower priority.</p>
</section>`;
}

function buildNclexTipsSection(title: string): string {
  return `
<section aria-labelledby="nclex-tips">
  <h2 id="nclex-tips">NCLEX tip focus</h2>
  <ul>
    <li>Re-state the patient risk in one sentence before choosing an intervention.</li>
    <li>Prioritize actions that improve airway, breathing, circulation, or safety monitoring first.</li>
    <li>When options are similar, choose the response that adds assessment clarity before escalation.</li>
    <li>Use ${title} as a cue to review adjacent concepts that commonly appear in mixed-question sets.</li>
  </ul>
</section>`;
}

function buildRelatedPostsSection(
  links: Array<{ slug: string; title: string }>,
): string {
  if (links.length === 0) return "";
  const rows = links
    .map((link) => `<li><a href="/blog/${encodeURIComponent(link.slug)}">${link.title}</a></li>`)
    .join("\n");
  return `
<section aria-labelledby="related-posts">
  <h2 id="related-posts">Related posts</h2>
  <ul>
${rows}
  </ul>
</section>`;
}

function buildSeoTitle(postTitle: string, exam: string | null): string {
  const base = postTitle.trim().replace(/\s+/g, " ");
  const examLabel = exam?.trim();
  const candidate = examLabel ? `${base} | ${examLabel} Clinical Guide` : `${base} | Clinical Guide`;
  return candidate.slice(0, 200);
}

function buildSeoDescription(excerpt: string, title: string): string {
  const source = (excerpt || title).trim().replace(/\s+/g, " ");
  const clipped = source.length > 220 ? source.slice(0, 217).trimEnd() + "..." : source;
  const tail = " Includes clinical insights, NCLEX tips, and related study links.";
  const merged = `${clipped}${tail}`;
  return merged.slice(0, 500);
}

function isSignificantImprovement(previousBody: string, nextBody: string): boolean {
  const delta = Math.max(0, nextBody.length - previousBody.length);
  const gainedSections =
    (!previousBody.includes("id=\"clinical-insights\"") && nextBody.includes("id=\"clinical-insights\"")) &&
    (!previousBody.includes("id=\"nclex-tips\"") && nextBody.includes("id=\"nclex-tips\""));
  return gainedSections || delta >= 500;
}

export async function refreshExistingBlogPosts(options: RefreshOptions = {}): Promise<RefreshResult> {
  const safeLimit = Math.max(1, Math.min(5000, options.limit ?? 5000));
  const posts = await prisma.blogPost.findMany({
    where: {},
    orderBy: { updatedAt: "asc" },
    take: safeLimit,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      body: true,
      exam: true,
      tags: true,
      postStatus: true,
      publishAt: true,
      relatedLessonPaths: true,
      relatedTools: true,
      keywordCluster: true,
      targetKeyword: true,
      countryTarget: true,
    },
  });

  const result: RefreshResult = {
    totalConsidered: posts.length,
    updatedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    updatedIds: [],
    failures: [],
  };

  for (const post of posts) {
    try {
      const relatedPosts = await prisma.blogPost.findMany({
        where: {
          id: { not: post.id },
          postStatus: BlogPostStatus.PUBLISHED,
          OR: [
            post.exam ? { exam: post.exam } : {},
            post.tags.length > 0 ? { tags: { hasSome: post.tags.slice(0, 6) } } : {},
            post.keywordCluster ? { keywordCluster: post.keywordCluster } : {},
          ],
        },
        select: { slug: true, title: true },
        take: 3,
        orderBy: { updatedAt: "desc" },
      });

      let nextBody = post.body;
      if (!nextBody.includes("id=\"clinical-insights\"")) {
        nextBody += buildClinicalInsightsSection(post.title, post.exam);
      }
      if (!nextBody.includes("id=\"nclex-tips\"")) {
        nextBody += buildNclexTipsSection(post.title);
      }
      if (!nextBody.includes("id=\"related-posts\"")) {
        nextBody += buildRelatedPostsSection(relatedPosts);
      }
      if (!hasRefreshMarker(nextBody)) {
        nextBody += `\n${REFRESH_MARKER}\n`;
      }

      nextBody = applyAutoLinksToHtml(nextBody, {
        exam: post.exam,
        countryTarget: post.countryTarget,
        relatedLessonPaths: post.relatedLessonPaths,
        relatedTools: post.relatedTools,
        maxTotalAutoLinks: 18,
      });

      const nextSeoTitle = buildSeoTitle(post.title, post.exam);
      const nextSeoDescription = buildSeoDescription(post.excerpt, post.title);
      const nextExcerpt = stripHtml(nextBody).slice(0, 460);

      const changed =
        nextBody !== post.body ||
        nextSeoTitle !== (post.seoTitle || "") ||
        nextSeoDescription !== (post.seoDescription || "") ||
        nextExcerpt !== post.excerpt;

      if (!changed) {
        result.skippedCount += 1;
        continue;
      }

      const significant = isSignificantImprovement(post.body, nextBody);
      if (!options.dryRun) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            body: nextBody,
            excerpt: nextExcerpt.length >= 40 ? nextExcerpt : post.excerpt,
            seoTitle: nextSeoTitle,
            seoDescription: nextSeoDescription,
            updatedAt: new Date(),
            ...(significant && post.postStatus === BlogPostStatus.PUBLISHED
              ? {
                  publishAt: new Date(),
                  workflowStatus: BlogWorkflowStatus.PUBLISHED,
                }
              : {}),
          },
        });
      }

      result.updatedCount += 1;
      result.updatedIds.push(post.id);
    } catch (error) {
      result.failedCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      result.failures.push({ id: post.id, slug: post.slug, error: message });
    }
  }

  return result;
}
