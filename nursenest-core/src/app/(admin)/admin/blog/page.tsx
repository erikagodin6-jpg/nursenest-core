import Link from "next/link";
import {
  BlogBatchScheduleItemStatus,
  BlogCampaignItemStatus,
  BlogDraftGenerationBatchItemStatus,
  BlogPostStatus,
  ContentAutomationLogCategory,
  type ContentAutomationLogStatus,
} from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { AdminBlogControlPanelClient } from "@/components/admin/admin-blog-control-panel-client";
import { getAdminBlogOperationsStatus } from "@/lib/blog/admin-blog-operations-status";
import { parseBlogBatchItemRepairMeta } from "@/lib/blog/blog-generation-repair-classifier";
import { AdminBlogRepairRetryButton } from "@/components/admin/admin-blog-repair-retry-button";
import { formatDisplayLabel, formatPrismaEnumLabel, humanizeAdminOperationalMessage } from "@/lib/ui/format-display-label";

export const dynamic = "force-dynamic";

type SearchParams = { id?: string; preview?: string };

function statusBadgeClass(status: BlogPostStatus | BlogCampaignItemStatus | BlogBatchScheduleItemStatus | BlogDraftGenerationBatchItemStatus) {
  switch (status) {
    case BlogPostStatus.PUBLISHED:
    case BlogCampaignItemStatus.PUBLISHED:
    case BlogBatchScheduleItemStatus.PUBLISHED:
    case BlogDraftGenerationBatchItemStatus.COMPLETED:
      return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-100";
    case BlogPostStatus.SCHEDULED:
    case BlogCampaignItemStatus.SCHEDULED:
    case BlogBatchScheduleItemStatus.PENDING:
    case BlogDraftGenerationBatchItemStatus.PENDING:
      return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
    case BlogCampaignItemStatus.GENERATING:
    case BlogBatchScheduleItemStatus.GENERATING:
    case BlogDraftGenerationBatchItemStatus.GENERATING:
      return "bg-sky-500/15 text-sky-950 dark:text-sky-100";
    case BlogPostStatus.FAILED:
    case BlogCampaignItemStatus.FAILED:
    case BlogBatchScheduleItemStatus.FAILED:
    case BlogDraftGenerationBatchItemStatus.FAILED:
      return "bg-rose-500/15 text-rose-950 dark:text-rose-100";
    default:
      return "bg-muted text-foreground";
  }
}

function automationBadgeClass(status: ContentAutomationLogStatus): string {
  if (status === "SUCCEEDED") return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-100";
  if (status === "FAILED") return "bg-rose-500/15 text-rose-950 dark:text-rose-100";
  if (status === "SKIPPED") return "bg-zinc-500/15 text-zinc-900 dark:text-zinc-100";
  return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
}

function fmtDate(value: Date | null | undefined): string {
  return value ? value.toISOString().replace("T", " ").slice(0, 16) : "No date";
}

export default async function AdminBlogConsolePage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const initialPostId = typeof sp.id === "string" && sp.id.length > 0 ? sp.id : null;
  const initialPreviewOpen = sp.preview === "1" || sp.preview === "true";

  const [
    opsStatus,
    scheduledPosts,
    campaignItems,
    scheduleItems,
    draftBatchItems,
    failedPosts,
    failedActivity,
  ] = await Promise.all([
    getAdminBlogOperationsStatus(),
    prisma.blogPost.findMany({
      where: { postStatus: { in: [BlogPostStatus.SCHEDULED, BlogPostStatus.APPROVED, BlogPostStatus.NEEDS_REVIEW] } },
      orderBy: [{ publishAt: "asc" }, { updatedAt: "desc" }],
      take: 12,
      select: { id: true, title: true, slug: true, postStatus: true, publishAt: true, updatedAt: true },
    }),
    prisma.blogCampaignItem.findMany({
      where: { status: { in: [BlogCampaignItemStatus.QUEUED, BlogCampaignItemStatus.GENERATING, BlogCampaignItemStatus.FAILED] } },
      orderBy: [{ plannedPublishAt: "asc" }, { updatedAt: "desc" }],
      take: 8,
      select: { id: true, plannedTitle: true, plannedKeyword: true, plannedSlug: true, plannedPublishAt: true, status: true, error: true },
    }),
    prisma.blogBatchScheduleItem.findMany({
      where: { status: { in: [BlogBatchScheduleItemStatus.PENDING, BlogBatchScheduleItemStatus.GENERATING, BlogBatchScheduleItemStatus.FAILED] } },
      orderBy: [{ plannedPublishAt: "asc" }, { updatedAt: "desc" }],
      take: 8,
      select: { id: true, topicRaw: true, plannedPublishAt: true, status: true, failureReason: true, blogPostId: true },
    }),
    prisma.blogDraftGenerationBatchItem.findMany({
      where: {
        status: {
          in: [
            BlogDraftGenerationBatchItemStatus.PENDING,
            BlogDraftGenerationBatchItemStatus.GENERATING,
            BlogDraftGenerationBatchItemStatus.FAILED,
          ],
        },
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 8,
      select: { id: true, topicRaw: true, status: true, error: true, blogPostId: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.FAILED },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: { id: true, title: true, slug: true, postStatus: true, updatedAt: true },
    }),
    prisma.contentAutomationLog.findMany({
      where: {
        category: {
          in: [
            ContentAutomationLogCategory.BLOG_AI_SIMPLE,
            ContentAutomationLogCategory.BLOG_AI_BATCH_ITEM,
            ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
            ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
            ContentAutomationLogCategory.BLOG_PUBLISH_BLOCKED,
            ContentAutomationLogCategory.BLOG_PUBLISH,
            ContentAutomationLogCategory.BLOG_MARK_FAILED,
            ContentAutomationLogCategory.BLOG_REFERENCE_GATE,
            ContentAutomationLogCategory.BLOG_INTERNAL_LINK_CHECK,
          ],
        },
        status: "FAILED",
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, jobType: true, topic: true, summary: true, error: true, status: true, createdAt: true, blogPostId: true },
    }),
  ]);

  const queuedCount =
    campaignItems.filter((item) => item.status !== BlogCampaignItemStatus.FAILED).length +
    scheduleItems.filter((item) => item.status !== BlogBatchScheduleItemStatus.FAILED).length +
    draftBatchItems.filter((item) => item.status !== BlogDraftGenerationBatchItemStatus.FAILED).length;
  const failureCount = failedPosts.length + failedActivity.length + campaignItems.filter((item) => item.status === BlogCampaignItemStatus.FAILED).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Blog console</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            One workflow for generation, review, SEO, scheduling, publishing, and queue health. Backend APIs and publish gates stay unchanged.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog/library" className="text-primary underline">
            Library
          </Link>
          <Link href="/admin/automation-logs" className="text-muted-foreground underline">
            Automation logs
          </Link>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3">
          <p className="text-xs uppercase text-muted-foreground">Canonical posts</p>
          <p className="mt-1 text-2xl font-bold">{opsStatus.canonicalBlogPostCount}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3">
          <p className="text-xs uppercase text-muted-foreground">Localized variants</p>
          <p className="mt-1 text-2xl font-bold">{opsStatus.localizedVariantCount ?? "Unavailable"}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3">
          <p className="text-xs uppercase text-muted-foreground">Queued items</p>
          <p className="mt-1 text-2xl font-bold">{queuedCount}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3">
          <p className="text-xs uppercase text-muted-foreground">Visible failures</p>
          <p className="mt-1 text-2xl font-bold">{failureCount}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3">
          <p className="text-xs uppercase text-muted-foreground">Translation generation</p>
          <p className="mt-1 text-lg font-semibold">{opsStatus.translationGenerationAvailable ? "Available" : "Unavailable"}</p>
        </div>
      </section>

      <nav className="mt-6 flex flex-wrap gap-2 text-xs font-semibold" aria-label="Blog console sections">
        {[
          ["Generate blog draft", "#generate-blog-draft"],
          ["Draft review/edit", "#draft-review-edit"],
          ["SEO fields/title/slug/meta description", "#seo-fields"],
          ["Schedule publish date/time", "#schedule-publish"],
          ["Publish now", "#publish-now"],
          ["Scheduled/queued posts with status", "#scheduled-queued-posts"],
          ["Error/failure messages", "#error-failure-messages"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="rounded-full border border-border bg-muted/40 px-3 py-1 hover:bg-muted">
            {label}
          </a>
        ))}
      </nav>

      <section id="generate-blog-draft" className="mt-8 scroll-mt-24">
        <AdminBlogControlPanelClient initialPostId={initialPostId} initialPreviewOpen={initialPreviewOpen} />
      </section>

      <section id="scheduled-queued-posts" className="mt-10 scroll-mt-24 rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Scheduled/queued posts with status</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--theme-heading-text)]">Queue and publish status</h2>
          </div>
          <Link href="/admin/blog/draft-batch" className="text-sm font-semibold text-primary underline">
            Batch queue
          </Link>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <StatusList title="Editorial queue">
            {scheduledPosts.map((post) => (
              <li key={post.id} className="border-b border-border/40 py-2 last:border-0">
                <Link href={`/admin/blog?id=${encodeURIComponent(post.id)}`} className="font-medium text-primary underline-offset-2 hover:underline">
                  {post.title}
                </Link>
                <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(post.postStatus)}`}>
                    {formatPrismaEnumLabel(post.postStatus)}
                  </span>
                  <span>{fmtDate(post.publishAt ?? post.updatedAt)}</span>
                  <span className="font-mono">{post.slug}</span>
                </p>
              </li>
            ))}
          </StatusList>

          <StatusList title="Campaign items">
            {campaignItems.map((item) => (
              <li key={item.id} className="border-b border-border/40 py-2 last:border-0">
                <p className="font-medium">{item.plannedTitle ?? item.plannedKeyword ?? item.plannedSlug ?? "Untitled campaign item"}</p>
                <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(item.status)}`}>
                    {formatPrismaEnumLabel(item.status)}
                  </span>
                  <span>{fmtDate(item.plannedPublishAt)}</span>
                  {item.error ? (
                    <span className="text-rose-700 dark:text-rose-300">{humanizeAdminOperationalMessage(item.error)}</span>
                  ) : null}
                </p>
              </li>
            ))}
          </StatusList>

          <StatusList title="Scheduled batch items">
            {scheduleItems.map((item) => {
              const repairMeta = item.status === BlogBatchScheduleItemStatus.FAILED
                ? parseBlogBatchItemRepairMeta(item.failureReason)
                : null;
              return (
                <li key={item.id} className="border-b border-border/40 py-2 last:border-0">
                  <p className="font-medium">{item.topicRaw}</p>
                  <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(item.status)}`}>
                      {formatPrismaEnumLabel(item.status)}
                    </span>
                    <span>{fmtDate(item.plannedPublishAt)}</span>
                    {item.blogPostId ? <Link href={`/admin/blog?id=${encodeURIComponent(item.blogPostId)}`} className="text-primary underline">Open draft</Link> : null}
                    {repairMeta ? (
                      <>
                        {repairMeta.repairAttempts !== null && (
                          <span className="text-amber-700 dark:text-amber-300">
                            Repair attempts: {repairMeta.repairAttempts}
                          </span>
                        )}
                        {repairMeta.terminal === true ? (
                          <span className="font-semibold text-rose-700 dark:text-rose-300">Terminal</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Repairable</span>
                        )}
                        {repairMeta.message ? (
                          <span className="text-rose-700 dark:text-rose-300">{repairMeta.message}</span>
                        ) : null}
                      </>
                    ) : item.failureReason ? (
                      <span className="text-rose-700 dark:text-rose-300">
                        {humanizeAdminOperationalMessage(item.failureReason)}
                      </span>
                    ) : null}
                  </p>
                  {item.status === BlogBatchScheduleItemStatus.FAILED && repairMeta?.terminal !== true ? (
                    <div className="mt-1">
                      <AdminBlogRepairRetryButton
                        apiPath={`/api/admin/blog/batch-schedule/items/${item.id}/retry-repair`}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </StatusList>

          <StatusList title="Draft generation batch">
            {draftBatchItems.map((item) => {
              const repairMeta = item.status === BlogDraftGenerationBatchItemStatus.FAILED
                ? parseBlogBatchItemRepairMeta(item.error)
                : null;
              return (
                <li key={item.id} className="border-b border-border/40 py-2 last:border-0">
                  <p className="font-medium">{item.topicRaw}</p>
                  <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(item.status)}`}>
                      {formatPrismaEnumLabel(item.status)}
                    </span>
                    <span>{fmtDate(item.updatedAt)}</span>
                    {item.blogPostId ? <Link href={`/admin/blog?id=${encodeURIComponent(item.blogPostId)}`} className="text-primary underline">Open draft</Link> : null}
                    {repairMeta ? (
                      <>
                        {repairMeta.repairAttempts !== null && (
                          <span className="text-amber-700 dark:text-amber-300">
                            Repair attempts: {repairMeta.repairAttempts}
                          </span>
                        )}
                        {repairMeta.terminal === true ? (
                          <span className="font-semibold text-rose-700 dark:text-rose-300">Terminal</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Repairable</span>
                        )}
                        {repairMeta.message ? (
                          <span className="text-rose-700 dark:text-rose-300">{repairMeta.message}</span>
                        ) : null}
                      </>
                    ) : item.error ? (
                      <span className="text-rose-700 dark:text-rose-300">{humanizeAdminOperationalMessage(item.error)}</span>
                    ) : null}
                  </p>
                  {item.status === BlogDraftGenerationBatchItemStatus.FAILED && repairMeta?.terminal !== true ? (
                    <div className="mt-1">
                      <AdminBlogRepairRetryButton
                        apiPath={`/api/admin/blog/draft-batch/items/${item.id}/retry-repair`}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </StatusList>
        </div>
      </section>

      <section id="error-failure-messages" className="mt-8 scroll-mt-24 rounded-xl border border-rose-500/25 bg-rose-500/[0.04] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Error/failure messages</p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--theme-heading-text)]">Recent failures</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <StatusList title="Failed posts">
            {failedPosts.map((post) => (
              <li key={post.id} className="border-b border-border/40 py-2 last:border-0">
                <Link href={`/admin/blog?id=${encodeURIComponent(post.id)}`} className="font-medium text-primary underline-offset-2 hover:underline">
                  {post.title}
                </Link>
                <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(post.postStatus)}`}>
                    {formatPrismaEnumLabel(post.postStatus)}
                  </span>
                  <span>{fmtDate(post.updatedAt)}</span>
                  <span className="font-mono">{post.slug}</span>
                </p>
              </li>
            ))}
          </StatusList>
          <StatusList title="Automation failures">
            {failedActivity.map((item) => (
              <li key={item.id} className="border-b border-border/40 py-2 last:border-0">
                <p className="font-medium">{formatDisplayLabel(item.jobType)}</p>
                <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className={`rounded-full px-2 py-0.5 font-medium ${automationBadgeClass(item.status)}`}>
                    {formatPrismaEnumLabel(item.status)}
                  </span>
                  <span>{fmtDate(item.createdAt)}</span>
                  {item.blogPostId ? <Link href={`/admin/blog?id=${encodeURIComponent(item.blogPostId)}`} className="text-primary underline">Open draft</Link> : null}
                </p>
                <p className="mt-1 text-xs text-rose-800 dark:text-rose-200">
                  {item.error
                    ? humanizeAdminOperationalMessage(item.error)
                    : item.summary ?? item.topic ?? "No failure message recorded."}
                </p>
              </li>
            ))}
          </StatusList>
        </div>
      </section>
    </main>
  );
}

function StatusList({ title, children }: { title: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const empty = Array.isArray(items) && items.length === 0;
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3>
      <ul className="mt-2 text-sm">
        {empty ? <li className="py-3 text-xs text-muted-foreground">No current items.</li> : items}
      </ul>
    </div>
  );
}
