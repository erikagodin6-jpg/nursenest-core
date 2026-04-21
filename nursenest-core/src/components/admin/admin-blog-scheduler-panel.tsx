"use client";

import { BlogPostStatus } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  exam: string | null;
  category: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  workflowStatus?: string;
  requiresReferences?: boolean;
  apaReferences?: string[];
  coverImage?: string | null;
  coverImageAlt?: string | null;
  imageStatus?: string;
  postStatus: BlogPostStatus;
  publishAt: string | null;
  updatedAt: string;
};

function statusChip(status: BlogPostStatus) {
  if (status === BlogPostStatus.PUBLISHED) return "bg-emerald-100 text-emerald-900";
  if (status === BlogPostStatus.SCHEDULED) return "bg-amber-100 text-amber-900";
  if (status === BlogPostStatus.APPROVED) return "bg-sky-100 text-sky-900";
  if (status === BlogPostStatus.NEEDS_REVIEW) return "bg-orange-100 text-orange-900";
  if (status === BlogPostStatus.FAILED) return "bg-red-100 text-red-900";
  return "bg-slate-200 text-slate-900";
}

export function AdminBlogSchedulerPanel({
  initialPosts,
  counts,
  nextScheduledAt,
  missingSeoCount,
  missingReferencesCount,
  missingImageAltCount,
}: {
  initialPosts: BlogRow[];
  counts: {
    draft: number;
    needsReview: number;
    approved: number;
    scheduled: number;
    published: number;
    failed: number;
  };
  nextScheduledAt: string | null;
  missingSeoCount: number;
  missingReferencesCount: number;
  missingImageAltCount: number;
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"ALL" | BlogPostStatus>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [createBusy, setCreateBusy] = useState(false);
  const [newPost, setNewPost] = useState({
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    exam: "",
    category: "",
    publishAt: "",
  });

  const posts = useMemo(
    () => initialPosts.filter((p) => (statusFilter === "ALL" ? true : p.postStatus === statusFilter)),
    [initialPosts, statusFilter],
  );

  async function patchPost(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function createPost() {
    setCreateBusy(true);
    try {
      const payload = {
        slug: newPost.slug.trim(),
        title: newPost.title.trim(),
        excerpt: newPost.excerpt.trim(),
        body: newPost.body.trim() || "Draft body",
        exam: newPost.exam.trim() || null,
        category: newPost.category.trim() || null,
        publishAt: newPost.publishAt ? new Date(newPost.publishAt).toISOString() : null,
        postStatus: newPost.publishAt ? "SCHEDULED" : "DRAFT",
      };
      await fetch("/api/admin/blog", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNewPost({ slug: "", title: "", excerpt: "", body: "", exam: "", category: "", publishAt: "" });
      router.refresh();
    } finally {
      setCreateBusy(false);
    }
  }

  return (
    <section className="nn-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Blog scheduler</h2>
          <p className="mt-1 text-sm text-muted-foreground">Draft, schedule, publish, and monitor blog readiness.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="rounded-md bg-muted px-2 py-1">Draft: {counts.draft}</div>
          <div className="rounded-md bg-orange-500/15 px-2 py-1 text-orange-950 dark:text-orange-100">Review: {counts.needsReview}</div>
          <div className="rounded-md bg-sky-500/15 px-2 py-1 text-sky-950 dark:text-sky-100">Approved: {counts.approved}</div>
          <div className="rounded-md bg-amber-500/15 px-2 py-1 text-amber-950 dark:text-amber-100">Scheduled: {counts.scheduled}</div>
          <div className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-950 dark:text-emerald-100">Published: {counts.published}</div>
          <div className="rounded-md bg-red-500/15 px-2 py-1 text-red-950 dark:text-red-100">Failed: {counts.failed}</div>
          <div className="rounded-md bg-muted px-2 py-1">Missing SEO: {missingSeoCount}</div>
          <div className="rounded-md bg-muted px-2 py-1">Missing refs: {missingReferencesCount}</div>
          <div className="rounded-md bg-muted px-2 py-1">Missing alt: {missingImageAltCount}</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Next scheduled publish:{" "}
        {nextScheduledAt ? new Date(nextScheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "none"}
      </p>

      <div className="mt-4 grid gap-2 md:grid-cols-6">
        <input
          className="rounded-md border border-border px-2 py-1 text-sm"
          placeholder="slug"
          value={newPost.slug}
          onChange={(e) => setNewPost((s) => ({ ...s, slug: e.target.value }))}
        />
        <input
          className="rounded-md border border-border px-2 py-1 text-sm md:col-span-2"
          placeholder="title"
          value={newPost.title}
          onChange={(e) => setNewPost((s) => ({ ...s, title: e.target.value }))}
        />
        <input
          className="rounded-md border border-border px-2 py-1 text-sm"
          placeholder="exam"
          value={newPost.exam}
          onChange={(e) => setNewPost((s) => ({ ...s, exam: e.target.value }))}
        />
        <input
          className="rounded-md border border-border px-2 py-1 text-sm"
          placeholder="category"
          value={newPost.category}
          onChange={(e) => setNewPost((s) => ({ ...s, category: e.target.value }))}
        />
        <input
          className="rounded-md border border-border px-2 py-1 text-sm"
          type="datetime-local"
          value={newPost.publishAt}
          onChange={(e) => setNewPost((s) => ({ ...s, publishAt: e.target.value }))}
        />
        <input
          className="rounded-md border border-border px-2 py-1 text-sm md:col-span-5"
          placeholder="excerpt"
          value={newPost.excerpt}
          onChange={(e) => setNewPost((s) => ({ ...s, excerpt: e.target.value }))}
        />
        <button
          type="button"
          disabled={createBusy}
          onClick={createPost}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Create {newPost.publishAt ? "scheduled" : "draft"} post
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <label htmlFor="blog-status-filter" className="text-muted-foreground">
          Status filter:
        </label>
        <select
          id="blog-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | BlogPostStatus)}
          className="rounded-md border border-border px-2 py-1"
        >
          <option value="ALL">All</option>
          {Object.values(BlogPostStatus).map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-muted/70">
            <tr>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Title / slug</th>
              <th className="px-2 py-2">Exam/category/tags</th>
              <th className="px-2 py-2">publishAt</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-border align-top">
                <td className="px-2 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusChip(p.postStatus)}`}>{p.postStatus}</span>
                </td>
                <td className="px-2 py-2">
                  <p className="font-semibold">{p.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{p.slug}</p>
                  <p className="mt-1 text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </td>
                <td className="px-2 py-2">
                  <p>{p.exam || "N/A"} / {p.category || "N/A"}</p>
                  <p className="mt-1 text-muted-foreground">{p.tags.join(", ") || "no tags"}</p>
                  <p className="mt-1 text-[10px] text-amber-700">
                    {!p.seoTitle || !p.seoDescription
                      ? "Missing SEO field(s)"
                      : p.requiresReferences && !(p.apaReferences?.length ?? 0)
                        ? "Needs references"
                        : p.coverImage && !p.coverImageAlt
                          ? "Needs image alt"
                          : "SEO ready"}
                  </p>
                  {p.workflowStatus ? <p className="mt-1 text-[10px] text-muted-foreground">Workflow: {p.workflowStatus}</p> : null}
                </td>
                <td className="px-2 py-2">
                  <input
                    type="datetime-local"
                    defaultValue={p.publishAt ? new Date(p.publishAt).toISOString().slice(0, 16) : ""}
                    className="rounded-md border border-border px-1.5 py-1"
                    onBlur={(e) => {
                      const value = e.currentTarget.value;
                      if (!value) return;
                      void patchPost(p.id, {
                        action: "schedule",
                        publishAt: new Date(value).toISOString(),
                      });
                    }}
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/admin/blog/control-panel?id=${encodeURIComponent(p.id)}`}
                      className="rounded border border-primary/40 px-2 py-1 text-left text-primary hover:bg-primary/10"
                    >
                      AI control panel →
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === p.id || p.postStatus === BlogPostStatus.PUBLISHED}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={() => patchPost(p.id, { action: "submit_for_review" })}
                    >
                      Submit for review
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id || p.postStatus === BlogPostStatus.PUBLISHED}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={() => patchPost(p.id, { action: "approve" })}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id || p.postStatus !== BlogPostStatus.NEEDS_REVIEW}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={() => patchPost(p.id, { action: "reject_review" })}
                    >
                      Reject to draft
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id || p.postStatus === BlogPostStatus.PUBLISHED}
                      className="rounded border border-border px-2 py-1 text-left hover:border-rose-500/40 disabled:opacity-60"
                      onClick={() => {
                        const reason = typeof window !== "undefined" ? window.prompt("Failure note (optional):") : null;
                        void patchPost(p.id, {
                          action: "mark_failed",
                          ...(reason?.trim() ? { failureReason: reason.trim() } : {}),
                        });
                      }}
                    >
                      Mark failed
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={() => patchPost(p.id, { action: "publish_now" })}
                    >
                      Publish now
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={() => patchPost(p.id, { action: "unpublish" })}
                    >
                      Unpublish to draft
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      className="rounded border border-border px-2 py-1 text-left hover:border-primary/40 disabled:opacity-60"
                      onClick={async () => {
                        setBusyId(p.id);
                        try {
                          await fetch(`/api/admin/blog/${p.id}/image-generate`, { method: "POST", credentials: "include" });
                          router.refresh();
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      Queue image generation
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">
                  No posts for selected filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
