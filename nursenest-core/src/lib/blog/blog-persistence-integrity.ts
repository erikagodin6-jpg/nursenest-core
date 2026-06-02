import type { Prisma } from "@prisma/client";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

type BlogPersistenceClient = Prisma.TransactionClient | typeof prisma;

type BlogPersistenceContext = {
  operation: string;
  correlationId?: string | null;
  slug?: string | null;
  title?: string | null;
};

export function maskDatabaseUrl(raw = process.env.DATABASE_URL ?? ""): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    const dbName = url.pathname.replace(/^\//, "") || "(default)";
    const schema = url.searchParams.get("schema");
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}/${dbName}${schema ? `?schema=${schema}` : ""}`;
  } catch {
    return value.replace(/:\/\/([^:@/]+):([^@/]+)@/, "://$1:***@").slice(0, 180);
  }
}

function logBlogPersistenceFailure(context: BlogPersistenceContext, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  safeServerLogCritical(
    "blog_integrity",
    "blog_persistence_failure",
    {
      operation: context.operation,
      correlationId: context.correlationId ?? null,
      slug: context.slug ?? null,
      title: context.title ? context.title.slice(0, 120) : null,
      environment: process.env.NODE_ENV ?? null,
      database: maskDatabaseUrl(),
      timestamp: new Date().toISOString(),
      error: message.slice(0, 500),
    },
    error,
    { flow: "blog_persistence" },
  );
}

export async function createBlogPostWithIntegrity<TSelect extends Prisma.BlogPostSelect>(params: {
  client?: BlogPersistenceClient;
  data: Prisma.BlogPostCreateInput;
  select: TSelect;
  context: BlogPersistenceContext;
}): Promise<Prisma.BlogPostGetPayload<{ select: TSelect }>> {
  const client = params.client ?? prisma;
  const selectWithId = { ...params.select, id: true } as TSelect & { id: true };

  try {
    const created = await client.blogPost.create({
      data: params.data,
      select: selectWithId,
    });
    const createdId = (created as { id?: unknown }).id;
    const id = typeof createdId === "string" && createdId.trim() ? createdId : null;
    if (!id) {
      throw new Error("Database persistence failed: BlogPost.create returned no id");
    }

    const persisted = await client.blogPost.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!persisted?.id) {
      throw new Error(`Database persistence failed: BlogPost ${id} missing after create`);
    }

    safeServerLog("blog_integrity", "blog_post_persisted", {
      operation: params.context.operation,
      correlationId: params.context.correlationId ?? null,
      blogPostId: id,
      slug: params.context.slug ?? null,
      environment: process.env.NODE_ENV ?? null,
      database: maskDatabaseUrl(),
    });
    return created as unknown as Prisma.BlogPostGetPayload<{ select: TSelect }>;
  } catch (error) {
    logBlogPersistenceFailure(params.context, error);
    throw error;
  }
}

export async function assertBlogPostPersisted(params: {
  postId: string | null | undefined;
  operation: string;
  correlationId?: string | null;
  expectedSlug?: string | null;
}): Promise<{ id: string; slug: string; title: string; postStatus: BlogPostStatus; updatedAt: Date }> {
  const postId = params.postId?.trim();
  if (!postId) {
    const error = new Error("Database persistence failed: missing BlogPost id");
    logBlogPersistenceFailure(
      {
        operation: params.operation,
        correlationId: params.correlationId ?? null,
        slug: params.expectedSlug ?? null,
      },
      error,
    );
    throw error;
  }

  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
  });
  if (!row) {
    const error = new Error(`Database persistence failed: BlogPost ${postId} missing`);
    logBlogPersistenceFailure(
      {
        operation: params.operation,
        correlationId: params.correlationId ?? null,
        slug: params.expectedSlug ?? null,
      },
      error,
    );
    throw error;
  }
  return row;
}

type CountRow<T extends string> = { [K in T]: string } & { _count: { _all: number } };

function rowsToCountMap<T extends string>(rows: Array<CountRow<T>>, key: T): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row[key], row._count._all]));
}

async function readLatestMigration(): Promise<{ migrationName: string | null; finishedAt: string | null; error?: string }> {
  try {
    const rows = await prisma.$queryRaw<Array<{ migration_name: string; finished_at: Date | null }>>`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      ORDER BY finished_at DESC NULLS LAST, started_at DESC
      LIMIT 1
    `;
    const latest = rows[0];
    return {
      migrationName: latest?.migration_name ?? null,
      finishedAt: latest?.finished_at ? latest.finished_at.toISOString() : null,
    };
  } catch (error) {
    return { migrationName: null, finishedAt: null, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getBlogPersistenceDiagnostics() {
  const now = new Date();
  const requiredEnv = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL?.trim()),
    DIRECT_URL: Boolean(process.env.DIRECT_URL?.trim()),
    NODE_ENV: Boolean(process.env.NODE_ENV?.trim()),
  };
  const [
    totalPosts,
    postStatusRows,
    workflowStatusRows,
    visiblePublicPosts,
    articleJobRows,
    draftBatchItemRows,
    scheduleItemRows,
    latestPost,
    latestJobSuccess,
    latestJobFailure,
    migration,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
    prisma.blogPost.groupBy({ by: ["workflowStatus"], _count: { _all: true } }),
    prisma.blogPost.count({
      where: {
        postStatus: BlogPostStatus.PUBLISHED,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        OR: [{ publishAt: null }, { publishAt: { lte: now } }],
      },
    }),
    prisma.blogArticleGenerationJob.groupBy({ by: ["stage"], _count: { _all: true } }),
    prisma.blogDraftGenerationBatchItem.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.blogBatchScheduleItem.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.blogPost.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, title: true, createdAt: true, postStatus: true, workflowStatus: true },
    }),
    prisma.blogArticleGenerationJob.findFirst({
      where: { stage: "published", blogPostId: { not: null } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, blogPostId: true, updatedAt: true, resultSlug: true, resultPostStatus: true },
    }),
    prisma.blogArticleGenerationJob.findFirst({
      where: { stage: "failed" },
      orderBy: { updatedAt: "desc" },
      select: { id: true, updatedAt: true, failureCode: true, lastError: true },
    }),
    readLatestMigration(),
  ]);

  const postStatus = rowsToCountMap(postStatusRows as Array<CountRow<"postStatus">>, "postStatus");
  const workflowStatus = rowsToCountMap(workflowStatusRows as Array<CountRow<"workflowStatus">>, "workflowStatus");
  const articleJobs = rowsToCountMap(articleJobRows as Array<CountRow<"stage">>, "stage");
  const draftBatchItems = rowsToCountMap(draftBatchItemRows as Array<CountRow<"status">>, "status");
  const scheduleItems = rowsToCountMap(scheduleItemRows as Array<CountRow<"status">>, "status");

  const articleJobsWithPersistedRows = await prisma.blogArticleGenerationJob.count({
    where: { stage: "published", blogPostId: { not: null }, blogPost: { isNot: null } },
  });
  const articleJobsMissingRows = await prisma.blogArticleGenerationJob.count({
    where: { stage: "published", blogPostId: { not: null }, blogPost: null },
  });

  return {
    ok: articleJobsMissingRows === 0,
    generated: {
      articleJobs,
      draftBatchItems,
      scheduleItems,
    },
    persisted: {
      totalPosts,
      postStatus,
      workflowStatus,
      visiblePublicPosts,
      latestPost: latestPost
        ? {
            ...latestPost,
            createdAt: latestPost.createdAt.toISOString(),
          }
        : null,
    },
    reconciliation: {
      articleJobsWithPersistedRows,
      articleJobsMissingRows,
      publishedJobs: articleJobs.published ?? 0,
      failedJobs: articleJobs.failed ?? 0,
      queuedJobs: articleJobs.queued ?? 0,
      draftBatchCompleted: draftBatchItems.COMPLETED ?? 0,
      draftBatchFailed: draftBatchItems.FAILED ?? 0,
      schedulePublished: scheduleItems.PUBLISHED ?? 0,
      scheduleFailed: scheduleItems.FAILED ?? 0,
    },
    database: {
      nodeEnv: process.env.NODE_ENV ?? null,
      connectedDatabase: maskDatabaseUrl(),
      requiredEnv,
      missingRequiredEnv: Object.entries(requiredEnv)
        .filter(([, present]) => !present)
        .map(([key]) => key),
      latestMigration: migration,
    },
    latestSuccessfulWrite: latestPost?.createdAt.toISOString() ?? null,
    latestJobSuccess: latestJobSuccess
      ? {
          ...latestJobSuccess,
          updatedAt: latestJobSuccess.updatedAt.toISOString(),
        }
      : null,
    latestJobFailure: latestJobFailure
      ? {
          ...latestJobFailure,
          updatedAt: latestJobFailure.updatedAt.toISOString(),
          lastError: latestJobFailure.lastError?.slice(0, 500) ?? null,
        }
      : null,
    checkedAt: now.toISOString(),
  };
}

export function buildBlogPersistenceDiagnosticsFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    ok: false,
    error: message.slice(0, 500),
    generated: {
      articleJobs: {} as Record<string, number>,
      draftBatchItems: {} as Record<string, number>,
      scheduleItems: {} as Record<string, number>,
    },
    persisted: {
      totalPosts: 0,
      postStatus: {} as Record<string, number>,
      workflowStatus: {} as Record<string, number>,
      visiblePublicPosts: 0,
      latestPost: null,
    },
    reconciliation: {
      articleJobsWithPersistedRows: 0,
      articleJobsMissingRows: 0,
      publishedJobs: 0,
      failedJobs: 0,
      queuedJobs: 0,
      draftBatchCompleted: 0,
      draftBatchFailed: 0,
      schedulePublished: 0,
      scheduleFailed: 0,
    },
    database: {
      nodeEnv: process.env.NODE_ENV ?? null,
      connectedDatabase: maskDatabaseUrl(),
      requiredEnv: {
        DATABASE_URL: Boolean(process.env.DATABASE_URL?.trim()),
        DIRECT_URL: Boolean(process.env.DIRECT_URL?.trim()),
        NODE_ENV: Boolean(process.env.NODE_ENV?.trim()),
      },
      missingRequiredEnv: ["DATABASE_URL", "DIRECT_URL", "NODE_ENV"].filter((key) => !process.env[key]?.trim()),
      latestMigration: { migrationName: null, finishedAt: null, error: message.slice(0, 500) },
    },
    latestSuccessfulWrite: null,
    latestJobSuccess: null,
    latestJobFailure: null,
    checkedAt: new Date().toISOString(),
  };
}
