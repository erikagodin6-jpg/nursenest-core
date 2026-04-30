/**
 * Single source of truth for DB fields when a {@link BlogPost} is publicly **PUBLISHED**
 * (must satisfy {@link blogPostIsLive}: `postStatus` + `workflowStatus` + `publishAt` rules).
 */
import { BlogPostStatus, BlogWorkflowStatus, type Prisma, type PrismaClient } from "@prisma/client";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type BlogPostPublishedScalars = {
  postStatus: typeof BlogPostStatus.PUBLISHED;
  workflowStatus: typeof BlogWorkflowStatus.PUBLISHED;
  publishAt: Date;
};

/** Scalar fragment for Prisma `data` when a row should be live on `/blog` as PUBLISHED. */
export function blogPostPublishedScalars(
  existingPublishAt: Date | null | undefined,
  now: Date = new Date(),
): BlogPostPublishedScalars {
  return {
    postStatus: BlogPostStatus.PUBLISHED,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    publishAt: existingPublishAt ?? now,
  };
}

/** Prefer explicit publish instant, then stored value, then clock (immediate publish). */
export function resolveBlogPostPublishAtExplicitOrExisting(
  explicit: Date | null | undefined,
  existing: Date | null | undefined,
  now: Date,
): Date {
  return explicit ?? existing ?? now;
}

/**
 * Normalize create/update fragments so `postStatus: PUBLISHED` never persists with a non-`PUBLISHED`
 * workflow (invisible on `/blog`). Scheduled rows keep their own workflow defaults.
 */
export function normalizeBlogPostStatusWriteFields(args: {
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  workflowFromRequest?: BlogWorkflowStatus | null;
  now?: Date;
}): { postStatus: BlogPostStatus; publishAt: Date | null; workflowStatus: BlogWorkflowStatus } {
  const now = args.now ?? new Date();
  if (args.postStatus === BlogPostStatus.PUBLISHED) {
    const s = blogPostPublishedScalars(args.publishAt, now);
    return { postStatus: s.postStatus, publishAt: s.publishAt, workflowStatus: s.workflowStatus };
  }
  if (args.postStatus === BlogPostStatus.SCHEDULED) {
    return {
      postStatus: BlogPostStatus.SCHEDULED,
      publishAt: args.publishAt,
      workflowStatus: args.workflowFromRequest ?? BlogWorkflowStatus.SCHEDULED,
    };
  }
  return {
    postStatus: args.postStatus,
    publishAt: args.publishAt,
    workflowStatus: args.workflowFromRequest ?? BlogWorkflowStatus.GENERATED,
  };
}

type BlogPostDelegate = Pick<PrismaClient, "blogPost">;

/**
 * Force a post into the canonical **published** bundle (live on `/blog` when not embargoed).
 * Companion fields must not override `postStatus`, `workflowStatus`, or `publishAt`.
 */
export async function setBlogPostPublished(
  prisma: BlogPostDelegate,
  postId: string,
  options?: {
    now?: Date;
    companion?: Omit<Prisma.BlogPostUpdateInput, "postStatus" | "workflowStatus" | "publishAt">;
  },
): Promise<BlogPostPublishedScalars> {
  const now = options?.now ?? new Date();
  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { publishAt: true },
  });
  if (!row) throw new Error(`setBlogPostPublished: missing post (${postId})`);
  const scalars = blogPostPublishedScalars(row.publishAt, now);
  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      ...(options?.companion as Prisma.BlogPostUpdateInput),
      ...scalars,
    },
  });
  return scalars;
}

/**
 * Observability: `PUBLISHED` + non-`PUBLISHED` workflow hides the post from `/blog`.
 * Call after reads in admin APIs, or before/after writes in generators.
 */
export function warnIfPublishedPostWorkflowNotAligned(
  row: { id?: string; slug?: string; postStatus: BlogPostStatus; workflowStatus: BlogWorkflowStatus | null },
  label: string,
): void {
  if (row.postStatus !== BlogPostStatus.PUBLISHED) return;
  if (row.workflowStatus === BlogWorkflowStatus.PUBLISHED) return;
  const id = row.id ? ` id=${row.id}` : "";
  const slug = row.slug ? ` slug=${row.slug}` : "";
  const msg = `[blog] ${label}: postStatus=PUBLISHED but workflowStatus=${row.workflowStatus ?? "null"} — hidden from /blog${id}${slug}`;
  safeServerLog("warn", msg);
}

/** Dev-only hard stop when a write payload would ship PUBLISHED without workflow PUBLISHED (generators / admin). */
export function devAssertPublishedWritePayloadAligned(args: {
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus;
  label: string;
}): void {
  if (process.env.NODE_ENV !== "development") return;
  if (args.postStatus !== BlogPostStatus.PUBLISHED) return;
  if (args.workflowStatus === BlogWorkflowStatus.PUBLISHED) return;
  throw new Error(
    `[blog] ${args.label}: invariant violated — postStatus=PUBLISHED requires workflowStatus=PUBLISHED (got ${args.workflowStatus})`,
  );
}
